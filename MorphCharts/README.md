! README

MorphCharts proposes a data format and validation workflow for a tool that collates instances of a lemma across a corpus into a grid that exposes its morphology.

!! Setup

- Install node.js (https://nodejs.org/en/download/).
- Run ./tools/DumpLemmas.js

Those are the preliminaries. See below for the idealized workflow from there.

!! What's Here

* `./charts/` - JSON that defines the collation charts. One JSON file per chart. Directories per morph scheme.
* `./data/` - lemma data extracted from CI word number databses for the purpose of validation and simulation. Subdirectories per morph scheme.
* `./output/` - simulated output as HTML, one per lemma, generated from ./data/. Subdirectories per morph scheme. 
* `./tsv/` - dump of ./charts/ in a format more suitable for editing in a spreadsheet. 
* `./tools/tsv2chart.js` - reads a single tab-separated file and generates a JSON "chart"
* `./tools/DumpLemmas.js` - reads a CI word number database and dumps some relevant data into ../data/%morphScheme
* `./tools/chart2tsv.js` - reads charts from ./charts and dumps them all out in a tab-separated format in ../tsv
* `./tools/ValidateCharts.js` - reads charts from ./charts/%morphScheme and simulates the output in ./output/%morphScheme. Generates ./tools/ValidateCharts.log to list any problems.

!! Workflow

1. Make a chart in a spreadsheeet. Labels are plain text, morph masks start with @.
2. Export that chart as *.tsv
3. Run tsv2chart.js to convert the *.tsv to a *.json chart
4. Run ValidateCharts.js to look for errors
5. Run chart2tsv.js to generate *.tsv versions of all the charts if you need to edit one
6. Repeat as necessary

!! Example Chart

	{
		"title": "Noun",
		"for": "@N*",
		"grid" : [
			["", "", "Nominative", "Genitive", "Dative", "Accusative", "Vocative"],
			["Masculine", "Singular", "@NNSM", "@NGSM", "@NDSM", "@NASM", "@NVSM"],
			["", "Dual", "@NNDM", "@NGDM", "@NDDM", "@NADM", "@NVDM"],
			["", "Plural", "@NNPM", "@NGPM", "@NDPM", "@NAPM", "@NVPM"],
			["Feminine", "Singular", "@NNSF", "@NGSF", "@NDSF", "@NASF", "@NVSF"],
			["", "Dual", "@NNDF", "@NGDF", "@NDDF", "@NADF", "@NVDF"],
			["", "Plural", "@NNPF", "@NGPF", "@NDPF", "@NAPF", "@NVPF"],
			["Neuter", "Singular", "@NNSN", "@NGSN", "@NDSN", "@NASN", "@NVSN"],
			["", "Dual", "@NNDN", "@NGDN", "@NDDN", "@NADN", "@NVDN"],
			["", "Plural", "@NNPN", "@NGPN", "@NDPN", "@NAPN", "@NVPN"]
		]
	}

!! Localization

Every label is actually a string identifier in a table. Those strings are localized and then reintroduced into the final data.

To discuss: If a label is a morph field name, eg, "Nominative" then we could encode a morphfield datatype reference instead and expect the client to render that label at runtime in the user's UI language. Even if we do this, some percentage (50%? 75%) of labels are likely to not be morph fields and still require translation.

- Eli Evans, eli.evans@faithlife.com


