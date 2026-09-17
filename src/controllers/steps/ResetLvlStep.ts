import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { Panel } from "../../view/Panel";
import { Button } from "../../view/ui/Button";

export interface ResetLvlStepParams extends BaseStepParams {
	panel: Panel;
	button: Button;
}

export class ResetLvlStep<
	T extends ResetLvlStepParams = ResetLvlStepParams,
> extends BaseStep<T> {
	protected _start({ panel, button }: T): void {
		panel.alpha = 1;
		button.alpha = 1;

		this._models.levelModel.generateLvlMechanicSettings();

		this._complete();
	}
}
