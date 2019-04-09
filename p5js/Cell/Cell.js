class Cells {
    constructor() {
        this.cells = [];
    }

    spawn(n, opts) {
        for (var i = 0; i < n; ++i) {
            var cell = new Cell();
            if (opts != null) {
                cell.x = opts.x ? opts.x : cell.x;
                cell.y = opts.y ? opts.y : cell.y;
                cell.predator = opts.predator ? opts.predator : cell.predator;
                cell.species = opts.species ? opts.species : cell.species;
                cell.size = opts.size ? opts.size : cell.size;
                cell.speed = opts.speed ? opts.speed : cell.speed;
            }    
            this.cells.push( cell );
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

            if (pred.energy < 100) {
                famine = true;
            }

            var closest; 
            var closest = this.getClosestCell(pred, (c) => ((!c.predator || famine) && (c.size < pred.size)));

            if (closest) {
                var vx = closest.x - pred.x;
                var vy = closest.y - pred.y;
                var v = createVector(vx, vy);

                v.normalize();

                pred.vx = v.x * pred.speed;
                pred.vy = v.y * pred.speed;

                
                if(dist(closest.x, closest.y, pred.x, pred.y) < pred.dx*1) {
                    closest.vx = v.x * closest.speed;
                    closest.vy = v.y * closest.speed;
                }
              
            }
            else {
                pred.vx = pred.vx * .25;
                pred.vy = pred.vy * .25;
            }
        }
    }

    fight(a, b) {
        var aRoll = (a.size - a.speed) * random(20);
        var bRoll = (b.size - b.speed) * random(20);

        return (aRoll > bRoll) ? {winner:a, loser:b} : {winner:b, loser:a};
    }

    eat() {
        var i,j,f;
        this.forPairs( (a,b,i) => {
            if (b.dead) return;
            if (this.overlap(a,b)) {
                if (a.predator && a.size > b.size) {
                    if (b.predator) {
                        f = this.fight(a, b);
                        f.winner.consume(f.loser);
                    }
                    else {
                        a.consume(b);
                    }
                }
                if (!a.predator && (a.dx + a.dy)/2 > (b.dx + b.dy)/2) {
                    if (this.cells.length < 75) {
                        var opts = {
                            x : (a.x + b.x) / 2,
                            y : (a.y + b.y) / 2,
                            size : (a.size + b.size) / 2,
                            speed : (a.speed + b.speed) / 2,
                            predator : false,
                        }
                        this.spawn(1);
                    }
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
        this.size = random(10,30);
        this.dx = this.size;
        this.dy = this.size;
        this.speed = random(3);
        this.vx = random(-1,1) * this.speed;
        this.vy = random(-1,1) * this.speed;

        this.energy = 255;
 
        this.dead = false;

        this.predator = random(1) < .15 ? true : false;

        this.color = Color.randomColor( {h:'cool', s:'medium', b:'light'});
        if (this.predator) {
            this.color = Color.randomColor( {h:'red', s:'bright', b:'range15'});
        }
    }

    jitter() {
        return random(-this.j, this.j)
    }

    consume(food) {
        // you convert 1/10 of food into size
        this.dx += food.dx/10;
        this.dy += food.dy/10;
        this.size += food.size/10;
        this.size += food.size/10;

        // you are what you eat
        this.speed += (food.speed * .05);
        this.energy += food.energy * .8;
        food.die();
    }

    die() {
        this.dead = true;
    }

    updateCell() {
        // fade a little
        this.energy -= Math.abs(this.speed * .2);
        if (this.energy <= 127 || this.size > 100) {
            this.die();
        }

        if (this.energy > 255) {
            this.energy = 255;
        }

        if (this.dead) {
            this.size -= 2;
            this.dx = this.dy = this.size;
        }
        else {
            if (!this.predator) {
                this.x += this.vx + this.jitter();
                this.y += this.vy + this.jitter();
            }
            else {
                this.x += this.vx + this.jitter() * .1;
                this.y += this.vy + this.jitter() * .1;
            }

            this.dx -= this.jitter() * 3;
            this.dy -= this.jitter() * 3;

            if (this.dx < this.size * .8 || this.dx > this.size * 1.2) this.dx = this.size;
            if (this.dy < this.size * 1.2 || this.dy > this.size * 1.2) this.dy = this.size;
        }

        // this.color.setAlpha(this.energy);
    }    

    draw() {
        var c = this.color;

        this.updateCell();

        if (this.predator) {
            this.drawPredator();
        }
        else {
            this.drawPrey();
        }
    }

    drawPrey() {
        var c = this.color;
        push();
        noStroke();
        c.setAlpha(this.energy);
        fill(c);
        // ellipse(this.x, this.y, this.dx, this.dy);
        this.drawBlob();
        pop();
    }

    drawPredator() {
        // Mouth/Nucleus
        push();
        noStroke();
        var nc = color(this.energy, saturation(this.color), brightness(this.color));
        fill(nc);
        ellipse(this.x + this.vx*3, this.y + this.vy*3, this.dx / 5, this.dy / 5);
        pop();

        push();
            noFill();
            var wc = color(this.energy, saturation(this.color), brightness(this.color));
            fill(200,200,200,60);
            stroke(wc);
            strokeWeight(1);
            this.drawBlob();
        pop();
    }

    drawBlob() {
        push();
        var r = this.size / 5;

        var x_off = 1000,y_off = 1000,z_off = 1000;
        var vertices_amount = 30;

        var px_offset = 20;    // amplitude
        var NOISE_SCALE = 20;  // the higher the softer

        var Z_SPEED = .1; // noise change per frame

        var X_SPEED = .1;
        var Y_SPEED = .1;

        beginShape();
        // translate(this.x, this.y);
        for (var a=0; a<=TWO_PI+1;a+=TWO_PI/vertices_amount) {
            var x = this.x + r*sin(a);
            var y = this.y + r*cos(a);
            
            var new_x = x + (
                        noise(
                ((x_off+x)/NOISE_SCALE),
                ((y_off+y)/NOISE_SCALE),
                        z_off) * px_offset * sin(a));
            
            var new_y = y + (
                        noise(
                ((x_off+x)/NOISE_SCALE),
                ((y_off+y)/NOISE_SCALE),
                        z_off) * px_offset * cos(a))
            vertex(new_x,new_y);
        }
        endShape();
        pop();
    }
 }