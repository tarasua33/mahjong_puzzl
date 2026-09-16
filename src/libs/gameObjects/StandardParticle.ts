import { Particle } from "pixi.js";
import { gsap } from "gsap";

export interface ParticleConfig {
	startAlpha?: number;
	endAlpha?: number;
	startScale?: { min: number; max: number };
	endScale?: { min: number; max: number };
	rotation?: { min: number; max: number };
	velocityX?: { min: number; max: number };
	velocityY?: { min: number; max: number };
	lifeTime?: { min: number; max: number };
	easing?: string;
}

export class StandardParticle extends Particle {
	public active = false;

	private _vx = 0;
	private _vy = 0;
	private _elapsed = 0;
	private _lifeTime = 1000;

	private _startAlpha = 1;
	private _endAlpha = 1;
	private _startScale = 1;
	private _endScale = 1;
	private _rotationSpeed = 0;

	private _config!: ParticleConfig;

	spawn(spawnPos: { x: number; y: number }, config: ParticleConfig): void {
		this._config = config;
		this.x = spawnPos.x;
		this.y = spawnPos.y;

		this._startAlpha = config.startAlpha ?? 1;
		this._endAlpha = config.endAlpha ?? this._startAlpha;

		this._startScale = this._rand(
			config.startScale?.min ?? 1,
			config.startScale?.max ?? 1,
		);
		this._endScale = this._rand(
			config.endScale?.min ?? this._startScale,
			config.endScale?.max ?? this._startScale,
		);

		this.rotation = this._rand(
			config.rotation?.min ?? 0,
			config.rotation?.max ?? 0,
		);
		this._rotationSpeed = this._rand(-0.05, 0.05);

		this._vx = this._rand(
			config.velocityX?.min ?? 0,
			config.velocityX?.max ?? 0,
		);
		this._vy = this._rand(
			config.velocityY?.min ?? 0,
			config.velocityY?.max ?? 0,
		);

		this._lifeTime = this._rand(
			config.lifeTime?.min ?? 1000,
			config.lifeTime?.max ?? 1000,
		);

		this.alpha = this._startAlpha;
		this.scaleX = this._startScale;
		this.scaleY = this._startScale;
		this._elapsed = 0;
		this.active = true;
	}

	private _easingFn(v: number): number {
		if (this._config.easing) {
			return gsap.parseEase(this._config.easing)(v);
		}

		return v;
	}

	private _rand(min: number, max: number): number {
		return min + Math.random() * (max - min);
	}

	update(dt: number): void {
		if (!this.active) return;

		this._elapsed += dt;
		const progress = this._elapsed / this._lifeTime;

		const eased = this._easingFn(progress);

		this.alpha = this._startAlpha + (this._endAlpha - this._startAlpha) * eased;
		const scale =
			this._startScale + (this._endScale - this._startScale) * eased;
		this.scaleX = scale;
		this.scaleY = scale;
		this.rotation += this._rotationSpeed * dt * 0.06;

		this.x += this._vx * dt * 0.06;
		this.y += this._vy * dt * 0.06;

		if (progress >= 1) {
			this.active = false;
			return;
		}
	}
}
