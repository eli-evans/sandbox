const fs = require('fs');

fs.readdirSync('../charts').forEach(scheme => {
		console.log(`Processing ${scheme} ...`)
	fs.readdirSync(`../charts/${scheme}`).forEach( file => {
		console.log(` - Processing ${file} ...`);

		let chart = JSON.parse(fs.readFileSync(`../charts/${scheme}/${file}`));
		let output = [
			["title", chart.title],
			["for", chart.for],
			[]
		];

		chart.grid.forEach( row => {
			output.push(row);
		});

		output = output.map(x => x.join('\t'));
		fs.writeFileSync(`../csv/${scheme}/${file}.tsv`, output.join('\n'));
	});
});