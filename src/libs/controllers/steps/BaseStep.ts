import { IModels } from "../../../models/IModels";
import { LevelModel } from "../../../models/LevelModel";
// import { Signal } from "../../utils/Signal";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseStepParams {
	// pass
}

export abstract class BaseStep<T extends BaseStepParams = BaseStepParams> {
	protected _params?: T;
	protected _models: IModels;
	private _resolve?: () => void;
	private _reject?: (reason?: unknown) => void;

	constructor() {
		this._models = {
			levelModel: LevelModel.getModel(),
		};

		this._models.levelModel.getLvlMechanicSettings();
	}

	public async start(params: T): Promise<void> {
		return new Promise((resolve, reject) => {
			this._params = params;
			this._resolve = resolve;
			this._reject = reject;

			this._start(params);
		});
	}

	protected _complete(): void {
		const resolve = this._resolve;
		this._resolve = undefined;
		this._reject = undefined;
		this._params = undefined;
		resolve?.();
	}

	protected abstract _start(params?: T): void | Promise<void>;
}
