import { Tile } from "./Tile";

export class Map {
    tilesetWidth: number;
    tilesetHeight: number;
    tileSize: number;
    topLeftX: number;
    topLeftY: number;
    tiles: Tile[][];

    constructor(tilesetWidth: number, tilesetHeight: number, tileSize: number, topLeftX: number, topLeftY: number) {
        this.tilesetWidth = tilesetWidth;
        this.tilesetHeight = tilesetHeight;
        this.tileSize = tileSize;
        this.topLeftX = topLeftX;
        this.topLeftY = topLeftY;
        this.tiles = [];

        this.initializeTiles();
    }

    private initializeTiles() {
        for (let y = 0; y < this.tilesetHeight; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.tilesetWidth; x++) {
                const worldX = this.topLeftX + x * this.tileSize;
                const worldY = this.topLeftY + y * this.tileSize;
                this.tiles[y][x] = new Tile(worldX, worldY, this.tileSize);
            }
        }
    }

    getWorldPositionToTile(x: number, y: number): { x: number, y: number } | null {
        const tileX = Math.floor((x - this.topLeftX) / this.tileSize);
        const tileY = Math.floor((y - this.topLeftY) / this.tileSize);

        if (tileX >= 0 && tileX < this.tilesetWidth && tileY >= 0 && tileY < this.tilesetHeight) {
            return { x: tileX, y: tileY };
        }

        return null;
    }

    getTileAt(x: number, y: number): Tile | null {
        if (x >= 0 && x < this.tilesetWidth && y >= 0 && y < this.tilesetHeight) {
            return this.tiles[y][x];
        }
        return null;
    }

    isValid(x: number, y: number): boolean {
        return (x >= 0 && x < this.tilesetWidth && y >= 0 && y < this.tilesetHeight);
    }

    getTileAtWorldPos(x: number, y: number): Tile | null {
        const pos = this.getWorldPositionToTile(x, y);
        if(pos) return this.getTileAt(pos.x, pos.y);
        return null;
    }

    public getNeighbors(tile: Tile): Tile[] {
        const { x, y } = tile;
        const neighbors: Tile[] = [];
        const deltas = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
        ];

        for (const { dx, dy } of deltas) {
            const nx = x + dx;
            const ny = y + dy;
            if (this.isValid(nx, ny)) {
                const tile = this.getTileAt(nx, ny);
                if(tile) neighbors.push(tile);
            }
        }

        return neighbors;
    }
}
