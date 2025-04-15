import Phaser from 'phaser';
import { globalAudio } from '../lib/AudioManager';

export class Settings extends Phaser.Scene {
    private masterText!: Phaser.GameObjects.Text;
    private musicText!: Phaser.GameObjects.Text;
    private fxText!: Phaser.GameObjects.Text;

    constructor() {
        super('Settings');
    }

    preload() {
        this.load.image('bg', 'public/assets/bg_1.jpeg');
        this.load.image('logo', 'public/assets/logo_1.png');
        this.load.image('bk', 'public/assets/bk.png');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Background
        this.add.image(this.scale.width / 2 + 220, this.scale.height / 2, 'bg').setOrigin(0.5, 0.5);

        // Top Logo
        const logo = this.add.image(centerX, 120, 'logo').setOrigin(0.5);
        logo.setScale(0.16);

        const backButton = this.add.image(250, 30, 'bk')
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        backButton.setScale(0.12);

        // Master Volume
        this.masterText = this.add.text(centerX, 300, `Master Volume: ${globalAudio.masterVolume.toFixed(2)}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Example: “+” button to increase volume
        const masterPlus = this.add.text(centerX + 200, 300, '+', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#00ff00',
            backgroundColor: '#000000'
        }).setOrigin(0.5).setInteractive();
        masterPlus.on('pointerdown', () => {
            globalAudio.masterVolume = Phaser.Math.Clamp(globalAudio.masterVolume + 0.1, 0, 1);
            this.updateVolumeTexts();
        });

        // Example: “-” button to decrease volume
        const masterMinus = this.add.text(centerX - 200, 300, '-', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ff0000',
            backgroundColor: '#000000'
        }).setOrigin(0.5).setInteractive();
        masterMinus.on('pointerdown', () => {
            globalAudio.masterVolume = Phaser.Math.Clamp(globalAudio.masterVolume - 0.1, 0, 1);
            this.updateVolumeTexts();
        });

        // Music Volume
        this.musicText = this.add.text(centerX, 370, `Music Volume: ${globalAudio.musicVolume.toFixed(2)}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // “+” button for music
        const musicPlus = this.add.text(centerX + 200, 370, '+', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#00ff00',
            backgroundColor: '#000000'
        }).setOrigin(0.5).setInteractive();
        musicPlus.on('pointerdown', () => {
            globalAudio.musicVolume = Phaser.Math.Clamp(globalAudio.musicVolume + 0.1, 0, 1);
            this.updateVolumeTexts();
        });

        // “-” button for music
        const musicMinus = this.add.text(centerX - 200, 370, '-', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ff0000',
            backgroundColor: '#000000'
        }).setOrigin(0.5).setInteractive();
        musicMinus.on('pointerdown', () => {
            globalAudio.musicVolume = Phaser.Math.Clamp(globalAudio.musicVolume - 0.1, 0, 1);
            this.updateVolumeTexts();
        });

        // FX Volume
        this.fxText = this.add.text(centerX, 440, `FX Volume: ${globalAudio.fxVolume.toFixed(2)}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // “+” button for FX
        const fxPlus = this.add.text(centerX + 200, 440, '+', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#00ff00',
            backgroundColor: '#000000'
        }).setOrigin(0.5).setInteractive();
        fxPlus.on('pointerdown', () => {
            globalAudio.fxVolume = Phaser.Math.Clamp(globalAudio.fxVolume + 0.1, 0, 1);
            this.updateVolumeTexts();
        });

        // “-” button for FX
        const fxMinus = this.add.text(centerX - 200, 440, '-', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ff0000',
            backgroundColor: '#000000'
        }).setOrigin(0.5).setInteractive();
        fxMinus.on('pointerdown', () => {
            globalAudio.fxVolume = Phaser.Math.Clamp(globalAudio.fxVolume - 0.1, 0, 1);
            this.updateVolumeTexts();
        });

        this.add.text(centerX, 520, 'Game Version: 1.0.0', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffff00'
        }).setOrigin(0.5);
    }

    private updateVolumeTexts(): void {
        this.masterText.setText(`Master Volume: ${globalAudio.masterVolume.toFixed(2)}`);
        this.musicText.setText(`Music Volume: ${globalAudio.musicVolume.toFixed(2)}`);
        this.fxText.setText(`FX Volume: ${globalAudio.fxVolume.toFixed(2)}`);
    }
}
