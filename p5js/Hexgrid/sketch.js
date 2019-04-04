var grid;
var focusColor;
var lineColor;

function setup() {
  height = window.innerHeight;
  width = window.innerWidth;
  createCanvas(width, height);
  angleMode(DEGREES);
  noFill();
  background(245);
  
  grid = new Hexgrid(11, 40);
  focusColor = Color.randomDarkColor();
  lineColor = Color.randomLightColor();
}

function draw() {

  for (var row in grid.tiles) {
    for (var col in grid.tiles[row]) {
      grid.tiles[row][col].color = [200];
    }
  }
  var focus = grid.getTileAt(mouseX, mouseY);
  if (focus) {
    /* var neighbors = grid.getLine(focus, Hexgrid.E)
      .concat(grid.getLine(focus, Hexgrid.W))
      .concat(grid.getLine(focus, Hexgrid.NW))
      .concat(grid.getLine(focus, Hexgrid.SW))
      .concat(grid.getLine(focus, Hexgrid.NE))
      .concat(grid.getLine(focus, Hexgrid.SE)); */
    
    var neighbors = [];
    var rosette = grid.getRosette(focus);
    for (var t in rosette) {
      var rosette2 = grid.getRosette(rosette[t]);
      for (var r in rosette2) {
        if (!neighbors.includes(rosette2[r]) && rosette2[r] !== focus) neighbors.push(rosette2[r]);
      }
    }
    focus.color = focusColor;
    for (var n in neighbors) {
      neighbors[n].color = lineColor;
    }
  }

  grid.draw();
}