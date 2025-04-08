import { Behaviour } from "../Behaviour";
import { SceneObject } from "../SceneObject";
import { Transform } from "./Transform";

export class SpriteRenderer extends Behaviour {
    private imgTag: string;
    private sprite: Phaser.GameObjects.Sprite | null;

    private transform: Transform;

    constructor(object: SceneObject, img: string) {
        super(object);

        this.imgTag = img;
    }

    public onStart() {
        let transform = this.object.getComponent(Transform);
        if(!transform) {
            console.error("Sprite renderer could not find a transform component");
            return;
        }

        this.transform = transform;

        this.sprite = this.object.getScene().add.sprite(transform.position.x, transform.position.y, this.imgTag);
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
