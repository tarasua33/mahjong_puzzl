import { Graphics } from "pixi.js";
import { Signal } from "./Signal";
import { GAME_DIMENSIONS } from "../../gameConfig";

export interface IFadeIn {
	show(): void;
	animationComplete: Signal;
	setText(txt: string): void;
}

export interface IFadeOut {
	hide(): void;
	animationComplete: Signal;
}

export interface IPoint {
	x: number;
	y: number;
}

export interface IRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export function getPositionY(
	previousPlt: IPoint,
	sizeBetween: number,
	height: number,
): number {
	// eslint-disable-next-line prettier/prettier
  const potentialY = previousPlt.y + height / 2 - sizeBetween * 2 + Math.random() * sizeBetween * 4;
	const newY = Math.max(
		Math.min(potentialY, GAME_DIMENSIONS.height - height / 2),
		GAME_DIMENSIONS.height / 4,
	);

	return newY;
}

export function getCircle(
	width: number,
	height: number,
	color: number,
): Graphics {
	const graphic = new Graphics()
		.arc(width / 2, height / 2, width / 2 - 3, 0, Math.PI * 2)
		.fill({
			color: color,
			alpha: 1,
		});

	return graphic;
}
