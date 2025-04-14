import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        // You can load fonts or UI assets here
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Game Title
        const title = this.add.text(centerX, 120, 'LAN Defense', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#ffffff',
        });
        title.setOrigin(0.5);

        // Host Button
        const hostButton = this.add.text(centerX, centerY - 40, 'Host Game', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        // Join Button
        const joinButton = this.add.text(centerX, centerY + 40, 'Join Game', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        // Settings Button
        const settingsButton = this.add.text(centerX, centerY + 140, 'Settings', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#dddddd',
            backgroundColor: '#222',
            padding: { x: 15, y: 8 },
        }).setOrigin(0.5).setInteractive();

        // Button Interactions
        hostButton.on('pointerdown', () => {
            this.scene.start('HostGame');
        });

        joinButton.on('pointerdown', () => {
            this.scene.start('JoinGame');
        });

        settingsButton.on('pointerdown', () => {
            this.scene.start('Settings');
        });

        // Optional hover effects
        [hostButton, joinButton, settingsButton].forEach(btn => {
            btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#666' }));
            btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#444' }));
        });
    }
}
