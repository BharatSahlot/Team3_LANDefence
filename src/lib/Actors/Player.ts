import { Scene } from "phaser";
import { SceneObject } from "../SceneObject";
import { Transform } from "../Behaviours/Transform";
import { SpriteRenderer } from "../Behaviours/SpriteRenderer";
import { ISerializable } from "../ISerializable";
import { netMan } from "../NetworkManager";
import { gameEvents } from "../GameEvents";

export class Player extends SceneObject implements ISerializable {
    public speed: number = 5;

    public transform: Transform;
    
    private sprite: SpriteRenderer;

    private currentSpeed: Phaser.Math.Vector2;

    private readonly leftKey: Phaser.Input.Keyboard.Key | undefined;
    private readonly rightKey: Phaser.Input.Keyboard.Key | undefined;
    private readonly downKey: Phaser.Input.Keyboard.Key | undefined;
    private readonly upKey: Phaser.Input.Keyboard.Key | undefined;

    private currentAnim: string = "idle";
    private isNetworkControlled: boolean = false;

    private position: Phaser.Math.Vector2;

    public peerId: string;
    
    constructor(scene: Scene, isNetworkControlled: boolean = false) {
        super(scene);
        
        this.isNetworkControlled = isNetworkControlled;

        this.transform = new Transform(this);
        this.transform.position = new Phaser.Math.Vector2(
            Phaser.Math.Between(400, 600),
            Phaser.Math.Between(200, 400)
        );
        this.position = this.transform.position;
        this.transform.scale = new Phaser.Math.Vector2(2, 2);
        this.addBehaviour(this.transform);

        this.sprite = new SpriteRenderer(this, "gold-knight");
        this.addBehaviour(this.sprite);

        this.leftKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.downKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.upKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    getType(): string {
        return 'Player';
    }

    public serialize(): any {
        return {
            peerId: this.peerId,
            enabled: true,
        };
    }

    public deserialize(data: any): void {
        this.peerId = data.peerId;
    }

    public onStart(): void {
        this.currentSpeed = new Phaser.Math.Vector2(0, 0);

        super.onStart();
    }

    public onTick(): void {
        this.currentSpeed.x = this.currentSpeed.y = 0;

        if(this.leftKey?.isDown) this.currentSpeed.x -= 1;
        if(this.rightKey?.isDown) this.currentSpeed.x += 1;
        if(this.downKey?.isDown) this.currentSpeed.y += 1;
        if(this.upKey?.isDown) this.currentSpeed.y -= 1;

        this.currentSpeed.normalize();

        if(this.currentSpeed.x < 0) this.currentAnim = 'left';
        if(this.currentSpeed.x > 0) this.currentAnim = 'right';
        if(this.currentSpeed.y < 0) this.currentAnim = 'up';
        if(this.currentSpeed.y > 0) this.currentAnim = 'down';

        if(!this.isNetworkControlled) {
            if(this.currentSpeed.length() == 0) this.sprite.anims?.pause();
            this.sprite.anims?.play(this.currentAnim, true);

            this.transform.position.x += this.currentSpeed.x * this.speed;
            this.transform.position.y += this.currentSpeed.y * this.speed;
        } else if(netMan.getPeerId() == this.peerId) {
            this.position.x += this.currentSpeed.x * this.speed;
            this.position.y += this.currentSpeed.y * this.speed;

            let x = this.position.x;
            let y = this.position.y;

            if(x != 0 || y != 0) gameEvents.emit('player-move', { x, y });
        }

        super.onTick();
    }
}
