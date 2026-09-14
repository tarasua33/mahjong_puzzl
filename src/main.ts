import { Application } from "pixi.js";
import { Game } from "./Game";
import Stats from "stats.js";
import { GAME_DIMENSIONS, GAME_DIMENSIONS_PORTRAIT } from "./gameConfig";

(async () => {
	// Create a new application
	const app = new Application({
		width: GAME_DIMENSIONS.width,
		height: GAME_DIMENSIONS.width,
		resolution: Math.min(window.devicePixelRatio ?? 1, 2),
		autoDensity: true,
		antialias: false,
		powerPreference: "high-performance",
		backgroundAlpha: 1,
	});

	await app.init({ background: "#110D12" });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).__PIXI_APP__ = app;

	document.getElementById("pixi-container")!.appendChild(app.canvas);

	const game = new Game(app.stage);

	const resize = () => {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		app.renderer.resize(vw, vh);

		const isPortrait = vh > vw;
		const G_D = isPortrait ? GAME_DIMENSIONS_PORTRAIT : GAME_DIMENSIONS;

		const scale = Math.min(vw / G_D.width, vh / G_D.height);
		// console.log(scale);

		app.stage.scale.set(scale);
		app.stage.position.set(
			(vw - G_D.width * scale) / 2,
			(vh - G_D.height * scale) / 2,
		);

		game.resize({
			w: window.innerWidth / scale,
			h: window.innerHeight / scale,
			isPortrait,
		});
	};

	window.addEventListener("resize", resize);
	resize();

	const success = await game.init();
	// Listen for animate update

	const stats = new Stats();
	stats.showPanel(0);
	document.body.appendChild(stats.dom);

	app.view.style.touchAction = "none";

	resize();

	if (success) {
		app.ticker.add(() => {
			stats.begin();
			// game.update(app.ticker, time.deltaMS);
			game.update(app.ticker);
			stats.end();
		});
	}

	await game.play();
})();
