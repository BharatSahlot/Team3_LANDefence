import { IControls } from "./IControls";
export class KeyboardControls implements IControls {
    private keys: any;
    private pointer: Phaser.Input.Pointer;
  
    constructor(scene: Phaser.Scene) {
      this.keys = {
        W: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        E: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E), // For item use
        NUM1: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE), // For item selection
        NUM2: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
        NUM3: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
        NUM4: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
        ESC: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC), // For pausing the game
      };
      this.pointer = scene.input.activePointer;
    }

    isPausePressed(): boolean {
      return Phaser.Input.Keyboard.JustDown(this.keys.ESC);
    }
  
    getMovement(): Phaser.Math.Vector2 {
      const dir = new Phaser.Math.Vector2();
      if (this.keys.W?.isDown) dir.y -= 1;
      if (this.keys.S?.isDown) dir.y += 1;
      if (this.keys.A?.isDown) dir.x -= 1;
      if (this.keys.D?.isDown) dir.x += 1;
      return dir;
    }
  
    getPointerPosition(): Phaser.Math.Vector2 {
      return new Phaser.Math.Vector2(this.pointer.x, this.pointer.y);
    }
  
    getPointerAim(): Phaser.Math.Vector2 {
      return new Phaser.Math.Vector2(this.pointer.x, this.pointer.y); // Aim based on mouse
    }
  
    isUseItemPressed(): boolean {
      return this.keys.E?.isDown ?? false; // 'E' for using item
    }
  
    getSelectedItemIndex(): number {
      if (this.keys.NUM1?.isDown) return 0;
      if (this.keys.NUM2?.isDown) return 1;
      if (this.keys.NUM3?.isDown) return 2;
      if (this.keys.NUM4?.isDown) return 3;
      return -1; // No item selected
    }
  }
  