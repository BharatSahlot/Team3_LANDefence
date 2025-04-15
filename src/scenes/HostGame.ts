import Phaser from 'phaser';
import { netMan } from '../lib/NetworkManager';

export class HostGame extends Phaser.Scene {
    private playerTexts: Phaser.GameObjects.Text[] = [];
    private peerIdText!: Phaser.GameObjects.Text;
    private playerListYStart = 200;

    constructor() {
        super('HostGame');
    }

    preload() {
        this.load.image('bg', 'public/assets/bg_1.jpeg');
        this.load.image('logo', 'public/assets/logo_1.png');
        this.load.image('bk', 'public/assets/bk.png');
        this.load.image('sg', 'public/assets/sg.png');
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

        // Peer ID display
        this.peerIdText = this.add.text(centerX, centerY * 1, 'Your ID: <waiting...>', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#00ffcc',
        }).setOrigin(0.5);

        // Update with real ID when ready
        netMan.host().then(id => {
            console.log(`Hosting as: ${id}`);
            this.peerIdText.setText(`Your ID: ${id}`);
        });

        // Player list header
        this.add.text(centerX, centerY * 0.8, 'Players Joined:', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Listen for new player connections
        netMan.on('update-player-list', players => {
            this.updatePlayerList(players);
        });

        // Start Game Button
        const startButton = this.add.image(centerX - 50, centerY * 1.5, 'sg').setOrigin(0.5).setInteractive();
        startButton.setScale(0.5);

        startButton.on('pointerdown', () => {
            this.scene.start('Game'); // Replace with your game scene
        });

        startButton.on('pointerover', () => startButton.setStyle({ backgroundColor: '#0099cc' }));
        startButton.on('pointerout', () => startButton.setStyle({ backgroundColor: '#0077aa' }));
    }

    private updatePlayerList(players: string[]) {
        // Remove previous text
        this.playerTexts.forEach(p => p.destroy());
        this.playerTexts = [];

        players.forEach((name, i) => {
            const text = this.add.text(100, this.playerListYStart + i * 40, name, {
                fontFamily: 'Courier',
                fontSize: '20px',
                color: '#ffffff',
            });
            this.playerTexts.push(text);
        });
    }
}
