import { ITileModel } from "../../../models/LevelModel";
import { GameTile } from "../../../view/GameTile";
import { BaseStep, BaseStepParams } from "./BaseStep";

export class AwaitOnUserActionStep extends BaseStep<BaseStepParams> {
	private _tiles: GameTile[] = [];

	protected _start(): void {
		const placedTiles = this._models.levelModel.getPlacedTiles();

		this._tiles = [...placedTiles.values()];

		this._tiles.forEach((tile) => {
			tile.onPickSignal.add(this._onTilePicked, this);
		});
	}

	private _onTilePicked(tileModel: ITileModel): void {
		const levelModel = this._models.levelModel;

		if (!levelModel.tileCanMove(tileModel)) {
			console.warn("===== NO =======");
			return;
		}

		console.warn("===== YES =======");
		levelModel.setPickedTileData(tileModel);
		levelModel.removeTile(tileModel);

		this._unsubscribe();
		this._complete();
	}

	private _unsubscribe(): void {
		this._tiles.forEach((tile) => {
			tile.onPickSignal.removeAll();
		});

		this._tiles.length = 0;
	}
}
