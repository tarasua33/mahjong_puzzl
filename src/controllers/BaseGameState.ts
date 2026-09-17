import { GameViewFactory, IGameView } from "../factories/GameViewFactory";
import { BaseState } from "../libs/controllers/BaseState";
import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { BaseGameController } from "./BaseGameController";
import { TransitionController } from "./TransitionController";
import { MainScene } from "../view/MainScene";
import { LevelStatus } from "../models/LevelModel";

interface ISTateParams {
	mainScene: MainScene;
	uiContainer: StandardContainer;
}

const PHRASES = {
	WELCOME: "Let's get started!",
	REPLAY: "Try again",
	NEXT_LVL: "You won!\nGet ready for next game",
};

export class BaseGameState extends BaseState {
	private _baseGameController!: BaseGameController;
	private _transitionController!: TransitionController;

	private _gameView!: IGameView;
	private _success: boolean = false;

	public init({ mainScene, uiContainer }: ISTateParams): void {
		this._transitionController = new TransitionController();
		this._gameView = this._buildGameObjects(mainScene, uiContainer);

		const OVERWRITE_LVL = 1;
		const { levelModel } = this._models;
		levelModel.setUpLvl(OVERWRITE_LVL);

		this._baseGameController = new BaseGameController();
		this._transitionController = new TransitionController();
	}

	private _buildGameObjects(
		mainScene: MainScene,
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
		await this._transitionController.start({
			gameView: this._gameView,
			title: PHRASES.WELCOME,
		});

		while (true) {
			await this._baseGameController.start({
				gameView: this._gameView,
				gameLoaded: true,
				title: PHRASES.WELCOME,
			});

			await this._showTransitionScreen();
		}
	}

	private async _showTransitionScreen(): Promise<void> {
		this._success = this._models.levelModel.getStatus() === LevelStatus.WIN;

		await this._transitionController.start({
			gameView: this._gameView,
			title: this._success ? PHRASES.NEXT_LVL : PHRASES.REPLAY,
		});
	}
}
