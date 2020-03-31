

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
            this.coords = arguments[0].coords;
            this.n = arguments[0].n || this.coords.length;
            this.pad(this.n);
        }
    }

    static fromArray(coords) {
        return new Point(  {coords: coords, n: coords.length } );
    }

    static fromCoordinates() {
        return new Point( { coords: [...arguments], n: arguments.length } );
    }

    static fromPoint() {
        return new Point( { coords: [...arguments[0].coords], n: arguments[0].n}  );
    }
 
    // accessors

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

    // instance methods

    pad(len) {
        for (var i = 0; i < len; ++i) {
            if (this.coords[i] === undefined) {
                this.coords[i] = 0;
            }
        }
    }

    trim(len) {
        this.n = len;
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
        var distance = Point.distance(this, origin);
        var diff = Point.subtract(this, origin);
        var radians = Math.atan2(diff.y, diff.x); // atan2 takes y first
        var degrees = radians * (180 / Math.PI);
        if (degrees < 0) {
            degrees += 360;
        }
        return new Polar(origin, distance, degrees);
    }    

    // class methods

    static maxN(vecs) {
        return Math.max( ...(vecs.map(v=>v.n)) );
    }

    static centroidArray(vecs) {

        var coords = [];
        var maxN = Point.maxN(vecs);

        var tmp = [];
        vecs.forEach( v => {
            tmp.push( new Point({ coords: [...v.coords], n: maxN }));
        });

        for (var i = 0; i < maxN; ++i) {
            var t = tmp
                .map( v => v.coords[i] )
                .reduce( (a, v) => a + v );
            coords.push( t / vecs.length );
        }

        var ret = new Point({ coords: coords, n: maxN});

        return ret;
    }

    static centroid() {
        if (Array.isArray(arguments[0])) {
            return Point.centroidArray(arguments[0]);
        }
        return Point.centroidArray([...arguments]);
    }

    static distance(a, b) {
        var maxN = Point.maxN([a,b]);

        var l = new Point({ coords: [...a.coords], n: maxN });
        var r = new Point({ coords: [...b.coords], n: maxN });

        var ret = 0;
        for (var i = 0; i < maxN; ++i) {
            ret += Math.pow(l.coords[i] - r.coords[i], 2);
        }
        return Math.sqrt(ret);
    }

    static subtract(a, b) {
        var maxN = Point.maxN([a,b]);

        var l = new Point({ coords: [...a.coords], n: maxN });
        var r = new Point({ coords: [...b.coords], n: maxN });

        var c = [];

        for (var i = 0; i < maxN; ++i) {
            c.push( a.coords[i] - b.coords[i] );
        }
        return new Point(c);
    }
}

class Polar {
    constructor(origin, distance, degrees) {
        this.origin = origin; // Point
        this.distance = distance; // scalar
        this.degrees = degrees; // rotation
    }

    toPoint() {
        // TODO
    }
}