import { FillGradient } from "pixi.js";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { TransitionsScreen } from "../view/TransitionsScreen";
import { GAME_DIMENSIONS } from "../gameConfig";

interface IBuildConfig {
	parent: StandardContainer;
}

export class TransitionsScreenFactory extends AbstractStandardFactory<TransitionsScreen> {
	public buildUi({ parent }: IBuildConfig): TransitionsScreen {
		const characterContainer = new TransitionsScreen({
			visible: false,
			bgX: -GAME_DIMENSIONS.width / 4,
			bgY: -GAME_DIMENSIONS.halfWidth - GAME_DIMENSIONS.halfWidth / 2 + 50,
			bgW: GAME_DIMENSIONS.width + GAME_DIMENSIONS.halfWidth,
			bgH: GAME_DIMENSIONS.width + GAME_DIMENSIONS.width,
			textY: GAME_DIMENSIONS.height / 3,
			textX: GAME_DIMENSIONS.width / 2,
			textConfig: {
				text: "Try Again!",
				styleOptions: {
					fontFamily: "Verdana, sans-serif",
					fontSize: 80,
					align: "center",
					fontWeight: "bolder",
					fill: new FillGradient({
						type: "linear",
						start: { x: 0, y: 0 },
						end: { x: 0, y: 1 },
						colorStops: [
							{ offset: 0, color: "#f6f673ff" },
							{ offset: 0.5, color: "#ca8102ff" },
							{ offset: 1, color: "#f6f673ff" },
						],
						textureSpace: "local",
					}),
					dropShadow: {
						distance: 6,
						color: "#f6f673ff",
						blur: 1,
						alpha: 0.25,
						angle: Math.PI * 0.75,
					},
				},
			},
		});
		characterContainer.build();
		parent.addChild(characterContainer);

		return characterContainer;
	}
}
