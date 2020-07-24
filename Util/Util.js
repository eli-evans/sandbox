class Util {
	// you may not need jquery, lol

	static getJson(path) {
		var json = Util.loadTextFileAjaxSync(path, "application/json");
		return JSON.parse(json);
	}

	static loadTextFileAjaxSync(path, mimeType) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", path, false);
		if (mimeType != null) {
			if (xmlhttp.overrideMimeType) {
				xmlhttp.overrideMimeType(mimeType);
			}
		}
		xmlhttp.send();
		if (xmlhttp.status == 200) {
			return xmlhttp.responseText;
		} else {
			// TODO Throw exception
			return null;
		}
	}

	static LogosColorsMedium = {
		red: "#CC3333",
		orange: "#FF6600",
		peach: "#FF9933",
		// yellow: "#FFD86A",
		green: "#99CC33",
		teal: "#66CCCC",
		skyBlue: "#6EA5E1",
		blue: "#005EC3",
		lavender: "#6E76B1",
		purple: "#986DAE",
		magenta: "#D12663",
		slate: "#63728C"
	};

	static bibleBookAbbr = [
		"",

		"Ge", "Ex", "Le", "Nu", "Dt", "Jos", "Ju", "Ru", "1Sa", "2Sa", "1Ki", "2Ki",
		"1Ch", "2Ch", "Ezr", "Ne", "Es", "Job", "Ps", "Pr", "Ec", "So", "Is", "Je",
		"La", "Eze", "Da", "Ho", "Joe", "Am", "Ob", "Jon", "Mic", "Na", "Hab", "Zep",
		"Zec", "Mal",

		"Tob", "Jud", "Add Es", "Wis Sol", "Sir", "Bar", "Lt Je", "S3Y", 
		"Sus", "Bel", "1Ma", "2Ma", "1Es", "Pr Man", "Ps 151", "3Ma", "2Es", "4Ma",

		"Mt", "Mk", "Lu", "Jn", "Ac", "Ro", "1Co", "2Co", "Ga", "Eph", "Php",
		"Col", "1Th", "2Th", "1Ti", "2Ti", "Tit", "Phm", "Heb", "Jam", "1Pe",
		"2Pe", "1Jn", "2Jn", "3Jn", "Jud", "Rev"
	];

	static pivotTable(table, prop) {
		let ret = [];
		let pivot = {};

		// iterate over rows
		table.forEach( (r, i) => {
			let propvals = ['_undefined_'];

			if (r[prop]) {
				if (Array.isArray(r[prop])) {
					propvals = r[prop];
				}
				else {
					propvals = [r[prop].toString()];
				}
			}

			propvals.forEach(propval => {
				if (pivot[propval] === undefined) {
					pivot[propval] = [];
				}
				pivot[propval].push(r);
			});
		});

		return pivot;
	}
}

if (module) {
	module.exports = Util;
}