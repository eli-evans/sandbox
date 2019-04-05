var cells;
const CELLS = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  cells = new Cells();
  cells.spawn(CELLS);

  setTimeout( noLoop, 60000);
}

function draw() {
  background(0);
  cells.draw();
}



