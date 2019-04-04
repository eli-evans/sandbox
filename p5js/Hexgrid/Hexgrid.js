class Hexgrid {

  static Above = 'N';
  static Below = 'S';
  static AboveLeft = 'NW';
  static AboveRight = 'NE';
  static BelowLeft = 'SW';
  static BelowRight = 'SE';
  static N = 'N';
  static S = 'S';
  static Left = 'W';
  static Right = 'E';
  static NW = 'NW';
  static SW = 'SW';
  static NE = 'NE';
  static SE = 'SE';
  static E = 'E';
  static W = 'W';

  constructor(size, tileSize) {
    this.size = size;
    this.tileSize = tileSize;
    this.tiles = [];

    var rows = size * 2 - 1;
    var last = size;

    for (var row = 0; row < rows; ++row) {
 
      var cols = row < (rows - 1) / 2 ? last++ : last--;
      
      this.tiles.push([]);
      for (var col = 0; col < cols; ++col) {
        var offset = 0;
        var color = [180,180,180];

        var tile = new Hextile(row, col, color);
        this.tiles[row].push(tile);
      }
    }

    this.centerRow = Math.floor((this.size * 2 - 1) / 2);
  }

  isCenterRow(tile) {
    return (tile.row == this.centerRow);
  }

  isCenterColumn(tile) {
    var w = this.tiles[tile.row].length;
    return (tile.col == (w-1) / 2);
  }

  isCenter(tile) {
    return this.isCenterRow(tile) && this.isCenterColumn(tile);
  }

  isUpper(tile) {
    return tile.row < this.centerRow;
  }
  
  isLower(tile) {
    return tile.row > this.centerRow;
  }

  getTile(row,col) {
    return this.tiles[row][col];
  }

  getLeft(tile) {
    if (tile.col == 0) {
      return null;
    }
    return this.tiles[tile.row][tile.col - 1];
  }

  getRight(tile) {
    if (tile.col == this.tiles[tile.row].length) {
      return null;
    }
    return this.tiles[tile.row][tile.col + 1];
  }

  getAbove(tile) {
    var ret = [];
    var left = this.getAboveLeft(tile);
    var right = this.getAboveRight(tile);
    if (left) ret.push(left);
    if (right) ret.push(right);
    return ret;
  }

  getAboveLeft(tile) {
    var r = tile.row;
    var c = tile.col;
    if(r == 0) {
      return null;
    }
    if (this.isUpper(tile) || this.isCenterRow(tile)) {
      return this.getTile(r-1,c-1);
    }
    if (this.isLower(tile)) {
      return this.getTile(r-1,c);
    }
  }

  getAboveRight(tile) {
    var r = tile.row;
    var c = tile.col;
    if(r == 0) {
      return null;
    }
    if (this.isUpper(tile) || this.isCenterRow(tile)) {
      return this.getTile(r-1, c);
    }
    if (this.isLower(tile)) {
      return this.getTile(r-1, c+1);
    }
  }

  getBelow(tile) {
    var ret = [];
    var left = this.getBelowLeft(tile);
    var right = this.getBelowRight(tile);
    if (left) ret.push(left);
    if (right) ret.push(right);
    return ret;
  }

  getBelowLeft(tile) {
    var r = tile.row;
    var c = tile.col;
    if(r == this.tiles.length - 1) {
      return null;
    }
    if (this.isUpper(tile)) {
      return this.getTile(r+1,c);
    }
    if (this.isLower(tile) || this.isCenterRow(tile)) {
      return this.getTile(r+1,c-1);
    }
  }

  getBelowRight(tile) {
    var r = tile.row;
    var c = tile.col;
    if(r == this.tiles.length - 1) {
      return null;
    }
    if (this.isUpper(tile)) {
      return this.getTile(r+1,c+1);
    }
    if (this.isLower(tile) || this.isCenterRow(tile)) {
      return this.getTile(r+1,c);
    }
  }

  getRosette(tile) {
    var ret = [];
    var left, right, aboveleft, aboveright, belowleft, belowright;

    aboveleft = this.getAboveLeft(tile);
    if (aboveleft) ret.push(aboveleft);

    aboveright = this.getAboveRight(tile);
    if (aboveright) ret.push(aboveright);

    right = this.getRight(tile);
    if (right) ret.push(right);

    belowleft = this.getBelowLeft(tile);
    if (belowleft) ret.push(belowleft);

    belowright = this.getBelowRight(tile);
    if (belowright) ret.push(belowright);  

    left = this.getLeft(tile);
    if (left) ret.push(left);
 
    return ret;
  }

  getLine(tile, dir) {
    var n = tile;
    var ret = [];

    while (true) {
      switch (dir) {
        case 'NW':
          n = this.getAboveLeft(n);
          break;
        case 'NE':
          n = this.getAboveRight(n);
          break;
        case 'SW':
          n = this.getBelowLeft(n);
          break;
        case 'SE':
          n = this.getBelowRight(n);
          break;
        case 'W':
          n = this.getLeft(n);
          break;
        case 'E':
          n = this.getRight(n);
          break;
      }
      if (n == null) break;
      ret.push(n);
    }
    return ret;
  }

  getArea(tile, dir) {
    var ret = [];
    var kids;
    
    switch (dir) {
      case 'N':
        kids = this.getAbove(tile);
        break;
      case 'S':
        kids = this.getBelow(tile);
        break;
    }
  
    for (var i in kids) {
      if (!ret.includes(kids[i])) ret.push(kids[i]);
      var more = this.getArea(kids[i], dir);
      for (var j in more) {
        if (!ret.includes(more[j])) ret.push(more[j]);
      }
    }
    return ret;
  }

  getTileAt(x,y) {
    for (var i in this.tiles) {
      for (var j in this.tiles[i]) {
        var tile = this.tiles[i][j];

        var d = dist(x,y, tile.x,tile.y);
        if (d < tile.d/2) {
          return tile;
          break;
        }
      }
    }
    return null;
  }

  draw() {
    for (var i in this.tiles) {
      var row = this.tiles[i];
      var offset = ((grid.size - 1) / 2) - row.length;
      for (var j in row) {
        var tile = row[j];
        
        noStroke();

        fill(tile.color);
        
        var x = (j*this.tileSize) + (offset*(this.tileSize/2)) + 300;
        var y = (i*this.tileSize*.88) + 100;
        var d = this.tileSize;

        tile.x = x;
        tile.y = y;
        tile.d = d;

        ellipse(x, y, d);
      }
    }
  }
}

class Hextile {
  constructor(x,y,c) {
    this.row = x;
    this.col = y;

    this.color = c;
    this.x = 0;
    this.y = 0;
    this.r = 0;
  }
}