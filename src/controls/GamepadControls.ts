// /controls/GamepadControls.ts
import Phaser from "phaser";
import { IControls } from "./IControls";

export class GamepadControls implements IControls {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public getDirection(): Phaser.Math.Vector2 {
    // Create a zero vector to return in case no gamepad is connected.
    const direction = new Phaser.Math.Vector2(0, 0);

    // Ensure the gamepad plugin is available.
    if (!this.scene.input.gamepad) {
      return direction;
    }

    // Retrieve the first connected gamepad.
    const pad = this.scene.input.gamepad.getPad(0);
    if (!pad) {
      return direction;
    }

    // Retrieve the left analog stick values.
    // Typically, axes[0] is the horizontal axis and axes[1] is the vertical axis.
    const x = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
    const y = pad.axes.length > 1 ? pad.axes[1].getValue() : 0;

    direction.set(x, y);

    // Optionally, apply a deadzone threshold to avoid drift.
    const DEADZONE = 0.2;
    if (direction.length() < DEADZONE) {
      direction.set(0, 0);
    } else {
      direction.normalize();
    }

    return direction;
  }
}
