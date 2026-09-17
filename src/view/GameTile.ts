import {
	StandardContainer,
	StandardContainerConfig,
} from "../libs/gameObjects/StandardContainer";
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
	x: 6,
	y: 5,
};

export interface GameTileConfig extends StandardContainerConfig {
	type: number;
	bg: StandardSpriteConfig;
}

export class GameTile extends StandardContainer<GameTileConfig> {
	public readonly onPickSignal = new Signal();
	public readonly type: number;
	private _dispatcher!: UserInteractionDispatcher;
	private _tileModel?: ITileModel;
	private _alphaAnimation!: AlphaInOutAnimation;

	constructor(config: GameTileConfig) {
		super(config);

		this.type = config.type;
	}

	public build(): void {
		super.build();

		const bg = new StandardSprite(this._config.bg);
		bg.build();
		this.addChild(bg);

		this._alphaAnimation = new AlphaInOutAnimation(this);

		const dispatcher = (this._dispatcher = new UserInteractionDispatcher(bg));
		dispatcher.pointerDownSignal.add(this._onPointed, this);
	}

	_onPointed(): void {
		console.log(this._tileModel);

		this.onPickSignal.dispatch(this._tileModel);
	}

	public setPosition(tileModel: ITileModel): void {
		this.alpha = 1;

		this._tileModel = tileModel;
		const pos = this.getNewPosition();
		this.x = pos.x;
		this.y = pos.y;
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
					x: -TILE_WIDTH / 2,
					y: TILE_HIGHT / 2,
				},
				to: {
					x: TILE_WIDTH / 2,
					y: -TILE_HIGHT / 2 - 25,
				},
				duration: 0.5,
			}),
			this._alphaAnimation.hide(1.0),
		]);

		particleLayer.removeFromParent();
		particleLayers.push(particleLayer);
	}

	public getModel(): ITileModel {
		return this._tileModel!;
	}

	public getNewPosition(): { x: number; y: number } {
		const { x, y, layer } = this._tileModel!;

		return {
			x:
				x * (TILE_WIDTH / GENERATOR_CONFIG.tileWidth) -
				LAYER_OFFSETS.x * layer +
				TILE_WIDTH / 2,
			y:
				y * (TILE_HIGHT / GENERATOR_CONFIG.tileHeight) -
				LAYER_OFFSETS.y * layer +
				TILE_HIGHT / 2,
		};
	}

	public clearModel(): void {
		this._tileModel = undefined;
	}
}
