import { BaseScene } from "../BaseScene";
import { PhysicsSprite } from "../Behaviours/PhysicsSprite";
import { Transform } from "../Behaviours/Transform";
import { SceneObject } from "../SceneObject";

export class BaseBullet extends SceneObject {
    protected is_moving = false;
    protected start_pos: Phaser.Math.Vector2;
    protected move_dir: Phaser.Math.Vector2;

    protected transform: Transform;
    protected sprite: PhysicsSprite;

    public speed = 0.2;

    constructor(scene: BaseScene) {
        super(scene);

        this.transform = new Transform(this);
        this.addBehaviour(this.transform);

        this.sprite = new PhysicsSprite(this, 'arrow', "bullet");
        this.addBehaviour(this.sprite);
    }

    public fire(pos: Phaser.Math.Vector2, dir: Phaser.Math.Vector2) {
        this.is_moving = true;
        this.start_pos = pos.clone();
        this.move_dir = dir.clone();

        this.transform.position = pos.clone();

        let angle = Math.atan2(dir.y, dir.x) + Math.PI / 4; // Add PI/4 (45 degrees) to offset the arrow's initial tilt
        this.transform.rotation = angle;
    }

    onTick(delta: number) {
        if(this.is_moving) this.move(delta);

        super.onTick(delta);
    }

    protected move(delta: number) {
        let pos = this.transform.position.clone();
        let dir = this.move_dir.clone();
        dir.scale(delta * this.speed);

        pos.add(dir);

        this.transform.position = pos.clone();

        if(pos.x < -1500 || pos.x > 1500 || pos.y < -1500 || pos.y > 1500) {
            this.scene.removeObjectFromScene(this);
        }
    }
}
