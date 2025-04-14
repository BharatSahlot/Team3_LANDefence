import { Scene } from "phaser";
import { SceneObject } from "../SceneObject";
import { Transform } from "../Behaviours/Transform";
import { SpriteRenderer } from "../Behaviours/SpriteRenderer";
import { InputManager } from "../../controls/InputManager";

export class Player extends SceneObject {

    private inputManager: InputManager

    public speed: number = 5;

    public transform: Transform;
    
    private sprite: SpriteRenderer;

    private currentSpeed: Phaser.Math.Vector2;
    
    constructor(scene: Scene, inputManager: InputManager) {
        super(scene);

        this.inputManager = inputManager;
        this.transform = new Transform(this);
        this.transform.position = new Phaser.Math.Vector2(64, 112);
        this.transform.scale = new Phaser.Math.Vector2(2, 2);
        this.addBehaviour(this.transform);

        this.sprite = new SpriteRenderer(this, "gold-knight");
        this.addBehaviour(this.sprite);
    }

    public onStart(): void {
        this.currentSpeed = new Phaser.Math.Vector2(0, 0);

        super.onStart();
    }

    public onTick(): void {

        this.currentSpeed = this.inputManager.movement.clone();
        if (this.currentSpeed.length() === 0) {
            this.sprite.anims?.pause();  // Pause animation if no movement
            return;
        }
        
        // Play corresponding animation based on direction
        if (this.currentSpeed.x < 0) {
            this.sprite.anims?.play("left", true); // Moving left
          } else if (this.currentSpeed.x > 0) {
            this.sprite.anims?.play("right", true); // Moving right
          } else if (this.currentSpeed.y < 0) {
            this.sprite.anims?.play("up", true); // Moving up
          } else if (this.currentSpeed.y > 0) {
            this.sprite.anims?.play("down", true); // Moving down
        }

        this.transform.position.x += this.currentSpeed.x * this.speed;
        this.transform.position.y += this.currentSpeed.y * this.speed;

        super.onTick();
    }
}