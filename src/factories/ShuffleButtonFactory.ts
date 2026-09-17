import { GAME_DIMENSIONS } from "../gameConfig";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { Button } from "../view/ui/Button";

interface IBuildConfig {
	parent: StandardContainer;
}

export class ShuffleButtonFactory extends AbstractStandardFactory<Button> {
	public buildUi({ parent }: IBuildConfig): Button {
		const bg = {
			texture: this._assetsLoader.getTexture("button_shuffle.png"),
			x: 0,
			y: 0,
			anchor: { x: 0.5, y: 0.5 },
			scale: { x: 1.5, y: 1.5 },
		};

		const button = new Button({
			x: GAME_DIMENSIONS.width / 2,
			y: GAME_DIMENSIONS.height / 2,

			landscape: {
				x: -300,
				y: 600,
			},

			portrait: {
				x: 620,
				y: -200,
			},

			bgConfig: bg,
		});

		button.build();
		parent.addChild(button);

		return button;
	}
}
