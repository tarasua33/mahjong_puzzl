import { GAME_DIMENSIONS, GAME_DIMENSIONS_PORTRAIT } from "../gameConfig";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { Panel } from "../view/Panel";

interface IBuildConfig {
	parent: StandardContainer;
}

export class PanelFactory extends AbstractStandardFactory<Panel> {
	public buildUi({ parent }: IBuildConfig): Panel {
		const bg = {
			texture: this._assetsLoader.getTexture("panel.png"),
			x: 0,
			y: 0,
			anchor: { x: 0.5, y: 0.5 },
			scale: { x: 0.75, y: 0.75 },
		};

		const panel = new Panel({
			x: GAME_DIMENSIONS.width / 2,
			y: GAME_DIMENSIONS.height / 2,

			landscape: {
				x: 220,
				y: GAME_DIMENSIONS.height / 2,
			},

			portrait: {
				x: GAME_DIMENSIONS_PORTRAIT.width / 2,
				y: 50,
			},

			bg,
			tilesPositions: [
				{ x: -185, y: -55 },
				{ x: -90, y: -55 },
				{ x: 5, y: -55 },
				{ x: 100, y: -55 },
			],
		});

		panel.build();
		parent.addChild(panel);

		return panel;
	}
}
