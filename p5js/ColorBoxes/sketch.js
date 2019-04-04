var w = 50;
var h = 50;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {

  frameRate(3);
  background(255);
  for (var i = 0; i < window.innerWidth; i+=w) {
    for (var j = 0; j < window.innerHeight; j+=h) {

      var c = Color.randomFilteredColor( (c) => Color.isWarm(c) && Color.isMuddy(c) && !Color.isDark(c) );
      fill( c );
      strokeWeight(0);
      rect(i, j, w - 1, h - 1);
    }
  }
  
}