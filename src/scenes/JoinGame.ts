import Phaser from 'phaser';
import { netMan } from '../lib/NetworkManager';
import { gameEvents } from '../lib/GameEvents';

export class JoinGame extends Phaser.Scene {
    private playerTexts: Phaser.GameObjects.Text[] = [];
    private inputBox!: HTMLInputElement;
    private inputWrapper!: HTMLDivElement;
    private playerListYStart = 200;
    private connected = false;

    private hostIdLabel!: Phaser.GameObjects.Text;

    constructor() {
        super('JoinGame');
    }

    preload() {
        this.load.image('bg', 'public/assets/bg_1.jpeg');
        this.load.image('logo', 'public/assets/logo_1.png');
        this.load.image('bk', 'public/assets/bk.png');
        this.load.image('jg', 'public/assets/jg.png');
    }

    create() {
        const { width, height, centerX, centerY } = this.cameras.main;
        const margin = 20;

        // Top Logo
        const logo = this.add.image(centerX, margin + 80, 'logo')
            .setOrigin(0.5)
            .setScale(0.3);

        // Back Button
        const backButton = this.add.image(margin + 80, margin + 40, 'bk')
            .setOrigin(0.5)
            .setScale(0.2)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                // Clean up the input elements before switching scene
                this.removeInput();
                this.scene.start('MainMenu');
            });

        // Title or label for host input
        this.hostIdLabel = this.add.text(centerX, centerY - 100, 'Enter Host ID:', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Create the HTML input box for entering Host ID.
        this.createInput(centerX, centerY);

        // Listen for network events
        netMan.on('update-player-list', (players: string[]) => {
            console.log(players);
            this.updatePlayerList(players);
        });

        netMan.on('lobby-full', () => {
            this.removeInput();
            this.showLobbyFullMessage();
            setTimeout(() => {
                netMan.reset();
                window.location.reload();
            }, 2000);
        });

        // Remove the input elements if the scene is shut down
        this.events.on('shutdown', () => {
            this.removeInput();
        });
        this.events.on('destroy', () => {
            this.removeInput();
        });
    }

    private createInput(x: number, y: number) {
        this.inputWrapper = document.createElement('div');
        // Position the wrapper absolutely using scene coordinates
        this.inputWrapper.style.position = 'absolute';
        this.inputWrapper.style.left = `${x + 100}px`;
        this.inputWrapper.style.top = `${y}px`;

        this.inputBox = document.createElement('input');
        this.inputBox.type = 'text';
        this.inputBox.placeholder = 'Host Peer ID';
        this.inputBox.style.width = '200px';
        this.inputBox.style.fontSize = '20px';
        this.inputBox.style.padding = '5px';

        // Create join button (as a Phaser Image) to initiate the connection.
        const joinButton = this.add.image(x - 20, y * 1.5, 'jg')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive();

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

    private removeInput() {
        if (this.inputWrapper && this.inputWrapper.parentElement) {
            this.inputWrapper.remove();
        }
    }

    private connectToHost(hostId: string) {
        if (this.connected) return;

        netMan.connectToHost(hostId);

        netMan.once('connected-to-host', () => {
            this.connected = true;
            // Remove the input element upon successful connection
            this.removeInput();
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
        this.removeInput();
    }

    destroy() {
        this.removeInput();
    }
}
