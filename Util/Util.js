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
		yellow: "#FFD86A",
		green: "#99CC33",
		teal: "#66CCCC",
		skyBlue: "#6EA5E1",
		blue: "#005EC3",
		lavender: "#6E76B1",
		purple: "#986DAE",
		magenta: "#D12663",
		slate: "#63728C"
	};

	static randomElement(array) {
		var r = Math.floor(random(0, array.length));
		return array[r];
	}

	static Logos = {
		'red': {
			'dark': "#942220",
			'medium': "#CC3333",
			'light': "#FF6F6F",
			'extra-light': "#FF9F9F",
			'extra-extra-light': "#FFE9E9"
		},
		'orange': {
			'dark': "#BD4B00",
			'medium': "#FF6600",
			'light': "#FF8433",
			'extra-light': "#FFB27F",
		},
		'peach': {
			'dark': "#BF7326",
			'medium': "#FF9933",
			'light': "#FFAD5B",
			'extra-light': "#FFD6AD",
		},
		'yellow': {
			'dark': "#DBA910",
			'medium': "#FFD86A",
			'light': "#FFE28F",
			'extra-light': "#FFEBB4",
			'extra-extra-light': "#FFF4D5"
		},
		'green': {
			'dark': "#5BA224",
			'medium': "#99CC33",
			'light': "#C3E179",
			'extra-light': "#D6EAAD",
		},
		'teal': {
			'dark': "#59B2B2",
			'medium': "#66CCCC",
			'light': "#A3E0E0",
			'extra-light': "#CBF3F8",
		},
		'sky-blue': {
			'dark': "#507FC0",
			'medium': "#6EA5E1",
			'light': "#82BCF1",
			'extra-light': "#C5DBF3",
			'extra-extra-light': "#EEF5FC"
		},
		'blue': {
			'dark': "#004692",
			'medium': "#005EC3",
			'light': "#1977DE",
			'extra-light': "#A5D0FF",
		},
		'lavender': {
			'dark': "#474C72",
			'medium': "#6E76B1",
			'light': "#9298C5",
			'extra-light': "#C2CEFA",
		},
		'purple': {
			'dark': "#734E8B",
			'medium': "#986DAE",
			'light': "#BE9BD7",
			'extra-light': "#E2D2ED",
		},
		'magenta': {
			'dark': "#911A45",
			'medium': "#D12663",
			'light': "#E37CA1",
			'extra-light': "#ECA8C0",
		},

		'slate': {
			'dark': "#515D72",
			'medium': "#63728C",
			'light': "#919CAE",
			'extra-light': "#C7CFDC",
		},

		'grey': {
			'dark': '#444444',
			'medium': '#BBBBBB',
			'light': '#E7E7E7',
			'extra-light': '#F4F4F4',

			'01': '#F8F8F8',
			'05': '#F4F4F4',
			'10': '#EEEEEE',
			'15': '#E7E7E7',
			'20': '#DDDDDD',
			'30': '#CCCCCC',
			'40': '#BBBBBB',
			'50': '#AAAAAA',
			'60': '#888888',
			'70': '#666666',
			'80': '#444444',
			'90': '#333333',
		},

		'white' : {
			'dark': '#FFFFFF',
			'medium': '#FFFFFF',
			'light': '#FFFFFF',
			'extra-light': '#FFFFFF',			
		}
	};

	static logosColor(name, intensity) {
		var ret = "#000000";
		var name = name.toLowerCase();
		var intensity = intensity.toLowerCase();

		return Util.Logos[name][intensity];
	}
}

try {
	module.exports = Util;
} catch (e) {}