import { InputManager } from "../../controls/InputManager";
import { BaseBullet } from "../Actors/BaseBullet";
import { Behaviour } from "../Behaviour";
import { Transform } from "./Transform";

export class BasicGun extends Behaviour {
    public delayBetweenShots = 1000;

    private timeSinceLastShot = 0;
    
    protected transform!: Transform;

    protected inputManager!: InputManager;

    private camera: Phaser.Cameras.Scene2D.Camera;

    onStart() {
        let transform = this.object.getComponent(Transform);
        if(!transform) {
            console.error("Image renderer could not find a transform component");
            return;
        }

        this.transform = transform;

        this.camera = this.object.getScene().cameras.main;
    }

    onTick(delta: number) {
        this.timeSinceLastShot += delta;
        if(this.timeSinceLastShot > this.delayBetweenShots) {
            this.shot();
            this.timeSinceLastShot = 0;
        }
    }

    protected shot() {
        const pos = this.transform.position.clone();

        const pointerPos = this.object.getScene().inputManager.pointerAim.clone();

        const worldPoint = this.camera.getWorldPoint(pointerPos.x, pointerPos.y);

        const dir = worldPoint.clone().subtract(pos).normalize();

        const bullet = new BaseBullet(this.object.getScene());
        this.object.getScene().addObjectToScene(bullet);
        bullet.fire(pos, dir);
    }
}
