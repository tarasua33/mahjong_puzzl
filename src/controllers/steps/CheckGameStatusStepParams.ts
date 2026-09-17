import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { LevelStatus } from "../../models/LevelModel";
import { Panel } from "../../view/Panel";

export interface CheckGameStatusStepParams extends BaseStepParams {
	panel: Panel;
}

export class CheckGameStatusStep extends BaseStep<CheckGameStatusStepParams> {
	protected async _start({ panel }: CheckGameStatusStepParams): Promise<void> {
		const levelModel = this._models.levelModel;

		if (levelModel.getPlacedTiles().size === 0) {
			levelModel.setStatus(LevelStatus.WIN);
			this._complete();

			console.warn("WIN");
			return;
		}

		const isLose = panel.tilesContainers.every(
			(container) => container.children.length > 0,
		);

		if (isLose) {
			levelModel.setStatus(LevelStatus.LOSE);
			this._complete();
			console.warn("LOSE");
			return;
		}

		levelModel.setStatus(LevelStatus.PLAYING);
		console.warn("NEXT");

		this._complete();
	}
}
