import { Behaviour } from "../Behaviour";
import { SceneObject } from "../SceneObject";
import { Transform } from "./Transform";

export class CameraController extends Behaviour {
    private camera: Phaser.Cameras.Scene2D.Camera;
    private target: Transform | undefined;

    constructor(object: SceneObject) {
        super(object);
    }

    onStart(): void {
        this.camera = this.object.getScene().cameras.main;
        this.target = this.object.getComponent(Transform);

        if(!this.camera) {
            console.warn("no main camera in scene");
        }
    }

    onTick(): void {
        if (!this.camera || !this.target) return;

        this.camera.centerOn(this.target.position.x, this.target.position.y);
    }
}
