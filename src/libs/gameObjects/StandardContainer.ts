import { Container, ContainerOptions } from "pixi.js";
import { IGameObject, ViewPort } from "./IGameObject";
import { ITicker } from "../utils/ITicker";

export interface ResizeConfig {
	x?: number;
	y?: number;
	alpha?: number;
	visible?: boolean;
	scale?: { x: number; y: number };
	anchor?: { x: number; y: number };
}

export interface StandardContainerConfig extends ContainerOptions {
	x?: number;
	y?: number;
	visible?: boolean;

	portrait?: ResizeConfig;
	landscape?: ResizeConfig;
}

// eslint-disable-next-line prettier/prettier
export class StandardContainer<T extends StandardContainerConfig = StandardContainerConfig>
	extends Container
	// eslint-disable-next-line prettier/prettier
  implements IGameObject {
	protected _config: T;

	constructor(config: T) {
		super(config);

		this._config = config;
	}

	public build(): void {
		// this._setBaseConfig(this);
	}

	public reset(): void {
		// this._setBaseConfig(this);

		for (const child of this.children as IGameObject[]) {
			child.reset();
		}
	}

	public resize(viewPort?: ViewPort): void {
		if (viewPort) {
			const orientation = viewPort.isPortrait ? "portrait" : "landscape";

			const config = this._config[orientation];

			if (config) {
				if (config.x !== undefined) this.x = config.x;
				if (config.y !== undefined) this.y = config.y;
				if (config.alpha !== undefined) this.alpha = config.alpha;
				if (config.visible !== undefined) this.visible = config.visible;
				if (config.scale !== undefined)
					this.scale.set(config.scale.x, config.scale.y);
				// if (config.anchor !== undefined) {
				// }
			}
		}

		for (const child of this.children as IGameObject[]) {
			if (child.resize) child.resize(viewPort);
		}
	}

	// /* eslint-disable */
	// private _setBaseConfig(ctx: any): void {
	//
	// }
	// /* eslint-enable */

	public update(ticker: ITicker | unknown): void {
		for (const child of this.children as IGameObject[]) {
			if (child.update) child.update(ticker as ITicker);
		}
	}
}
