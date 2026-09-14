import { BaseStep, BaseStepParams } from "./steps/BaseStep";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IControllerParams extends BaseStepParams {
	// pass
}

export abstract class Controller<
	T extends IControllerParams = IControllerParams,
> extends BaseStep<T> {
	//
}
