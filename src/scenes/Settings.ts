import Phaser from 'phaser';
import { globalAudio } from '../lib/AudioManager';
import { globalVersions } from '../lib/Versions';

export class Settings extends Phaser.Scene {
    private masterText!: Phaser.GameObjects.Text;
    private musicText!: Phaser.GameObjects.Text;
    private fxText!: Phaser.GameObjects.Text;

    // Slider DOM elements for each volume control
    private masterSlider!: Phaser.GameObjects.DOMElement;
    private musicSlider!: Phaser.GameObjects.DOMElement;
    private fxSlider!: Phaser.GameObjects.DOMElement;

    constructor() {
        super('Settings');
    }

    preload() {
        this.load.image('logo', 'public/assets/logo_1.png');
        this.load.image('bk', 'public/assets/bk.png');
    }

    create() {
        const { width, height, centerX, centerY } = this.cameras.main;
        const margin = 20;

        // Top Logo
        const logo = this.add.image(centerX, margin + 80, 'logo')
            .setOrigin(0.5)
            .setScale(0.3);

        // Back Button (size unchanged)
        const backButton = this.add.image(margin + 80, margin + 40, 'bk')
            .setOrigin(0.5)
            .setScale(0.2)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        // ----------------------
        // Volume Options Box
        // ----------------------
        // Define the vertical spacing and starting y position for the volume controls
        const startY = centerY - 100;
        const spacing = 70;

        // Define box dimensions (you can adjust these values)
        const boxWidth = 440;
        // Calculate height: extra padding at the top and bottom of the slider groups
        const boxHeight = spacing * 2 + 80;
        const boxX = centerX - boxWidth / 2;
        const boxY = startY - 60; // include a top padding

        // // Draw a rectangle to frame the volume controls
        // const graphics = this.add.graphics();
        // graphics.lineStyle(2, 0xffffff, 1);
        // graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // ----------------------
        // Master Volume Controls
        // ----------------------
        this.masterText = this.add.text(centerX, startY, `Master Volume: ${globalAudio.masterVolume.toFixed(2)}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Horizontal slider for Master Volume
        this.masterSlider = this.add.dom(centerX, startY + 30, 'input', 
            'width: 300px; height: 20px; background: #ccc; border-radius: 4px; appearance: none;'
        ) as Phaser.GameObjects.DOMElement;
        // Set the input type to range with proper attributes
        (this.masterSlider.node as HTMLInputElement).setAttribute('type', 'range');
        (this.masterSlider.node as HTMLInputElement).setAttribute('min', '0');
        (this.masterSlider.node as HTMLInputElement).setAttribute('max', '1');
        (this.masterSlider.node as HTMLInputElement).setAttribute('step', '0.01');
        (this.masterSlider.node as HTMLInputElement).value = String(globalAudio.masterVolume);

        this.masterSlider.addListener('input');
        this.masterSlider.on('input', (event: any) => {
            const value = parseFloat(event.target.value);
            globalAudio.masterVolume = Phaser.Math.Clamp(value, 0, 1);
            this.updateVolumeTexts();
        });

        // ----------------------
        // Music Volume Controls
        // ----------------------
        this.musicText = this.add.text(centerX, startY + spacing, `Music Volume: ${globalAudio.musicVolume.toFixed(2)}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.musicSlider = this.add.dom(centerX, startY + spacing + 30, 'input', 
            'width: 300px; height: 20px; background: #ccc; border-radius: 4px; appearance: none;'
        ) as Phaser.GameObjects.DOMElement;
        (this.musicSlider.node as HTMLInputElement).setAttribute('type', 'range');
        (this.musicSlider.node as HTMLInputElement).setAttribute('min', '0');
        (this.musicSlider.node as HTMLInputElement).setAttribute('max', '1');
        (this.musicSlider.node as HTMLInputElement).setAttribute('step', '0.01');
        (this.musicSlider.node as HTMLInputElement).value = String(globalAudio.musicVolume);

        this.musicSlider.addListener('input');
        this.musicSlider.on('input', (event: any) => {
            const value = parseFloat(event.target.value);
            globalAudio.musicVolume = Phaser.Math.Clamp(value, 0, 1);
            this.updateVolumeTexts();
        });

        // ----------------------
        // FX Volume Controls
        // ----------------------
        this.fxText = this.add.text(centerX, startY + spacing * 2, `FX Volume: ${globalAudio.fxVolume.toFixed(2)}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.fxSlider = this.add.dom(centerX, startY + spacing * 2 + 30, 'input', 
            'width: 300px; height: 20px; background: #ccc; border-radius: 4px; appearance: none;'
        ) as Phaser.GameObjects.DOMElement;
        (this.fxSlider.node as HTMLInputElement).setAttribute('type', 'range');
        (this.fxSlider.node as HTMLInputElement).setAttribute('min', '0');
        (this.fxSlider.node as HTMLInputElement).setAttribute('max', '1');
        (this.fxSlider.node as HTMLInputElement).setAttribute('step', '0.01');
        (this.fxSlider.node as HTMLInputElement).value = String(globalAudio.fxVolume);

        this.fxSlider.addListener('input');
        this.fxSlider.on('input', (event: any) => {
            const value = parseFloat(event.target.value);
            globalAudio.fxVolume = Phaser.Math.Clamp(value, 0, 1);
            this.updateVolumeTexts();
        });

        // ----------------------
        // Game Version
        // ----------------------
        this.add.text(centerX, height - margin - 20, `Game Version: ${globalVersions.masterVersion}`, {
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
