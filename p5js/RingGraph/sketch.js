var ring;
var height, width;

var Settings = {
  segments : 3,
  size : 200,
  weight : 40,
  style : 'drawSegments'
};

function setup() {
  height = window.innerHeight;
  width = window.innerWidth;
  createCanvas(width, height);

  settings = QuickSettings.create();
  // settings.setGlobalChangeHandler(changeRing);
  settings.addRange('segments', 3, 40, 2, 1, (v) => {Settings.segments = v; changeRing();});
  settings.addRange('size', 40, height, 40, 1, (v) => {Settings.size = ring.r = v; });
  settings.addRange('weight', 20, 100, 25, 1, (v) => {Settings.weight = ring.weight = v; });
  settings.addDropDown('style', ['drawSegments', 'static', 'drawRing'], (v) => {Settings.style = ring.style = v.value; ring.resetAnimation(); });

  angleMode(DEGREES);
  noFill();  
  background(245);

  changeRing();
  // noLoop();
  // redraw();
}

function changeRing() {
  background(245);

  ring = new Ring(width/2, height/2, Settings.size);
  ring.weight = Settings.weight;
  ring.style = Settings.style;

  for (var i = 0; i < Settings.segments; ++i) {
    ring.addSegment(random(100) + 2);
  }
}

function draw() {
  background(245);
  ring.draw();
}