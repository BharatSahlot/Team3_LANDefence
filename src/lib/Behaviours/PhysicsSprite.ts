import { Behaviour } from "../Behaviour";
import { SceneObject } from "../SceneObject";
import { Transform } from "./Transform";

export class PhysicsSprite extends Behaviour {
    private imgTag: string;
    private sprite: Phaser.Physics.Arcade.Sprite | null;

    private transform: Transform;

    public anims: Phaser.Animations.AnimationState | null;

    private groupName: string;

    public onCollisionCB: (other: SceneObject) => void;

    constructor(object: SceneObject, img: string, group: string) {
        super(object);

        this.imgTag = img;

        this.groupName = group;
    }

    public onStart() {
        let transform = this.object.getComponent(Transform);
        if(!transform) {
            console.error("Sprite renderer could not find a transform component");
            return;
        }

        this.transform = transform;

        const group = this.object.getScene().physicsManager.getLayerByName(this.groupName);
        if(!group) return;

        this.sprite = group.create(transform.position.x, transform.position.y, this.imgTag);
        if(!this.sprite) return;

        this.sprite.setName(this.imgTag);
        this.sprite.setScale(this.transform.scale.x, this.transform.scale.y);
        this.sprite.setRotation(this.transform.rotation);
        this.sprite.setDepth(100);

        this.sprite.setData('sceneObject', this.object);

        this.anims = this.sprite.anims;

        this.object.getScene().physicsManager.createCollider(this.groupName, this.sprite, this.onCollision.bind(this));
    }

    // do after other components are done updating transform
    public onLateTick() {
        this.sprite?.setPosition(this.transform.position.x, this.transform.position.y);
        this.sprite?.setScale(this.transform.scale.x, this.transform.scale.y);
        this.sprite?.setRotation(this.transform.rotation);
    }

    public onDestroy() {
        this.sprite?.destroy();
    }

    private onCollision(_: SceneObject, objB: SceneObject) {
        if(this.onCollisionCB) this.onCollisionCB(objB);
    }
}
