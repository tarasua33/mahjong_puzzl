import { IGameView } from "../factories/GameViewFactory";
import { Controller, IControllerParams } from "../libs/controllers/Controller";
import { AwaitOnUserActionStep } from "./steps/AwaitOnUserActionStep";
import { AwaitTimeStep } from "../libs/controllers/steps/AwaitTimeStep";
// import { Signal } from "../libs/utils/Signal";
import { UserInteractionDispatcher } from "../libs/utils/UserInteractionDispatcher";
import { PlaceTilesStep } from "./steps/PlaceTileStep";
import { ScreenFadeInStep } from "./steps/ScreenFadeInStep";
import { ScreenFadeOutStep } from "./steps/ScreenFadeOutStep";
import { MovePickedTileToPanelStep } from "./steps/MovePickedTileToPanelStep";
import { MatchTilesStep } from "./steps/MatchTilesStep";
import { MoveTilesToLeftStep } from "./steps/MoveTilesToLeftStep";
import { CheckGameStatusStep } from "./steps/CheckGameStatusStepParams";
import { LevelStatus, UserAction } from "../models/LevelModel";
import { ShuffleTilesAnimationStep } from "./steps/ShuffleTilesAnimationStep";

// import { SetLvlSettingsStep } from "./steps/SetLvlSettingsStep";

interface IControllerBaseParams extends IControllerParams {
	gameView: IGameView;
	userInteractionDispatcher: UserInteractionDispatcher;
	gameLoaded: boolean;
	title: string;
}

export class BaseGameController extends Controller<IControllerBaseParams> {
	private _screenFadeInStep: ScreenFadeInStep;
	private _screenFadeOutStep: ScreenFadeOutStep;
	// private _setLvlSettingsStep!: SetLvlSettingsStep;

	// private _gameView!: IGameView;

	constructor() {
		super();

		// this._playGameStep = new PlayGameStep();
		// this._stopGameStep = new StopGameStep();
		this._screenFadeInStep = new ScreenFadeInStep();
		this._screenFadeOutStep = new ScreenFadeOutStep();
	}

	protected async _start(): Promise<void> {
		const gameView = this._params!.gameView;

		const placeStep = new PlaceTilesStep();
		placeStep.start({
			parent: gameView.tileContainer,
			pool: gameView.tilePool,
		});

		while (true) {
			await new AwaitTimeStep().start({
				delay: 0.25,
			});

			await new AwaitOnUserActionStep().start({
				shuffleButton: gameView.shuffleButton,
			});

			const action = this._models.levelModel.getUserAction();

			if (action === UserAction.Shuffle) {
				//
				console.warn("=========SHUFFLE===========");
				await new ShuffleTilesAnimationStep().start({
					parent: gameView.tileContainer,
				});
			} else {
				await new MovePickedTileToPanelStep().start({
					panel: gameView.panel,
				});

				await new MatchTilesStep().start({
					panel: gameView.panel,
					gameTilePool: gameView.tilePool,
					particleLayers: gameView.particleLayers,
				});

				await new MoveTilesToLeftStep().start({
					panel: gameView.panel,
				});

				await new CheckGameStatusStep().start({
					panel: gameView.panel,
				});
			}

			const status = this._models.levelModel.getStatus();
			if (status === LevelStatus.LOSE || status === LevelStatus.WIN) {
				break;
			}
		}

		await new AwaitTimeStep().start({
			delay: 200.0,
		});

		// for (let i = 0; i < 20; i++) {
		// 	await new AwaitTimeStep().start({
		// 		delay: 2.0,
		// 	});

		// 	await this._screenFadeInStep.start({
		// 		screen: this._params!.gameView.transitionsScreen,
		// 		title: "Let's get started!",
		// 	});

		// 	await new AwaitTimeStep().start({
		// 		delay: 2.0,
		// 	});

		// 	await this._screenFadeOutStep.start({
		// 		screen: this._params!.gameView.transitionsScreen,
		// 	});
		// }
	}

	// private _onStopGame(): void {
	// 	// const gameView = this._gameView;
	// 	// this.forceComplete();
	// }

	// private _onGameFail(): void {
	// 	// this._onStopGame(true);
	// 	// this.completeStepSignal.dispatch(false);
	// }

	// private _onGameWin(): void {
	// 	// this._onStopGame(false);
	// 	// this.completeStepSignal.dispatch(true);
	// }

	// public forceComplete(): void {
	// 	// this._mng.forceComplete();
	// }
}
