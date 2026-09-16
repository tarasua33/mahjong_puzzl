import { Emitter } from "../libs/gameObjects/Emitter";
import {
	StandardContainer,
	StandardContainerConfig,
} from "../libs/gameObjects/StandardContainer";
import { ITicker } from "../libs/utils/ITicker";

export interface ParticleLayerConfig extends StandardContainerConfig {
	emitter: Emitter;
}

export class ParticleLayer extends StandardContainer<ParticleLayerConfig> {
	public emitter!: Emitter;
	// private _angle = 0;

	public build(): void {
		this.emitter = this._config.emitter;
		//
	}

	public update(ticker: ITicker | unknown): void {
		this.emitter.update((ticker! as ITicker).deltaMS);
	}
}
