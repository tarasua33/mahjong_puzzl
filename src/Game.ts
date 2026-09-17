import { Container, Renderer, Text, Ticker } from "pixi.js";
import { MainScene } from "./view/MainScene";
import { AssetsLoader } from "./libs/utils/AssetsLoader";
import { BaseGameState } from "./controllers/BaseGameState";
import { UserInteractionDispatcher } from "./libs/utils/UserInteractionDispatcher";
import { ITicker } from "./libs/utils/ITicker";
import { StandardContainer } from "./libs/gameObjects/StandardContainer";
import { ViewPort } from "./libs/gameObjects/IGameObject";
import { GAME_DIMENSIONS, GAME_DIMENSIONS_PORTRAIT } from "./gameConfig";

export class Game {
	private _stage: Container;
	// private _view: HTMLCanvasElement;
	private _mainScene!: MainScene;
	private _uiContainer!: StandardContainer;
	private _baseGame!: BaseGameState;
	private _userInteractionDispatcher!: UserInteractionDispatcher;
	private _loadingText!: Text;

	constructor(stage: Container, renderer: Renderer) {
		this._stage = stage;
		// this._view = view;

		const mainScene = (this._mainScene = new MainScene({
			landscape: {
				x: 0,
				y: 0,
			},
			portrait: {
				x: 0,
				y: 0,
			},
			renderer,
		}));
		mainScene.build();
		stage.addChild(mainScene);

		const uiContainer = (this._uiContainer = new StandardContainer({}));
		uiContainer.build();
		stage.addChild(uiContainer);

		this._loadingScreen(mainScene);
	}

	private _loadingScreen(mainScene: StandardContainer): void {
		const loadingContainer = new StandardContainer({
			landscape: {
				x: GAME_DIMENSIONS.width / 2,
				y: GAME_DIMENSIONS.height / 2,
			},
			portrait: {
				x: GAME_DIMENSIONS_PORTRAIT.width / 2,
				y: GAME_DIMENSIONS_PORTRAIT.height / 2,
			},
		});
		loadingContainer.build();
		mainScene.addChild(loadingContainer);

		const loadingText = (this._loadingText = new Text("Loading...", {
			fontFamily: "Verdana, sans-serif",
			fontSize: 30,
			align: "center",
			fontWeight: "bolder",
			fill: 0xffffff,
		}));
		loadingText.anchor.set(0.5, 0.5);
		loadingContainer.addChild(loadingText);
	}

	public async init(): Promise<boolean> {
		// const stage = this._stage;
		// const mainScene = this._mainScene;

		const assetsLoader = AssetsLoader.getLoader();
		await assetsLoader.initAssets();

		await assetsLoader.loadBundle("preload");

		const loadingText = this._loadingText;
		loadingText.renderable = false;
		this._mainScene.removeChild(loadingText);
		loadingText.destroy({ style: true, texture: true, textureSource: true });

		this._userInteractionDispatcher = new UserInteractionDispatcher(
			this._mainScene,
		);

		this._baseGame = new BaseGameState();
		this._baseGame.init({
			mainScene: this._mainScene,
			uiContainer: this._uiContainer,
		});

		return true;
	}

	// public update(ticker: Ticker, deltaMS: number): void {
	public update(ticker: Ticker): void {
		this._mainScene.update(ticker as ITicker);
		// if (this._physicEngine) this._physicEngine.update(deltaMS);
	}

	public resize(viewPort: ViewPort): void {
		this._mainScene.resize(viewPort);
		this._uiContainer.resize(viewPort);
	}

	public async play() {
		await this._baseGame.start({});
	}
}
