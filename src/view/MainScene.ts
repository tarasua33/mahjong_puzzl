// import { Graphics } from "pixi.js";
import { Renderer } from "pixi.js";
import {
	StandardContainer,
	StandardContainerConfig,
} from "../libs/gameObjects/StandardContainer";
// import { GAME_DIMENSIONS } from "../Game";

interface MainSceneConfig extends StandardContainerConfig {
	renderer: Renderer;
}

export class MainScene extends StandardContainer {
	public renderer!: Renderer;
	constructor(configs: MainSceneConfig) {
		super(configs);
		this.renderer = configs.renderer;
	}

	public build(): void {
		// // const graphic = new Graphics()
		// //   .rect(0, 0, GAME_DIMENSIONS.width, GAME_DIMENSIONS.height)
		// //   .fill({
		// //     color: 0x00ff00,
		// //     alpha: 0.5,
		// //   });
		// this.addChild(graphic);
	}
}
