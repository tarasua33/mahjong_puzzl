import { IGameView } from "../factories/GameViewFactory";
import { Controller, IControllerParams } from "../libs/controllers/Controller";
import { AwaitOnUserActionStep } from "./steps/AwaitOnUserActionStep";
import { AwaitTimeStep } from "../libs/controllers/steps/AwaitTimeStep";
import { PlaceTilesStep } from "./steps/PlaceTileStep";
import { MovePickedTileToPanelStep } from "./steps/MovePickedTileToPanelStep";
import { MatchTilesStep } from "./steps/MatchTilesStep";
import { MoveTilesToLeftStep } from "./steps/MoveTilesToLeftStep";
import { CheckGameStatusStep } from "./steps/CheckGameStatusStepParams";
import { LevelStatus, UserAction } from "../models/LevelModel";
import { ShuffleTilesAnimationStep } from "./steps/ShuffleTilesAnimationStep";
import { ReturnTilesToPoolStep } from "./steps/ReturnTilesToPoolStep";
import { SpawnTilesAnimationStep } from "./steps/SpawnTilesAnimationStep";

// import { SetLvlSettingsStep } from "./steps/SetLvlSettingsStep";

interface IControllerBaseParams extends IControllerParams {
	gameView: IGameView;
	gameLoaded: boolean;
	title: string;
}

export class BaseGameController extends Controller<IControllerBaseParams> {
	// private _setLvlSettingsStep!: SetLvlSettingsStep;

	// private _gameView!: IGameView;

	protected async _start(): Promise<void> {
		const gameView = this._params!.gameView;

		const returnTilesToPoolStep = new ReturnTilesToPoolStep();
		returnTilesToPoolStep.start({
			panel: gameView.panel,
			pool: gameView.tilePool,
		});

		const placeStep = new PlaceTilesStep();
		placeStep.start({
			parent: gameView.tileContainer,
			pool: gameView.tilePool,
		});

		const spawnTilesAnimationStep = new SpawnTilesAnimationStep();
		await spawnTilesAnimationStep.start({});

		while (true) {
			await new AwaitTimeStep().start({
				delay: 0.1,
			});

			await new AwaitOnUserActionStep().start({
				shuffleButton: gameView.shuffleButton,
			});

			const action = this._models.levelModel.getUserAction();

			if (action === UserAction.Shuffle) {
				//
				console.warn("=========SHUFFLE===========");
				await new ShuffleTilesAnimationStep().start({
					tileParent: gameView.tileContainer,
					shuffleButton: gameView.shuffleButton,
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
				await new AwaitTimeStep().start({
					delay: 0.25,
				});
				break;
			}
		}

		this._complete();
	}
}
