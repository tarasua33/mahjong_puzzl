import { Container } from "pixi.js";
import { Signal } from "./Signal";

export class UserInteractionDispatcher {
	public readonly pointerDownSignal = new Signal();

	constructor(view: Container) {
		view.interactive = true;
		view.eventMode = "static";
		view.on("pointerdown", this._onPointerDown.bind(this));
	}

	private _onPointerDown(): void {
		this.pointerDownSignal.dispatch();
	}
}
