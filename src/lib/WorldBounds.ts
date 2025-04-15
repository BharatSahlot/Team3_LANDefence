export class WorldBounds {
    public minX: number;
    public maxX: number;
    public minY: number;
    public maxY: number;

    constructor(minX: number, maxX: number, minY: number, maxY: number) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    /**
        * Clamps a Vector2 within the defined world bounds.
        * @param vector The Vector2 to clamp.
        * @returns The clamped Vector2.
        */
    clamp(vector: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        let x = vector.x;
        let y = vector.y;

        if (x < this.minX) {
            x = this.minX;
        } else if (x > this.maxX) {
            x = this.maxX;
        }

        if (y < this.minY) {
            y = this.minY;
        } else if (y > this.maxY) {
            y = this.maxY;
        }

        return new Phaser.Math.Vector2(x, y);
    }
}

export const worldBounds = new WorldBounds(-1100, 1100, -1100, 1100);
