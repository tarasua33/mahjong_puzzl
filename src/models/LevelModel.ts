import { GameTile } from "../view/GameTile";

interface ILevelGeneratorConfig {
	layers: number;

	tileWidth: number;
	tileHeight: number;

	maxWidth: number;
	maxHeight: number;

	minTilesPerLayer: number;
	maxTilesPerLayer: number;
}

export interface ITileModel {
	type: number;
	layer: number;
	x: number;
	y: number;
}

interface IMechanicSettings {
	geometryMatrix: number[][][];
	typeMatrix: number[][][];
	tiles: ITileModel[];
}

export enum LevelStatus {
	PLAYING = "playing",
	LOSE = "lose",
	WIN = "win",
}

export const TILE_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const TILE_WIDTH = 114;
export const TILE_HIGHT = 150;
export const GENERATOR_CONFIG = {
	layers: 2,

	tileWidth: 2,
	tileHeight: 3,

	maxWidth: 12,
	maxHeight: 18,

	minTilesPerLayer: 16,
	maxTilesPerLayer: 32,
};

interface ITileSettings {
	tileTypes: number[];
	eachTileNumber: number;
	assetsKey: Record<number, string>;
}

const TILE_SETTINGS = {
	tileTypes: TILE_TYPES,
	eachTileNumber: 16,
	assetsKey: {
		1: "01_zhong.png",
		2: "02_fa.png",
		3: "03_bird.png",
		4: "04_flower.png",
		5: "05_east.png",
		6: "06_south.png",
		7: "07_west.png",
		8: "08_north.png",
		9: "09_blank.png",
	},
};

export const LAYERING_MATRIX = [
	[0, 2, 5, 9, 14, 20, 27, 35, 44, 54, 65, 77],
	[1, 4, 8, 13, 19, 26, 34, 43, 53, 64, 76, 89],
	[3, 7, 12, 18, 25, 33, 42, 52, 63, 75, 88, 102],
	[6, 11, 17, 24, 32, 41, 51, 62, 74, 87, 101, 116],
	[10, 16, 23, 31, 40, 50, 61, 73, 86, 100, 115, 131],
	[15, 22, 30, 39, 49, 60, 72, 85, 99, 114, 130, 147],
	[21, 29, 38, 48, 59, 71, 84, 98, 113, 129, 146, 164],
	[28, 37, 47, 58, 70, 83, 97, 112, 128, 145, 163, 182],
	[36, 46, 57, 69, 82, 96, 111, 127, 144, 162, 181, 201],
	[45, 56, 68, 81, 95, 110, 126, 143, 161, 180, 200, 221],
	[55, 67, 80, 94, 109, 125, 142, 160, 179, 199, 220, 242],
	[66, 79, 93, 108, 124, 141, 159, 178, 198, 219, 241, 264],
	[78, 92, 107, 123, 140, 158, 177, 197, 218, 240, 263, 287],
	[91, 106, 122, 139, 157, 176, 196, 217, 239, 262, 286, 311],
	[105, 121, 138, 156, 175, 195, 216, 238, 261, 285, 310, 336],
	[120, 137, 155, 174, 194, 215, 237, 260, 284, 309, 335, 362],
	[136, 154, 173, 193, 214, 236, 259, 283, 308, 334, 361, 389],
	[153, 172, 192, 213, 235, 258, 282, 307, 333, 360, 388, 417],
];
export type TileKey = `${number}-${number}-${number}`;

export enum UserAction {
	TilePicked = "tilePicked",
	Shuffle = "shuffle",
}

export class LevelModel {
	static instance: LevelModel;

	private _status: LevelStatus = LevelStatus.PLAYING;

	static getModel(): LevelModel {
		if (!LevelModel.instance) {
			LevelModel.instance = new LevelModel();
		}

		return LevelModel.instance;
	}

	private readonly _config: ILevelGeneratorConfig = GENERATOR_CONFIG;
	private _lvl = 1;
	private _settings!: IMechanicSettings;
	private _placedTiles = new Map<TileKey, GameTile>();
	private _pickedTile?: ITileModel;
	private _action?: UserAction;

	public setPlacedTiles(tiles: Map<TileKey, GameTile>): void {
		this._placedTiles = tiles;
	}

	public getPlacedTiles(): Map<TileKey, GameTile> {
		return this._placedTiles;
	}

	public getGeneralSettings(): ITileSettings {
		return TILE_SETTINGS;
	}

	public setPickedTileData(pickedTile: ITileModel): void {
		this._pickedTile = pickedTile;
	}

	public getPickedTileData(): ITileModel {
		return this._pickedTile!;
	}

	public removePickedTileData(): void {
		this._pickedTile = undefined;
	}

	removeUserAction(): void {
		this._action = undefined;
	}

	setUserAction(action: UserAction): void {
		this._action = action;
	}

	getUserAction(): UserAction | undefined {
		return this._action;
	}

	public setUpLvl(newLvl: number): void {
		this._lvl = newLvl;
	}

	public getLvlMechanicSettings(): IMechanicSettings {
		if (!this._settings) {
			this.generateLvlMechanicSettings();
		}

		return this._settings;
	}

	public generateLvlMechanicSettings(): IMechanicSettings {
		const geometryMatrix = this._generateGeometryMatrix();
		const typeMatrix = this._generateTypeMatrix(geometryMatrix);
		const tiles = this._getTilesModels(geometryMatrix, typeMatrix);
		// console.log(typeMatrix);

		return (this._settings = {
			geometryMatrix,
			typeMatrix,
			tiles,
		});
	}

	private _getTilesModels(
		geometryMatrix: number[][][],
		typeMatrix: number[][][],
	): ITileModel[] {
		const tiles: ITileModel[] = [];

		for (let layer = 0; layer < geometryMatrix.length; layer++) {
			for (let y = 0; y < geometryMatrix[layer].length; y++) {
				for (let x = 0; x < geometryMatrix[layer][y].length; x++) {
					const geometryId = geometryMatrix[layer][y][x];

					if (geometryId === 0) {
						continue;
					}

					if (
						(x > 0 && geometryMatrix[layer][y][x - 1] === geometryId) ||
						(y > 0 && geometryMatrix[layer][y - 1][x] === geometryId)
					) {
						continue;
					}

					tiles.push({
						type: typeMatrix[layer][y][x],
						layer,
						x,
						y,
					});
				}
			}
		}

		return tiles;
	}

	private _generateGeometryMatrix(): number[][][] {
		const layers: number[][][] = [];

		let tileId = 1;

		for (let layerIndex = 0; layerIndex < this._config.layers; layerIndex++) {
			const layer = this._createEmptyLayer();

			const tilesCount = this._randomInt(
				this._config.minTilesPerLayer,
				this._config.maxTilesPerLayer,
			);

			let placedTiles = 0;
			let attempts = 0;

			const maxAttempts = tilesCount * 100;

			while (placedTiles < tilesCount && attempts < maxAttempts) {
				attempts++;

				const x = this._randomInt(
					0,
					this._config.maxWidth - this._config.tileWidth,
				);

				const y = this._randomInt(
					0,
					this._config.maxHeight - this._config.tileHeight,
				);

				const lowerLayer = layers[layerIndex - 1];

				if (this._tryPlaceTile(layer, lowerLayer, x, y, tileId)) {
					tileId++;
					placedTiles++;
				}
			}

			layers.push(layer);
		}

		const totalTiles = tileId - 1;

		if (totalTiles % 2 !== 0) {
			const lastTileId = totalTiles;

			for (const layer of layers) {
				for (let y = 0; y < layer.length; y++) {
					for (let x = 0; x < layer[y].length; x++) {
						if (layer[y][x] === lastTileId) {
							layer[y][x] = 0;
						}
					}
				}
			}
		}

		return layers;
	}

	private _createEmptyLayer(): number[][] {
		return Array.from({ length: this._config.maxHeight }, () =>
			Array(this._config.maxWidth).fill(0),
		);
	}

	private _tryPlaceTile(
		layer: number[][],
		lowerLayer: number[][] | undefined,
		x: number,
		y: number,
		tileId: number,
	): boolean {
		if (!this._canPlaceTile(layer, x, y)) {
			return false;
		}

		if (lowerLayer && !this._hasSupport(lowerLayer, x, y)) {
			return false;
		}

		for (let row = 0; row < this._config.tileHeight; row++) {
			for (let col = 0; col < this._config.tileWidth; col++) {
				layer[y + row][x + col] = tileId;
			}
		}

		return true;
	}

	private _canPlaceTile(layer: number[][], x: number, y: number): boolean {
		if (!this._isInsideMatrix(x, y)) {
			return false;
		}

		for (let row = 0; row < this._config.tileHeight; row++) {
			for (let col = 0; col < this._config.tileWidth; col++) {
				if (layer[y + row][x + col] !== 0) {
					return false;
				}
			}
		}

		return true;
	}

	private _hasSupport(lowerLayer: number[][], x: number, y: number): boolean {
		for (let row = 0; row < this._config.tileHeight; row++) {
			for (let col = 0; col < this._config.tileWidth; col++) {
				if (lowerLayer[y + row]?.[x + col] > 0) {
					return true;
				}
			}
		}

		return false;
	}

	private _isInsideMatrix(x: number, y: number): boolean {
		return (
			x >= 0 &&
			y >= 0 &&
			x + this._config.tileWidth <= this._config.maxWidth &&
			y + this._config.tileHeight <= this._config.maxHeight
		);
	}

	private _randomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	private _generateTypeMatrix(geometryMatrix: number[][][]): number[][][] {
		const tileCount = this._getTileCount(geometryMatrix);

		const types = this._generateTileTypes(tileCount);

		const typeByTileId = new Map<number, number>();

		const tileIds = Array.from({ length: tileCount }, (_, index) => index + 1);

		this._shuffle(tileIds);

		for (let i = 0; i < tileIds.length; i++) {
			typeByTileId.set(tileIds[i], types[i]);
		}

		return geometryMatrix.map((layer) =>
			layer.map((row) =>
				row.map((tileId) => {
					if (tileId === 0) {
						return 0;
					}

					return typeByTileId.get(tileId)!;
				}),
			),
		);
	}

	private _generateTileTypes(tileCount: number): number[] {
		const tileTypes = TILE_TYPES;

		if (tileCount < tileTypes.length * 2) {
			throw new Error(
				`Not enough tiles: ${tileCount}. Minimum is ${tileTypes.length * 2}`,
			);
		}

		if (tileCount % 2 !== 0) {
			throw new Error(`Tile count must be even: ${tileCount}`);
		}

		const maxTilesPerType = 8;

		if (tileCount > tileTypes.length * maxTilesPerType) {
			throw new Error(`Too many tiles: ${tileCount}`);
		}

		const result: number[] = [];

		for (const type of tileTypes) {
			result.push(type, type);
		}

		let remaining = tileCount - result.length;

		while (remaining > 0) {
			const availableTypes = tileTypes.filter((type) => {
				const count = result.filter((value) => value === type).length;

				return count < maxTilesPerType;
			});

			const type =
				availableTypes[this._randomInt(0, availableTypes.length - 1)];

			result.push(type, type);

			remaining -= 2;
		}

		this._shuffle(result);

		return result;
	}

	private _getTileCount(geometryMatrix: number[][][]): number {
		let maxTileId = 0;

		for (const layer of geometryMatrix) {
			for (const row of layer) {
				for (const tileId of row) {
					maxTileId = Math.max(maxTileId, tileId);
				}
			}
		}

		return maxTileId;
	}

	private _shuffle<T>(array: T[]): void {
		for (let i = array.length - 1; i > 0; i--) {
			const j = this._randomInt(0, i);

			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	public getTileZIndex(layerIndex: number, x: number, y: number): number {
		const LAYER_Z_OFFSET = 1000;

		const zIndex = LAYERING_MATRIX[y][x] + layerIndex * LAYER_Z_OFFSET;

		return zIndex;
	}

	public tileCanMove(tileModel: ITileModel): boolean {
		const { geometryMatrix } = this.getLvlMechanicSettings();
		const { layer, x, y } = tileModel;

		const upperLayer = geometryMatrix[layer + 1];

		if (upperLayer && this._hasBlockingTileAbove(upperLayer, x, y)) {
			return false;
		}

		const currentLayer = geometryMatrix[layer];

		if (!this._isSideBlocked(currentLayer, x, y, -1)) {
			return true;
		}

		if (!this._isSideBlocked(currentLayer, x, y, 1)) {
			return true;
		}

		return false;
	}

	private _hasBlockingTileAbove(
		upperLayer: number[][],
		x: number,
		y: number,
	): boolean {
		for (let row = 0; row < this._config.tileHeight; row++) {
			for (let col = 0; col < this._config.tileWidth; col++) {
				if (upperLayer[y + row]?.[x + col] > 0) {
					return true;
				}
			}
		}

		return false;
	}

	private _isSideBlocked(
		layer: number[][],
		x: number,
		y: number,
		direction: -1 | 1,
	): boolean {
		const sideX = direction === -1 ? x - 1 : x + this._config.tileWidth;

		if (sideX < 0 || sideX >= this._config.maxWidth) {
			return false;
		}

		for (let row = 0; row < this._config.tileHeight; row++) {
			if (layer[y + row]?.[sideX] > 0) {
				return true;
			}
		}

		return false;
	}

	public removeTile(tileModel: ITileModel): void {
		const settings = this._settings;

		const { geometryMatrix, typeMatrix } = settings;
		const { type, layer, x, y } = tileModel;

		for (let dy = 0; dy < GENERATOR_CONFIG.tileHeight; dy++) {
			for (let dx = 0; dx < GENERATOR_CONFIG.tileWidth; dx++) {
				geometryMatrix[layer][y + dy][x + dx] = 0;
				typeMatrix[layer][y + dy][x + dx] = 0;
			}
		}

		settings.tiles = settings.tiles.filter((tile) => tile.type !== type);
	}

	public setStatus(status: LevelStatus): void {
		this._status = status;
	}

	public getStatus(): LevelStatus {
		return this._status;
	}

	public shuffleTiles(): void {
		this._shuffleTilePositions();
		this._updateTypeMatrix();
		this._updatePlacedTilesKeys();
	}

	private _shuffleTilePositions(): void {
		const { tiles } = this.getLvlMechanicSettings();

		const positions = tiles.map(({ layer, x, y }) => ({
			layer,
			x,
			y,
		}));

		this._shuffle(positions);

		tiles.forEach((tile, index) => {
			tile.layer = positions[index].layer;
			tile.x = positions[index].x;
			tile.y = positions[index].y;
		});
	}

	private _updateTypeMatrix(): void {
		const { typeMatrix, tiles } = this.getLvlMechanicSettings();

		for (let layer = 0; layer < typeMatrix.length; layer++) {
			for (let y = 0; y < typeMatrix[layer].length; y++) {
				for (let x = 0; x < typeMatrix[layer][y].length; x++) {
					typeMatrix[layer][y][x] = 0;
				}
			}
		}

		for (const tile of tiles) {
			for (let dy = 0; dy < this._config.tileHeight; dy++) {
				for (let dx = 0; dx < this._config.tileWidth; dx++) {
					typeMatrix[tile.layer][tile.y + dy][tile.x + dx] = tile.type;
				}
			}
		}
	}

	private _updatePlacedTilesKeys(): void {
		const gameTiles = Array.from(this._placedTiles.values());

		this._placedTiles = new Map();

		for (const gameTile of gameTiles) {
			const { x, y, layer } = gameTile.getModel();

			const tileKey: TileKey = `${x}-${y}-${layer}`;

			this._placedTiles.set(tileKey, gameTile);
		}
	}
}
