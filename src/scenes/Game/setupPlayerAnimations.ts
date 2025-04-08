import { Game } from "../Game";

export function setupPlayerAnimations(this: Game) {
    this.anims.create({
        key: 'up',
        frames: [
            { key: 'gold-knight', frame: 1 },
            { key: 'gold-knight', frame: 5 },
            { key: 'gold-knight', frame: 9 },
            { key: 'gold-knight', frame: 13 },
            { key: 'gold-knight', frame: 17 },
        ],
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: [
            { key: 'gold-knight', frame: 2 },
            { key: 'gold-knight', frame: 6 },
            { key: 'gold-knight', frame: 10 },
            { key: 'gold-knight', frame: 14 },
            { key: 'gold-knight', frame: 18 },
        ],
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: [
            { key: 'gold-knight', frame: 3 },
            { key: 'gold-knight', frame: 7 },
            { key: 'gold-knight', frame: 11 },
            { key: 'gold-knight', frame: 15 },
            { key: 'gold-knight', frame: 19 },
        ],
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: [
            { key: 'gold-knight', frame: 4 },
            { key: 'gold-knight', frame: 8 },
            { key: 'gold-knight', frame: 12 },
            { key: 'gold-knight', frame: 16 },
            { key: 'gold-knight', frame: 20 },
        ],
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [
            { key: 'gold-knight', frame: 1 },
        ],
        frameRate: 5,
        repeat: -1
    });
}
