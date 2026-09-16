import { Graphics, ParticleContainer, Renderer, Texture } from "pixi.js";
import { Emitter, EmitterConfig } from "../libs/gameObjects/Emitter";
// import { StandardContainer } from "../libs/gameObjects/StandardContainer";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { ParticleLayer } from "../view/ParticleLayer";

interface IBuildConfig {
	// parent: StandardContainer;
	renderer: Renderer;
	emitterCount: number;
}

export class ParticleLayerFactory extends AbstractStandardFactory<
	ParticleLayer[]
> {
	public buildUi({ renderer, emitterCount }: IBuildConfig): ParticleLayer[] {
		const result: ParticleLayer[] = [];

		const particleTexture = this._createSparkTexture(renderer);

		for (let i = 0; i < emitterCount; i++) {
			const particleContainer = new ParticleContainer({
				dynamicProperties: {
					position: true,
					scale: true,
					rotation: true,
					alpha: true,
				},
			});

			particleContainer.blendMode = "add";
			const emitter = this._createSparklerEmitter(
				particleContainer,
				particleTexture,
			);

			const container = new ParticleLayer({
				emitter,
			});

			container.addChild(particleContainer);
			container.build();

			// parent.addChild(container);

			result.push(container);
		}

		return result;
	}

	private _createSparkTexture(renderer: Renderer): Texture {
		const g = new Graphics();

		const color = 0xffd700;
		const radius = 20;

		g.beginFill(color);

		for (let i = 0; i < 5; i++) {
			const angle = (i * Math.PI * 2) / 5;
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;

			if (i === 0) {
				g.moveTo(x, y);
			} else {
				g.lineTo(x, y);
			}
		}

		g.closePath();
		g.endFill();

		// g.beginFill(0xffffff, 0.4);
		// g.drawCircle(0, 0, radius * 1.4);
		// g.endFill();

		const texture = renderer.generateTexture(g);

		g.destroy(true);

		return texture;
	}

	private _createSparklerEmitter(
		particleContainer: ParticleContainer,
		particleTexture: Texture,
	): Emitter {
		const config: EmitterConfig = {
			particleContainer,
			poolSize: 400,
			particleTexture,

			spawnNumber: {
				min: 6,
				max: 10,
			},

			spawnType: "circle",
			spawnRadius: 10,
			duration: 2,

			particleConfig: {
				startAlpha: 1,
				endAlpha: 0.25,

				startScale: {
					min: 0.45,
					max: 0.75,
				},

				endScale: {
					min: 0.1,
					max: 0.15,
				},

				rotation: {
					min: 0,
					max: Math.PI * 2,
				},

				velocityX: {
					min: -5,
					max: 5,
				},

				velocityY: {
					min: -5,
					max: 5,
				},

				lifeTime: {
					min: 550,
					max: 600,
				},

				easing: "power2.out",
			},
		};

		const emitter = new Emitter();
		emitter.init(config);

		return emitter;
	}
}
