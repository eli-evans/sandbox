window.onload = () => {
	let books = Util.getJson('genre-data.json');

	let colors = {
		'Behavioral, Evaluation': Util.logosColor('peach', 'light'),
		'Behavioral, Hortatory': Util.logosColor('yellow', 'light'),
	
		'Expository, What things are or were like': Util.logosColor('green', 'light'),
		'Expository, What things will be like': Util.logosColor('teal', 'light'),
	
		'Narrative, Future Events': Util.logosColor('sky-blue', 'light'),
		'Narrative, Story': Util.logosColor('blue', 'light'),
	
		'Procedural, How it was done': Util.logosColor('purple', 'light'),
		'Procedural, How to do it': Util.logosColor('lavender', 'light'),
	};

	// sort
	books = books.sort( (a,b) => a.number - b.number );
	
	// data calcs
	let biggest = 0;
	books.forEach( book => {

		let size = 0; 
		book.data.forEach( r => {
			size += r.value;
		});

		book.size = size;
		if (size > biggest) {
			biggest = size;
		}
	});

	// draw it!
	books.forEach( book => {
		let size = book.size / biggest * 197 + 3;

		let bookdiv = document.createElement('div');
		bookdiv.className = 'book';
		bookdiv.style.width = size + 12;
		bookdiv.dataset.width = size + 12;

		let bookBlock = bookdiv.appendChild(document.createElement('div'));
		bookBlock.className = 'bookBlock';
		bookBlock.style.width = size;

		book.data.forEach( item => {
			let color = colors[item.name];

			let genrediv = document.createElement('div');
			genrediv.className = 'segment';
			genrediv.setAttribute('style', `background: ${color}; height: ${item.percentage}px;`);
			genrediv.setAttribute('title', `${item.name}\n${item.value.toLocaleString()} verses (${item.percentage.toLocaleString({style: 'percentage'})} %)`);
			bookBlock.appendChild(genrediv);
		});

		let label = document.createElement('div');
		label.className = 'bookName';
		label.innerText = book.abbr;
		bookdiv.appendChild(label);

		document.body.appendChild(bookdiv);
	});

	// setInterval( setWidth, 1 );
	// setInterval( hideSome, 1000 );
};

function hideSome() {
	document.getElementsByClassName('book').forEach( elem => {
		if (Math.random() > .8) {
			elem.classList.add('hidden');
		}
	});
}

function setWidth() {
	document.body.getElementsByClassName('hidden').forEach( elem => {
		if (parseInt(elem.style.width) > 0) {
			elem.style.width = parseInt(elem.style.width) - 1;
		}
	});
}
