import { BaseStep, BaseStepParams } from "./BaseStep";
import { gsap } from "gsap";

export interface AwaitTimeStepParams extends BaseStepParams {
	delay: number;
}

export class AwaitTimeStep extends BaseStep<AwaitTimeStepParams> {
	protected _start({ delay }: AwaitTimeStepParams): void {
		gsap.delayedCall(delay, () => this._complete());
	}
}
