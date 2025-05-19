import { Scene } from "phaser";
import { InputManager } from "../controls/InputManager";
import { netMan } from "./NetworkManager";

export class BaseScene extends Scene
{
    public inputManager: InputManager;
    private isPaused = false;

    constructor(name: string) {
        super(name);
    }

    create() {
        this.inputManager = new InputManager(this);

        // Listen for pause input
        this.events.on('update', () => {
            if (this.inputManager.isPausePressed && !this.isPaused) {
                this.isPaused = true;
                this.scene.pause();
                this.scene.launch('PauseMenu');
                netMan.sendPauseState(true);
            }
        });

        // Reset pause state when game resumes
        this.events.on('resume-game', () => {
            this.isPaused = false;
        });

        // Network pause listener
        netMan.setupPauseListener((isPaused: boolean) => {
            this.isPaused = isPaused;
            if (isPaused) {
                this.scene.pause();
                this.scene.launch('PauseMenu');
            } else {
                this.scene.stop('PauseMenu');
                this.scene.resume();
            }
        });
    }
}
