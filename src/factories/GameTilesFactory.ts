import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
// import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { GameTilePool } from "../libs/utils/GameTilePool";
import { GameTile } from "../view/GameTile";

// interface IBuildConfig {
// 	parent?: StandardContainer;
// }

export class GameTilesFactory extends AbstractStandardFactory<GameTilePool> {
	public buildUi(): GameTilePool {
		const settings = this._models.levelModel.getGeneralSettings();
		const pool = new GameTilePool();

		for (const type of settings.tileTypes) {
			const textureName = settings.assetsKey[type];

			for (let i = 0; i < settings.eachTileNumber; i++) {
				const tile = new GameTile({
					texture: this._assetsLoader.getTexture(textureName),
					anchor: { x: 0, y: 0 },
					type,
				});

				tile.build();

				pool.release(tile);
			}
		}

		return pool;
	}
}
