var w = 50;
var h = 50;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noLoop();
  redraw();
}

function draw() {

  // frameRate(3);
  background(0);
  for (var i = 0; i < window.innerWidth; i+=w) {
    for (var j = 0; j < window.innerHeight; j+=h) {
      var c = Color.randomColor( {h:'warm', s:'technicolor', b:[200,220]} );
      fill( c );
      strokeWeight(0);
      ellipse(i, j, w, h);
    }
  }
  
}