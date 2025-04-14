import { Scene } from "phaser";
import { InputManager } from "../controls/InputManager";

export class BaseScene extends Scene
{
    public inputManager: InputManager;

    constructor(name: string) {
        super(name);

        this.inputManager = new InputManager(this);
    }
}
