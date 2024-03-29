let Vector = require('./Vector.js');

var a = new Vector([5,5,5,5]);
var b = new Vector(8,8,8,8,8);
var p = new Vector(123, 308);
var q = new Vector(-21.4, 77, 0);

test( () => a );
test( () => b );
test( () => p );
test( () => q );

test( () => Vector.distance(a, b));
test( () => Vector.subtract(a, b));
test( () => Vector.centroid(a, b));
test( () => Vector.distance(p, q));
test( () => Vector.subtract(p, q));
test( () => Vector.centroid(p, q));
test( () => Vector.centroid(p, q, new Vector([0,0,0,0,0,0,1])));

test( () => p);

test( () => Vector.distance(p, new Vector(0,0)));
test( () => p.distanceTo(new Vector(0,0)));

test( () => p.toPolar( new Vector(0,0) ) );
test( () => p.toPolar(q) );
test( () => p.toPolar() );
test( () => a.toPolar(b));

function test(code) {
    console.log("\n" + code.toString().replace('() =>', '//'));
    console.log( code() );
}

