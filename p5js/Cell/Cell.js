class Cells {
    constructor() {
        this.cells = [];
    }

    spawn(n) {
        for (var i = 0; i < n; ++i) {
            this.cells.push( new Cell() );
        } 
    }

    reap() {
        this.forCells( (c, i) => {
            if (c.dead && c.dx < 2) {
                this.cells.splice(i, 1);
            }
        });
    }

    filterCells(f) {
        var ret = [];
        this.forCells( (c,i) => { if (f(c)) { ret.push(c); } });
        return ret;
    }

    forCells(f) {
        for (var i = 0; i < this.cells.length; ++i) {
            f(this.cells[i], i);
        }
    }

    forPairs(f) {
        for (var i = 0; i < this.cells.length; ++i) {
            for (var j = 0; j < this.cells.length; ++j) {
                if (i  == j) continue; // skip yourself
                f(this.cells[i], this.cells[j], i);
            }
        }
    }

    getClosestCell(a, f) {
        var ret = null;

        // var d = 1000000000;
        for (var i = 0; i < this.cells.length; ++i) {
            var test = this.cells[i];
            if (test === a) continue;
            if (f && !f(test)) continue;

            if (ret === null) ret = test;
            else if ( dist(test.x, test.y, a.x, a.y) < dist(ret.x, ret.y, a.x, a.y) ) {
                ret = test;
            }
        }

        return ret;
    }

    overlap(a,b) {
        return ( dist(a.x, a.y, b.x, b.y) < a.j*3);
    } 

    update() {
        var i, j;
        this.reap();

        var predators = this.filterCells( (c) => (c.predator) );
        for (i in predators) {
            var pred = predators[i];
            var closest = this.getClosestCell(pred, (c) => (!c.predator && c.mind < pred.mind));

            if (closest) {

                var vx = closest.x - pred.x;
                var vy = closest.y - pred.y;
                var v = createVector(vx, vy);

                v.normalize();

                pred.vx = v.x * 1.5;
                pred.vy = v.y * 1.5;

                if(dist(closest.x, closest.y, pred.x, pred.y) < pred.dx*1) {
                    closest.vx = v.x * (random(-1,1)+1);
                    closest.vy = v.y * (random(-1,1)+1);
                }
            }
            else {
                pred.vx = 0;
                pred.vy = 0;
            }
        }

        // eat!
        this.forPairs( (a,b,i) => {
            if (b.dead) return;
            if (this.overlap(a,b)) {
                if (a.predator && (a.dx + a.dy)/2 > (b.dx + b.dy)/2) {
                    if (b.predator) {
                        b.die();
                    }
                    else {
                        a.consume(b);
                    }
                }
                if (!a.predator && (a.dx + a.dy)/2 > (b.dx + b.dy)/2) {
                    b.die();
                    // this.split(a);
                }
            }
        });

        // this.reap();
    }

    split(c) {
        var n = new Cell(c);
        // console.log(n.x, c.x);

        n.x -= n.dx/2;
        n.y += n.dy/2;
        if (random(1) < .5) {
            n.x = -n.x;
            n.y = -n.y;
        }

        c.x += c.dx/2;
        c.y -= c.dy/2;
        if (random(1) < .5) {
            c.x = -c.x;
            c.y = -c.y;
        }
        
        c.dx /= 2;
        c.dy /= 2;
        n.dx /= 2;
        n.dy /= 2;
        c.mind /= 2;
        c.maxd /= 2;
        n.mind /= 2;
        n.maxd /= 2;

        c.j * 2;
        n.j * 2;

        this.cells.push(n);
    }

    draw() {
        this.update();
        this.forCells( (c,i) => {c.draw()});
    }
}



class Cell {

    constructor(options) {
        if (options === undefined) {
            options = {
                x:random(-windowWidth/2,windowWidth/2),
                y:random(-windowHeight/2,windowHeight/2),

                dx:random(10,30),
                dy:random(10,30),

                j:random(2),

                vx:0,
                vy:0
            };
        }
        
        this.x = options.x;
        this.y = options.y;
        this.dx = options.dx;
        this.dy = options.dy;
        this.j = options.j;
        this.vx = options.vx;
        this.vy = options.vy;
 
        this.mind = Math.max(this.dx, this.dy) * 0.75;
        this.maxd = Math.min(this.dx, this.dy) * 1.25;
 
        this.dead = false;

        this.predator = random(1) < .20 ? true : false;

        this.color = Color.randomFilteredColor( (c) => Color.isCool(c) && Color.isBright(c));
        if (this.predator) {
            this.color = Color.randomFilteredColor( (c) => Color.isWarm(c) && Color.isBright(c));
        }
    }

    jitterValue(val) {
        return val + this.jitterAmount();
    }

    jitterAmount() {
        return random(-this.j, this.j)
    }

    jitterNucleus() {
        var jx = this.jitterAmount();
        var jy = this.jitterAmount();

        this.x += jx;
        this.y += jy;
        this.dx -= jx;
        this.dy -= jy;

        if (this.dx < this.mind) this.dx = this.mind;
        if (this.dy < this.mind) this.dy = this.mind;
        if (this.dx > this.maxd) this.dx = this.maxd;
        if (this.dy > this.maxd) this.dy = this.maxd;

        if (this.dead) {
            this.maxd /= 1.5;
            this.mind /= 1.5;
        }
    }

    consume(food) {
        this.dx += food.dx/10;
        this.dy += food.dy/10;
        this.j += food.j/10;
        this.mind += food.mind/5;
        this.maxd += food.maxd/5;
        // this.color = Color.average(this.color, food.color);
        food.die();
    }

    die() {
        this.dead = true;
    }

    draw() {
        this.jitterNucleus();
        this.x += this.vx;
        this.y += this.vy;

        push();
        if (this.predator) {
            noFill();
            strokeWeight(this.jitterValue(this.j) * 2);
            stroke(this.color);
        }
        else {
            noStroke();
            fill( this.color );
        }
        translate(windowWidth/2, windowHeight/2);
        ellipse(this.x, this.y, this.dx, this.dy);
        pop();
    }
}