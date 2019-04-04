var rings = [];
var height, width;

function setup() {
  height = window.innerHeight;
  width = window.innerWidth;
  createCanvas(width, height);

  angleMode(DEGREES);
  noFill();
  
  background(245);
  for (var n = 0; n < 24; ++n) {
    var ring = new Ring(width/2, height/2, (n+1) * 60);
    ring.weight = ring.r/120 + 10;
    ring.offset = random(90);
    // ring.colorizer = (i) => Color.randomFilteredColor( (c) => Color.isCool(c) && Color.isBright(c) );

    var l = Math.floor(random(10)) + 10;
    var segs = [];
    for (var i = 0; i < l; ++i) {
      segs.push(random(100) + 10);
    }
    
    ring.addSegments(segs);
    rings.push(ring);
  }  

  console.log(rings);
}

function draw() {
  background(245);
  for(var i in rings) {
    if (!rings[i].segments[0].grow) {
      rings[i].offset -= .05;
    }
    rings[i].draw();
  }

}