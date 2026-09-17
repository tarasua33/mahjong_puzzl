import { FillGradient } from "pixi.js";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { TransitionsScreen } from "../view/TransitionsScreen";
import { GAME_DIMENSIONS, GAME_DIMENSIONS_PORTRAIT } from "../gameConfig";

interface IBuildConfig {
	parent: StandardContainer;
}

const SIZE = 2224;

export class TransitionsScreenFactory extends AbstractStandardFactory<TransitionsScreen> {
	public buildUi({ parent }: IBuildConfig): TransitionsScreen {
		const characterContainer = new TransitionsScreen({
			visible: false,
			bgX: -SIZE / 2,
			bgY: -SIZE / 2,
			bgW: SIZE,
			bgH: SIZE,
			textY: 0,
			textX: 0,
			textConfig: {
				text: "Try Again!",
				styleOptions: {
					fontFamily: "Verdana, sans-serif",
					fontSize: 75,
					align: "center",
					fontWeight: "bold",
					fill: new FillGradient({
						type: "linear",
						start: { x: 0, y: 0 },
						end: { x: 0, y: 1 },
						colorStops: [
							{ offset: 0, color: "#fff4c2" },
							{ offset: 0.45, color: "#e8c66a" },
							{ offset: 1, color: "#b77a22" },
						],
						textureSpace: "local",
					}),
					dropShadow: {
						distance: 5,
						color: "#1b1208",
						blur: 3,
						alpha: 0.7,
						angle: Math.PI * 0.75,
					},
				},
			},
			landscape: {
				x: GAME_DIMENSIONS.width / 2,
				y: GAME_DIMENSIONS.height / 2,
			},
			portrait: {
				x: GAME_DIMENSIONS_PORTRAIT.width / 2,
				y: GAME_DIMENSIONS_PORTRAIT.height / 2,
			},
			textContainer: {
				landscape: {
					x: 0,
					y: 0,
				},
				portrait: {
					x: 0,
					y: 0,
				},
			},
		});
		characterContainer.build();
		parent.addChild(characterContainer);

		return characterContainer;
	}
}
