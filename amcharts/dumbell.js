am4core.ready(function() {
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdiv", am4charts.XYChart);
	let data = Util.getJson('Data/BiblebooksData.json');
	chart.data = data["Protestant (66 Books)"];
	
	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.ticks.template.disabled = true;
	categoryAxis.renderer.axisFills.template.disabled = true;
	categoryAxis.dataFields.category = "title";
	categoryAxis.renderer.minGridDistance = 15;
	categoryAxis.renderer.inversed = true;
	// categoryAxis.renderer.inside = true;
	// categoryAxis.renderer.grid.template.location = 0.5;
	// categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
	
	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.tooltip.disabled = true;
	valueAxis.renderer.ticks.template.disabled = true;
	valueAxis.renderer.axisFills.template.disabled = true;
	
	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "title";
	series.dataFields.openValueX = "dateEarly";
	series.dataFields.valueX = "dateLate";
	series.tooltipText = "early: {openValueX.value} late: {valueX.value}";
	series.sequencedInterpolation = true;
	series.fillOpacity = 1;
	series.strokeOpacity = 1;
	series.columns.template.height = 12;
	series.tooltip.pointerOrientation = "vertical";
	
	/*var openBullet = series.bullets.create(am4charts.CircleBullet);
	openBullet.locationX = 1;
	
	var closeBullet = series.bullets.create(am4charts.CircleBullet);
	
	closeBullet.fill = chart.colors.getIndex(4);
	closeBullet.stroke = closeBullet.fill;
	*/

	chart.cursor = new am4charts.XYCursor();
	chart.cursor.behavior = "zoomY";
	
	chart.scrollbarX = new am4core.Scrollbar();
	chart.scrollbarY = new am4core.Scrollbar();
	
	}); // end am4core.ready()