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
}

if (module) {
	module.exports = Util;
}