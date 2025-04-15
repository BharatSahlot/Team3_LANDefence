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
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
         // Background
         this.add.image(this.scale.width / 2 + 220, this.scale.height / 2, 'bg').setOrigin(0.5, 0.5);

        //  // Game Title image logo
         const logo = this.add.image(centerX, 120, 'logo').setOrigin(0.5);
         logo.setScale(0.16);   


        // Back to main menu button (top-right corner)
        const backButton = this.add.image(250 , 30, 'bk')
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
        backButton.setScale(0.12); 

        // Peer ID display
        this.peerIdText = this.add.text(centerX, centerY - 150, 'Your ID: <waiting...>', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#00ffcc',
        }).setOrigin(0.5);

        // Update with real ID when ready
        netMan.host().then(id => {
            this.peerIdText.setText(`Your ID: ${id}`);
        });

        // Player list header
        this.add.text(centerX, centerY - 110, 'Players Joined:', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Listen for new player connections
        netMan.on('update-player-list', players => {
            this.updatePlayerList(players);
        });

        // Start Game Button
        const startButton = this.add.image(centerX, 550, 'sg').setOrigin(0.5).setInteractive();
        startButton.setScale(0.185);

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
