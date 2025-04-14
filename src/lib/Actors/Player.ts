import { Scene } from "phaser";
import { SceneObject } from "../SceneObject";
import { Transform } from "../Behaviours/Transform";
import { SpriteRenderer } from "../Behaviours/SpriteRenderer";
import PlayerControls from "../../controls/PlayerControls";
import { KeyboardControls } from "../../controls/KeyboardControls";
import { IControls } from "../../controls/IControls";

export class Player extends SceneObject {
    public speed: number = 5;

    public transform: Transform;
    
    private sprite: SpriteRenderer;

    private currentSpeed: Phaser.Math.Vector2;

    // private readonly leftKey: Phaser.Input.Keyboard.Key | undefined;
    // private readonly rightKey: Phaser.Input.Keyboard.Key | undefined;
    // private readonly downKey: Phaser.Input.Keyboard.Key | undefined;
    // private readonly upKey: Phaser.Input.Keyboard.Key | undefined;

    private currentAnim: string = "idle";
    private controls: PlayerControls;
    
    constructor(scene: Scene) {
        super(scene);

        this.transform = new Transform(this);
        this.transform.position = new Phaser.Math.Vector2(64, 112);
        this.transform.scale = new Phaser.Math.Vector2(2, 2);
        this.addBehaviour(this.transform);

        this.sprite = new SpriteRenderer(this, "gold-knight");
        this.addBehaviour(this.sprite);
        
        this.controls = new PlayerControls(new KeyboardControls(scene));
        // this.leftKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        // this.rightKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // this.downKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // this.upKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    public onStart(): void {
        this.currentSpeed = new Phaser.Math.Vector2(0, 0);

        super.onStart();
    }

    public onTick(): void {

        const direction = this.controls.getDirection();
        if (direction.length() === 0){
            this.currentSpeed.x = this.currentSpeed.y = 0;
            this.sprite.anims?.pause();
        } else{
            if(direction.x < 0) {
                this.currentAnim = 'left';
                this.currentSpeed.x = -1;
            }
            if(direction.x > 0) {
                this.currentAnim = 'right';
                this.currentSpeed.x = 1;
            }
            if(direction.y < 0) {
                this.currentAnim = 'up';
                this.currentSpeed.y = -1;
            }
            if(direction.y > 0) {
                this.currentAnim = 'down';
                this.currentSpeed.y = 1;
            }
            this.sprite.anims?.play(this.currentAnim, true);
        }

        // this.currentSpeed.x = this.currentSpeed.y = 0;

        // if(this.leftKey?.isDown) this.currentSpeed.x -= 1;
        // if(this.rightKey?.isDown) this.currentSpeed.x += 1;
        // if(this.downKey?.isDown) this.currentSpeed.y += 1;
        // if(this.upKey?.isDown) this.currentSpeed.y -= 1;

        // this.currentSpeed.normalize();

        // if(this.currentSpeed.length() == 0) this.sprite.anims?.pause();

        // if(this.currentSpeed.x < 0) this.currentAnim = 'left';
        // if(this.currentSpeed.x > 0) this.currentAnim = 'right';
        // if(this.currentSpeed.y < 0) this.currentAnim = 'up';
        // if(this.currentSpeed.y > 0) this.currentAnim = 'down';

        // this.sprite.anims?.play(this.currentAnim, true);

        this.transform.position.x += this.currentSpeed.x * this.speed;
        this.transform.position.y += this.currentSpeed.y * this.speed;

        super.onTick();
    }
    public setControlStrategy(strategy: IControls) {
        this.controls.setStrategy(strategy);
    }
}
