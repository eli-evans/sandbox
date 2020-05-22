let chart;
let series;
let loading;
let datasetToggle;

var radios = document.switchDataset.dataset;
radios.forEach( radio => {
	radio.addEventListener('change', radioOnChange);
});
function radioOnChange() {
	initForceChart(this.value);
}

am4core.useTheme(am4themes_animated);
chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
chart.legend = new am4charts.Legend();

chart.preloader.disabled = true;

initForceChart('Data/CounselingThemes.json');


function initForceChart(dataPath) {
	if (chart.series.length > 0) {
		chart.series.removeIndex(0).dispose();
	}

	showLoading();

	series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

	series.dataFields.linkWith = "linkWith";
	series.dataFields.name = "name";
	series.dataFields.id = "id";
	series.dataFields.value = "value";
	series.dataFields.children = "children";
	series.dataFields.fixed = "fixed";

	series.nodes.template.propertyFields.x = "x";
	series.nodes.template.propertyFields.y = "y";

	series.nodes.template.tooltipText = "{name}";
	series.nodes.template.fillOpacity = 1;

	series.nodes.template.label.text = "{name}"
	series.fontSize = 14;
	series.maxLevels = 5;
	series.nodes.template.label.hideOversized = true;
	series.nodes.template.label.truncate = true;

	series.centerStrength = 1.4;
	// series.manyBodyStrength = -20;

	series.data = Util.getJson(dataPath);
	setTimeout(hideLoading, 200);
}

function showLoading() {
	let div = document.getElementById("loadingDiv");
	div.classList.remove('hidden');
}

function hideLoading() {
	let div = document.getElementById("loadingDiv");
	div.classList.add('hidden');
}
