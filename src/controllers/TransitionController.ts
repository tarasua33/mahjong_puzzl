import { IGameView } from "../factories/GameViewFactory";
import { Controller, IControllerParams } from "../libs/controllers/Controller";
import { AwaitTimeStep } from "../libs/controllers/steps/AwaitTimeStep";
import { ResetLvlStep } from "./steps/ResetLvlStep";
import { ReturnTilesToPoolStep } from "./steps/ReturnTilesToPoolStep";

import { ScreenFadeInStep } from "./steps/ScreenFadeInStep";
import { ScreenFadeOutStep } from "./steps/ScreenFadeOutStep";

interface ITransitionControllerParams extends IControllerParams {
	gameView: IGameView;
	title: string;
	// success: boolean;
}

export class TransitionController extends Controller<ITransitionControllerParams> {
	private _screenFadeInStep: ScreenFadeInStep;
	private _screenFadeOutStep: ScreenFadeOutStep;
	private _awaitTimeStep: AwaitTimeStep;
	private _returnTilesToPoolStep: ReturnTilesToPoolStep;
	private _resetLvlStep: ResetLvlStep;

	constructor() {
		super();

		this._resetLvlStep = new ResetLvlStep();
		this._awaitTimeStep = new AwaitTimeStep();
		this._screenFadeInStep = new ScreenFadeInStep();
		this._screenFadeOutStep = new ScreenFadeOutStep();
		this._returnTilesToPoolStep = new ReturnTilesToPoolStep();
	}

	protected async _start({
		gameView,
		title,
	}: ITransitionControllerParams): Promise<void> {
		await this._screenFadeInStep.start({
			title,
			screen: gameView.transitionsScreen,
		});

		await this._returnTilesToPoolStep.start({
			panel: gameView.panel,
			pool: gameView.tilePool,
		});

		this._resetLvlStep.start({
			panel: gameView.panel,
			button: gameView.shuffleButton,
		});

		await this._awaitTimeStep.start({
			delay: 2,
		});

		await this._screenFadeOutStep.start({
			screen: gameView.transitionsScreen,
		});

		this._complete();
	}
}
