import { SceneObject } from "./SceneObject";

export abstract class Behaviour {
    public object: SceneObject;

    constructor(object: SceneObject) {
        this.object = object;
    }

    // function called after the object is loaded into the scene
    onStart?(): void;

    // called every frame
    onTick?(): void;

    // called every frame after all onTick are called
    onLateTick?(): void;

    // called when this object is destroyed, can be due to scene un load also
    onDestroy?(): void;
}
