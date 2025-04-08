import { Behaviour } from "../Behaviour";

export class Transform extends Behaviour {
    public position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    
    public scale: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 1);

    // only 1 axis(going towards screen) of rotation
    public rotation: number = 0;
}
