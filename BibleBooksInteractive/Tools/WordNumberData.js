let xml2js = require('xml2js');
let Bible = require('../../Util/Bible.js');
let Counter = require('../../Util/CounterV1.js');
let fs = require('fs');
const { throws } = require('assert');

class WordNumberData {
	constructor(path) {
		this.books = [];
		this.counter = new Counter();

		var files = fs.readdirSync(path)
			.filter( r => ! /\.gitignore|00Index/.test(r) )
			.map( r => `${path}/${r}`);

		// files = files.slice(0,29);

		let lastbooknum = 0;
		let book;

		files.forEach( file => {
			if (lastbooknum != Bible.getBookNumberFromRef(file)) {
				book = this.addBook(file);
				book.chapters = book.chapters.sort((a,b) => Bible.getChapterNumberFromRef(a.reference) - Bible.getChapterNumberFromRef(b.reference));
				lastbooknum = Bible.getBookNumberFromRef(file);
			}
			
			book.addChapter(file);
		});

		this.books = this.books.sort((a,b) => Bible.getBookNumberFromRef(a.reference) - Bible.getBookNumberFromRef(b.reference));

		this.updateCounts();
	}

	addBook(file) {
		let book = new BookData(file);
		this.books.push(book);
		return book;
	}

	updateCounts() {
		this.books.forEach( book => {
			book.updateCounts();
		});

		this.books.forEach( book => {
			book.counter.items('lemmas').forEach( lemma => {
				this.counter.count('lemmas', lemma.name, lemma.count);
			});
		});

		this.books.forEach( book => {
			book.counter.items('roots').forEach( root => {
				this.counter.count('roots', root.name, root.count);
			});
		});
	}
}

class BookData {
	constructor(file) {
		this.chapters = [];
		this.counter = new Counter();
		this.reference = file.replace('.xml', '');

		this.name = Bible.getBookNameFromRef(file);
		console.log(`Processing ${this.name} ...`);
	}

	addChapter(xmlpath) {
		let chapter = new ChapData(xmlpath);
		this.chapters.push(chapter);
		return chapter;
	}

	updateCounts() {
		this.counter = new Counter();
		let self = this;
		this.chapters.forEach( c => {
			this.counter.count('all', 'verses', c.verses.length);

			c.verses.forEach( v => {
				this.counter.count('all', 'words', v.words.length);

				v.words.forEach( w => {

					w.getValues('lemma').forEach( lemma => {
						this.counter.count('lemmas', lemma);
					});

					w.getValues('root').forEach( root => {
						this.counter.count('roots', root);
					});
				});
			});
		});
	}	
}

class ChapData {
	constructor(xmlpath) {

		this.verses = [];

		this.json = {};
		xml2js.parseString(fs.readFileSync(xmlpath, 'utf8'), (err, data) => {
			this.json = data;
		});

		this.reference = this.json['word-number-data'].$.ref;

		console.log(`   - ${Bible.getBookNameFromRef(this.reference)} ${Bible.getChapterNumberFromRef(this.reference)}`)

		this.json['word-number-data']['raster-units'].forEach( rUnit => {
			rUnit['raster-unit'].forEach( v => {
				this.addVerse(v);
			});

		});

		delete this.json;
	}

	addVerse(v) {
		this.verses.push(new VerseData(v));
	}
}

class VerseData {
	constructor(rawdata) {
		this.words = [];
		this.reference = rawdata.$.ref;

		rawdata['word'].forEach( w => {
			this.addWord(w);
		});
	}

	addWord(w) {
		this.words.push(new WordData(w));
	}
}

class WordData {
	constructor(rawdata) {
		this._fields = {};
		this.wnum = '';

		rawdata.field.forEach( f => {
			if (f.$.name === 'WordNumber') {
				this.wnum = f._;
			}
			else if (f.$.name === 'Lemma' || f.$.name === 'Root') {
				this.setValue(f.$.name, f._);
			}
			else {
				// this.setValue(f.$.name, f._);
			}
		});
	}

	getValue(fname, defval) {
		if (defval === undefined) defval = "";
		return this._fields[fname][0] ? this._fields[fname][0] : defval;
	}

	getValues(fname) {
		return this._fields[fname] ? this._fields[fname] : [];
	}

	setValue(fname, val) {
		fname = fname[0].toLowerCase() + fname.substring(1);
		if (this._fields[fname] === undefined) {
			this._fields[fname] = [];
		}
		this._fields[fname].push(val);

		return this._fields[fname];
	}
}


module.exports = WordNumberData;