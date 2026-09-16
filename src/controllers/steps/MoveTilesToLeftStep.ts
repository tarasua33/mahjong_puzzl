import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { MoveAnimation } from "../../libs/utils/MoveAnimation";
import { GameTile } from "../../view/GameTile";
import { Panel } from "../../view/Panel";

export interface MoveTilesToLeftStepParams extends BaseStepParams {
	panel: Panel;
}

export class MoveTilesToLeftStep extends BaseStep<MoveTilesToLeftStepParams> {
	protected async _start({ panel }: MoveTilesToLeftStepParams): Promise<void> {
		const { tilesContainers } = panel;
		const parent = panel;

		if (!parent) {
			this._complete();
			return;
		}

		const firstEmptyIndex = tilesContainers.findIndex(
			(container) => container.children.length === 0,
		);

		if (
			firstEmptyIndex === -1 ||
			firstEmptyIndex === tilesContainers.length - 1
		) {
			this._complete();
			return;
		}

		const animations: Promise<void>[] = [];

		for (
			let sourceIndex = firstEmptyIndex + 1;
			sourceIndex < tilesContainers.length;
			sourceIndex++
		) {
			const sourceContainer = tilesContainers[sourceIndex];
			const targetContainer = tilesContainers[sourceIndex - 1];

			const tile = sourceContainer.children[0] as GameTile | undefined;

			if (!tile) {
				continue;
			}

			// Позиції контейнерів стабільні.
			const startPosition = {
				x: sourceContainer.x,
				y: sourceContainer.y,
			};

			const targetPosition = {
				x: targetContainer.x,
				y: targetContainer.y,
			};

			parent.addChild(tile);

			const animation = new MoveAnimation(tile);

			animations.push(
				animation.play(startPosition, targetPosition, 0.3).then(() => {
					tile.removeFromParent();
					targetContainer.addChild(tile);

					tile.position.set(0, 0);
				}),
			);
		}

		await Promise.all(animations);

		this._complete();
	}
}
