class RadialYear {
	constructor(start, end) {
		if (!start && !end) {
			start = new Date(new Date(Date.now()).getFullYear(), 0, 1);
			end = new Date(new Date(Date.now()).getFullYear(), 11, 31, 23, 59, 59);
		}

		this.startDate = start;
		this.endDate = end;
		this.length = 0;

		this.months = [];
		this.days = [];

		this._createMonths(); // sets length, populates months
		this.degreesPerDay = 360 / this.length;

		this._measureMonths();
		this._createDays();
		this._measureWeeks();
	}

	_createMonths() {
		var start = this.startDate;
		var end = this.endDate;

		var month = {
			name: RadialYear.getMonthName(start),
			abbr: RadialYear.getShortMonthName(start),
			year: start.getFullYear(),
			length: 0,
			sundays: []
		};

		this.months.push(month);

		// iterate days between start and end
		for (var i = new Date(start); i <= end; i.setDate(i.getDate() + 1)) {

			var y = i.getFullYear();
			var m = RadialYear.getMonthName(i);
			var d = i.getDate();
			var w = RadialYear.getWeekdayName(i);

			// new month maybe
			if (m != month.name) {				
				month = { name: m, abbr: RadialYear.getShortMonthName(i), year: y, length: 0, sundays: []};
				this.months.push(month);
			}

			month.length ++;
			this.length ++;

			if (w === "Sunday") {
				month.sundays.push(d);
			}		
		}
	}

	_measureMonths() {
		var nth = 1;
		this.months.forEach( (m) => {
			m.startDay = nth;
			nth += m.length;
			m.endDay = nth - 1;

			m.startAngle = (m.startDay - 1) * this.degreesPerDay;
			m.endAngle = (m.endDay) * this.degreesPerDay;
		});	
	}

	_createDays() {
		this.days = [];

		var nth = 1;
		for (var i = new Date(this.startDate); i <= this.endDate; i.setDate(i.getDate() + 1)) {
			this.days.push( {
				date: RadialYear.normalizeDate(i), // trim any timestamp
				index: nth,
				position: (nth - 1) * this.degreesPerDay,
			});
			++nth;
		}
	}

	_measureWeeks() {
		// count the number of full 7-day weeks
		this.fullWeeks = 0;
		this.months.forEach(m => {
			this.fullWeeks += m.sundays.length;
		});

		// how long are the first and last week?
		this.firstWeekLength = this.months[0].sundays[0] - 1;

		var lastMonth = this.months[this.months.length - 1];
		this.lastWeekLength = lastMonth.length - lastMonth.sundays[lastMonth.sundays.length - 1] + 1;

		if (this.lastWeekLength != 7) {
			this.fullWeeks -= 1; // back off partial week at the end
		}		
	}

	getDayString(str) {
		return this.getDay( RadialYear.normalizeDate( new Date( Date.parse(str) ) ) );
	}

	getDay(date) {
		date = RadialYear.normalizeDate(date);
		
		for (var i = 0; i < this.days.length; ++i) {
			if (date.getTime() === this.days[i].date.getTime()) {
				return this.days[i];
			}
		}

		// console.log(`Couldn't find day for <${date}>`);
		return null;
	}

	// Static data and methods

	static normalizeDate(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	static monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	static shortMonthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

	static getMonthName(n) {
		if (n instanceof Date) {
			return RadialYear.monthNames[n.getMonth()];
		}
		else {
			return RadialYear.monthNames[n];
		}
	}

	static getShortMonthName(n) {
		if (n instanceof Date) {
			return RadialYear.shortMonthNames[n.getMonth()];
		}
		else {
			return RadialYear.shortMonthNames[n];
		}
	}

	static dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

	static getWeekdayName(n) {
		if (n instanceof Date) {
			return RadialYear.dayNames[n.getDay()];
		}
		else {
			return RadialYear.dayNames[n];
		}
	}
}
