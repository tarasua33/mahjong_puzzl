import { gsap } from "gsap";
import { IGameObject } from "../gameObjects/IGameObject";

export class SpawnAnimation {
	private _resolve?: () => void;

	constructor(private readonly _target: IGameObject) {}

	public play(
		duration: number,
		delay: number = 0,
		// ease: string = "back.out",
	): Promise<void> {
		return new Promise((resolve) => {
			this._resolve = resolve;

			gsap.killTweensOf(this._target);

			this._target.alpha = 0;
			this._target.scale.set(5);

			const timeline = gsap.timeline({
				delay,
				onComplete: () => this._complete(),
			});

			timeline.to(
				this._target,
				{
					alpha: 1,
					duration,
					ease: "sine.in",
				},
				0,
			);

			timeline.to(
				this._target.scale,
				{
					x: 1,
					y: 1,
					duration,
					ease: "bounce.out",
				},
				0,
			);
		});
	}

	private _complete(): void {
		const resolve = this._resolve;
		this._resolve = undefined;

		resolve?.();
	}
}
