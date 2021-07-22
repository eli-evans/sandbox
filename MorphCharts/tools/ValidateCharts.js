const fs = require('fs');

// Command line

if (process.argv.length < 3) {
	console.log('\n\nUSAGE: node ValidateCharts.js <morphScheme>\n\n');
	process.exit();
}
let scheme = process.argv[2];

// Initialize global data

let lemmas = loadLemmaData();
let grids = loadGridData();
let lang = scheme === 'lbs-morph+el' ? 'el' : 'he'; 

// Set up logging

let log = { infos: [], warnings: [], errors: [],
	log: (str, arr = log.infos) => {console.log(`  >> ${str}`); arr.push(str)},
	warn: str => log.log(str, log.warnings),
	error: str => log.log(str, log.errors),
	summarize: () => `${log.errors.length} Errors, ${log.warnings.length} Warnings, ${log.infos.length} Infos`,
	toString: () => `${log.errors.length} errors:\n${log.errors.join('\n')}`
		+ `\n\n${log.warnings.length} warnings:\n${log.warnings.join('\n')}`
		+ `\n\n${log.infos.length} infos:\n${log.infos.join('\n')}`,
	save: path => fs.writeFileSync(path, log.toString())
}

// Main processing loop
for (let lemma in lemmas) {
	console.log(`Processing ${lemma} ...`);
	processLemma(lemma);
}

console.log('\n' + log.summarize());
log.save('ValidateCharts.log');

function processLemma(lemma) {
	let analysis = groupLemmaData(lemmas[lemma]);
	let validGrids = selectValidGridsForAnalysis(analysis);

	if (validGrids.length == 0) {
		log.error(`No charts found for ${lemma} <${Object.keys(analysis).sort().join(', ')}>`);
		return;
	}

	let output = [`<html><head><title>${lemma}</title><link rel='stylesheet' href='../morphcharts.css'/></head><body>`];

	validGrids.forEach( grid => {
		let display = [];

		grid.grid.forEach( row => {
			let outRow = [];
	
			row.forEach( cell => {

				// morph code
				if (cell.substr(0,1) === '@') {
					let mask = makeMask(cell);

					// gather all the morph codes that match into the cell
					let matches = [];
					let matchedMorphs = [];
					for (let morph in analysis) {
						if (mask.test(morph)) {
							matches.push(analysis[morph]);
							matchedMorphs.push(morph);
							delete analysis[morph];
						}
					}
	
					// none matched
					if (matches.length === 0) {
						outRow.push({count: 0, forms: [], mask});
					}

					// some matched
					else {
						// reduce many to one
						let reduction = {count: 0, forms: []};
						matches.forEach( x => {
							reduction.count += x.count;
							reduction.forms = reduction.forms.concat(x.forms);
						});

						// sort and unique
						reduction.forms = reduction.forms
							.filter((value, index, self) => {
								return self.indexOf(value) === index;
							})
							.sort();

						reduction.mask = mask;
						reduction.morphs = matchedMorphs; 

						outRow.push(reduction);
					}
				}

				// labels
				else {
					outRow.push({label: cell});
				}
			});
	
			display.push(outRow);
		});

		// output the display table
		output.push(`\n\n<h2>${grid.title}</h2>\n<table>`);
		display.forEach( row => {
			output.push('<tr>');
		
			row.forEach( cell => {
				if (cell.label !== undefined) {
					output.push(`<td class='label'>${cell.label}</td>`);
				}
				else if (cell.count > 0) {
					output.push(`<td title='${cell.mask} ~ ${cell.morphs.join(', ')}'><span class='${lang}'>${cell.forms.join(', ')}</span> (${cell.count})</td>`);
				}
				else if (cell.count === 0) {
					output.push(`<td title='${cell.mask}'>--</td>`);
				}
				else {
					throw new Error('What is this: ' + cell);
				}
			});
		
			output.push('</tr>\n');
		});
		output.push('</table>');
	});

	// list any leftovers
	let filename = lemma;
	if (Object.keys(analysis).length > 0) {
		output.push(`<pre>${JSON.stringify(analysis, null, 4)}</pre></body></html>`);
		filename = `_Errors-${Object.keys(analysis).length}-${lemma}`;

		for (let morph in analysis) {
			log.warn(`Uncharted morph code ${morph} (${lemma})`);
		}
	}

	// write it
	fs.writeFileSync(`../output/${filename}.html`, output.join(''));
}

function groupLemmaData(data) {
	let analysis = {};

	// iterate instances, group by unique morph
	data.forEach(instance => {
		let morph = instance.morph;
		if (analysis[morph] === undefined) {
			analysis[morph] = [];
		}
		instance.surface = foldSurfaceText(instance.surface);
		analysis[morph].push(instance);
	});

	// reduce morphs to key stats
	for( let morph in analysis) {
		let count = analysis[morph].length;
		let forms = analysis[morph].map(x => x.surface);
		analysis[morph] = {count, forms};
	}

	return analysis;
}

function loadLemmaData() {
	let ret = {};
	let paths = fs.readdirSync(`../data/${scheme}`);
	paths.forEach( path => {
		ret[path.replace('.json', '')] = loadJson(`../data/${scheme}/${path}`);
	});
	return ret;
}

function loadGridData() {
	let ret = [];
	let paths = fs.readdirSync(`../charts/${scheme}`);
	paths.forEach( path => {
		let grid = loadJson(`../charts/${scheme}/${path}`);
		grid.mask = makeMask(grid.for);
		ret.push(grid);
	});

	return ret;
}

function makeMask(str) {
	str = str.replace('@', '');
	return new RegExp(`^${ str.replace(/\?/g, '.').replace(/\*/g, '.*') }$`);
}

function loadJson(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}

function selectValidGridsForAnalysis(analysis) {
	return grids.filter( x => isValidGridForAnalysis(x, analysis));
}

function isValidGridForAnalysis(grid, analysis) {
	for (let morph in analysis) {
		if (grid.mask.test(morph)) {
			return true;
		}
	}
	return false;
}

function foldSurfaceText(str) {
	if (scheme === 'lbs-morph+el') {
		let nfd = str.toLowerCase().normalize('NFD');
		nfd = nfd.replace(/\u0300|\u0301/g, ''); // TODO: this isn't correct
	
		str = nfd.normalize('NFC');
	}
	else if (scheme === 'lbs-morph+he') {
		str = str.replace(/[\u0591-\u05AF\u05BD\u05C0]/g, '');
	}

	return str;
}
