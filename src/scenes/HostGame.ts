import Phaser from 'phaser';
import { netMan } from '../lib/NetworkManager';

export class HostGame extends Phaser.Scene {
    private playerTexts: Phaser.GameObjects.Text[] = [];
    private peerIdText!: Phaser.GameObjects.Text;
    private playerListYStart = 200;

    constructor() {
        super('HostGame');
    }

    create() {
        // Back to main menu button (top-right corner)
        const backButton = this.add.text(this.cameras.main.width - 30, 20, '← Back', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#333',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        })
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        const centerX = this.cameras.main.centerX;

        // Title
        this.add.text(centerX, 60, 'Host Game Lobby', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Peer ID display
        this.peerIdText = this.add.text(centerX, 120, 'Your ID: <waiting...>', {
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
        this.add.text(centerX, 160, 'Players Joined:', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Listen for new player connections
        netMan.on('update-player-list', players => {
            this.updatePlayerList(players);
        });

        // Start Game Button
        const startButton = this.add.text(centerX, 600, 'Start Game', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#0077aa',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

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
