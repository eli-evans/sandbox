var w = 50;
var h = 50;

var spec = {h:'warm', s:'gray', b:'dark'};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  settings = QuickSettings.create();
  settings.addDropDown('hue', ['warm', 'cool', 'any'], (v) => {spec.h = v.value; redraw();});
  settings.addDropDown('saturation', ['gray', 'dull', 'colorful', 'technicolor', 'saturated', 'any'], (v) => {spec.s = v.value; redraw();});
  settings.addDropDown('brightness', ['dark', 'mid', 'bright', 'any'], (v) => {spec.b = v.value; redraw();});

  noLoop();
  redraw();
}

function draw() {

  // frameRate(3);
  background(0);
  for (var i = 0; i < window.innerWidth; i+=w) {
    for (var j = 0; j < window.innerHeight; j+=h) {
      var c = Color.randomColor( spec );
      fill( c );
      strokeWeight(0);
      ellipse(i, j, w, h);
    }
  }
  
}