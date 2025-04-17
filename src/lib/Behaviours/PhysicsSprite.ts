import { Behaviour } from "../Behaviour";
import { SceneObject } from "../SceneObject";
import { Transform } from "./Transform";

export class PhysicsSprite extends Behaviour {
    private imgTag: string;
    private sprite: Phaser.GameObjects.Sprite | null;

    private transform: Transform;

    public anims: Phaser.Animations.AnimationState | null;

    private group: Phaser.Physics.Arcade.Group;

    constructor(object: SceneObject, img: string, group: Phaser.Physics.Arcade.Group) {
        super(object);

        this.imgTag = img;

        this.group = group;
    }

    public onStart() {
        let transform = this.object.getComponent(Transform);
        if(!transform) {
            console.error("Sprite renderer could not find a transform component");
            return;
        }

        this.transform = transform;

        this.sprite = this.group.create(transform.position.x, transform.position.y, this.imgTag);
        if(!this.sprite) return;

        this.sprite.setScale(this.transform.scale.x, this.transform.scale.y);
        this.sprite.setRotation(this.transform.rotation);
        this.sprite.setDepth(100);

        this.anims = this.sprite.anims;
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
}
