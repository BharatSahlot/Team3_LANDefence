import { BaseScene } from "../BaseScene";
import { SpriteRenderer } from "../Behaviours/SpriteRenderer";
import { Transform } from "../Behaviours/Transform";
import { ISerializable } from "../ISerializable";
import { netMan } from "../NetworkManager";
import { SceneObject } from "../SceneObject";
import { Map as GameMap } from "../Map/Map";
import { Game } from "../../scenes/Game";
import { EnemyManager } from "../EnemyManager";

export class BaseEnemy extends SceneObject implements ISerializable {
    protected currentAnim = "idle";

    protected sprite: SpriteRenderer;
    protected target: Transform | null = null;

    private spriteTag: string;

    public transform: Transform;
    
    public speed: number = 0.2;
    public distanceFromTarget: number = 70;
    
    protected targetReached: boolean = false;

    protected game!: Game;
    protected map!: GameMap;
    protected enemyManager!: EnemyManager;

    public delayBetweenTargetUpdate = 150;
    private timeSinceLastUpdate = 0;

    public randomSeparationForceMagnitude: number = 20;

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

        this.game = this.scene as Game;
        this.map = this.game.map;
        this.enemyManager = this.game.enemyManager;

        this.delayBetweenTargetUpdate += Math.random() * 100;
    }

    public onTick(delta: number): void {
        super.onTick(delta);

        if(netMan.isHosting()) {
            this.timeSinceLastUpdate += delta;
            if(this.timeSinceLastUpdate >= this.delayBetweenTargetUpdate) {
                let closestTarget = this.enemyManager.getClosestTarget(this.transform.position);
                this.target = closestTarget;
            }

            this.moveToTarget(delta);
            this.playCorrectAnim();
        }
    }


    protected getRandomSeparationForce(): Phaser.Math.Vector2 {
        let randomX = Phaser.Math.FloatBetween(-1, 1);
        let randomY = Phaser.Math.FloatBetween(-1, 1);
        return new Phaser.Math.Vector2(randomX, randomY).normalize().scale(this.randomSeparationForceMagnitude);
    }

    protected moveToTarget(delta: number): void {
        if(!this.target) return;

        const targetPos = this.target.position.clone();

        let dir = targetPos.clone().subtract(this.transform.position).normalize().scale(this.distanceFromTarget);

        const destination = targetPos.clone().subtract(dir);

        dir = destination.clone().subtract(this.transform.position);

        const distance = dir.lengthSq();

        let targetForce = new Phaser.Math.Vector2(0,0);

        if(distance > 1) {
            dir = dir.normalize();
            targetForce = dir;
        }

        let randomForce = this.enemyManager.calculateSeparationForce(this);

        // Combine target and random forces (adjust weights as needed)
        let finalForce = targetForce.add(randomForce.scale(3)); // Adjust 0.5 to control separation strength

        if(finalForce.lengthSq() > 0) {
            finalForce = finalForce.normalize();
        }

        let maxDist = this.speed * delta;
        let newPos = this.transform.position.add(finalForce.scale(maxDist));

        this.transform.position = newPos;
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
