import { IGameObject } from "./IGameObject";
import { ITicker } from "../utils/ITicker";
import {
	StandardContainer,
	StandardContainerConfig,
} from "./StandardContainer";
import {
	StandardAnimatedSprite,
	StandardAnimatedSpriteOptions,
} from "./StandardAnimatedSprite";

export interface StandardFramesAnimationsConfig extends StandardContainerConfig {
	x?: number;
	y?: number;
	visible?: boolean;
	animations: {
		name: string;
		animation: StandardAnimatedSpriteOptions;
	}[];
}

// eslint-disable-next-line prettier/prettier
export class StandardFramesAnimations<T extends StandardFramesAnimationsConfig = StandardFramesAnimationsConfig,>
	extends StandardContainer
	// eslint-disable-next-line prettier/prettier
  implements IGameObject {
	protected _animations = new Map<string, StandardAnimatedSprite>();
	protected _active: StandardAnimatedSprite | undefined;
	protected _config: T;

	constructor(config: T) {
		super(config);

		this._config = config;
	}

	public build(): void {
		const { animations } = this._config;

		for (const anm of animations) {
			const animation = new StandardAnimatedSprite(anm.animation);
			this.addChild(animation);
			animation.visible = false;
			animation.stop();
			this._animations.set(anm.name, animation);
		}
	}

	public playAnimation(name: string, loop = false, speedMultiplier = 1): void {
		if (this._active) {
			this._active.loop = false;
			this._active.stop();
			this._active.visible = false;
			this._active = undefined;
		}

		const active = (this._active = this._animations.get(name)!);
		active.visible = true;
		active.loop = loop;
		active.animationSpeed = active.baseSpeed * speedMultiplier;
		active.play();
	}

	public reset(): void {
		// this._setBaseConfig(this);

		for (const child of this.children as IGameObject[]) {
			if (child.reset) child.reset();
		}
	}

	public resize(): void {
		for (const child of this.children as IGameObject[]) {
			if (child.resize) child.resize();
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public update(_ticker: ITicker): void {
		// super.update(ticker);
		// for (const child of this.children as IGameObject[]) {
		//   if (child.update) child.update(ticker);
		// }
	}
}
