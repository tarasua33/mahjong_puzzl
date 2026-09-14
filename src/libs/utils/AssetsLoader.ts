import { Assets, Texture } from "pixi.js";

export class AssetsLoader {
	static instance: AssetsLoader;
	static getLoader(): AssetsLoader {
		if (!AssetsLoader.instance) {
			AssetsLoader.instance = new AssetsLoader();
		}
		return AssetsLoader.instance;
	}
	//
	public getTexture(key: string, fromAtlas = true): Texture {
		if (fromAtlas) {
			return Assets.get("mainAtlas").textures[`${key}`];
		} else {
			return Assets.get(key);
		}
	}

	public async initAssets(): Promise<boolean> {
		const manifest = await fetch("/assets/manifest.json").then((res) =>
			res.json(),
		);

		await Assets.init({ manifest, basePath: "/assets" });

		return true;
	}

	public async loadBundle(key: string): Promise<boolean> {
		return await Assets.loadBundle(key);
	}
}
