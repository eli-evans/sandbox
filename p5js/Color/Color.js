class Color {
    static randomColor(spec) {
        colorMode(HSB, 255);
        spec = spec || {h:'any', s:'any', b:'any'};
        var h, s, b, a;

        var c = color(
            Color.randomHue(spec.h),
            Color.randomSaturation(spec.s),
            Color.randomBrightness(spec.b),
            255
        );
        return c;
    }

    static randomHue(p) {
        var r;
        if (Array.isArray(p)) {
            r = random(p[0], p[1]);
        }
        else if (!isNaN(p)) {
            r = p;
        }
        else {
            switch (p) {
                case 'warm':
                    r = random(1) < .5 ? random(0,40) : random(232,255);
                break;

                case 'cool':
                    r = random(110,190);
                break;

                default:
                    r = random(0,255);
                break;
            }
        }
        return r;
    }

    static randomSaturation(p) {
        var r;
        if (Array.isArray(p)) {
            r = random(p[0], p[1]);
        }
        else if (!isNaN(p)) {
            r = p;
        }
        else {
            switch (p) {
                case 'saturated':
                    r = random(200,255);
                break;

                case 'grey':
                case 'gray':
                    r = random(0,32);
                break;

                case 'dull':
                    r = random(51,85)
                break;

                case 'colorful':
                    r = random(86,170)
                break;

                case 'technicolor':
                    r = random(171,255);
                break;

                default:
                    r = random(0,255);
                break;
            }
        }
        return r;
    }

    static randomBrightness(p) {
        var r;
        if (Array.isArray(p)) {
            r = random(p[0], p[1]);
        }
        else if (!isNaN(p)) {
            r = p;
        }
        else {
            switch (p) {
                case 'dark':
                    r = random(0,85);
                break;

                case 'midtone':
                case 'mid':
                    r = random(85,170);
                break;

                case 'light':
                case 'bright':
                    r = random(171,255);
                break;

                default:
                    r = random(0,255);
                break;
            }
        }
        return r;
    }

    static setHue(c, h) {
        return color(h, saturation(c), brightness(c));
    }
}