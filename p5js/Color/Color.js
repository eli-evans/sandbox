class Color {
	static randomColor(spec) {
		colorMode(HSB, 255);
		spec = spec || { h: 'any', s: 'any', b: 'any' };
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
		} else if (!isNaN(p)) {
			r = p;
		} else {
			switch (p) {
				case "red":
					r = random(1) < .5 ? random(0, 16) : random(240, 255);
					break;
				case "orange":
					r = random(16, 32);
					break;
				case "range1":
				case "gray":
				case "grey":
					r = random(0, 32);
					break;
				case "range2":
				case "yellow":
					r = random(32, 48);
					break;
				case "range3":
				case "lime":
					r = random(48, 64);
					break;
				case "green":
					r = random(64, 112);
					break;
				case "range4":
					r = random(64, 80);
					break;
				case "range5":
					r = random(80, 96);
					break;
				case "range6":
					r = random(96, 112);
					break;
				case "range7":
				case "teal":
				case "aqua":
				case "cyan":
					r = random(112, 128);
					break;
				case "range8":
				case "skyblue":
				case "cerulean":
					r = random(128, 144);
					break;
				case "range9":
				case "blue":
					r = random(144, 160);
					break;
				case "range10":
				case "indigo":
					r = random(160, 176);
					break;
				case "range11":
				case "violet":
					r = random(176, 192);
					break;
				case "range12":
				case "purple":
					r = random(192, 208);
					break;
				case "range13":
				case "magenta":
					r = random(208, 224);
					break;
				case "range14":
				case "red-violet":
					r = random(224, 240);
					break;
				case "range15":
				case "scarlet":
				case "vermillion":
					r = random(240, 255);
					break;
				case "warm":
					r = random(1) > .5 ? random(0, 48) : random(224, 255);
					break;
				case "cool":
					r = random(160, 204);
					break;
				case "any":
					r = random(0, 255);
					break;

				case "dark":
				case "dim":
				case "dim":
					r = random(1, 112);
					break;
				case "mid":
				case "medium":
				case "midtone":
					r = random(112, 176)
					break;
				case "light":
				case "bright":
					r = random(176, 255);
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

	static Logos = {
		'red': {
			'dark': "#942220",
			'medium': "#CC3333",
			'light': "#FF6F6F",
			'extra-light': "#FF9F9F",
			'extra-extra-light': "#FFE9E9"
		},
		'orange': {
			'dark': "#BD4B00",
			'medium': "#FF6600",
			'light': "#FF8433",
			'extra-light': "#FFB27F",
		},
		'peach': {
			'dark': "#BF7326",
			'medium': "#FF9933",
			'light': "#FFAD5B",
			'extra-light': "#FFD6AD",
		},
		'yellow': {
			'dark': "#DBA910",
			'medium': "#FFD86A",
			'light': "#FFE28F",
			'extra-light': "#FFEBB4",
			'extra-extra-light': "#FFF4D5"
		},
		'green': {
			'dark': "#5BA224",
			'medium': "#99CC33",
			'light': "#C3E179",
			'extra-light': "#D6EAAD",
		},
		'teal': {
			'dark': "#59B2B2",
			'medium': "#66CCCC",
			'light': "#A3E0E0",
			'extra-light': "#CBF3F8",
		},
		'sky-blue': {
			'dark': "#507FC0",
			'medium': "#6EA5E1",
			'light': "#82BCF1",
			'extra-light': "#C5DBF3",
			'extra-extra-light': "#EEF5FC"
		},
		'blue': {
			'dark': "#004692",
			'medium': "#005EC3",
			'light': "#1977DE",
			'extra-light': "#A5D0FF",
		},
		'lavender': {
			'dark': "#474C72",
			'medium': "#6E76B1",
			'light': "#9298C5",
			'extra-light': "#C2CEFA",
		},
		'purple': {
			'dark': "#734E8B",
			'medium': "#986DAE",
			'light': "#BE9BD7",
			'extra-light': "#E2D2ED",
		},
		'magenta': {
			'dark': "#911A45",
			'medium': "#D12663",
			'light': "#E37CA1",
			'extra-light': "#ECA8C0",
		},

		'slate': {
			'dark': "#515D72",
			'medium': "#63728C",
			'light': "#919CAE",
			'extra-light': "#C7CFDC",
		},

		'grey': {
			'dark': '#444444',
			'medium': '#BBBBBB',
			'light': '#E7E7E7',
			'extra-light': '#F4F4F4',

			'01': '#F8F8F8',
			'05': '#F4F4F4',
			'10': '#EEEEEE',
			'15': '#E7E7E7',
			'20': '#DDDDDD',
			'30': '#CCCCCC',
			'40': '#BBBBBB',
			'50': '#AAAAAA',
			'60': '#888888',
			'70': '#666666',
			'80': '#444444',
			'90': '#333333',
		}
	};

	static logosColor(name, intensity, alpha) {
		var ret = color(0, 0, 0);
		var name = name.toLowerCase();
		var intensity = intensity.toLowerCase();

		var c = color(Color.Logos[name][intensity]);
		if (alpha) {
			c.setAlpha(alpha);
		}

		return c;
	}

	static randomLogosColor(spec) {
		var c = spec.c || Color.randomElement(Object.keys(Color.Logos));
		var i = spec.i || Color.randomElement(Object.keys(Color.Logos[c]));

		return Color.logosColor(c, i);
	}

	static randomElement(array) {
		var r = Math.floor(random(0, array.length));
		return array[r];
	}

}
