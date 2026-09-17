import { Text } from "pixi.js";
import {
	StandardContainer,
	StandardContainerConfig,
} from "../../libs/gameObjects/StandardContainer";
import {
	StandardSprite,
	StandardSpriteConfig,
} from "../../libs/gameObjects/StandardSprite";
import { UserInteractionDispatcher } from "../../libs/utils/UserInteractionDispatcher";
import { Signal } from "../../libs/utils/Signal";

const INACTIVE_TINT = 0x808080;
const ACTIVE_TINT = 0xffffff;

export interface ButtonConfig extends StandardContainerConfig {
	bgConfig: StandardSpriteConfig;
}

export class Button extends StandardContainer<ButtonConfig> {
	public readonly onPickSignal = new Signal();
	public dispatcher!: UserInteractionDispatcher;
	private _bg!: StandardSprite;
	private _text!: Text;
	private _textShadow!: Text;

	public build(): void {
		const { bgConfig } = this._config;

		const bg = (this._bg = new StandardSprite(bgConfig));
		bg.build();
		this.addChild(bg);

		this.dispatcher = new UserInteractionDispatcher(this);
		this.dispatcher.pointerDownSignal.add(this._onPointed, this);
	}

	public makeInactive(): void {
		this._bg.tint = INACTIVE_TINT;
		this._text.tint = INACTIVE_TINT;
		this._textShadow.tint = INACTIVE_TINT;
	}

	public makeActive(): void {
		this._bg.tint = ACTIVE_TINT;
		this._text.tint = ACTIVE_TINT;
		this._textShadow.tint = ACTIVE_TINT;
	}

	_onPointed(): void {
		this.onPickSignal.dispatch();
	}
}
