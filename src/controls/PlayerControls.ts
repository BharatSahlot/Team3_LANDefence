import { IControls } from './IControls';
import Phaser from 'phaser';

class PlayerControls {
    private controlStrategy: IControls | null; // Updated to use IControls interface

    constructor(initialStrat: IControls) {
        this.controlStrategy = initialStrat;
    }

    public setStrategy(strategy: IControls) {
        this.controlStrategy = strategy;
    }

    public getDirection(): Phaser.Math.Vector2 {
        return this.controlStrategy!.getDirection();
    }
}

export default PlayerControls;