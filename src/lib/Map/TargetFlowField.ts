import { Map } from './Map';
import { Tile } from './Tile';

type TargetSource = {
    tile: Tile;
    priority: number; // lower = more important
};

export class TargetFlowField {
    private map: Map;

    public refreshDelay = 500;

    private timeSinceLastRefresh = 0;

    constructor(map: Map) {
        this.map = map;
    }

    public refresh(delta: number) {
        this.timeSinceLastRefresh += delta;

        if(this.timeSinceLastRefresh < this.refreshDelay) return;

        const sources: TargetSource[] = [];

        const cTile = this.map.getTileAtWorldPos(0, 0);
        if(cTile) {
            sources.push({ tile: cTile, priority: 0 });
        }

        for (const row of this.map.tiles) {
            for(const tile of row) {
                // TODO: dont hardcode this priority here
                if (tile.occupiedBy?.occupantType === 'player' || tile.occupiedBy?.occupantType === 'building') {
                    sources.push({ tile, priority: 5 }); // higher = less attractive
                }
            }
        }
        this.computeFlowField(sources);

        this.timeSinceLastRefresh = 0;
    }

    private computeFlowField(sources: TargetSource[]) {
        // Reset tiles
        for (const row of this.map.tiles) {
            for (const tile of row) {
                tile.distance = Infinity;
                tile.nextTargetTile = null;
            }
        }

        // Min-heap style priority queue
        const queue: { tile: Tile; priority: number }[] = [];

        for (const src of sources) {
            src.tile.distance = src.priority;
            queue.push({ tile: src.tile, priority: src.priority });
        }

        queue.sort((a, b) => a.priority - b.priority);

        while (queue.length > 0) {
            const { tile: current } = queue.shift()!;
            const neighbors = this.map.getNeighbors(current);

            for (const neighbor of neighbors) {
                if (neighbor.isBlocked()) continue;

                const tentativeDist = current.distance + 1;

                if (tentativeDist < neighbor.distance) {
                    neighbor.distance = tentativeDist;
                    neighbor.nextTargetTile = current;
                    queue.push({ tile: neighbor, priority: tentativeDist });
                    queue.sort((a, b) => a.priority - b.priority); // keep sorted
                }
            }
        }
    }
}
