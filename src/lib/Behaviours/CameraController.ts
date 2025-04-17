import { Behaviour } from "../Behaviour";
import { SceneObject } from "../SceneObject";
import { worldBounds } from "../WorldBounds";
import { Transform } from "./Transform";

export class CameraController extends Behaviour {
    private camera: Phaser.Cameras.Scene2D.Camera;
    private target: Transform | undefined;
    private cameraWidth: number;
    private cameraHeight: number;

    constructor(object: SceneObject) {
        super(object);
    }

    onStart(): void {
        this.camera = this.object.getScene().cameras.main;
        this.target = this.object.getComponent(Transform);

        if(!this.camera) {
            console.warn("no main camera in scene");
        }

        this.cameraWidth = this.camera.width;
        this.cameraHeight = this.camera.height;
    }

    onTick(_: number): void {
        if (!this.camera || !this.target) return;

        const minX = worldBounds.minX + this.cameraWidth / 2;
        const maxX = worldBounds.maxX - this.cameraWidth / 2;
        const minY = worldBounds.minY + this.cameraHeight / 2;
        const maxY = worldBounds.maxY - this.cameraHeight / 2;

        // Clamp target position to camera boundaries
        let targetX = this.target.position.x;
        let targetY = this.target.position.y;

        targetX = Phaser.Math.Clamp(targetX, minX - 10, maxX + 10);
        targetY = Phaser.Math.Clamp(targetY, minY - 10, maxY + 10);

        this.camera.centerOn(targetX, targetY);
    }
}
