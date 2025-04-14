import { IControls } from "./IControls";
import Phaser from "phaser";

export class KeyboardControls implements IControls {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;

    constructor(scene: Phaser.Scene){
        this.cursors = scene.input.keyboard!.createCursorKeys();
    }

    getDirection(): Phaser.Math.Vector2 {
        const direction = new Phaser.Math.Vector2(0, 0);
        if (this.cursors) {
            if (this.cursors.left.isDown) {
                direction.x = -1;
            } else if (this.cursors.right.isDown) {
                direction.x = 1;
            }
            if (this.cursors.up.isDown) {
                direction.y = -1;
            } else if (this.cursors.down.isDown) {
                direction.y = 1;
            }
        }
        return direction.normalize();
    }
}