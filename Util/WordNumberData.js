let xml2js = require('xml2js');
let Bible = require('./Bible.js');
let fs = require('fs');

class WordNumberData {
	constructor(path, filter) {
		this.books = [];

		var files = fs.readdirSync(path)
			.filter( r => ! /\.gitignore|00Index/.test(r) )
			.map( r => `${path}/${r}`);

		if (filter)
			files = files.filter(filter);

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
	}

	addBook(file) {
		let book = new BookData(file);
		this.books.push(book);
		return book;
	}
}

class BookData {
	constructor(file) {
		this.chapters = [];
		this.reference = file.replace('.xml', '');

		this.name = Bible.getBookNameFromRef(file);
		console.log(`Processing ${this.name} ...`);
	}

	addChapter(xmlpath) {
		let chapter = new ChapData(xmlpath);
		this.chapters.push(chapter);
		return chapter;
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
		this.kq = '';

		rawdata.field.forEach( f => {
			if (f.$.name === 'WordNumber') {
				this.wnum = f._;
			}
			else if (f.$.name === 'KQStatus') {
				this.kq = f._;
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
		if (!this._fields[fname]) return defval;
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