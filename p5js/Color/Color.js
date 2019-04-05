class Color {
    static randomColor() {
        var r = Color.randomColorComponent();
        var g = Color.randomColorComponent();
        var b = Color.randomColorComponent();
        
        return [r, g, b];
    }
      
    static randomColorComponent() {
        return Math.floor(random(225) + 20);
        
    }

    static randomFilteredColor(f) {
        f = f || function(c) { return true; };

        var attempt = 0;
        var c = Color.randomColor();

        while (!f(c)) {
            c = Color.randomColor();
            if (++attempt >= 1000) break;
        }
        return c;
    }


    static randomNiceColor() {
        return Color.randomFilteredColor(
            (c) => !(Color.isDark(c) || Color.isMuddy(c) || Color.isLight(c))
        );
    }

    static randomMidtoneColor() {
        return Color.randomFilteredColor(
            (c) => !Color.isDark(c) && !Color.isLight(c)
        );
    }  

    static randomDarkColor() {
        return Color.randomFilteredColor(
            (c) => Color.isDark(c) && !Color.isMuddy(c)
        );
    }

    static randomLightColor() {
        return Color.randomFilteredColor(
            (c) => Color.isLight(c) && !Color.isMuddy(c)
        );
    }

    static randomBrightColor() {
        return Color.randomFilteredColor(
            (c) => Color.isBright(c)
        );
    }   

    static randomMuddyColor() {
        return Color.randomFilteredColor(
            (c) => Color.isMuddy(c)
        )
    }

    static RGB2HSL(c) {
        var r = c[0];
        var g = c[1];
        var b = c[2];

        r /= 255, g /= 255, b /= 255;
        
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
            switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            }
        
            h /= 6;
        }
        
        return [ Math.floor(h*= 255), Math.floor(s*= 255), Math.floor(l*=255) ];
    }

    static isMuddy(c) {
        var d = 32;
        var r = c[0];
        var g = c[1];
        var b = c[2];

        var dRG = Math.abs(r-g);
        var dRB = Math.abs(r-b);
        var dGB = Math.abs(g-b);

        var hsl = Color.RGB2HSL(c)

        return (
            // any two components are < d apart
            (dRG < d && dRB < d) || (dRB < d && dGB < d) || (dRG < d && dGB < d)
            ||
            (hsl[1] < d*2)
        ) ;
    }

    static isDark(c) {
        var hsl = Color.RGB2HSL(c);
        return (hsl[2] < 120);
    }

    static isLight(c) {
        var hsl = Color.RGB2HSL(c);
        return (hsl[2] > 200);
    }

    static isMidtone(c) {
        var hsl = Color.RGB2HSL(c);
        return (hsl[2] > 120 && hsl[2] < 200);
    }  

    static isNice(c) {
        return !(Color.isDark(c) || Color.isLight(c) || Color.isMuddy(c));
    }

    static isBright(c) {
        var hsl = Color.RGB2HSL(c);
        var h = hsl[0];
        var s = hsl[1];
        var l = hsl[2];
        return (s > 200 && l > 120 && l < 220);
    }

    static isCool(c) {
        var hsl = Color.RGB2HSL(c);
        var h = hsl[0];
        var s = hsl[1];
        var l = hsl[2];
        return (h > 110 && h < 160); 
    }

    static isWarm(c) {
        var hsl = Color.RGB2HSL(c);
        var h = hsl[0];
        var s = hsl[1];
        var l = hsl[2];
        return (h < 36 || h > 245); 
    }

    static average(a,b) {
        return [ Math.floor((a[0]+b[0])/2), Math.floor((a[1]+b[1])/2), Math.floor((a[2]+b[2])/2) ];
    }
}