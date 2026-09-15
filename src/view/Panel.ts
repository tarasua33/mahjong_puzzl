import {
	StandardContainer,
	StandardContainerConfig,
} from "../libs/gameObjects/StandardContainer";
import {
	StandardSprite,
	StandardSpriteConfig,
} from "../libs/gameObjects/StandardSprite";
import { IPoint } from "../libs/utils/GameHelper";

interface PanelConfig extends StandardContainerConfig {
	bg: StandardSpriteConfig;
	tilesPositions: IPoint[];
}

export class Panel extends StandardContainer<PanelConfig> {
	private _bg!: StandardSprite;
	public tilesContainers: StandardContainer[] = [];

	public build(): void {
		super.build();

		const { bg, tilesPositions } = this._config;

		this._bg = new StandardSprite(bg);
		this._bg.build();
		this.addChild(this._bg);

		tilesPositions.forEach((pos) => {
			const slot = new StandardContainer({
				x: pos.x,
				y: pos.y,
			});

			slot.build();
			this.addChild(slot);

			this.tilesContainers.push(slot);
		});
	}
}
