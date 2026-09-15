import {
	StandardSprite,
	StandardSpriteConfig,
} from "../libs/gameObjects/StandardSprite";
import { Signal } from "../libs/utils/Signal";
import { UserInteractionDispatcher } from "../libs/utils/UserInteractionDispatcher";
import {
	GENERATOR_CONFIG,
	ITileModel,
	TILE_HIGHT,
	TILE_WIDTH,
} from "../models/LevelModel";

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

	constructor(config: GameTileConfig) {
		super(config);

		this.type = config.type;
	}

	public build(): void {
		super.build();

		this.anchor.set(0, 0);
		const dispatcher = (this._dispatcher = new UserInteractionDispatcher(this));
		dispatcher.pointerDownSignal.add(this._onPointed, this);
	}

	_onPointed(): void {
		console.log(this._tileModel);

		this.onPickSignal.dispatch(this._tileModel);
	}

	public setPosition(tileModel: ITileModel): void {
		this._tileModel = tileModel;
		this.x =
			tileModel.x * (TILE_WIDTH / GENERATOR_CONFIG.tileWidth) -
			LAYER_OFFSETS.x * tileModel.layer;
		this.y =
			tileModel.y * (TILE_HIGHT / GENERATOR_CONFIG.tileHeight) -
			LAYER_OFFSETS.x * tileModel.layer;
	}
}
