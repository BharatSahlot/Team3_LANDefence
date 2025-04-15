import { SceneObject } from "../SceneObject";
import { Transform } from "../Behaviours/Transform";
import { SpriteRenderer } from "../Behaviours/SpriteRenderer";
import { InputManager } from "../../controls/InputManager";

import { ISerializable } from "../ISerializable";
import { netMan } from "../NetworkManager";
import { gameEvents } from "../GameEvents";
import { BaseScene } from "../BaseScene";
import { CameraController } from "../Behaviours/CameraController";
import { worldBounds } from "../WorldBounds";

export class Player extends SceneObject implements ISerializable {
    public speed: number = 0.3;

    public transform: Transform;
    
    private sprite: SpriteRenderer;

    private currentSpeed: Phaser.Math.Vector2;
    private isNetworkControlled: boolean = false;

    private position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

    public peerId: string;
    constructor(scene: BaseScene, isNetworkControlled: boolean = false) {
        super(scene);
        
        this.isNetworkControlled = isNetworkControlled;

        this.transform = new Transform(this);
        this.transform.position = new Phaser.Math.Vector2(
            Phaser.Math.Between(-250, 250),
            Phaser.Math.Between(-250, 250)
        );
        this.position = this.transform.position;
        this.transform.scale = new Phaser.Math.Vector2(2, 2);
        this.addBehaviour(this.transform);

        this.sprite = new SpriteRenderer(this, "gold-knight");
        this.addBehaviour(this.sprite);
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

        if(this.peerId == netMan.getPeerId())
        {
            this.addBehaviour(new CameraController(this));
        }
    }

    public onTick(delta: number): void {
        this.currentSpeed = this.scene.inputManager?.movement.clone();

        if(!this.isNetworkControlled) {
            this.transform.position.x += this.currentSpeed.x * this.speed * delta;
            this.transform.position.y += this.currentSpeed.y * this.speed * delta;

            this.transform.position = worldBounds.clamp(this.transform.position);
        } else if(netMan.getPeerId() == this.peerId) {
            this.position.x += this.currentSpeed.x * this.speed * delta;
            this.position.y += this.currentSpeed.y * this.speed * delta;

            this.position = worldBounds.clamp(this.position);

            let x = this.position.x;
            let y = this.position.y;

            if(this.currentSpeed.x != 0 || this.currentSpeed.y != 0) gameEvents.emit('player-move', { x, y });
        }

        super.onTick(delta);
    }
}
