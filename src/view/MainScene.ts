// import { Graphics } from "pixi.js";
import {
	StandardContainer,
	StandardContainerConfig,
} from "../libs/gameObjects/StandardContainer";
// import { GAME_DIMENSIONS } from "../Game";

export class MainScene extends StandardContainer {
	constructor(configs: StandardContainerConfig) {
		super(configs);
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
