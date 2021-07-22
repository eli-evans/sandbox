const fs = require('fs');

if (process.argv.length !== 4) {
	console.log("USAGE: node csv2matrix.js <csvfile> <output>")
	process.exit();
}
let inpath = process.argv[2];
let outpath = process.argv[3];

let infile = fs.readFileSync(inpath).toString();

let out = [`{\n\t"title": "",\n\t"for": "",\n\t"grid": [`];

out.push(
	infile.split(/[\r\n]+/)
		.map(line => `\t\t[ ${ line.split('\t').map( x => `"${x}"`).join(', ') } ]`)
		.join(',\n')
);
out.push('\t]\n}');

fs.writeFileSync(outpath, out.join('\n'));



