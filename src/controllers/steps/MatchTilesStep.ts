import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { GameTilePool } from "../../libs/utils/GameTilePool";
import { GameTile } from "../../view/GameTile";
import { Panel } from "../../view/Panel";
import { ParticleLayer } from "../../view/ParticleLayer";

export interface MatchTilesStepParams extends BaseStepParams {
	panel: Panel;
	gameTilePool: GameTilePool;
	particleLayers: ParticleLayer[];
}

export class MatchTilesStep extends BaseStep<MatchTilesStepParams> {
	protected async _start({ panel }: MatchTilesStepParams): Promise<void> {
		const match = this._findMatch(panel);

		if (!match) {
			this._complete();
			return;
		}

		await this._playMatch(match[0], match[1]);

		this._complete();
	}

	private _findMatch(panel: Panel): [GameTile, GameTile] | undefined {
		const tilesByType = new Map<number, GameTile>();

		for (const container of panel.tilesContainers) {
			const tile = container.children[0] as GameTile | undefined;

			if (!tile) {
				continue;
			}

			const previousTile = tilesByType.get(tile.type);

			if (previousTile) {
				return [previousTile, tile];
			}

			tilesByType.set(tile.type, tile);
		}

		return undefined;
	}

	private async _playMatch(tile1: GameTile, tile2: GameTile): Promise<void> {
		const particleLayers = this._params!.particleLayers;
		await Promise.all([
			tile1.playMatch(particleLayers),
			tile2.playMatch(particleLayers),
		]);

		this._params!.gameTilePool.release(tile1);
		this._params!.gameTilePool.release(tile2);
	}
}
