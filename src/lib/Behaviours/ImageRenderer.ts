import { Behaviour } from "../Behaviour";
import { SceneObject } from "../SceneObject";
import { Transform } from "./Transform";

export class ImageRenderer extends Behaviour {
    private imgTag: string;
    private image: Phaser.GameObjects.Image | null;

    private transform: Transform;

    constructor(object: SceneObject, img: string) {
        super(object);

        this.imgTag = img;
    }

    public onStart() {
        let transform = this.object.getComponent(Transform);
        if(!transform) {
            console.error("Image renderer could not find a transform component");
            return;
        }

        this.transform = transform;

        this.image = this.object.getScene().add.image(transform.position.x, transform.position.y, this.imgTag);
        this.image.setScale(this.transform.scale.x, this.transform.scale.y);
        this.image.setRotation(this.transform.rotation);
        this.image.setDepth(100);
    }

    // do after other components are done updating transform
    public onLateTick() {
        this.image?.setPosition(this.transform.position.x, this.transform.position.y);
        this.image?.setScale(this.transform.scale.x, this.transform.scale.y);
        this.image?.setRotation(this.transform.rotation);
    }

    public onDestroy() {
        this.image?.destroy();
    }
}
