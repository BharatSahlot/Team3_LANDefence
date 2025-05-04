import { BaseScene } from "./BaseScene";
import { SceneObject } from "./SceneObject";

export type CollisionCBType = (objA: SceneObject, objB: SceneObject) => void;

type CollisionObjectType = Phaser.Types.Physics.Arcade.GameObjectWithBody|Phaser.Physics.Arcade.Body|Phaser.Tilemaps.Tile;

export class PhysicsManager {
    private scene: BaseScene;
    private layers: Map<string, Phaser.Physics.Arcade.Group>;
    private collisionMatrix: Map<string, Map<string, boolean>>;

    constructor(scene: BaseScene) {
        this.scene = scene;
        this.layers = new Map<string, Phaser.Physics.Arcade.Group>();
        this.collisionMatrix = new Map<string, Map<string, boolean>>();

        this.layers.set('enemy', this.scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            runChildUpdate: true
        }));

        this.layers.set('bullet', this.scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            runChildUpdate: true
        }));

        this.layers.forEach((_, layerName) => {
            this.collisionMatrix.set(layerName, new Map<string, boolean>());
            this.layers.forEach((_, innerLayerName) => {
                if(layerName == innerLayerName) return;

                this.enableCollisionBetweenLayers(layerName, innerLayerName);
            });
        });
    }

    public enable(): void {}
    public disable(): void {}

    public getLayerByName(name: string): Phaser.Physics.Arcade.Group | undefined {
        return this.layers.get(name);
    }

    public createCollider(layerName: string, obj: Phaser.GameObjects.GameObject, cb: CollisionCBType) {
        const layer = this.getLayerByName(layerName);
        if(!layer) return;

        this.layers.forEach((otherLayer, otherLayerName) => {
            if(!this.canCollideWith(layerName, otherLayerName)) return;

            this.scene.physics.world.addOverlap(obj, otherLayer, this.collisionHandlerCB(cb), () => true, this);
        });
    }

    public canCollideWith(layerA: string, layerB: string) : boolean {
        if(this.collisionMatrix.get(layerA)?.get(layerB))
            return true;

        return false;
    }

    public enableCollisionBetweenLayers(a: string, b: string) {
        const layerA = this.getLayerByName(a);
        const layerB = this.getLayerByName(b);

        if(!layerA || !layerB) return;

        this.collisionMatrix.get(a)?.set(b, true);
        this.collisionMatrix.get(b)?.set(a, true);
    }

    public disableCollisionBetweenLayers(a: string, b: string) {
        this.collisionMatrix.get(a)?.set(b, false);
        this.collisionMatrix.get(b)?.set(a, false);
    }

    private collisionHandlerCB(_cb: CollisionCBType) : (bodyA: any, bodyB: any) => void {
        const cb = _cb;
        return (bodyA: CollisionObjectType, bodyB: CollisionObjectType) => {
            let objA: SceneObject|undefined;
            let objB: SceneObject|undefined;

            if(bodyA instanceof Phaser.Physics.Arcade.Body){
                objA = bodyA.gameObject?.getData('sceneObject') as SceneObject;
            } else {
                objA = (bodyA as Phaser.GameObjects.GameObject).getData('sceneObject') as SceneObject;
            }

            if(bodyB instanceof Phaser.Physics.Arcade.Body){
                objB = bodyB.gameObject?.getData('sceneObject') as SceneObject;
            } else {
                objB = (bodyB as Phaser.GameObjects.GameObject)?.getData('sceneObject') as SceneObject;
            }

            if(objA && objB)
                cb(objA, objB);
        };
    }
}
