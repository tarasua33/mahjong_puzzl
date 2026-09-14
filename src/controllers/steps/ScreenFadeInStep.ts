import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { IFadeIn } from "../../libs/utils/GameHelper";

export interface ScreenFadeInStepParams extends BaseStepParams {
	screen: IFadeIn;
	// skipAwait?: boolean;
	title: string;
}

export class ScreenFadeInStep<
	T extends ScreenFadeInStepParams = ScreenFadeInStepParams,
> extends BaseStep<ScreenFadeInStepParams> {
	protected _start({ screen, title }: T): void {
		screen.animationComplete.addOnce(this._complete, this);

		screen.setText(title);
		screen.show();
	}
}
