import { Graphics, Text, TextStyle } from "pixi.js";
import {
	StandardContainer,
	StandardContainerConfig,
} from "../libs/gameObjects/StandardContainer";
import { Signal } from "../libs/utils/Signal";
import { IFadeIn, IFadeOut } from "../libs/utils/GameHelper";
import { Bounce, Expo, Back, Sine, gsap } from "gsap";

interface TransitionsScreenConfig extends StandardContainerConfig {
	bgX: number;
	bgY: number;
	bgW: number;
	bgH: number;
	textY: number;
	textX: number;
	textConfig: {
		text: string;
		styleOptions: Partial<TextStyle>;
	};
}

export class TransitionsScreen
	extends StandardContainer<TransitionsScreenConfig>
	// eslint-disable-next-line prettier/prettier
  implements IFadeIn, IFadeOut {
	public readonly animationComplete = new Signal();

	private _text!: Text;
	private _progress = 0;
	private _alphaFrom = 0;
	private _alphaTo = 1;
	private _scaleFrom = 10;
	private _scaleTo = 1;
	private _isFadeIn = true;

	public build(): void {
		super.build();

		const { bgX, bgY, bgW, bgH, textConfig, textX, textY } = this._config;

		const bg = new Graphics();
		bg.beginFill(0x273028).drawRect(bgX, bgY, bgW, bgH).endFill();
		this.addChild(bg);

		const text = (this._text = new Text(
			textConfig.text,
			textConfig.styleOptions,
		));
		text.anchor.set(0.5, 0.5);

		text.x = textX;
		text.y = textY;

		this.addChild(text);
	}

	public show(): void {
		this.visible = true;
		this.alpha = 0;

		this._isFadeIn = true;
		this._alphaFrom = 0;
		this._alphaTo = 1;
		this._scaleFrom = 10;
		this._scaleTo = 1;

		this._startTweenAnimation();
	}

	public hide(): void {
		this._isFadeIn = false;
		this._alphaFrom = 1;
		this._alphaTo = 0;
		this._scaleFrom = 1;
		this._scaleTo = 10;

		this._startTweenAnimation();
	}

	private _startTweenAnimation(): void {
		this._progress = 0;

		gsap.killTweensOf(this);
		gsap.to(this, {
			progress: 1,
			duration: 0.5,
			ease: "none",
			overwrite: true,
			onComplete: this._onCompleteAnimation.bind(this),
		});
	}

	private _onCompleteAnimation(): void {
		if (!this._isFadeIn) {
			this.alpha = 0;
			this.visible = false;
		}

		this.animationComplete.dispatch();
	}

	private set progress(value: number) {
		this._progress = value;

		const alphaValue = this._isFadeIn
			? Expo.easeOut(value)
			: Sine.easeInOut(value);
		this.alpha =
			this._alphaFrom + (this._alphaTo - this._alphaFrom) * alphaValue;

		let scaleValue = value;
		if (this._isFadeIn) {
			scaleValue = Bounce.easeOut(value);
		} else {
			scaleValue = Back.easeOut(value);
		}
		const scale =
			this._scaleFrom + (this._scaleTo - this._scaleFrom) * scaleValue;
		this._text.scale = scale;
	}

	public get progress(): number {
		return this._progress;
	}

	public setText(txt: string): void {
		this._text.text = txt;
	}
}
