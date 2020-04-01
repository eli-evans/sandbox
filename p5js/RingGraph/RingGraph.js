class Ring {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.weight = 10;
    this.segments = [];
    this.offset = 0; // lets users rotate the ring
    this.colorizer = function(i) {
        return i % 2
            ? Color.randomColor( {h:'warm', s:'medium', b:'light'} )
            : Color.randomColor( {h:'cool', s:'medium', b:'light'} )
    };

    this.style = 'static'; // static, growSegments, growRing

    this.animating = true;
    this.angle = 0;

    this.padding = .125;

    this.label = '100%';
    this.labelSize = r/4;

    this.sort = (a,b) => b - a;
  }

  static angleCorrection() {
    return -90; 
  }

  addSegments(segs) {
    if (this.sort)
      segs.sort(this.sort);

    // sum
    var sum = 0;
    for (var i in segs) {
      sum += segs[i];
    }
    var q = 360 / sum;

    // convert to degrees
    var start = 0 + Ring.angleCorrection() + this.offset;
    for (var i in segs) {
      var v = segs[i];
      var l = segs[i] * q;
      var end = start + l;

      var newSeg = new Segment(start, end , v);
      newSeg.color = this.colorizer(i);
      
      if (newSeg.end < newSeg.start) {
        newSeg.end = newSeg.start;
      }
      this.segments.push(newSeg);

      start = end;
    }
  }

  addSegment(val) {
    var tmp = this.segments.map( (e) => (e.value));
    tmp.push(val);

    this.segments = [];
    this.addSegments(tmp);
  }

  draw() {
    switch (this.style) {
      case 'static':
        this.drawStatic();
      break;
      case 'drawSegments':
        this.drawSegments();
      break;
      case 'drawRing':
        this.drawRing();
      break;
      default:
        console.log(`Unknown style {0}`, this.style);
      break;
    }

    push();
    textSize(this.labelSize);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
    pop();
  }

  drawStatic() {
    push();
    strokeCap(SQUARE);
    strokeWeight(this.weight);
    for (var i in this.segments) {
      var seg = this.segments[i];

      stroke(seg.color);
      arc(this.x, this.y, this.r, this.r, seg.start + this.padding, seg.end);
    }
    pop();
  }

  drawSegments() {
    push();
    for (var i in this.segments) {
      var seg = this.segments[i];
      strokeCap(SQUARE);
      strokeWeight(this.weight);
      stroke(seg.color);

      if (seg.animating) {
        var end = Math.min(seg.angle, seg.end);
        if (end > 360) {
          end = 360;
        }
        if (seg.start + (90/this.r) > 358) continue;
        arc(this.x, this.y, this.r, this.r, seg.start + this.padding, seg.end);
      }
      
      else if (!seg.animating) {
        arc(this.x, this.y, this.r, this.r, seg.start + this.padding, seg.end);
      }

      seg.angle += (seg.end - seg.start) / 15;
      if (seg.angle >= seg.end) {
        seg.angle = seg.start;
        seg.animating = false;
      }
    }
    pop();
  }

  drawRing() {
    push();
    strokeCap(SQUARE);
    strokeWeight(this.weight);

    for (var i in this.segments) {
      var seg = this.segments[i];

      stroke(seg.color);
      if (this.animating) {
        var end = Math.min(this.angle, seg.end);
        if (end > 360) {
          end = 360;
        }
        if (seg.start + (90/this.r) > 358) continue;
        if (seg.start + (100/this.r) <= end) {
          arc(this.x, this.y, this.r, this.r, seg.start + this.padding, Math.min(end, seg.end));
        }
      }
      else if (!this.animating) {
        arc(this.x, this.y, this.r, this.r, seg.start + this.padding, seg.end);
      }
    }    
    this.angle += 9;
    if (this.angle >= 360) {
      this.angle = 360;
      this.animating = false;
    }
    pop();
  }

  resetAnimation() {
    this.animating = true;
    this.angle = 0;
    for (var i in this.segments) {
      this.segments[i].resetAnimation();
    }
  }
}

class Segment {
  constructor(s, e, v) {
    this.start = s || 0;
    this.end = e || 0;
    this.value = v || 0;
    this.animating = true;
    this.angle = this.start;
  }

  resetAnimation() {
    this.animating = true;
    this.angle = this.start;
  }
}