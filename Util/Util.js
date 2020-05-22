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
}

