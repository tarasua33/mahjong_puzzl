import { IModels } from "../../models/IModels";
import { LevelModel } from "../../models/LevelModel";
import { AssetsLoader } from "../utils/AssetsLoader";

export abstract class AbstractBaseFactory {
	protected _assetsLoader: AssetsLoader;
	protected _models: IModels;

	constructor() {
		this._assetsLoader = AssetsLoader.getLoader();
		this._models = {
			levelModel: LevelModel.getModel(),
		};
	}
}
