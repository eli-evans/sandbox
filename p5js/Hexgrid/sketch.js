var grid;
var focusColor;
var lineColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noFill();
  noLoop();
  background(245);
  
  grid = new Hexgrid({
    size : 12,
    tileSize : 30,
    canvasHeight : windowWidth,
    canvasWidth : windowHeight
  });
  focusColor = Color.randomDarkColor();
  lineColor = Color.randomLightColor();

  windowResized();
  redraw();
}

function draw() {
  background(245); // clear screen

  var focus = grid.getTileAt(mouseX, mouseY);
  
  // var hi = grid.getLine(focus, ['W', 'E']);

  grid.focusTile(focus, grid.getLines(focus, ['NW', 'SE', 'E', 'W', 'NE', 'SW']).concat(grid.getRosette(focus)));

  grid.draw();
}

function mouseMoved() {
  if (mouseX > (grid.left - 50) && 
    mouseX < (grid.left + grid.width + 50) && 
    mouseY > (grid.top - 50) && 
    mouseY < (grid.top + grid.height + 50))
  {


    redraw();
  }
}

function mouseClicked() {
  var tile = grid.getTileAt(mouseX, mouseY);
  grid.selectTile(tile);
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  grid.canvasWidth = windowWidth;
  grid.canvasHeight = windowHeight;
  grid.setup();
  redraw();
  console.log(windowWidth, windowHeight);
}