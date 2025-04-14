export interface IControls {
    getMovement(): Phaser.Math.Vector2;
    getPointerPosition(): Phaser.Math.Vector2;
    getPointerAim(): Phaser.Math.Vector2;
    isUseItemPressed(): boolean;
    getSelectedItemIndex(): number;
  }