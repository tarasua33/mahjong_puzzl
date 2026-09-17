import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
// import { StandardContainer } from "../../libs/gameObjects/StandardContainer";
import { SpawnAnimation } from "../../libs/utils/SpawnAnimation";

// export interface SpawnTilesAnimationStepParams extends BaseStepParams {
// 	// parent: StandardContainer;
// }

export class SpawnTilesAnimationStep extends BaseStep<BaseStepParams> {
	protected async _start(): Promise<void> {
		const tiles = [...this._models.levelModel.getPlacedTiles().values()];

		if (!tiles.length) {
			this._complete();
			return;
		}

		const sortedTiles = [...tiles].sort((a, b) => a.zIndex - b.zIndex);

		await Promise.all(
			sortedTiles.map((tile, index) =>
				new SpawnAnimation(tile).play(0.5, index * 0.06),
			),
		);

		this._complete();
	}
}
