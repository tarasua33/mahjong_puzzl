// import { Graphics, TextStyle, Text } from "pixi.js";
// import {
// 	StandardContainer,
// 	StandardContainerConfig,
// } from "../../libs/gameObjects/StandardContainer";
// import { gsap, Sine } from "gsap";
// import { getCircle } from "../../libs/utils/GameHelper";

// export interface TapHintConfig extends StandardContainerConfig {
// 	size: { width: number; height: number };
// 	duration: number;
// 	textConfig: {
// 		y: number;
// 		anchor: { x: number; y: number };
// 		alpha: number;
// 		text: string;
// 		styleOptions: Partial<TextStyle>;
// 	};
// }

// export class TapHint extends StandardContainer<TapHintConfig> {
// 	// private _innerCircle: Graphics;
// 	private _outerCircle!: Graphics;
// 	private _progress = 0;
// 	private _startAllScale = 0.9;
// 	private _endAllScale = 0.75;

// 	private _startCircleScale = 0.9;
// 	private _endCircleScale = 2;
// 	private _startAlpha = 1;
// 	private _endAlpha = 0;
// 	private _startTextAlpha = 0.75;
// 	private _endTextAlpha = 0.25;
// 	private _text!: Text;
// 	private _circleContainer!: StandardContainer;

// 	public build(): void {
// 		const { textConfig, size } = this._config;
// 		const { width, height } = size;
// 		const circleContainer = (this._circleContainer = new StandardContainer({}));
// 		circleContainer.build();
// 		this.addChild(circleContainer);

// 		const innerCircle = getCircle(width, height, 0xffffff);
// 		innerCircle.pivot.x = innerCircle.width / 2;
// 		innerCircle.pivot.y = innerCircle.height / 2;

// 		const outerCircle = (this._outerCircle = getCircle(
// 			width,
// 			height,
// 			0xffffff,
// 		));
// 		outerCircle.pivot.x = outerCircle.width / 2;
// 		outerCircle.pivot.y = outerCircle.height / 2;
// 		circleContainer.addChild(innerCircle);
// 		circleContainer.addChild(outerCircle);

// 		const text = (this._text = new Text(
// 			textConfig.text,
// 			textConfig.styleOptions,
// 		));
// 		text.anchor.set(textConfig.anchor.x, textConfig.anchor.y);
// 		text.alpha = textConfig.alpha;
// 		text.y = textConfig.y;
// 		this.addChild(text);
// 	}

// 	public play(): void {
// 		this._startTweenAnimation();
// 	}

// 	private _startTweenAnimation(): void {
// 		this._progress = 0;

// 		gsap.killTweensOf(this);
// 		gsap.to(this, {
// 			progress: 1,
// 			duration: this._config.duration,
// 			ease: "none",
// 			overwrite: true,
// 			repeat: 3,
// 			onRepeat: this._onRepeat.bind(this),
// 			onComplete: this._onCompleteAnimation.bind(this),
// 		});
// 	}

// 	private _onCompleteAnimation(): void {
// 		this._text.alpha = 0;
// 	}

// 	private _onRepeat(): void {
// 		this._text.alpha = this._startTextAlpha;
// 		this._circleContainer.alpha = 1;
// 		this._circleContainer.scale.set(1, 1);
// 		this._outerCircle.scale.set(1, 1);
// 	}

// 	private set progress(value: number) {
// 		this._progress = value;
// 		const module = 2;

// 		if (value < 0.5) {
// 			const linearValue = value * module;
// 			const updatedProgress = Sine.easeInOut(linearValue);
// 			const scaleDelta =
// 				updatedProgress * (this._endAllScale - this._startAllScale);
// 			const scale = this._startAllScale + scaleDelta;
// 			this._circleContainer.scale.set(scale, scale);

// 			const textDeltaAlpha =
// 				(this._endTextAlpha - this._startTextAlpha) * updatedProgress;
// 			this._text.alpha = this._startTextAlpha + textDeltaAlpha;
// 		} else {
// 			const linearValue = value * module - 1;
// 			const updatedProgress = Sine.easeInOut(linearValue);
// 			const scaleDelta =
// 				updatedProgress * (this._endAllScale - this._startAllScale);
// 			const scale = this._startAllScale + scaleDelta;
// 			this._circleContainer.scale.set(scale, scale);

// 			this._circleContainer.alpha =
// 				this._startAlpha +
// 				(this._endAlpha - this._startAlpha) * updatedProgress;

// 			const scaleCircleDelta =
// 				updatedProgress * (this._endCircleScale - this._startCircleScale);
// 			const scaleCircle = this._startCircleScale + scaleCircleDelta;
// 			this._outerCircle.scale.set(scaleCircle, scaleCircle);

// 			const textDeltaAlpha =
// 				(this._startTextAlpha - this._endTextAlpha) * updatedProgress;
// 			this._text.alpha = this._endTextAlpha + textDeltaAlpha;
// 		}
// 	}

// 	public get progress(): number {
// 		return this._progress;
// 	}
// }
