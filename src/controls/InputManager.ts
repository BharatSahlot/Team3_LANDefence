import { KeyboardControls } from "./KeyboardControls";
import { GamepadControls } from "./GamepadControls";
import Phaser from "phaser";

export class InputManager {
    private keyboardControls: KeyboardControls;
    private gamepadControls: GamepadControls | null = null;

    // Constructor initializes both keyboard and gamepad controls
    constructor(scene: Phaser.Scene) {
        this.keyboardControls = new KeyboardControls(scene);

        // Listen for gamepad connection and disconnection
        scene.input.gamepad?.on("connected", (pad: Phaser.Input.Gamepad.Gamepad) => {
            this.gamepadControls = new GamepadControls(scene);
            console.log("Gamepad connected:", pad);
        });

        scene.input.gamepad?.on("disconnected", () => {
            console.log("Gamepad disconnected.");
            this.gamepadControls = null; // Clear the gamepad controls when disconnected
        });
    }

    // Get movement based on both keyboard and gamepad
    get movement(): Phaser.Math.Vector2 {
        let movement = this.keyboardControls.getMovement();

        if (this.gamepadControls) {
            movement = movement.add(this.gamepadControls.getMovement());
        }

        return movement.normalize(); // Normalize to avoid faster movement on diagonals
    }

    // Get pointer position (keyboard/mouse uses mouse, gamepad uses left stick)
    get pointerPosition(): Phaser.Math.Vector2 {
        if (this.gamepadControls) {
            return this.gamepadControls.getPointerPosition(); // Gamepad uses right stick for aiming
        } else {
            return this.keyboardControls.getPointerPosition(); // Keyboard/mouse uses mouse for pointer position
        }
    }

    // Get pointer aim (keyboard/mouse uses mouse, gamepad uses right stick)
    get pointerAim(): Phaser.Math.Vector2 {
        if (this.gamepadControls) {
            return this.gamepadControls.getPointerAim(); // Gamepad uses right stick for aiming
        } else {
            return this.keyboardControls.getPointerAim(); // Keyboard/mouse uses mouse for aiming
        }
    }

    // Check if the 'use item' action has been triggered (E for keyboard, A for gamepad)
    get useItem(): boolean {
        if (this.gamepadControls) {
            return this.gamepadControls.isUseItemPressed(); // Gamepad button (A) for using item
        } else {
            return this.keyboardControls.isUseItemPressed(); // Keyboard (E) for using item
        }
    }

    // Get the currently selected item index (1, 2, 3, etc.)
    get selectedItemIndex(): number {
        if (this.gamepadControls) {
            return this.gamepadControls.getSelectedItemIndex(); // Gamepad uses DPad or left stick for selection
        } else {
            return this.keyboardControls.getSelectedItemIndex(); // Keyboard uses numbers for selection
        }
    }

    get isPausePressed(): boolean {
        return (this.keyboardControls.isPausePressed() || this.gamepadControls?.isPausePressed()) ?? false;
    }
}
