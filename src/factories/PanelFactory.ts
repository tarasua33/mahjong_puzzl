import { GAME_DIMENSIONS } from "../gameConfig";
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
			alpha: 0,
			x: GAME_DIMENSIONS.width / 2,
			y: GAME_DIMENSIONS.height / 2,

			landscape: {
				x: -300,
				y: GAME_DIMENSIONS.height / 2,
			},

			portrait: {
				x: 260,
				y: -200,
			},

			bg,
			tilesPositions: [
				{ x: -191, y: 0 },
				{ x: -65, y: 0 },
				{ x: 62, y: 0 },
				{ x: 188, y: 0 },
			],
		});

		panel.build();
		parent.addChild(panel);

		return panel;
	}
}
