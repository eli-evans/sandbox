! README

MorphCharts proposes a data format and validation workflow for a tool that collates instances of a lemma across a corpus into a grid that exposes its morphology.

!! Installs

Install node.js (https://nodejs.org/en/download/).

!! What's here

* `./tools/tsv2chart.js` - reads a single tab-separated file and generates a JSON "chart"
* `./tools/DumpLemmas.js` - reads a CI word number database and dumps some relevant data into ../data/%morphScheme
* `./chart2tsv.js` - reads charts from ./charts and dumps them all out in a tab-separated format in ../tsv
* 

!! Dependencies

- Node.js <https://nodejs.org/en/download/>
- Node.js fs 
- CI/WordNumberDatabases - used by ./tools/DumpLemmas.js to extract relevant data from a CI word number database
- ../Util/WordNumberDatabases.js - used by ./tools/DumpLemmas.js to read a CI word number database

!! Run Order

- ./tools/DumpLemmas.js generates a bunch of *.json files in ../data/%morphScheme
- ./