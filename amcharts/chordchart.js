

window.onload =  () => {
	document.getElementById('ntBook').addEventListener('change', e => {
		var dataset = e.target.value;
		var relationship = document.getElementById('relationship').value;

		if (dataset === "All") {
			chart.data = data.byBook[relationship];
		}
		else {
			chart.data = data.byChapter[dataset];
		}
	});

	document.getElementById('relationship').addEventListener('change', e => {
		relationship = e.target.value;
		var dataset = document.getElementById('ntBook').value;

		if (dataset === "All") {
			chart.data = data.byBook[relationship];
		}
		else {
			chart.data = data.byChapter[ntBook];
		}
	});

	let relationship = 'Citation';

	am4core.useTheme(am4themes_animated);

	var chart = am4core.create("chartdiv", am4charts.ChordDiagram);
	chart.hiddenState.properties.opacity = 0;
	
	let data = Util.getJson("Data/otquotes.json");
	chart.data = data.byBook[relationship];
	// chart.nodes.sortBy = "name";
	// chart.dataSource.updateCurrentData = true;
	chart.dataFields.fromName = "from";
	chart.dataFields.toName = "to";
	chart.dataFields.value = "value";
	chart.dataFields.color = "nodeColor";

};