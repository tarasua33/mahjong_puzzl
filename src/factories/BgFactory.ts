import { GAME_DIMENSIONS } from "../gameConfig";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { StandardSprite } from "../libs/gameObjects/StandardSprite";

interface IBuildConfig {
	parent: StandardContainer;
}

export class BgFactory extends AbstractStandardFactory<StandardSprite> {
	public buildUi({ parent }: IBuildConfig): StandardSprite {
		const bg = new StandardSprite({
			texture: this._assetsLoader.getTexture("green-gradient.jpg"),
			x: GAME_DIMENSIONS.width / 2,
			y: GAME_DIMENSIONS.width / 2,
			anchor: { x: 0.5, y: 0.5 },
			scale: { x: 1.25, y: 1.25 },
		});
		bg.build();
		parent.addChild(bg);

		return bg;
	}
}
