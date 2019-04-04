class Ring {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.weight = 10;
    this.segments = [];
    this.offset = -90;
    this.colorizer = function(i) {
        return i % 2
            ? Color.randomFilteredColor( (c) => Color.isNice(c) && Color.isBright(c) && Color.isCool(c) )
            : Color.randomFilteredColor( (c) => Color.isNice(c) && Color.isBright(c) && Color.isWarm(c) )
    };
  }

  addSegments(segs) {
    segs.sort((a, b) => b - a);

    // sum
    var sum = 0;
    for (var i in segs) {
      sum += segs[i];
    }
    var q = 360 / sum;

    // convert to degrees
    var start = 0;
    for (var i in segs) {
      var v = segs[i];
      var l = segs[i] * q;
      var end = start + l;


      var newSeg = new Segment(start , end , v);
      newSeg.color = this.colorizer(i);
      
      if (newSeg.end < newSeg.start) {
        newSeg.end = newSeg.start;
      }
      this.segments.push(newSeg);

      start = end;
    }
  }

  draw() {
    for (var i in this.segments) {
      var seg = this.segments[i];
      strokeCap(SQUARE);
      strokeWeight(this.weight);
      stroke(seg.color);
      if (seg.grow) {
        var end = Math.min(seg.angle, seg.end);
        arc(this.x, this.y, this.r, this.r, seg.start- this.offset + (100/this.r), end- this.offset);
      }
      
      else if (!seg.grow) {
        arc(this.x, this.y, this.r, this.r, seg.start- this.offset + (100/this.r), seg.end- this.offset);
      }

      seg.angle += (seg.end - seg.start) / 15;
      if (seg.angle >= seg.end) {
        seg.angle = seg.start;
        seg.grow = false;
      }
    }
  }
}


class Segment {
  constructor(s, e, v) {
    this.start = s || 0;
    this.end = e || 0;
    this.value = v || 0;
    this.grow = true;
    this.angle = this.start;
  }
}