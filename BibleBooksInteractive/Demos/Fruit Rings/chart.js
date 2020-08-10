am4core.ready(function() {
	let data = Util.getJson('genre-data.json');

	let colors = {
		'Behavioral, Evaluation': Util.LogosColorsMedium['peach'],
		'Behavioral, Hortatory': Util.LogosColorsMedium['yellow'],

		'Expository, What things are or were like': Util.LogosColorsMedium['green'],
		'Expository, What things will be like': Util.LogosColorsMedium['teal'],

		'Narrative, Future Events': Util.LogosColorsMedium['skyBlue'],
		'Narrative, Story': Util.LogosColorsMedium['blue'],

		'Procedural, How it was done': Util.LogosColorsMedium['purple'],
		'Procedural, How to do it': Util.LogosColorsMedium['lavender'],
	};

	data = data
		.filter(r => r.abbr)
		.sort((a, b) => a.number - b.number);

	let biggest = 0;
	data.forEach((book, i) => {
		let booksize = 0;
		let start = 0;

		book.data = book.data.sort((a, b) => b.value - a.value);

		book.data.forEach(r => {
			booksize += r.value;
			if (colors[r.name] !== undefined) {
				r.color = colors[r.name];
			}

			r.category = '';
			r.start = start;
			r.end = start + r.value;
			start = r.end;
		});

		book.size = booksize;
		if (booksize > biggest) {
			biggest = booksize;
		}
	});

	// console.log( data );

	// adjust size
	data.forEach(book => {
		let size = ((book.size / biggest) * 120) + 60;
		book.chartSize = size;
	});

	// generate a chart for each book
	data.forEach((book, i) => {
		let div = document.createElement('div');
		div.className = 'pie';
		div.id = 'chartdiv' + i;

		div.setAttribute('style', `width:${book.chartSize}px;`);

		document.body.appendChild(div);

		makePieChart(div.id, book);
	});
});

function makePieChart(div, book) {
	let chart = am4core.create(div, am4charts.PieChart);

	chart.data = book.data;

	// chart styling
	chart.logo.disabled = true;
	chart.padding(0, 0, 0, 0);
	chart.chartContainer.minHeight = book.chartSize;
	chart.chartContainer.minWidth = book.chartSize;
	chart.radius = book.chartSize / 2;
	chart.innerRadius = chart.radius * .66;

	// data series
	let pieSeries = chart.series.push(new am4charts.PieSeries());
	pieSeries.dataFields.value = "value";
	pieSeries.dataFields.category = "name";
	pieSeries.labels.template.disabled = true;
	pieSeries.ticks.template.disabled = true;

	pieSeries.slices.template.adapter.add("fill", (fill, target) => {
		return am4core.color(target.dataItem.dataContext.color);
	});

	// label
	let label = pieSeries.createChild(am4core.Label);
	label.text = book.abbr;
	label.horizontalCenter = "middle";
	label.verticalCenter = "middle";
	label.fontSize = 12;
}
