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
			scale: { x: 1, y: 1 },
		};

		const panel = new Panel({
			x: GAME_DIMENSIONS.width / 2,
			y: GAME_DIMENSIONS.height / 2,

			landscape: {
				x: -300,
				y: GAME_DIMENSIONS.height / 2,
			},

			portrait: {
				x: GAME_DIMENSIONS_PORTRAIT.width / 2 - 37.5,
				y: -200,
			},

			bg,
			tilesPositions: [
				{ x: -250, y: -75 },
				{ x: -122, y: -75 },
				{ x: 3, y: -75 },
				{ x: 130, y: -75 },
			],
		});

		panel.build();
		parent.addChild(panel);

		return panel;
	}
}
