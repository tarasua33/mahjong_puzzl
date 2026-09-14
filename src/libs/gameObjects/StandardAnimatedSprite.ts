import { AnimatedSprite, AnimatedSpriteOptions } from "pixi.js";

export interface StandardAnimatedSpriteOptions extends AnimatedSpriteOptions {
	baseSpeed: number;
}

export class StandardAnimatedSprite extends AnimatedSprite {
	public readonly baseSpeed: number;

	constructor(config: StandardAnimatedSpriteOptions) {
		super(config);
		this.baseSpeed = config.baseSpeed;
	}
}
