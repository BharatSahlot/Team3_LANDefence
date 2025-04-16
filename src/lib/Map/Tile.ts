import { IOccupiable } from "./IOccupiable";

export class Tile {
    x: number;
    y: number;
    size: number;
    occupiedBy: IOccupiable | null;
    distance: number = 5000;
    nextTargetTile: Tile | null;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.occupiedBy = null;
    }

    occupy(object: IOccupiable) {
        this.occupiedBy = object;
    }

    vacate() {
        this.occupiedBy = null;
    }

    isOccupied() {
        return this.occupiedBy != null;
    }

    isBlocked() {
        return this.isOccupied();
    }
}

