const fs = require('fs');
const DataTable = require('../../Util/DataTable.js');

var json = JSON.parse(fs.readFileSync('biblebooks-protestant.json'));
var table = new DataTable(json);
var pivot = table.pivot('language');

var output = [];

Object.keys(pivot).forEach( key => {

	var node = {
		'id' : key,
		'name' : key,
		'children' : []
	};

	pivot[key].forEach( r => {
		node.children.push(r);
	});

	output.push(node);
});

console.log(JSON.stringify(output, null, 4));

