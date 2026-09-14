import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { StandardContainer } from "../../libs/gameObjects/StandardContainer";
import { GameTilePool } from "../../libs/utils/GameTilePool";

export interface PlaceTilesStepParams extends BaseStepParams {
	parent: StandardContainer;
	pool: GameTilePool;
}

export class PlaceTilesStep<
	T extends PlaceTilesStepParams = PlaceTilesStepParams,
> extends BaseStep<T> {
	protected _start({ parent, pool }: T): void {
		const tiles = this._models.levelModel.getLvlMechanicSettings().tiles;

		for (const tileModel of tiles) {
			const tile = pool.acquire(tileModel.type);
			tile.setPosition(tileModel);

			tile.zIndex = this._models.levelModel.getTileZIndex(
				tileModel.layer,
				tileModel.x,
				tileModel.y,
			);

			parent.addChild(tile);
		}

		parent.sortChildren();

		this._complete();
	}
}
