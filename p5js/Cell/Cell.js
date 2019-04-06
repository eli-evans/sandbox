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
            if (c.dead && c.size < 2) {
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
        return ( dist(a.x, a.y, b.x, b.y) < a.size/20 + b.size/2);
    }

    wraparound() {
        this.forCells( (a,i) => {
        var r = a.size/2;
        if ((a.x - r) > windowWidth) a.x = 0 - r;
        if ((a.y - r) > windowHeight) a.y = 0 - r;
        if ((a.x + r) < 0) a.x = windowWidth + r;
        if ((a.y + r) < 0) a.y = windowHeight + r;
        });
    }

    hunt() {
        var i, j;
        var predators = this.filterCells( (c) => (c.predator) );

        var famine = false;
        if (predators.length > this.cells.length/2) {
            famine = true;
        }

        for (i in predators) {
            var pred = predators[i];

            var closest; 
            var closest = this.getClosestCell(pred, (c) => ((!c.predator || famine) && (c.size < pred.size)));

            if (closest) {
                var vx = closest.x - pred.x;
                var vy = closest.y - pred.y;
                var v = createVector(vx, vy);

                v.normalize();

                pred.vx = v.x * pred.speed;
                pred.vy = v.y * pred.speed;

                /*
                if(dist(closest.x, closest.y, pred.x, pred.y) < pred.dx*1) {
                    closest.vx = v.x * (random(-1,1)+1);
                    closest.vy = v.y * (random(-1,1)+1);
                }
                */
            }
            else {
                pred.vx = pred.jitter();
                pred.vy = pred.jitter();
            }
        }
    }

    fight(a, b) {
        var aRoll = (a.size - a.speed) * random(20);
        var bRoll = (b.size - b.speed) * random(20);

        return (aRoll > bRoll) ? b : a;
    }

    eat() {
        var i,j;
        this.forPairs( (a,b,i) => {
            if (b.dead) return;
            if (this.overlap(a,b)) {
                if (a.predator && a.size > b.size) {
                    if (b.predator) {
                        var loser = this.fight(a, b);
                        loser.die();
                    }
                    else {
                        a.consume(b);
                    }
                }
                if (!a.predator && (a.dx + a.dy)/2 > (b.dx + b.dy)/2) {
                    var loser = this.fight(a, b);
                    loser.die();
                }
            }
        });    
    }

    update() {
        var i, j;
        this.reap();
        this.wraparound();
        this.hunt();
        this.eat();
    }

    draw() {
        this.update();
        this.forCells( (c,i) => {c.draw()});
    }
}



class Cell {
    constructor() {
        this.x = random(windowWidth);
        this.y = random(windowHeight);
        this.j = random(3);
        this.size = random(20,40);
        this.dx = this.size;
        this.dy = this.size;
        this.speed = random(3);
        this.vx = random(-1,1) * this.speed;
        this.vy = random(-1,1) * this.speed;
 
        this.dead = false;

        this.predator = random(1) < .1 ? true : false;

        this.color = Color.randomFilteredColor( (c) => Color.isCool(c) && Color.isNice(c) && !Color.isDark(c));
        if (this.predator) {
            this.color = Color.randomFilteredColor( (c) => Color.isWarm(c) && Color.isNice(c));
        }
    }

    jitter() {
        return random(-this.j, this.j)
    }

    jitterArray(arr) {
        return arr.map( (e) => e + random(-2,2));
    }

    consume(food) {
        // you convert 1/10 of food into size
        this.dx += food.dx/10;
        this.dy += food.dy/10;
        this.size += food.size/10;
        this.size += food.size/10;

        // you are what you eat
        this.speed *= .99;

        this.color = Color.mix( [this.color, food.color], [.90, .10]);
        food.die();
    }

    die() {
        this.dead = true;
    }

    updateCell() {
        if (this.dead) {
            this.size /= 1.5;
            this.dx = this.dy = this.size;
        }
        else {
            this.x += this.vx + this.jitter();
            this.y += this.vy + this.jitter();

            this.dx -= this.jitter();
            this.dy -= this.jitter();

            if (this.dx < this.size * .8 || this.dx > this.size * 1.2) this.dx = this.size;
            if (this.dy < this.size * 1.2 || this.dy > this.size * 1.2) this.dy = this.size;

            this.color = this.jitterArray(this.color);
            this.color = this.color.map( (e) => e <= 0 ? 20 : e);
            this.color = this.color.map( (e) => e >= 255 ? 240 : e);
        }
    }    

    draw() {
        this.updateCell();

        if (this.predator) {
            push();
            // translate(windowWidth/2, windowHeight/2);
            noStroke();
            fill( this.color );
            ellipse(this.x + this.jitter()/2, this.y + this.jitter()/2, this.dx/10, this.dy/10);
            fill( this.color.concat(90) );
            noFill();
            strokeWeight(this.jitter() + 2);
            stroke(this.color);
            ellipse(this.x, this.y, this.dx, this.dy);
            pop();
        }
        else {
            push();
            // translate(windowWidth/2, windowHeight/2);
            noStroke();
            fill( this.color.concat(200) );
            ellipse(this.x, this.y, this.dx, this.dy);
            pop();
        }

      
    }
}