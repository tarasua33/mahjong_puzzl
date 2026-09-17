import { ITileModel, UserAction } from "../../models/LevelModel";
import { GameTile } from "../../view/GameTile";
import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { Button } from "../../view/ui/Button";

export interface AwaitOnUserActionStepParams extends BaseStepParams {
	shuffleButton: Button;
}

export class AwaitOnUserActionStep extends BaseStep<AwaitOnUserActionStepParams> {
	private _tiles: GameTile[] = [];

	protected _start(): void {
		const levelModel = this._models.levelModel;

		levelModel.removePickedTileData();
		levelModel.removeUserAction();

		const placedTiles = levelModel.getPlacedTiles();

		this._tiles = [...placedTiles.values()];

		this._tiles.forEach((tile) => {
			tile.onPickSignal.add(this._onTilePicked, this);
		});

		this._params!.shuffleButton.onPickSignal.add(this._onShufflePressed, this);
	}

	private _onTilePicked(tileModel: ITileModel): void {
		const levelModel = this._models.levelModel;

		if (!levelModel.tileCanMove(tileModel)) {
			return;
		}

		levelModel.setPickedTileData(tileModel);
		levelModel.removeTile(tileModel);
		levelModel.setUserAction(UserAction.TilePicked);

		this._unsubscribe();
		this._complete();
	}

	private _onShufflePressed(): void {
		this._models.levelModel.setUserAction(UserAction.Shuffle);

		this._unsubscribe();
		this._complete();
	}

	private _unsubscribe(): void {
		this._tiles.forEach((tile) => {
			tile.onPickSignal.removeAll();
		});

		this._params!.shuffleButton.onPickSignal.removeAll();

		this._tiles.length = 0;
	}
}
