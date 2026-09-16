import { gsap } from "gsap";
import { IGameObject } from "../gameObjects/IGameObject";

export class MoveAnimation {
	private _resolve?: () => void;

	constructor(private readonly _target: IGameObject) {}

	public play(
		startPosition: { x: number; y: number },
		targetPosition: { x: number; y: number },
		duration: number,
	): Promise<void> {
		return new Promise((resolve) => {
			this._resolve = resolve;

			this._target.position.set(startPosition.x, startPosition.y);

			gsap.killTweensOf(this._target);

			gsap.to(this._target, {
				x: targetPosition.x,
				y: targetPosition.y,
				duration,
				ease: "power2.inOut",
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
