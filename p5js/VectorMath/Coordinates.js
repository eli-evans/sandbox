class Point {
    // construction

    constructor() {
        if (Array.isArray(arguments[0])) {
            return Point.fromArray(arguments[0]);
        }

        else if (typeof arguments[0] === 'number') {
            return Point.fromArray([...arguments]);
        }

        else if (arguments[0] instanceof Point) {
            return Point.fromPoint(arguments[0]);
        }

        else if (typeof arguments[0] === 'object') {
            var spec = arguments[0];
            this.coords = spec.coords;
            if (spec.dimensions) {
                this.dimensions = spec.dimensions;
            }
        }
    }

    // static constructor factories

    static fromArray(coords) {
        return new Point(  {coords: coords, dimensions: coords.length } );
    }

    static fromCoordinates() {
        return new Point( { coords: [...arguments], dimensions: arguments.length } );
    }

    static fromPoint() {
        return new Point( { coords: [...arguments[0].coords], dimensions: arguments[0].dimensions}  );
    }
 
    // property accessors

    set x(p) {
        this.coords[0] = p;
    }
    get x() {
        return this.coords[0];
    }

    set y(p) {
        this.coords[1] = p;
    }
    get y() {
        return this.coords[1];
    }

    set z(p) {
        this.coords[2] = p;
    }
    get z() {
        return this.coords[2] || 0;
    }

    set dimensions(n) {
        if (n > this.coords.length) {
            this.pad(n);
        }
        else if (n < this.coords.length) {
            this.trim(n);
        }
    }
    get dimensions() {
        return this.coords.length;
    }

    // instance methods

    pad(len) {
        for (var i = 0; i < len; ++i) {
            if (this.coords[i] === undefined) {
                this.coords[i] = 0;
            }
        }
    }

    trim(len) {
        var c = [];
        for (var i = 0; i < len; ++i) {
            c.push(this.coords[i]);
        }
        this.coords = c;
    }

    distanceTo(vec) {
        return Point.distance(this, vec);
    }

    toPolar(origin) {
        if (origin === undefined) {
            origin = new Point(0,0);
        }

        var radius = Point.distance(this, origin);
        var diff = Point.subtract(this, origin);
        var radians = Math.atan2(diff.y, diff.x); // atan2 takes y first
        var angle = radians * (180 / Math.PI);
        if (angle < 0) {
            angle += 360;
        }
        return new Polar(origin, radius, angle);
    }    

    // class methods

    static maxDimensionsArray(vecs) {
        return Math.max( ...(vecs.map(v=>v.dimensions)) );
    }

    static maxDimensions() {
        if (Array.isArray(arguments[0])) {
            return Point.maxDimensionsArray(arguments[0]);
        }
        return Point.maxDimensionsArray([...arguments]);
    }

    static centroidArray(vecs) {
        var coords = [];
        var maxDimensions = Point.maxDimensions(vecs);

        var tmp = vecs.map(v => {
            var p = new Point(v);
            p.dimensions = maxDimensions;
            return p;
        });

        for (var i = 0; i < maxDimensions; ++i) {
            var t = tmp
                .map( p => p.coords[i] )
                .reduce( (a,p) => a + p );
            coords.push( t / tmp.length );
        }

        var ret = new Point(coords);

        return ret;
    }

    static centroid() {
        if (Array.isArray(arguments[0])) {
            return Point.centroidArray(arguments[0]);
        }
        return Point.centroidArray([...arguments]);
    }

    static distance(a, b) {
        var maxDimensions = Point.maxDimensions(a,b);

        var l = new Point(a);
        var r = new Point(b);
        l.dimensions = r.dimensions = maxDimensions;

        var ret = 0;
        for (var i = 0; i < maxDimensions; ++i) {
            ret += Math.pow(l.coords[i] - r.coords[i], 2);
        }
        return Math.sqrt(ret);
    }

    static subtract(a, b) {
        var maxDimensions = Point.maxDimensions(a,b);

        var l = new Point(a);
        var r = new Point(b);
        l.dimensions = r.dimensions = maxDimensions;

        var c = [];

        for (var i = 0; i < maxDimensions; ++i) {
            c.push( l.coords[i] - r.coords[i] );
        }
        return new Point(c);
    }
}

class Polar {
    constructor(origin, radius, angle) {
        this.origin = origin; // Point
        this.radius = radius; // scalar
        this.angle = angle; // rotation
    }

    toPoint() {
        var x = (this.radius * cos(this.angle)) + origin.x;
        var y = (this.radius * sin(this.angle)) + origin.y;

        return new Point(x,y);
    }
}