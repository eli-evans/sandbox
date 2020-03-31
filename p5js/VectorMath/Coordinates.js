

class Vec {
    constructor(coords, n) {
        this.coords = coords.map( x => x ? x : 0 ); // ensure zero values
        if (n !== undefined) {
            this.pad(n);
        }
        this.n = coords.length;
    }
 
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
        return this.coords[2];
    }

    pad(len) {
        for (var i = 0; i < len; ++i) {
            if (this.coords[i] === undefined) {
                this.coords[i] = 0;
            }
        }
    }

    distanceTo(vec) {
        return Vec.distance(this, vec);
    }

    static maxN(vecs) {
        return Math.max( ...(vecs.map(v=>v.n)) );
    }

    static centroid(vecs) {
        var coords = [];
        var maxN = Vec.maxN(vecs);

        var tmp = [];
        vecs.forEach( v => {
            tmp.push( new Vec(v.coords, maxN));
        });

        for (var i = 0; i < maxN; ++i) {
            var t = vecs
                .map( v => v.coords[i] )
                .reduce( (a, v) => a + v );
            coords.push( t / vecs.length );
        }

        var ret = new Vec(coords);

        return new Vec(coords);
    }

    static distance(a, b) {
        var maxN = Vec.maxN([a,b]);

        var l = new Vec(a.coords, maxN);
        var r = new Vec(b.coords, maxN);

        var ret = 0;
        for (var i = 0; i < maxN; ++i) {
            ret += Math.pow(l.coords[i] - r.coords[i], 2);
        }
        return Math.sqrt(ret);
    }

    static subtract(a, b) {
        var maxN = Vec.maxN([a,b]);

        var l = new Vec(a.coords, maxN);
        var r = new Vec(b.coords, maxN);

        var c = [];

        for (var i = 0; i < maxN; ++i) {
            c.push( a.coords[i] - b.coords[i] );
        }
        return new Vec(c);
    }
}

class Point extends Vec {
    constructor(x, y, z) {
        super([x,y, z]);
    }

    toPolar(origin) {
        if (origin === undefined) {
            origin = new Point(0,0);
        }
        var distance = Vec.distance(this, origin);
        var diff = Vec.subtract(this, origin);
        var radians = Math.atan2(diff.y, diff.x); // atan2 takes y first
        var degrees = radians * (180 / Math.PI);
        if (degrees < 0) {
            degrees += 360;
        }
        return new Polar(origin, distance, degrees);
    }
}

class Polar {
    constructor(origin, distance, degrees) {
        this.origin = origin; // Point
        this.distance = distance; // scalar
        this.degrees = degrees; // rotation
    }

    toPoint() {

    }
}