import { Map } from './Map';
import { Tile } from './Tile';
import { Heap } from 'heap-js';

type TargetSource = {
    tile: Tile;
    priority: number; // lower = more important
};

const heapComparator = (a: TargetSource, b: TargetSource) => {
    return a.priority - b.priority;
};

export class TargetFlowField {
    private map: Map;

    public refreshDelay = 1000;

    private timeSinceLastRefresh = 0;

    private firstRefresh = false;

    private ri = 0;

    constructor(map: Map) {
        this.map = map;
    }

    public refresh(delta: number) {
        this.timeSinceLastRefresh += delta;

        if(!this.firstRefresh && this.timeSinceLastRefresh < this.refreshDelay) return;

        this.firstRefresh = false;
        const sources: TargetSource[] = [];

        const cTile = this.map.getTileAtWorldPos(0, 0);
        if(cTile) {
            sources.push({ tile: cTile, priority: 0 });
        }

        for (const row of this.map.tiles) {
            for(const tile of row) {
                // TODO: dont hardcode this priority here
                if (tile.occupiedBy?.occupantType === 'player' || tile.occupiedBy?.occupantType === 'building') {
                    sources.push({ tile, priority: 2 }); // higher = less attractive
                }
            }
        }
        this.computeFlowField(sources);

        this.timeSinceLastRefresh = 0;
    }

    private computeFlowField(sources: TargetSource[]) {
        this.ri++;
        // Reset tiles
        for (const row of this.map.tiles) {
            for (const tile of row) {
                tile.distance = Infinity;
                tile.nextTargetTile = null;
            }
        }

        const pq = new Heap(heapComparator);

        for (const src of sources) {
            src.tile.distance = 0;
            pq.push({ tile: src.tile, priority: src.priority });
        }

        while (!pq.isEmpty()) {
            const current = pq.pop()!;
            const currentDist = current.priority;

            for (const neighbor of this.map.getNeighbors(current.tile)) {

                if (neighbor.isOccupied()) continue;

                const newDist = currentDist + 1;

                if (newDist < neighbor.distance) {
                    neighbor.distance = newDist;
                    neighbor.nextTargetTile = current.tile;

                    pq.push({ tile: neighbor, priority: newDist })
                }
            }
        }
    }
}
