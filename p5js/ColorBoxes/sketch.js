var w = 50;
var h = 50;

var spec = {h:'any', s:'any', b:'any'};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  var ranges = ['any'];
  for (var i = 1; i <= 15; ++i) {
    ranges.push('range'+ i);
  }

  settings = QuickSettings.create();
  settings.addDropDown('hue', ranges.concat(['red', 'orange', 'yellow', 'green', 'teal', 'cerulean', 'blue', 'indigo', 'violet', 'purple', 'magenta', 'red-violet', 'scarlet', 'warm', 'cool']), (v) => {spec.h = v.value; redraw();});
  settings.addDropDown('saturation', ranges.concat(['gray', 'medium', 'bright']), (v) => {spec.s = v.value; redraw();});
  settings.addDropDown('brightness', ranges.concat(['dark', 'medium', 'light']), (v) => {spec.b = v.value; redraw();});

  noLoop();
  redraw();
}

function draw() {

  // frameRate(3);
  background(255);
  for (var i = 0; i < window.innerWidth; i+=w) {
    for (var j = 0; j < window.innerHeight; j+=h) {
      var c = Color.randomColor( spec );
      fill( c );
      strokeWeight(0);
      rect(i, j, w - 1, h - 1);
    }
  }
  
}