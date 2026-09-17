import { gsap } from "gsap";
import { IGameObject } from "../gameObjects/IGameObject";

export class ButtonClickAnimation {
	private _resolve?: () => void;

	constructor(private readonly _target: IGameObject) {}

	public play(duration: number = 0.15): Promise<void> {
		return new Promise((resolve) => {
			this._resolve = resolve;

			gsap.killTweensOf(this._target.scale);

			gsap
				.timeline({
					onComplete: () => this._complete(),
				})
				.to(this._target.scale, {
					x: 0.8,
					y: 0.8,
					duration,
					ease: "back.in",
				})
				.to(this._target.scale, {
					x: 1,
					y: 1,
					duration,
					ease: "power2.out",
				});
		});
	}

	private _complete(): void {
		const resolve = this._resolve;
		this._resolve = undefined;

		resolve?.();
	}
}
