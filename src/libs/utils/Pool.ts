export class Pool<T> {
	private pool: T[] = [];
	private _createFn: () => T;

	constructor(createFn: () => T) {
		this._createFn = createFn;
	}

	public get(): T {
		return this.pool.length > 0 ? this.pool.pop()! : this._createFn();
	}

	public release(item: T): void {
		this.pool.push(item);
	}

	public preload(count: number): void {
		for (let i = 0; i < count; i++) this.pool.push(this._createFn());
	}
}
