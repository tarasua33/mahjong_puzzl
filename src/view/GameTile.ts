import {
	StandardSprite,
	StandardSpriteConfig,
} from "../libs/gameObjects/StandardSprite";
import { AlphaInOutAnimation } from "../libs/utils/AlphaInOutAnimation";
import { Signal } from "../libs/utils/Signal";
import { UserInteractionDispatcher } from "../libs/utils/UserInteractionDispatcher";
import {
	GENERATOR_CONFIG,
	ITileModel,
	TILE_HIGHT,
	TILE_WIDTH,
} from "../models/LevelModel";
import { ParticleLayer } from "./ParticleLayer";

const LAYER_OFFSETS = {
	x: 5,
	y: 4,
};

export interface GameTileConfig extends StandardSpriteConfig {
	type: number;
}

export class GameTile extends StandardSprite<GameTileConfig> {
	public readonly onPickSignal = new Signal();
	public readonly type: number;
	private _dispatcher!: UserInteractionDispatcher;
	private _tileModel!: ITileModel;
	private _alphaAnimation!: AlphaInOutAnimation;

	constructor(config: GameTileConfig) {
		super(config);

		this.type = config.type;
	}

	public build(): void {
		super.build();

		this._alphaAnimation = new AlphaInOutAnimation(this);

		this.anchor.set(0, 0);
		const dispatcher = (this._dispatcher = new UserInteractionDispatcher(this));
		dispatcher.pointerDownSignal.add(this._onPointed, this);
	}

	_onPointed(): void {
		console.log(this._tileModel);

		this.onPickSignal.dispatch(this._tileModel);
	}

	public setPosition(tileModel: ITileModel): void {
		this.alpha = 1;

		this._tileModel = tileModel;
		this.x =
			tileModel.x * (TILE_WIDTH / GENERATOR_CONFIG.tileWidth) -
			LAYER_OFFSETS.x * tileModel.layer;
		this.y =
			tileModel.y * (TILE_HIGHT / GENERATOR_CONFIG.tileHeight) -
			LAYER_OFFSETS.x * tileModel.layer;
	}

	public async playMatch(particleLayers: ParticleLayer[]): Promise<void> {
		const particleLayer = particleLayers.pop();

		if (!particleLayer) {
			return;
		}

		this.addChild(particleLayer);

		await Promise.all([
			particleLayer.emitter.emit({
				from: {
					x: 0,
					y: TILE_HIGHT,
				},
				to: {
					x: TILE_WIDTH,
					y: -25,
				},
				duration: 0.5,
			}),
			this._alphaAnimation.hide(1.0),
		]);

		particleLayer.removeFromParent();
		particleLayers.push(particleLayer);
	}

	public getModel(): ITileModel {
		return this._tileModel;
	}

	public getNewPosition(): { x: number; y: number } {
		const { x, y, layer } = this._tileModel;

		return {
			x:
				x * (TILE_WIDTH / GENERATOR_CONFIG.tileWidth) - LAYER_OFFSETS.x * layer,
			y:
				y * (TILE_HIGHT / GENERATOR_CONFIG.tileHeight) -
				LAYER_OFFSETS.y * layer,
		};
	}
}
