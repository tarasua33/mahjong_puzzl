import { GameTile } from "../../view/GameTile";

export class GameTilePool {
	private readonly _pool = new Map<number, GameTile[]>();

	public acquire(type: number): GameTile {
		const tiles = this._pool.get(type);

		if (!tiles || tiles.length === 0) {
			throw new Error(`No available GameTile of type ${type}`);
		}

		return tiles.pop()!;
	}

	public release(tile: GameTile): void {
		let tiles = this._pool.get(tile.type);

		if (!tiles) {
			tiles = [];
			this._pool.set(tile.type, tiles);
		}

		tile.removeFromParent();

		tiles.push(tile);
	}
}
