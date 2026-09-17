import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { StandardContainer } from "../../libs/gameObjects/StandardContainer";
import { MoveAnimation } from "../../libs/utils/MoveAnimation";
import {
	GENERATOR_CONFIG,
	TILE_HIGHT,
	TILE_WIDTH,
} from "../../models/LevelModel";

export interface ShuffleTilesAnimationStepParams extends BaseStepParams {
	parent: StandardContainer;
}

export class ShuffleTilesAnimationStep extends BaseStep<ShuffleTilesAnimationStepParams> {
	protected async _start({
		parent,
	}: ShuffleTilesAnimationStepParams): Promise<void> {
		this._models.levelModel.shuffleTiles();

		const tiles = [...this._models.levelModel.getPlacedTiles().values()];
		if (!tiles.length) {
			this._complete();
			return;
		}

		const cellWidth = TILE_WIDTH / GENERATOR_CONFIG.tileWidth;
		const cellHeight = TILE_HIGHT / GENERATOR_CONFIG.tileHeight;

		const centerPosition = {
			x: (GENERATOR_CONFIG.maxWidth * cellWidth) / 2 - TILE_WIDTH / 2,
			y: (GENERATOR_CONFIG.maxHeight * cellHeight) / 2 - TILE_HIGHT / 2,
		};

		await Promise.all(
			tiles.map((tile) => {
				const startPosition = {
					x: tile.x,
					y: tile.y,
				};

				return new MoveAnimation(tile).play(
					startPosition,
					centerPosition,
					0.3,
					"back.inOut",
				);
			}),
		);

		tiles.forEach((tile) => {
			const tileModel = tile.getModel();

			tile.zIndex = this._models.levelModel.getTileZIndex(
				tileModel.layer,
				tileModel.x,
				tileModel.y,
			);
		});

		parent.sortChildren();

		await Promise.all(
			tiles.map((tile) => {
				const targetPosition = tile.getNewPosition();

				return new MoveAnimation(tile).play(
					centerPosition,
					targetPosition,
					0.3,
					"back.inOut",
				);
			}),
		);

		this._complete();
	}
}
