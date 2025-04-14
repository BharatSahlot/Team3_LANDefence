import { Scene } from "phaser";
import { SceneObject } from "../SceneObject";
import { Transform } from "../Behaviours/Transform";
import { SpriteRenderer } from "../Behaviours/SpriteRenderer";
import { InputManager } from "../../controls/InputManager";

import { ISerializable } from "../ISerializable";
import { netMan } from "../NetworkManager";
import { gameEvents } from "../GameEvents";

export class Player extends SceneObject implements ISerializable {
    public speed: number = 5;

    public transform: Transform;
    
    private sprite: SpriteRenderer;

    private currentSpeed: Phaser.Math.Vector2;
    private inputManager: InputManager
    private isNetworkControlled: boolean = false;

    private position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

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

        if(this.peerId == netMan.getPeerId()) 
        {
            this.inputManager = new InputManager(this.scene);
        }

        super.onStart();
    }

    public onTick(): void {
        this.currentSpeed = this.inputManager?.movement.clone();

        if(!this.isNetworkControlled) {
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
