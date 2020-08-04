const DatatypeReference = require('./DatatypeReference.js');

console.log( new DatatypeReference('bible.1.1.1') );
console.log( new DatatypeReference('bible+bhs.1.1.1') );

var lgenre = new DatatypeReference('lgenre.2.1');
console.log(lgenre);
console.log(lgenre.render());

