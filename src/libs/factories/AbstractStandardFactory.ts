/* eslint-disable prettier/prettier */
import { IGameObject } from "../gameObjects/IGameObject";
import { GameTilePool } from "../utils/GameTilePool";
import { AbstractBaseFactory } from "./AbstractBaseFactory";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IBuildConfig {
  // parent: IGameObject;
}

export abstract class AbstractStandardFactory<
  T extends | GameTilePool | IGameObject
  | IGameObject[]
  | Map<string | number, IGameObject>
  | Map<string | number, IGameObject[]>
  | Map<string | number, Map<string | number, IGameObject[]>
	> = IGameObject,
> extends AbstractBaseFactory {
  public abstract buildUi(params: IBuildConfig): T;
}
