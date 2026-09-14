import { TilingSprite, TilingSpriteOptions } from "pixi.js";
import { IGameObject } from "./IGameObject";
import { ITicker } from "../utils/ITicker";

export interface StandardTilingSpriteConfig extends TilingSpriteOptions {
	x?: number;
	y?: number;
	visible?: boolean;
}

// eslint-disable-next-line prettier/prettier
export class StandardTilingSprite<T extends StandardTilingSpriteConfig = StandardTilingSpriteConfig,>
	extends TilingSprite
	// eslint-disable-next-line prettier/prettier
  implements IGameObject {
	protected _config: T;

	constructor(config: T) {
		super(config);

		this._config = config;
	}

	public build(): void {
		//
	}

	public reset(): void {
		//

		for (const child of this.children as IGameObject[]) {
			if (child.reset) child.reset();
		}
	}

	public resize(): void {
		for (const child of this.children as IGameObject[]) {
			if (child.resize) child.resize();
		}
	}

	public update(ticker: ITicker): void {
		for (const child of this.children as IGameObject[]) {
			if (child.update) child.update(ticker);
		}
	}
}
