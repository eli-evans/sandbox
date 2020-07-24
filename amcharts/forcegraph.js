let chart;
let series;

am4core.useTheme(am4themes_animated);
chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
chart.legend = new am4charts.Legend();
am4core.useTheme(LogosTheme);

chart.preloader.disabled = true;

initChart('Data/ntletters.json');

function LogosTheme(target) {
	if (target instanceof am4core.ColorSet) {
		target.list = [];
		for (var color in Util.LogosColorsMedium) {
			target.list.push(am4core.color(Util.LogosColorsMedium[color]));
		}
	}
}

function initChart(dataPath) {
	if (chart.series.length > 0) {
		chart.series.removeIndex(0)
			.dispose();
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
	series.tooltip.label.interactionsEnabled = true;
	series.tooltip.label.wrap = true;

	series.nodes.template.label.text = "{name}"
	series.fontSize = 14;
	series.maxLevels = 5;
	series.nodes.template.label.hideOversized = true;
	series.nodes.template.label.truncate = true;

	series.nodes.template.strokeWidth = 0;
	series.links.template.strokeWidth = 3;


	let data = Util.getJson(dataPath);

	if (dataPath === "Data/output.json") {
		series.dataFields.value = "words";
	}

	// Special stuff for NT Epistles
	if (dataPath === "Data/ntletters.json") {
		series.dataFields.value = "value";


		series.nodes.template.adapter.add("tooltipHTML", function(something, target) {

			if (target.dataItem.level === 0)
			{
				return `<div style='max-width: 320px;min-width: 80px;'>
				<p><b>{authorName}</b> {description.en}</p>`;
				target.label.wrap = false;
			}
			else {
				return `<div style='max-width: 320px;'>
				<p><b>{titleLong.en}</b> {subkind.en}</p>
				<p>{description.en}</p>
				<p>From {renderedAuthors} to {renderedRecipients} ({dateOfCompositionEarly}-{dateOfCompositionLate} AD)</p>
				<p>{n_chapters} chapters, {n_verses} verses, {n_words} words</p>
				</table></div>`;
			}
		});

		series.dataFields.name = (d) => d.abbreviation ? d.abbrevation.en : d.name;

		// series.centerStrength = 1.5;

		let authorcolors = {
			'Paul' : am4core.color(Util.LogosColorsMedium.red),
			'John' : am4core.color(Util.LogosColorsMedium.skyBlue),
			'Peter' : am4core.color(Util.LogosColorsMedium.green),
			'James' : am4core.color(Util.LogosColorsMedium.orange),
			'Writer of Hebrews' : am4core.color(Util.LogosColorsMedium.teal),
			'Jude' : am4core.color(Util.LogosColorsMedium.purple)
		};

		series.nodes.template.adapter.add("fill", function(fill, target) {
			var name = target.dataItem.dataContext.authorName;
			return authorcolors[name] || am4core.color('#FFF') && console.log(`Unknown authorName: ${name}`);
		});

		series.nodes.template.adapter.add("stroke", function(fill, target) {
			var name = target.dataItem.dataContext.authorName;
			return authorcolors[name] || am4core.color('#FFF') && console.log(`Unknown authorName: ${name}`);
		});

		series.links.template.adapter.add("stroke", function(fill, target) {
			if(target.dataItem && target.dataItem.dataContext) {
				var name = target.dataItem.dataContext.authorName;
				return authorcolors[name] || am4core.color('#FFF') && console.log(`Unknown authorName: ${name}`);
			}
		});

		data.forEach(auth => {
			auth.children.forEach( rec => {
				rec.name = rec.abbreviation.en;
				rec.renderedAuthors = renderEntities(rec.authors);
				rec.renderedRecipients = renderEntities(rec.recipients);
				rec.dateOfCompositionEarly = renderDate(rec.dateOfCompositionEarly);
				rec.dateOfCompositionLate = renderDate(rec.dateOfCompositionLate);
			});
		});
		// chart.legend.hide();
	}

	series.data = data;
	setTimeout(hideLoading, 200);
}

function renderDate(str) {
	str = str.replace(new RegExp('^date\.'), '');
	return str;
}

function renderEntities(array) {
	var str = "";
	array.forEach(d => {
		d = d.replace(new RegExp('bk.[#%$@]'), '');
		str += `${d}, `;
	});
	str = str.replace(new RegExp(', $'), '');
	return str;
}
