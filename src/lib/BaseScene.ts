import { Scene } from "phaser";
import { InputManager } from "../controls/InputManager";
import { SceneObject } from "./SceneObject";

export class BaseScene extends Scene
{
    public inputManager: InputManager;

    protected objects: SceneObject[] = [];

    constructor(name: string) {
        super(name);
    }

    create() {
        this.inputManager = new InputManager(this);
    }

    public addObjectToScene(obj: SceneObject) {
        this.objects.push(obj);
        obj.onStart();
    }

    public removeObjectFromScene(obj: SceneObject) {
        let ind = this.objects.findIndex(_b => obj === _b);
        if(ind != -1) {
            this.objects.splice(ind, 1);
        }

        obj.onDestroy();
    }
}
