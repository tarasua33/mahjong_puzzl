import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { IFadeOut } from "../../libs/utils/GameHelper";

export interface ScreenFadeOutStepParams extends BaseStepParams {
	screen: IFadeOut;
	// skipAwait?: boolean;
}

export class ScreenFadeOutStep<
	T extends ScreenFadeOutStepParams = ScreenFadeOutStepParams,
> extends BaseStep<ScreenFadeOutStepParams> {
	protected _start({ screen }: T): void {
		screen.animationComplete.addOnce(this._complete, this);
		screen.hide();
	}
}
