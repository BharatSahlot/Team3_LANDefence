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
        this.load.setPath('assets');
        this.load.image('healer', './classes/healer.png');
        this.load.image('attacker', './classes/attacker.png');
        this.load.image('engineer', './classes/engineer.png');
        this.load.image('tank', './classes/tank.png');
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

    private showClassSelectionPopup(playerId: string) {
        const popup = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
        const background = this.add.rectangle(0, 0, 500, 250, 0x000000, 0.9)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xffffff);
        popup.add(background);
    
        const classes = ['healer', 'attacker', 'engineer', 'tank'];
        const spacing = 110;
    
        classes.forEach((classKey, index) => {
            const xOffset = (index - 1.5) * spacing;
    
            const classContainer = this.add.container(xOffset, 0);
    
            const image = this.add.image(0, -30, classKey)
                .setDisplaySize(64, 64)
                .setInteractive({ useHandCursor: true });
    
            const label = this.add.text(0, 50, classKey.charAt(0).toUpperCase() + classKey.slice(1), {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff',
            }).setOrigin(0.5);
    
            image.on('pointerdown', () => {
                popup.destroy();
    
                // Send class selection to NetworkManager
                netMan.selectClass(playerId, classKey);
                // Notify others
                netMan.send({ type: 'select-class', payload: { playerId, className: classKey } });
            });
    
            classContainer.add([image, label]);
            popup.add(classContainer);
        });
    
        // Close Button
        const closeButton = this.add.text(0, -90, 'Close', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#ff0000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
        closeButton.on('pointerdown', () => {
            popup.destroy(); // Destroy the popup when clicked
        });
    
        // Adjust the close button position relative to the popup
        closeButton.setPosition(0, -90); // Above the popup
        popup.add(closeButton);
    }

    private updatePlayerList(players: {id: string, className?: string}[]) {
        // Remove previous text
        this.playerTexts.forEach(p => p.destroy());
        this.playerTexts = [];

        players.forEach((player, i) => {
            const displayText = player.className ? `${player.id} - ${player.className}` : player.id;
            const text = this.add.text(100, this.playerListYStart + i * 40, displayText, {
                fontFamily: 'Courier',
                fontSize: '20px',
                color: '#ffffff',
            }).setInteractive({ useHandCursor: true });
        
            text.on('pointerdown', () => {
                // Only allow the local player to update their own class
                if (player.id === netMan.getPeerId()) {
                    this.showClassSelectionPopup(player.id);
                }
            });
        
            this.playerTexts.push(text);
        });
    }
}
