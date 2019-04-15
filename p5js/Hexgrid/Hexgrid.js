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

  constructor(options) {
    this.size = options.size;
    this.tileSize = options.tileSize;
    this.canvasHeight = options.canvasHeight;
    this.canvasWidth = options.canvasWidth;

    this.setup();
  }

  setup() {
    this.height = 0;
    this.width = 0;
    this.tiles = [];

    push();
    colorMode(RGB, 255);
    this.color = {
      base : color(180,180,180),
      selected : color(200,80,20),
      focused : color(180,120,0),
      highlighted : color(200,200,200),
    };
    pop();
    
    var rows = this.size * 2 - 1;
    var last = this.size;

    for (var row = 0; row < rows; ++row) {
      var cols = row < (rows - 1) / 2 ? last++ : last--;
      this.tiles.push([]);
      for (var col = 0; col < cols; ++col) {
        var tile = new Hextile(row, col);
        this.tiles[row].push(tile);
      }
    }

    this.centerRow = Math.floor((this.size * 2 - 1) / 2);
    this.width = this.tiles[this.centerRow].length * this.tileSize * 1;
    this.height = this.tiles.length * this.tileSize * .88;

    this.left = (this.canvasWidth - this.width)/2  + (this.tileSize/2);
    this.top = (this.canvasHeight - this.height)/2 + (this.tileSize/2);
  }

  // ---- Tile is? ----

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

//---- getTiles ----

  getTile(row,col) {
    if (row > -1 && row < this.tiles.length && col > -1 && col < this.tiles[row].length) {
      return this.tiles[row][col];
    }
    return null;
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

  getAdjacentTiles(tile, dirs) {
    if (!tile) return [];

    var r = tile.row;
    var c = tile.col;

    var ret = [];

    for (var i = 0; i < dirs.length; ++i) {
      switch (dirs[i]) {
        case 'W':
          ret.push(this.getTile(r, c-1));
        break;

        case 'E':
          ret.push(this.getTile(r, c+1));
        break;

        case 'NW':
          if (this.isUpper(tile) || this.isCenterRow(tile)) {
            ret.push( this.getTile(r-1, c-1) );
          }
          else if (this.isLower(tile)) {
            ret.push( this.getTile(r-1, c) );
          }
        break;

        case 'NE':
          if (this.isUpper(tile) || this.isCenterRow(tile)) {
            ret.push( this.getTile(r-1, c) );
          }
          else if (this.isLower(tile)) {
              ret.push( this.getTile(r-1, c+1) );
          }
        break;
        
        case 'SW':
          if (this.isUpper(tile)) {
            ret.push( this.getTile(r+1,c) );
          }
          else if (this.isLower(tile) || this.isCenterRow(tile)) {
            ret.push( this.getTile(r+1,c-1) );
          }
        break;

        case 'SE':
          if (this.isUpper(tile)) {
            ret.push( this.getTile(r+1,c+1) );
          }
          else if (this.isLower(tile) || this.isCenterRow(tile)) {
            ret.push( this.getTile(r+1,c) );
          }
        break;      
      }
    }
    return ret.filter( (e) => e !== null );
  }

  getLines(tile, dirs) {
    var ret = [];
    var next = [tile];

    for (var i = 0; i < dirs.length; ++i) {
      var tmp = this.getLine(tile, dirs[i]);
      ret = ret.concat(tmp);
    }
    return ret;
  }

  getLine(tile, dir) {
    var ret = [];
    var next = [tile];
    
    while (true) {
      next = this.getAdjacentTiles(next[0], [dir]);
      if (next.length == 0 || next === undefined || next === null) break;
      if (next[0].state == 'selected') break;
      ret.push(next[0]);
    }
    return ret;
  }

  getRosette(tile) {
    return this.getAdjacentTiles(tile, ['NW', 'NE', 'E', 'SE', 'SW', 'W']);
  }

  draw() {
    for (var i in this.tiles) {
      var row = this.tiles[i];
      var longestRow = (this.size * 2) - 1;
      var rowDiff = longestRow - row.length;
      var offset = (rowDiff/2) * this.tileSize;

      for (var j in row) {
        var tile = row[j];
        
        noStroke();

        fill(grid.color[tile.state]);
        
        var x = (j*this.tileSize) + offset + this.left;
        var y = (i*this.tileSize*.88) + this.top;
        var d = this.tileSize;

        tile.x = x;
        tile.y = y;
        tile.d = d;

        ellipse(x, y, d);
      }
    }
  }

  forEachTile(f) {
    for (var r in this.tiles) {
      for (var c in this.tiles[r]) {
        var t = this.getTile(r, c);
        f(t);
      }
    }
  }

  focusTile(tile, highlights) {
    this.forEachTile( (t) => {
      if (t.state != 'selected') t.state = 'base';
    });

    if (!tile) return;
    if (tile.state == 'selected') return;
    tile.state = 'focused';

    if (!highlights) return;
    for (var i in highlights) {
      if (!highlights[i]) continue;
      highlights[i].state = (highlights[i].state == 'selected') ? 'selected' : 'highlighted';
    }  
  }

  selectTile(tile) {
    if (!tile) return;
    tile.state = (tile.state == 'selected') ? 'base' : 'selected';
  }
}

class Hextile {
  constructor(x,y) {
    this.row = x;
    this.col = y;

    this.state = 'base';

    this.x = 0;
    this.y = 0;
    this.r = 0;
  }
}