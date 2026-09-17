import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { StandardContainer } from "../../libs/gameObjects/StandardContainer";
import { ButtonClickAnimation } from "../../libs/utils/ButtonClickAnimation";
import { MoveAnimation } from "../../libs/utils/MoveAnimation";
import {
	GENERATOR_CONFIG,
	TILE_HIGHT,
	TILE_WIDTH,
} from "../../models/LevelModel";
import { Button } from "../../view/ui/Button";

export interface ShuffleTilesAnimationStepParams extends BaseStepParams {
	tileParent: StandardContainer;
	shuffleButton: Button;
}

export class ShuffleTilesAnimationStep extends BaseStep<ShuffleTilesAnimationStepParams> {
	protected async _start({
		tileParent,
		shuffleButton,
	}: ShuffleTilesAnimationStepParams): Promise<void> {
		new ButtonClickAnimation(shuffleButton).play();

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

		tileParent.sortChildren();

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

		console.log(this._models.levelModel.getLvlMechanicSettings());

		this._complete();
	}
}
