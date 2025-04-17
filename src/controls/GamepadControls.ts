import { IControls } from "./IControls";
import Phaser from "phaser";
export class GamepadControls implements IControls {
  private gamepad: Phaser.Input.Gamepad.Gamepad | null;

  constructor(scene: Phaser.Scene) {
    this.gamepad = scene.input.gamepad?.gamepads[0] || null;
  }

  isPausePressed(): boolean {
    if (this.gamepad) {
        return this.gamepad.buttons[9]?.pressed ?? false; // 'Start' button 
    }
    return false;
  }

  getMovement(): Phaser.Math.Vector2 {
    if (this.gamepad) {
      const leftStick = this.gamepad.leftStick;
      return new Phaser.Math.Vector2(leftStick.x, leftStick.y);
    }
    return new Phaser.Math.Vector2();
  }

  getPointerPosition(): Phaser.Math.Vector2 {
    if (this.gamepad) {
      const rightStick = this.gamepad.rightStick;
      return new Phaser.Math.Vector2(rightStick.x, rightStick.y); // Right stick for aiming
    }
    return new Phaser.Math.Vector2();
  }

  getPointerAim(): Phaser.Math.Vector2 {
    if (this.gamepad) {
      const rightStick = this.gamepad.rightStick;
      return new Phaser.Math.Vector2(rightStick.x, rightStick.y); // Right stick for aiming
    }
    return new Phaser.Math.Vector2();
  }

  isUseItemPressed(): boolean {
    if (this.gamepad) {
      return this.gamepad.A; // A button for using item
    }
    return false;
  }

  getSelectedItemIndex(): number {
    if (this.gamepad) {
      // Example: Use DPad for selection
      if (this.gamepad.pad.left) return 0;
      if (this.gamepad.pad.right) return 1;
      if (this.gamepad.pad.up) return 2;
      if (this.gamepad.pad.down) return 3;
    }
    return -1;
  }
}
