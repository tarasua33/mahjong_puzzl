export class Queue<T> {
	private _items: Record<number, T> = {};
	private _tail = 0;
	private _head = 0;

	public enqueue(el: T): void {
		this._items[this._tail] = el;
		this._tail++;
	}

	public dequeue(): T {
		const el = this._items[this._head];
		delete this._items[this._head];
		this._head++;

		return el;
	}

	public isEmpty(): boolean {
		return this.size() === 0;
	}

	public size(): number {
		return this._tail - this._head;
	}
}
