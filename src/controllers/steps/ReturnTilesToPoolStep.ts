import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { GameTilePool } from "../../libs/utils/GameTilePool";
import { GameTile } from "../../view/GameTile";
import { Panel } from "../../view/Panel";

export interface ReturnTilesToPoolStepParams extends BaseStepParams {
	panel: Panel;
	pool: GameTilePool;
}

export class ReturnTilesToPoolStep extends BaseStep<ReturnTilesToPoolStepParams> {
	protected _start({ panel, pool }: ReturnTilesToPoolStepParams): void {
		const placedTiles = this._models.levelModel.getPlacedTiles();

		if (placedTiles?.size) {
			for (const tile of placedTiles.values()) {
				pool.release(tile);
			}

			// this._models.levelModel.clearPlacedTiles();
		}

		for (const container of panel.tilesContainers) {
			const tile = container.children[0] as GameTile | undefined;

			if (!tile) {
				continue;
			}

			pool.release(tile);
		}

		this._complete();
	}
}
