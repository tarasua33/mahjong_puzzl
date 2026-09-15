import { AbstractBaseFactory } from "../libs/factories/AbstractBaseFactory";
import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { StandardSprite } from "../libs/gameObjects/StandardSprite";
import { GameTilePool } from "../libs/utils/GameTilePool";
import { Panel } from "../view/Panel";

import { TransitionsScreen } from "../view/TransitionsScreen";
import { BgFactory } from "./BgFactory";
import { GameTilesFactory } from "./GameTilesFactory";
import { PanelFactory } from "./PanelFactory";
// import { MuteButton } from "../view/ui/MuteButton";
// import { TapHint } from "../view/ui/TapHint";

// import { MuteButtonFactory } from "./MuteButtonFactory";
import { TransitionsScreenFactory } from "./TransitionsScreenFactory";

interface IBuildConfig {
	mainScene: StandardContainer;
	uiContainer: StandardContainer;
}

export interface IGameView {
	panel: Panel;
	bg: StandardSprite;
	transitionsScreen: TransitionsScreen;
	tilePool: GameTilePool;
	tileContainer: StandardContainer;
}

export class GameViewFactory extends AbstractBaseFactory {
	public buildUi(params: IBuildConfig): IGameView {
		const { mainScene } = params;

		const bgFactory = new BgFactory();
		const transitionsScreenFactory = new TransitionsScreenFactory();
		const tilePoolFactory = new GameTilesFactory();
		const panelFactory = new PanelFactory();

		const bg = bgFactory.buildUi({ parent: mainScene });
		const panel = panelFactory.buildUi({ parent: mainScene });
		const tileContainer = new StandardContainer({
			landscape: {
				x: 450,
				y: 40,
				scale: { x: 0.72, y: 0.72 },
			},
			portrait: {
				x: 50,
				y: 125,
				scale: { x: 1, y: 1 },
			},
		});
		mainScene.addChild(tileContainer);

		// const tapHintFactory = new TapHintFactory();
		// const muteButtonFactory = new MuteButtonFactory();

		const view: IGameView = {
			// tapHint: tapHintFactory.buildUi({
			// 	parent: mainScene,
			// }),
			panel,
			bg,
			transitionsScreen: transitionsScreenFactory.buildUi({
				parent: mainScene,
			}),
			tilePool: tilePoolFactory.buildUi(),
			tileContainer,
			// muteButton: muteButtonFactory.buildUi({
			// 	parent: uiContainer,
			// }),
		};

		return view;
	}
}
