import { IGameObject } from "../gameObjects/IGameObject";
import { gsap } from "gsap";

export class AlphaInOutAnimation {
	private _resolve?: () => void;

	constructor(private readonly _target: IGameObject) {}

	public show(duration: number): Promise<void> {
		return this._start(1, duration);
	}

	public hide(duration: number): Promise<void> {
		return this._start(0, duration);
	}

	private _start(targetAlpha: number, duration: number): Promise<void> {
		return new Promise((resolve) => {
			this._resolve = resolve;

			gsap.killTweensOf(this._target);

			gsap.to(this._target, {
				alpha: targetAlpha,
				ease: "circ.inOut",
				duration,
				onComplete: () => this._complete(),
			});
		});
	}

	private _complete(): void {
		const resolve = this._resolve;
		this._resolve = undefined;

		resolve?.();
	}
}
