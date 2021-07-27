const fs = require('fs');

if (process.argv.length !== 6) {
	console.log("USAGE: node tsv2chart.js <tsv> <outpath> <title> <for>")
	process.exit();
}
let inpath = process.argv[2];
let outpath = process.argv[3];
let title = process.argv[4];
let isFor = process.argv[5];	

let infile = fs.readFileSync(inpath).toString();

let out = [`{\n\t"title": "${title}",\n\t"for": "${isFor}",\n\t"grid": [`];

out.push(
	infile.split(/[\r\n]+/)
		.map(line => `\t\t[ ${ line.split('\t').map( x => `"${x}"`).join(', ') } ]`)
		.join(',\n')
);
out.push('\t]\n}');

fs.writeFileSync(outpath, out.join('\n'));



