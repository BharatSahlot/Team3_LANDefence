import { BaseEnemy } from "./Actors/BaseEnemy";
import { BaseScene } from "./BaseScene";
import { Transform } from "./Behaviours/Transform";
import { Math as PhaserMath } from "phaser";

export class EnemyManager {
    private targets: Transform[] = [];
    private enemies: BaseEnemy[] = [];

    public separationDistance: number = 32;

    private scene: BaseScene;

    constructor(scene: BaseScene) {
        this.scene = scene;
    }

    public registerTarget(target: Transform): void {
        this.targets.push(target);
    }

    public registerEnemy(enemy: BaseEnemy): void {
        this.enemies.push(enemy);
    }

    public getClosestTarget(pos: Phaser.Math.Vector2): Transform | null {
        if (this.targets.length === 0) {
            return null;
        }

        let closestTarget: Transform | null = null;
        let closestDistance: number = Infinity;

        for (const target of this.targets) {
            const distance = PhaserMath.Distance.Between(pos.x, pos.y, target.position.x, target.position.y);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = target;
            }
        }

        return closestTarget;
    }

    public calculateSeparationForce(me: BaseEnemy): Phaser.Math.Vector2 {
        let separationForce = new Phaser.Math.Vector2(0, 0);
        let neighbors = 0;

        for (const enemy of this.enemies) {
            if (enemy instanceof BaseEnemy && enemy !== me) {
                const distance = Phaser.Math.Distance.Between(
                    me.transform.position.x,
                    me.transform.position.y,
                    enemy.transform.position.x,
                    enemy.transform.position.y
                );

                if (distance < this.separationDistance) {
                    let diff = me.transform.position.clone().subtract(enemy.transform.position);
                    diff = diff.normalize().divide(new Phaser.Math.Vector2(distance, distance)); // Weight by distance
                    separationForce.add(diff);
                    neighbors++;
                }
            }
        }

        if (neighbors > 0) {
            // separationForce.divide(new Phaser.Math.Vector2(neighbors, neighbors));
        }

        return separationForce;
    }
}
