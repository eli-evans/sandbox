var height, width;
var year;
var months;
var MONTHSWIDTH = 8;
var TRACKPADDING = 4;
var ARCPADDING = .20;
var label;

var Tracks = [
  {
    name: "US Holidays",
    color: "blue",
    weight: 12,
    events: CalendarUtil.getUSHolidays2020()
  },
  {
    name: "Church Holidays",
    color: "red",
    weight: 12,
    events: CalendarUtil.getChurchHolidays2020()
  },  
  {
    name: "Track 1",
    color: "peach",
    weight: 60,
    events: [
      {start: "January 1", end: "January 4"},
      {start: "January 5", end: "January 22", name: "Event Name"},
      {start: "February 20", end: "February 20"},
      {start: "March 15", end: "March 17"},
      {start: "March 1", end: "March 10"},
      {start: "March 18", end: "March 30"},
    ],
  },
  {
    name: "Track 2",
    color: "green",
    weight: 60,
    events: [    
      {start: "June 15", end: "June 19"}
    ]
  },
  {
    name: "Track 3", 
    color: "purple",
    weight: 60,
    events: [
      {start: "October 1", end: "October 29"},
      {start: "October 30", end: "October 31"},
      {start: "November 1", end: "November 23"},
      {start: "November 24", end: "December 31"}
    ]
  }

];

function setup() {
  height = window.innerHeight;
  width = window.innerWidth;
  createCanvas(width, height);

  angleMode(DEGREES);
  noFill();
  background(255);

  year = CalendarUtil.get2020();
  // console.log(year);

  var fullsize = (Math.min(height, width)) * .9;

  months = new Ring(width/2, height/2, fullsize);
  months.offset = 90;
  months.padding = ARCPADDING;
  months.label = "";
  months.labelSize = 18;
  months.weight = MONTHSWIDTH;
  months.style = "drawRing";
  months.colorizer = (i) => {return i % 2 ? color("#A0A0A0") : color("#E0E0E0")};
  months.addSegments( year.months.map( (i) => i.length ) );

  changeRing();

}

function changeRing() {
  background(255);

  var lastRing = months; 

  Tracks.forEach( (t, nTrack) => {

    // make a ring
    var radius = lastRing.r - (lastRing.weight + t.weight) - TRACKPADDING;

    ring = new Ring(width/2, height/2, radius);
    ring.weight = t.weight;
    ring.style = "drawRing";
    ring.padding = ARCPADDING;
    ring.offset = 90;
    ring.label = "";

    lastRing = ring;

    // set ring color
    var c = Color.logosColor(t.color, "extra-light");
    c.setAlpha(180);
    ring.colorizer = (i) => c;


    // add weeks
    ring.addSegment( year.firstWeekLength );
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
    var ring = t.ring;
    t.ring.draw();

    if (t.ring.animating) return;

    t.events.forEach( (e) => {
      push();
      strokeCap(SQUARE);
      strokeWeight(t.weight * .8);
      var c = Color.logosColor(t.color, "medium");
      c.setAlpha(200);
      stroke(c);

      if (!e.end) {
        e.end = e.start;
      }

      var startPos = year.daysByName[e.start].position - ring.offset + ring.padding;
      var endPos = year.daysByName[e.end].position + year.degreesPerDay - ring.offset;
  
      arc(ring.x, ring.y, ring.r, ring.r, startPos, endPos);

      if (e.name && t.color === "peach") {
        textBlockOnACircle(e.name, t.ring.r/2, startPos + ((endPos-startPos)/2), months.x, months.y);
      }

      pop();

    });

    push();
    fill(0);
    noStroke();
    year.months.forEach( (m, i) => {
      var angle = 15 + (30 * i) - months.offset;
      textBlockOnACircle(m.abbr, months.r/2 + 12, angle, months.x, months.y);
    });
    pop();

  });

  var today = "March 15";
  drawLash(year.daysByName["March 12"], color("#000"), 40);

  mouseMoved();
  drawShadow();
}

function textBlockOnACircle(txt, radius, angle, x, y) {
  var vec = polar2Cartesian( radius, angle, x, y );

  push();
  noStroke();
  fill("#000");
  textAlign(CENTER, CENTER);
  translate(vec.x, vec.y);
  rotate(angle + (vec.y > height/2 ? 270 : 90 ));

  console.log(txt);

  text(txt, 0,0);
  pop();
}

function cartesian2Polar(x, y, oX, oY) {
  oX = oX ? oX : width/2;
  oY = oY ? oY : height/2;

  x -= oX; 
  y -= oY;

  var distance = Math.sqrt(x*x + y*y);
  var radians = Math.atan2(y,x); // atan2 takes y first
  var degrees = radians * (180/Math.PI) + months.offset;
  if (degrees < 0) {
    degrees += 360;
  }
  return {distance: distance, degrees: degrees};
}

function polar2Cartesian(r, a, oX, oY) {
  var x = (r * cos(a)) + oX;
  var y = (r * sin(a)) + oY;

  return {x: x, y: y};
}

function mouseMoved() {
  var day = getDayFromAngle(cartesian2Polar(mouseX, mouseY));
  label = day.name;

  drawLash(day, Color.logosColor('red', 'medium'), 80);

  return false;
}

function drawLash(day, color, alpha) {
  push();
  strokeWeight(months.r/2 + months.weight);
  var radius = months.r/2 + months.weight + 24; // months.r - 240;

  strokeCap(SQUARE);
  color.setAlpha(alpha);
  stroke(color);

  var startPos = day.position - months.offset + ring.padding;
  var endPos = day.position - months.offset + year.degreesPerDay;

  if (!months.animating) {
    arc(months.x, months.y, radius, radius, startPos, endPos);
  }
  pop();
}

function getDayFromAngle( vec ) {
  for (var i = 0; i < year.days.length; ++i) {
    if (year.days[i].position + year.degreesPerDay >= vec.degrees) {
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
  var x = width/2 + 1;
  var y = months.y - months.r/2 - MONTHSWIDTH/2;
  var w = 16;
  var h = 0;

  Tracks.forEach( t => {
    h += TRACKPADDING + t.weight;
  });

  // console.log(`x ${x}, y ${y}, w ${w}, h ${h}`);


  for (let i = x; i <= x + w; i++) {
    let inter = map(i, x, x + w, 0, 1);
    let c = lerpColor(c1, c2, inter);
    fill(c);
    rect(i, y, 1, h);
  }




}