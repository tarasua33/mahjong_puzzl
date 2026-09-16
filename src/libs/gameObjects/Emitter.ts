import { ParticleConfig, StandardParticle } from "./StandardParticle";
import { ParticleContainer, Texture } from "pixi.js";
import { Sine, gsap } from "gsap";
import { Signal } from "../utils/Signal";
import { Pool } from "../utils/Pool";

export type SpawnType = "point" | "circle";

const AMPLITUDE = 45;
const MAX_F = 3;
const MIN_F = 1;

interface IPosition {
	x: number;
	y: number;
}

export interface EmitterEmitConfig {
	from: IPosition;
	to: IPosition;
	spawnNumber?: {
		min: number;
		max: number;
	};
	spawnRadius?: number;
	duration?: number;
}

export interface EmitterConfig {
	particleContainer: ParticleContainer;
	poolSize: number;
	particleTexture: Texture;
	particleConfig: ParticleConfig;

	spawnNumber: {
		min: number;
		max: number;
	};

	spawnType: SpawnType;
	spawnRadius: number;
	duration: number;
}

export class Emitter {
	public readonly completeSignal = new Signal();

	private _frequency = 5;
	private _emitting = false;
	private _spawnRate = 30;
	private _spawnTimer = 0;
	private _progress = 0;

	private _spawnPosition: IPosition = { x: 0, y: 0 };
	private _to: IPosition = { x: 0, y: 0 };
	private _from: IPosition = { x: 0, y: 0 };

	private _activeParticles: Set<StandardParticle> = new Set();
	private _particlePool!: Pool<StandardParticle>;
	private _config!: EmitterConfig;
	private _spawnNumber!: {
		min: number;
		max: number;
	};

	private _spawnRadius = 0;
	private _duration = 0;

	private _resolve?: () => void;

	public init(config: EmitterConfig): void {
		this._config = config;
		this._spawnNumber = { ...config.spawnNumber };
		this._spawnRadius = config.spawnRadius;
		this._duration = config.duration;

		this._particlePool = new Pool<StandardParticle>(
			this._createParticle.bind(this),
		);

		this._particlePool.preload(config.poolSize);
	}

	private _createParticle(): StandardParticle {
		return new StandardParticle(this._config.particleTexture);
	}

	public spawn(): void {
		const {
			// spawnNumber,
			spawnType,
			// spawnRadius,
			particleConfig,
			particleContainer,
		} = this._config;

		const spawnNumber = this._spawnNumber;
		const spawnRadius = this._spawnRadius;

		const count =
			Math.floor(Math.random() * (spawnNumber.max - spawnNumber.min + 1)) +
			spawnNumber.min;

		for (let i = 0; i < count; i++) {
			const particle = this._particlePool.get();
			const pos = { ...this._spawnPosition };

			if (spawnType === "circle") {
				const angle = Math.random() * Math.PI * 2;
				const radius = Math.random() * spawnRadius;

				pos.x += Math.cos(angle) * radius;
				pos.y += Math.sin(angle) * radius;
			}

			particle.spawn(pos, particleConfig);

			this._activeParticles.add(particle);
			particleContainer.addParticle(particle);
		}
	}

	public update(dt: number): void {
		if (this._emitting) {
			this._spawnTimer += dt;

			if (this._spawnTimer >= this._spawnRate) {
				this._spawnTimer = 0;
				this.spawn();
			}
		}

		for (const particle of this._activeParticles) {
			particle.update(dt);

			if (!particle.active) {
				this._activeParticles.delete(particle);

				this._config.particleContainer.removeParticle(particle);
				this._particlePool.release(particle);
			}
		}
	}

	public emit(config: EmitterEmitConfig): Promise<void> {
		return new Promise<void>((resolve) => {
			this._resolve = resolve;

			this._from = { ...config.from };
			this._to = { ...config.to };

			this._spawnPosition = { ...config.from };

			this._spawnNumber = config.spawnNumber ?? this._config.spawnNumber;

			this._spawnRadius = config.spawnRadius ?? this._config.spawnRadius;

			this._duration = config.duration ?? this._config.duration;

			this._startEmitting();

			this._frequency = Math.round(Math.random() * (MAX_F - MIN_F)) + MIN_F;

			this._startTweenAnimation(this._duration, 0);
		});
	}

	private _startEmitting(): void {
		this._emitting = true;
		this._spawnTimer = 0;
	}

	private _stopEmitting(): void {
		this._emitting = false;

		this.completeSignal.dispatch();

		const resolve = this._resolve;
		this._resolve = undefined;

		resolve?.();
	}

	private _startTweenAnimation(duration: number, delay: number): void {
		this._progress = 0;

		gsap.killTweensOf(this);

		gsap.to(this, {
			progress: 1,
			duration,
			delay,
			ease: Sine.easeOut,
			overwrite: true,
			onComplete: this._stopEmitting.bind(this),
		});
	}

	private set progress(value: number) {
		this._progress = value;

		const x = this._countStep(this._from.x, this._to.x, value);

		const y = this._countStep(this._from.y, this._to.y, value);

		const offsetX = Math.sin(value * Math.PI * this._frequency) * AMPLITUDE;

		this._spawnPosition = {
			x: x + offsetX,
			y,
		};
	}

	private _countStep(a: number, b: number, t: number): number {
		return a + (b - a) * t;
	}

	public get progress(): number {
		return this._progress;
	}
}
