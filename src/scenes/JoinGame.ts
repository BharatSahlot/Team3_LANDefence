import Phaser from 'phaser';
import { netMan } from '../lib/NetworkManager';
import { gameEvents } from '../lib/GameEvents';

export class JoinGame extends Phaser.Scene {
    private playerTexts: Phaser.GameObjects.Text[] = [];
    private inputBox!: HTMLInputElement;
    private inputWrapper!: HTMLDivElement;
    private playerListYStart = 200;
    private connected = false;

    private hostIdLabel: Phaser.GameObjects.GameObject;

    constructor() {
        super('JoinGame');
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
            this.inputWrapper?.remove();  // Clean up input
            this.scene.start('MainMenu');
        });

        const centerX = this.cameras.main.centerX;

        // Title
        this.add.text(centerX, 60, 'Join Game Game', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Create HTML input box
        this.createInput(centerX);

        // Instruction
        this.hostIdLabel = this.add.text(centerX, 130, 'Enter Host ID:', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Set listener for receiving updated player list
        netMan.on('update-player-list', (players: string[]) => {
            console.log(players);
            this.updatePlayerList(players);
        });

        netMan.on('lobby-full', () => {
            this.inputWrapper?.remove();
            this.showLobbyFullMessage();
            setTimeout(() => {
                netMan.reset();
                window.location.reload();
            }, 2000);
        });
    }

    private showLobbyFullMessage() {
        const message = this.add.text(this.cameras.main.centerX, 300, 'Lobby is full. Please try another Host ID.', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ff5555',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    
        setTimeout(() => {
            message.destroy();
            this.createInput(this.cameras.main.centerX);
        }, 2000);
    }

    private createInput(x: number) {
        this.inputWrapper = document.createElement('div');
        this.inputWrapper.style.position = 'absolute';
        this.inputWrapper.style.left = `${x - 100}px`;
        this.inputWrapper.style.top = '160px';

        this.inputBox = document.createElement('input');
        this.inputBox.type = 'text';
        this.inputBox.placeholder = 'Host Peer ID';
        this.inputBox.style.width = '200px';
        this.inputBox.style.fontSize = '20px';
        this.inputBox.style.padding = '5px';

        // this.inputBox.addEventListener('keydown', (e) => {
        //     if (e.key === 'Enter') {
        //         this.connectToHost(this.inputBox.value);
        //     }
        // });

        const centerX = this.cameras.main.centerX;
        const joinButton = this.add.text(centerX, 600, 'Join Game', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#0077aa',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        joinButton.on('pointerdown', () => {
            joinButton.destroy();
            console.log('connecting to ' + this.inputBox.value);
            this.connectToHost(this.inputBox.value);
        });

        joinButton.on('pointerover', () => joinButton.setStyle({ backgroundColor: '#0099cc' }));
        joinButton.on('pointerout', () => joinButton.setStyle({ backgroundColor: '#0077aa' }));

        this.inputWrapper.appendChild(this.inputBox);
        document.body.appendChild(this.inputWrapper);
    }

    private connectToHost(hostId: string) {
        if (this.connected) return;

        netMan.connectToHost(hostId);

        netMan.once('connected-to-host', () => {
            this.connected = true;
            this.inputWrapper.remove();
            this.hostIdLabel.destroy();

            window.addEventListener('beforeunload', () => {
                netMan.reset();  // Disconnects from host and frees lobby slot
            });

            // Show player list title
            this.add.text(this.cameras.main.centerX, 180, 'Players in Game:', {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff',
            }).setOrigin(0.5);

            gameEvents.once('start-game', () => {
                this.scene.start('Game');
            });
        });
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

    shutdown() {
        this.inputWrapper?.remove();
    }

    destroy() {
        this.shutdown();
    }
}
