import { gsap } from "gsap";
import {
	BaseStep,
	BaseStepParams,
} from "../../libs/controllers/steps/BaseStep";
import { StandardContainer } from "../../libs/gameObjects/StandardContainer";
import { GameTile } from "../../view/GameTile";
import { Panel } from "../../view/Panel";
import { TileKey } from "../../models/LevelModel";

export interface MovePickedTileToPanelStepParams extends BaseStepParams {
	panel: Panel;
}

export class MovePickedTileToPanelStep extends BaseStep<MovePickedTileToPanelStepParams> {
	private _tile?: GameTile;
	private _targetContainer?: StandardContainer;

	protected _start({ panel }: MovePickedTileToPanelStepParams): void {
		const pickedTile = this._models.levelModel.getPickedTileData();
		const placedTiles = this._models.levelModel.getPlacedTiles();

		const tileKey: TileKey = `${pickedTile.x}-${pickedTile.y}-${pickedTile.layer}`;
		const tile = placedTiles.get(tileKey);

		if (!tile) {
			this._complete();
			return;
		}

		const targetContainer = panel.tilesContainers.find(
			(container) => container.children.length === 0,
		);

		if (!targetContainer) {
			console.warn("NO EMPTY CONTAINER");
			this._complete();
			return;
		}

		this._tile = tile;
		this._targetContainer = targetContainer;

		this._animateTile(tile, targetContainer, placedTiles, tileKey);
	}

	private _animateTile(
		tile: GameTile,
		targetContainer: StandardContainer,
		placedTiles: Map<TileKey, GameTile>,
		tileKey: TileKey,
	): void {
		const targetGlobalPosition = targetContainer.toGlobal({ x: 0, y: 0 });
		const targetLocalPosition = tile.parent!.toLocal(targetGlobalPosition);
		tile.parent!.addChild(tile);

		const startScale = tile.scale.x;
		const parentScale = tile.parent!.scale.x;
		const targetScale = (startScale * 1.15) / parentScale;

		gsap.killTweensOf(tile);

		gsap.to(tile, {
			x: targetLocalPosition.x,
			y: targetLocalPosition.y,
			duration: 0.5,
			ease: "power2.inOut",
			onComplete: () => {
				tile.removeFromParent();
				targetContainer.addChild(tile);

				tile.position.set(0, 0);
				tile.scale.set(startScale * parentScale, startScale * parentScale);

				placedTiles.delete(tileKey);
				this._models.levelModel.addActiveTilesData(
					this._models.levelModel.getPickedTileData(),
				);
				this._models.levelModel.removePickedTileData();

				this._cleanup();
				this._complete();
			},
		});

		gsap.to(tile.scale, {
			x: targetScale,
			y: targetScale,
			duration: 0.25,
			yoyo: true,
			repeat: 1,
			ease: "sine.inOut",
		});
	}

	private _cleanup(): void {
		if (this._tile) {
			gsap.killTweensOf(this._tile);
			gsap.killTweensOf(this._tile.scale);
		}

		this._tile = undefined;
		this._targetContainer = undefined;
	}
}
