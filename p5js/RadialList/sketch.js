var height, width;
var year;
var months;
var today;
var MONTHSWIDTH = 12;
var TRACKPADDING = 6;
var ARCPADDING = .3;
var label;
var hoverTrack;

function setup() {
	height = window.innerHeight;
	width = window.innerWidth;
	createCanvas(width, height);

	angleMode(DEGREES);
	noFill();
	background(255);
	frameRate(30);

	today = new Date( Date.now() );
	year = new RadialYear( new Date(2019, 11, 1), new Date(2020, 10, 29) ); // Liturgical Year 2019-2020
	// year = new RadialYear(); // 2020
	// year = new RadialYear(new Date(2020, 3, 1), new Date(2021, 0, 31));

	// year = new RadialYear( new Date(2020, 4, 1), new Date(2020, 4, 31) );

	var fullsize = (Math.min(height, width)) * .9;

	months = new Ring(width / 2, height / 2, fullsize);
	months.padding = ARCPADDING;
	months.label = "";
	months.labelSize = 18;
	months.weight = MONTHSWIDTH;
	months.style = "static";
	months.colorizer = (i) => { return i % 2 ? Color.logosColor('grey', 'medium') : Color.logosColor('grey', 'light') };
	months.sort = false;

	months.addSegments(year.months.map((i) => i.length));

	weedTracks(); // imported tracks may have events out of range

	changeRing();
}

function weedTracks() {
	Tracks.forEach(t => {
		var tmpEvents = [];
		t.events.forEach(e => {
			e.end = e.end ? e.end : e.start;
			var start = year.getDayString(e.start);
			var end = year.getDayString(e.end);
			if (start && end) {
				tmpEvents.push(e);
			}
		});
		t.events = tmpEvents;
	});
}

function changeRing() {
	background(255);

	var lastRing = months;

	Tracks.forEach((t, nTrack) => {

		// make a ring
		var radius = lastRing.r - (lastRing.weight + t.weight) - TRACKPADDING;

		ring = new Ring(width / 2, height / 2, radius);
		ring.weight = t.weight;
		ring.style = "static";
		ring.padding = ARCPADDING;
		ring.label = "";
		ring.sort = false;

		lastRing = ring;

		// set ring color
		if (t.color) {
			if (t.color === "transparent") {
				var c = color("#fff");
				c.setAlpha(0);
				ring.colorizer = (i) => c;
			}
			else {
				var c = Color.logosColor(t.color, "extra-light");
				c.setAlpha(140);
				ring.colorizer = (i) => c;
			}
		}
		else {
			ring.colorizer = (i) => color("#EEEEEE");
		}

		// add weeks
		if (year.firstWeekLength > 0) {
			ring.addSegment(year.firstWeekLength);
		}
		for (var i = 0; i < year.fullWeeks; ++i) {
			ring.addSegment(7);
		}
		ring.addSegment(year.lastWeekLength);

		t.ring = ring;
	});
}

function draw() {

	background(255);

	months.label = label;
	months.draw();

	Tracks.forEach((t) => {
		if (t === hoverTrack) {
			
		}
		t.ring.draw();
	});

	drawShadow();

	if (Tracks[0] && Tracks[0].ring.animating) return;

	drawMonthNames();
	drawEvents();
	drawTodayIndicator();
	mouseMoved();
}

function drawTodayIndicator() {
	var day = year.getDay(today);
	var angle = day.position + (year.degreesPerDay/2) - 90;

	var coords = polar2Cartesian(months.r / 2, angle, months.x, months.y);

	push()
	stroke("#FFF");
	strokeWeight(2);
	fill(Color.logosColor('orange', 'medium'));
	circle(coords.x, coords.y, months.weight/2);
	pop();
}

function drawMonthNames() {
	push();
	fill(0);
	noStroke();
	year.months.forEach((m, i) => {
		var angle = m.startAngle + ((m.endAngle - m.startAngle) / 2) - 90;
		var monthName = m.abbr;
		monthName +=  (m.year != today.getFullYear()) ? " " + m.year : "";

		textBlockOnACircle(monthName, months.r / 2 + (months.weight * 1.666), angle, months.x, months.y);
	});
	pop();
}

function drawEvents() {
	Tracks.forEach(t => {
		t.events.forEach(e => {
			if (e.type === "selected") {
				drawEvent(t, e, 1.0, 255);
			} else if (e.type === "series") {
				drawEvent(t, e, 1.0, 200);
			} else {
				drawEvent(t, e, .75, 220);
			}
		});
	});

	Tracks.forEach(t => {
		t.events.forEach(e => {
			if (true || e.type === "series") {
				drawEventName(t, e);
			}
		});
	});
}

function drawEvent(t, e, weight, alpha) {
	if (!e.end) {
		e.end = e.start;
	}

	var startDay = year.getDayString(e.start);
	var endDay = year.getDayString(e.end);
	var ring = t.ring;

	var eColor = e.color || t.color;
	var c = eColor ? Color.logosColor((eColor), "medium") : color("#000");
	if (eColor == "yellow" || eColor == "white") {
		c = Color.logosColor("yellow", "dark");
	}
	c.setAlpha(alpha);

	var startPos = startDay.position + ring.padding;
	var endPos = endDay.position + year.degreesPerDay;

	push();
	strokeCap(SQUARE);
	strokeWeight(t.weight * weight);
	stroke(c);
	arc(ring.x, ring.y, ring.r, ring.r, startPos - 90, endPos - 90);
	pop();
}

function drawEventName(t, e) {
	if (!e.end) {
		e.end = e.start;
	}
	var startDay = year.getDayString(e.start);
	var endDay = year.getDayString(e.end);

	// add captions
	var words = e.name.split(' ');
	var maxLength = Math.floor((year.getDayString(e.end).index - year.getDayString(e.start).index) * .575);
	var lines = 1;
	var length = 0;
	var caption = "";

	words.forEach(w => {
		if (length + w.length <= maxLength) {
			caption += " " + w;
			length = caption.length;
		} else {
			if (lines == 1) {
				length = 0;
				lines = 2;

				if (length + w.length <= maxLength) {
					if (length == 0) caption += "\n";
					caption += (length ? " " : "") + w;
				} else {
					var word = "";
					w.split("")
						.forEach(c => {
							if (caption.length + word.length + 1 <= maxLength) {
								word += c;
							}
						});

					if (word) {
						caption += " " + word;
					}
				}
			}
		}
	});

	if (caption.length > 0 && caption.length < e.name.length + 1) {
		caption += '...';
	}

	var startPos = startDay.position + ring.padding;
	var endPos = endDay.position + year.degreesPerDay;

	push();
	fill("white");
	textBlockOnACircle(caption, t.ring.r / 2, startPos - 90 + ((endPos - startPos) / 2), months.x, months.y);
	pop();
}

function textBlockOnACircle(txt, radius, angle, x, y) {
	var vec = polar2Cartesian(radius, angle, x, y);

	push();
	noStroke();
	textAlign(CENTER, CENTER);
	translate(vec.x, vec.y);
	rotate(angle + (vec.y > height / 2 ? 270 : 90));

	textSize(months.weight * 1.5);

	text(txt, 0, 0);
	pop();
}

function polar2Cartesian(r, a, oX, oY) {
	var x = (r * cos(a)) + oX;
	var y = (r * sin(a)) + oY;

	return { x: x, y: y };
}

function mouseMoved() {
	var loc = new Vector(mouseX, mouseY);
	var polar = loc.toPolar(new Vector(width / 2, height / 2));
	var day = getDayFromAngle(polar.angle);

	label = `${RadialYear.getWeekdayName(day.date)}\n${RadialYear.getMonthName(day.date)} ${day.date.getDate()}, ${day.date.getFullYear()}`;

	var whichTrack = intersectTracks(polar);
	if (whichTrack) {
		label += "\n" + whichTrack.name;
		hoverTrack = whichTrack;
	}

	var whichEvent = intersectEvents(whichTrack, day);
	if (whichEvent) {
		label += "\n" + whichEvent.name;
	}

	drawLash(day, Color.logosColor('red', 'medium'), 60);

	return false;
}

function intersectTracks(polar) {
	var whichTrack = null;
	Tracks.forEach(t => {
		var r = t.ring;
		var inner = r.r / 2 - r.weight / 2 - TRACKPADDING;
		var outer = r.r / 2 + r.weight / 2;
		if (polar.radius >= inner && polar.radius <= outer) {
			whichTrack = t;
		}
	});
	return whichTrack;
}

function intersectEvents(track, day) {
	if (track == null) return null;

	var whichEvent = null;
	track.events.forEach(e => {
		var startIndex = year.getDayString(e.start).index;
		var endIndex = year.getDayString(e.end).index;

		if (day.index >= startIndex && day.index <= endIndex) {
			whichEvent = e;
		}

	});
	return whichEvent;
}

function drawLash(day, color, alpha) {
	push();

	// measure rings
	var weight = 0;
	Tracks.forEach(t => {
		weight += t.weight + TRACKPADDING;
	});
	weight += months.weight + TRACKPADDING;

	strokeWeight(weight);
	var radius = (months.r + months.weight * 2) - weight;

	strokeCap(SQUARE);
	color.setAlpha(alpha);
	stroke(color);

	var startPos = day.position + ARCPADDING;
	var endPos = day.position + year.degreesPerDay;

	if (!months.animating) {
		arc(months.x, months.y, radius, radius, startPos - 90, endPos - 90);
	}
	pop();
}

function getDayFromAngle(angle) {
	for (var i = 0; i < year.days.length; ++i) {
		if (year.days[i].position + year.degreesPerDay >= angle) {
			return year.days[i];
		}
	}
	return year.days[0];
}

function drawShadow() {
	push();
	noStroke();

	// shadow color
	var c1 = color("#000");
	c1.setAlpha(60);
	var c2 = color("#000");
	c2.setAlpha(0);

	// shadow location
	var x = width / 2 + 1;
	var y = months.y - months.r / 2 - MONTHSWIDTH / 2;
	var w = 16;
	var h = 0 + months.weight;

	Tracks.forEach(t => {
		h += TRACKPADDING + t.weight;
	});
	h -= TRACKPADDING;

	for (let i = x; i <= x + w; i++) {
		let inter = map(i, x, x + w, 0, 1);
		let c = lerpColor(c1, c2, inter);
		fill(c);
		rect(i, y, 1, h);
	}

}
