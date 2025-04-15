export class Tile {
    x: number;
    y: number;
    size: number;
    occupiedBy: string | null;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.occupiedBy = null;
    }

    occupy(objectName: string) {
        this.occupiedBy = objectName;
    }

    vacate() {
        this.occupiedBy = null;
    }
}

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
}
