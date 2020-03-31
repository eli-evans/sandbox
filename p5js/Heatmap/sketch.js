var bible, ring, hits;

var H, W, P;

function setup() {
    bible = new Bible();
    W = 1;
    P = 20;
    noStroke();
    windowResized();

    noLoop();
    redraw();
}

function draw() {

    var xoff = P;
    var yoff = P;

    // pass one for measurement
    var nRows = 0;
    bible.books.forEach( b => {
        b.chapters.forEach( (vv, i) => {
            for (var v = 1; v <= vv; ++v) {
                if (xoff > windowWidth - P) {
                    xoff = P;
                    nRows++;
                }
                xoff += W;
            }
        });
    });

    H = (windowHeight - (P*4)) / nRows;
    
    // pass two, draw
    background(255);

    xoff = yoff = P;

    bible.groups.forEach( group => {
        
        group.books.forEach( bk => {
            var book = bible.getBook(bk);

            push();
            fill("#000");
            text(book.abbr, xoff + 2, yoff + 5);
            pop();

            book.chapters.forEach( (vv, i) => {
                for (var v = 1; v <= vv; ++v) {

                    if (xoff >= windowWidth - P) {
                        xoff = P;
                        yoff += H;
                    }

                    // fill(Color.logosColor( group.color, 'extra-light', 128 ));
                    fill(Color.logosColor('grey', '10'));

                    rect(xoff, yoff, W, H-2);


                    if (v === 1 && i === 0) {
                        push();
                        fill("#FFF");
                        rect(xoff, yoff, W, H-2);
                        pop();
                    }

                    if (random() >= .995) {
                        push();
                        fill(Color.logosColor(group.color, 'medium'));
                        rect(xoff, yoff, W, H-2);
                        pop();
                    }

                    xoff += W;
                }
            });
        });
    });

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}