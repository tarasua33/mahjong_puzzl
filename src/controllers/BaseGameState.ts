import { GameViewFactory, IGameView } from "../factories/GameViewFactory";
import { BaseState } from "../libs/controllers/BaseState";
import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { BaseGameController } from "./BaseGameController";
import { UserInteractionDispatcher } from "../libs/utils/UserInteractionDispatcher";
import { TransitionController } from "./TransitionController";

interface ISTateParams {
	userInteractionDispatcher: UserInteractionDispatcher;
	mainScene: StandardContainer;
	uiContainer: StandardContainer;
}

const PHRASES = {
	WELCOME: "Let's get started!",
	REPLAY: "Try again",
	NEXT_LVL: "You win!\nGet ready for level",
};

export class BaseGameState extends BaseState {
	private _baseGameController!: BaseGameController;
	private _transitionController!: TransitionController;

	private _gameView!: IGameView;
	private _userInteractionDispatcher!: UserInteractionDispatcher;
	private _success: boolean = false;

	public init({
		userInteractionDispatcher,
		mainScene,
		uiContainer,
	}: ISTateParams): void {
		this._userInteractionDispatcher = userInteractionDispatcher;

		this._transitionController = new TransitionController();
		this._gameView = this._buildGameObjects(mainScene, uiContainer);

		const OVERWRITE_LVL = 1;
		const { levelModel } = this._models;
		levelModel.setUpLvl(OVERWRITE_LVL);

		this._baseGameController = new BaseGameController();
	}

	private _buildGameObjects(
		mainScene: StandardContainer,
		uiContainer: StandardContainer,
	): IGameView {
		const uiFactory = new GameViewFactory();
		const gameUI = uiFactory.buildUi({
			mainScene,
			uiContainer,
		});

		return gameUI;
	}

	protected async _start(): Promise<void> {
		await this._baseGameController.start({
			gameView: this._gameView,
			userInteractionDispatcher: this._userInteractionDispatcher,
			gameLoaded: true,
			title: PHRASES.WELCOME,
		});
	}

	private _showTransitionScreen(success: boolean): void {
		this._success = success;

		// const transitionController = this._transitionController;
		// transitionController.completeStepSignal.addOnce(this._restartGame, this);

		// const lvlModels = this._models.levelModel;
		// transitionController.start({
		// 	success,
		// 	gameView: this._gameView,
		// 	title: this._success
		// 		? PHRASES.NEXT_LVL + ` ${lvlModels.lvl + 1}`
		// 		: PHRASES.REPLAY,
		// });
	}

	private _restartGame(): void {
		// const baseGameController = this._baseGameController;
		// // const lvlModels = this._models.levelModel;
		// lvlModels.setUpLvl(this._success ? lvlModels.lvl + 1 : lvlModels.lvl);
		// baseGameController.completeStepSignal.addOnce(
		// 	this._showTransitionScreen,
		// 	this,
		// );
		// baseGameController.start({
		// 	gameView: this._gameView,
		// 	userInteractionDispatcher: this._userInteractionDispatcher,
		// 	gameLoaded: false,
		// 	title: this._success
		// 		? PHRASES.NEXT_LVL + ` ${lvlModels.lvl}`
		// 		: PHRASES.REPLAY,
		// });
	}
}
