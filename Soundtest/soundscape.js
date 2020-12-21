class Soundscape {
	constructor(context, bg) {
		this.context = context;

		this.started = false;
		this.playing = false;

		this.background = bg;
		let audio = new Audio(bg);
		audio.volume = 1.0;
		audio.loop = true;
		audio.autoLoad = true;

		document.body.appendChild(audio);
		this.background = audio;

		this.emitters = [];
	}

	addEmitter(x, y, size, domain, clip) {
		let emitter = new Emitter(x, y, size, domain, clip);
		this.emitters.push(emitter);

		return emitter;
	}

	draw() {
		let ctx = this.context;

		this.emitters.forEach(emitter => {
			ctx.beginPath();
			ctx.arc(emitter.x, emitter.y, emitter.size, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(emitter.x, emitter.y, emitter.domain, 0, 2 * Math.PI);
			ctx.stroke();
		});
	}

	start() {
		this.started = true;
	}

	play() {
		if (!this.started) return;

		this.playing = true;
		this.background.play();
		this.emitters.forEach(x => {
			x.play();
		});
	}

	pause() {
		if (!this.started) return;

		this.playing = false;
		this.background.pause();
		this.emitters.forEach(x => {
			x.pause();
		});
	}

	stop() {
		if (!this.started) return;

		this.playing = false;
		this.background.stop();
		this.emitters.forEach(x => {
			x.stop();
		});
	}

	randomLocation() {
		return [
			Math.floor( Math.random() * this.context.canvas.width - 100 ) + 50,
			Math.floor( Math.random() * this.context.canvas.height - 100 ) + 50
		];
	}
}

class Emitter {
	constructor(x, y, size, domain, clip) {
		this.x = x; 
		this.y = y;
		this.size = size;
		this.domain = domain;
		this.clip = clip;

		let audio = new Audio(clip);
		audio.volume = 0.5;
		audio.loop = true;
		audio.autoLoad = true;

		document.body.appendChild(audio);
		this.audio = audio;
	}

	distanceTo(x, y) {
		return Math.sqrt(Math.pow(Math.abs(x - this.x), 2)
			+ Math.pow(Math.abs(y - this.y), 2));
	}

	play() {
		this.audio.play();
	}

	pause() {
		this.audio.pause();
	}

	stop() {
		this.audio.pause();
		this.currentTime = 0;
	}
}