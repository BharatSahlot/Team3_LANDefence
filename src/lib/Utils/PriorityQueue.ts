// TODO: should use some better implementation
type Entry<T> = { item: T; priority: number };

export class PriorityQueue<T> {
    private items: Entry<T>[] = [];

    enqueue(item: T, priority: number) {
        this.items.push({ item, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): T | undefined {
        return this.items.shift()?.item;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    remove(item: T, equals?: (a: T, b: T) => boolean): boolean {
        let eq = equals;
        if (eq == null) {
            eq = (a: T, b: T) => a === b;
        }

        for (let i = 0; i < this.items.length; i++) {
            if (eq(this.items[i].item, item)) {
                this.items.splice(i, 1);
                return true; // Indicate that the item was found and removed
            }
        }
        return false; // Indicate that the item was not found
    }
}
