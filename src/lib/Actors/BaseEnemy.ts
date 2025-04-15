import { Math } from "phaser";
import { BaseScene } from "../BaseScene";
import { SpriteRenderer } from "../Behaviours/SpriteRenderer";
import { Transform } from "../Behaviours/Transform";
import { ISerializable } from "../ISerializable";
import { netMan } from "../NetworkManager";
import { SceneObject } from "../SceneObject";

export class BaseEnemy extends SceneObject implements ISerializable {
    protected currentAnim = "idle";

    protected sprite: SpriteRenderer;
    protected target = new Phaser.Math.Vector2(200, 200);

    private spriteTag: string;

    public transform: Transform;
    
    public speed: number = 0.2;

    constructor(scene: BaseScene, sprite: string) {
        super(scene);

        this.transform = new Transform(this);

        this.transform.position = new Phaser.Math.Vector2(
            Phaser.Math.Between(0, 1000),
            Phaser.Math.Between(1000, 1200)
        );
        if(Phaser.Math.Between(-1, 1) < 0) 
            this.transform.position.x *= -1;

        if(Phaser.Math.Between(-1, 1) < 0) 
            this.transform.position.y *= -1;

        this.transform.scale = new Phaser.Math.Vector2(2, 2);
        this.addBehaviour(this.transform);

        this.spriteTag = sprite;
        this.sprite = new SpriteRenderer(this, sprite);
        this.addBehaviour(this.sprite);
    }

    public onTick(delta: number): void {
        super.onTick(delta);

        if(netMan.isHosting()) {
            this.moveToTarget(delta);
            this.playCorrectAnim();
        }
    }

    protected moveToTarget(delta: number): void {
        const distance = this.transform.position.distance(this.target);
        if(distance > 1) {
            let dir = this.target.subtract(this.transform.position).normalize();

            let maxDist = this.speed * delta;
            if(maxDist > distance) maxDist = distance;

            let newPos = this.transform.position.add(dir.scale(maxDist));

            this.transform.position = newPos;
        }
    }

    protected playCorrectAnim(): void {

    }

    public getType(): string {
        return "BaseEnemy";
    }

    public serialize() {
        return {
            sprite: this.spriteTag,
            anim: this.currentAnim
        };
    }

    deserialize(data: any): void {
        if(this.spriteTag != data.sprite) {
            if(this.sprite) this.sprite.onDestroy();

            this.sprite = new SpriteRenderer(this, data.sprite);
        }
        this.currentAnim = data.anim;
    }
}
