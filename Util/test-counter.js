const Counter = require('./Counter.js');

let c = new Counter();

c.count(['fruit', 'lemon'], 12);
c.count(['fruit', 'orange'], 17);
c.count(['fruit', 'sour', 'lemon'], 1);
c.count(['fruit', 'bitter', 'orange'], 1);
c.count(['fruit', 'mango'], 8);
c.count(['fruit', 'grape'], 90);
c.count('fruit', 17, 'banana');

c.count('category', 'fruit', 'vegetation', 878);

c.count('elephant', 9);
c.count('elephant as well', 12);
c.count(['elephant']);
c.count('elephant');
c.count(['animal/elephant']);
c.count('animal', 'fruitfly', 3000);

console.log(c);

let fruit = c.list('fruit');

console.log(`\nList 'fruit' (prefix): ${fruit}`);

c.matchLoose();
console.log(`\nList 'fruit' (loose): ${c.list('fruit')}`);
console.log(`\nList 'lemon' (loose): ${c.list('lemon')}`);
c.matchPrefix();

console.log(`\nCounter has ${c.aggregate('fruit')} fruits (aggregate).`);
console.log(`\nCounter has ${c.value('fruit/lemon')} lemons (exact value of 'fruit/lemon').`);

c.matchLoose();

console.log(`\nCounter has ${c.aggregate('lemon')} lemons (loose aggregate).`)

c.matchPrefix();

console.log(`\nCounter has ${c.value('elephant')} elephants.`);

let analysis = c.analyze();
console.log(`\nList aggregation 'lemon' has a mean of ${analysis.mean}, and a mode of ${analysis.mode} over an extent of ${analysis.extent}.`);
console.log(`\nDeviations and percentages for all items:`)
analysis.items.forEach( r => {
	console.log(`- ${r.path} :: ${r.stdev} :: ${r.percentage}`);
});

console.log(`\nList of singles: ${c.singles()}`);
console.log(`\nList of 'fruit' singles: ${c.singles('fruit')}`);
console.log(`\nList of 'animal' singles: ${c.singles('animal')}`);

console.log(`\nDominant fruit is: ${c.dominant('fruit').name}`);
console.log(`\nDominant animal is: ${c.dominant('animal').name}`);

