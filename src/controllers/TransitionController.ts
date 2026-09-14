import { IGameView } from "../factories/GameViewFactory";
import { Controller, IControllerParams } from "../libs/controllers/Controller";

import { ScreenFadeInStep } from "./steps/ScreenFadeInStep";

interface IControllerBaseParams extends IControllerParams {
	gameView: IGameView;
	title: string;
	success: boolean;
}

export class TransitionController extends Controller<IControllerBaseParams> {
	private _screenFadeInStep: ScreenFadeInStep;

	constructor() {
		super();

		this._screenFadeInStep = new ScreenFadeInStep();
		// this._resetGameStep = new ResetGameStep();
		// this._characterCelebrationStep = new CharacterCelebrationStep();
		// this._playAudioStep = new PlayAudioStep();
	}

	protected _start(): void {
		// baseSequence.addStepByStep(this._screenFadeInStep, {
		//   screen: gameView.transitionsScreen as IFadeIn,
		//   title: title,
		// });
	}

	// protected _onComplete(): void {
	// 	this.completeStepSignal.dispatch();
	// }
}
