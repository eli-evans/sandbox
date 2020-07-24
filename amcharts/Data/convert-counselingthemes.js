const fs = require('fs');
const dataPath = '/users/eevans/documents/github/ShipCounselingThemes/data/themes/en/';

var files = fs.readdirSync(dataPath);

var topics = [];
var tree = [];
let guid = 0;

// read data into memory
files.forEach(file => {
	topics.push(JSON.parse(fs.readFileSync(dataPath + file)));
});

// add root nodes
topics.forEach(topic => {
	if (topic.parents.length == 0) {
		var root = newNode(topic);
		tree.push(root);
		topic.cataloged = true;
	}
});

// iterate over the list until all the parents are added
while (!allFound(tree, topics)) {
	//	console.log('ITERATING AGAIN ...');

	topics.forEach(topic => {
		var id = topic.identifier;
		var parents = topic.parents;

		var me = findNode(id, tree);

		parents.forEach(parentId => {
			var parentNode = findNode(parentId, tree);
			if (!parentNode) {
				// console.log(`didn't find parent ${parentId} in ${id}`);
			} else if (hasChild(parentNode, id)) {
				// already in the tree here don't need to add it again
			} else {
				parentNode.children.push(newNode(topic));
			}
		});
	});
}

// measure
tree.forEach( root => {
	root.value = updateValue(root);
});

function updateValue(node) {
	if (node.children.length === 0){
		node.value = 1;	
	}
	else {
		node.children.forEach((child) => {
			node.value += updateValue(child);
		});
	}
	return node.value;
}

fs.writeFileSync('CounselingThemes.json', JSON.stringify(tree, null, 4));

function hasChild(parent, childId) {
	var ret = false;
	parent.children.forEach(child => {
		if (child.id === childId) {
			ret = true;
		}
	});
	return ret;
}

function allFound(tree, topics) {
	var allFound = true;
	topics.forEach(topic => {
		if (!findNode(topic.identifier, tree))
			allFound = false;
	});
	return allFound;
}

function newNode(topic) {
	return { name: topic.title, id: topic.identifier, guid: ++guid, parents: topic.parents, value:0, children: [] };
}

function findNode(nodeId, context) {
	if (context) {
		for (var i = 0; i < context.length; ++i) {
			if (context[i].id === nodeId) {
				return context[i];
				break;
			}
			ret = findNode(nodeId, context[i].children);
			if (ret && ret.id === nodeId) {
				return ret;
			}
		}
	}

	return null;
}
