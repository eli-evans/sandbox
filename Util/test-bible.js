const Bible = require('./Bible.js');

console.log(`Bible data has ${Bible.books.length} books and ${Bible.groups.length} groups.`);

console.log(`\nHere's Leviticus: ${JSON.stringify(Bible.getBook('Leviticus'))}.`);

console.log(`\nHere's book 3: ${JSON.stringify(Bible.getBookByNumber(3))}.`);

console.log(`\nThe book in bible.3.4.19 is ${JSON.stringify(Bible.getBookNameFromRef('bible.3.4.19'))}`);

console.log(`\nThe book number in bible.3.4.19 is ${JSON.stringify(Bible.getBookNumberFromRef('bible.3.4.19'))}`);

console.log(`\nThe chapter is ${JSON.stringify(Bible.getChapterNumberFromRef('bible.3.4.19'))}`);

console.log(`\nGenesis 1:1-2:4 spans ${Bible.countVerses('bible.1.1.1-1.2.4')} verses.`);

console.log(`\nPsalm 119 spans ${Bible.countVerses('bible.19.119')} verses.`);

console.log(`\nPsalms spans ${Bible.countVerses('bible.19')} verses.`);

