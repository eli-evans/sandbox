class Color {
    static randomColor(spec) {
        colorMode(HSB, 255);
        spec = spec || {h:'any', s:'any', b:'any'};
        var h, s, b, a;

        var c = color(
            Color.randomRange(spec.h),
            Color.randomRange(spec.s),
            Color.randomRange(spec.b),
            255
        );
        return c;
    }

    static randomRange(p) {
        var r;
        if (Array.isArray(p)) {
            r = random(p[0], p[1]);
        }
        else if (!isNaN(p)) {
            r = p;
        }
        else {
            switch (p) {
                case "red":
                    r = random(1) < .5 ? random(0,16) : random(240,255);
                break;
                case "orange":
                    r = random(16,32);
                break;
                case "range1":
                case "gray":
                case "grey":
                    r = random(0,32);
                break;
                case "range2":
                case "yellow":
                    r = random(32,48);
                break;
                case "range3":
                case "lime":
                    r = random(48,64);
                break;
                case "green":
                    r = random(64,112);
                break;
                case "range4":
                    r = random(64,80);
                break;
                case "range5":
                    r = random(80,96);
                break;
                case "range6":
                    r = random(96,112);
                break;
                case "range7":
                case "teal":
                case "aqua":
                case "cyan":
                    r = random(112,128);
                break;
                case "range8":
                case "skyblue":
                case "cerulean":
                    r = random(128,144);
                break;
                case "range9":
                case "blue":
                    r = random(144,160);
                break;
                case "range10":
                case "indigo":
                    r = random(160,176);
                break;
                case "range11":
                case "violet":
                    r = random(176,192);
                break;
                case "range12":
                case "purple":
                    r = random(192,208);
                break;
                case "range13":
                case "magenta":
                    r = random(208,224);
                break;
                case "range14":
                case "red-violet":
                    r = random(224,240);
                break;
                case "range15":
                case "scarlet":
                case "vermillion":
                    r = random(240,255);
                break;
                case "warm":
                    r = random(1) > .5 ? random(0,48) : random(224,255);
                break;
                case "cool":
                    r = random(160,204);
                break;
                case "any":
                    r = random(0, 255);
                break;

                case "dark":
                case "dim":
                case "dim":
                    r = random(1,112); 
                break;
                case "mid":
                case "medium":
                case "midtone":
                    r = random(112,176)
                break;
                case "light":
                case "bright":
                    r = random(176,255);
                break;

                default:
                    r = random(0, 255);
                break;
            }
        }
        return r;
    }

    static setHue(c, h) {
        return color(h, saturation(c), brightness(c));
    }
}