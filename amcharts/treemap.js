let chart;

am4core.useTheme(am4themes_animated);
am4core.useTheme(LogosTheme);

initChart('Data/ntletters.json');

function initChart(dataPath) {
	if (chart)
		chart.dispose();

	chart = am4core.create("chartdiv", am4charts.TreeMap);

	// chart.legend = new am4charts.Legend();
	chart.navigationBar = new am4charts.NavigationBar();
	chart.preloader.disabled = true;

	showLoading();

	if (dataPath.indexOf('ntletters') > -1) {
		initLetters();
	}
	if (dataPath.indexOf('CounselingThemes') > -1) {
		initCounseling();
	}

	chart.dataSource.url = dataPath;
	setTimeout(hideLoading, 200);
}

function initCounseling() {
	console.log('initCounseling()');
	chart.maxLevels = 1;
	chart.dataFields.id = "guid";
	chart.dataFields.value = "value";
	chart.dataFields.name = "name";
	chart.dataFields.children = "children";

	for (var l = 0; l < 5; ++l) {
		createLevel(l);
	}
}

function createLevel(n) {
	let level = chart.seriesTemplates.create(n);
	addLabel(level);
	styleColumn(level);
}

function styleColumn(level) {
	let col = level.columns.template.column;
	col.cornerRadius(10, 10, 10, 10);
	col.fillOpacity = .5;
	col.strokeWidth = 5;
	col.tooltipText = "";
}

function addLabel(level) {
	let bullet = level.bullets.push(new am4charts.LabelBullet());
	bullet.locationY = .5;
	bullet.locationX = .5;
	bullet.label.text = "{name}";
}

function initLetters() {
	console.log('initLetters()');
	chart.maxLevels = 2;
	chart.dataFields.value = "value";
	chart.dataFields.name = "name";
	chart.dataFields.children = "children";

	let level0 = chart.seriesTemplates.create("0");
	let col0 = level0.columns.template.column;
	col0.cornerRadius(10, 10, 10, 10);
	col0.fillOpacity = 0;
	col0.strokeWidth = 0;
	col0.tooltipText = "";

	let level1 = chart.seriesTemplates.create("1");
	level1.columns.template.column.cornerRadius(10, 10, 10, 10);
	let bullet = level1.bullets.push(new am4charts.LabelBullet());
	bullet.locationY = .5;
	bullet.locationX = .5;

	bullet.label.text = "{abbreviation.en}";
	bullet.label.fill = am4core.color('#000');
}

function LogosTheme(target) {
	if (target instanceof am4core.ColorSet) {
		target.list = [];
		for (var color in Util.LogosColorsMedium) {
			target.list.push(am4core.color(Util.LogosColorsMedium[color]));
		}
	}
}
