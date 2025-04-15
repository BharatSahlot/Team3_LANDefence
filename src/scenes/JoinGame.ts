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

    preload() {
        this.load.image('bg', 'public/assets/bg_1.jpeg');
        this.load.image('logo', 'public/assets/logo_1.png');
        this.load.image('bk', 'public/assets/bk.png');
        this.load.image('jg', 'public/assets/jg.png');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
         // Background
         this.add.image(this.scale.width / 2 + 200, this.scale.height / 2, 'bg').setOrigin(0.5, 0.5);

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
        
        // const centerX = this.cameras.main.centerX;

        // // Title
        // this.add.text(centerX, 60, 'Join Game Game', {
        //     fontFamily: 'Arial',
        //     fontSize: '48px',
        //     color: '#ffffff',
        // }).setOrigin(0.5);

        // Create HTML input box
        this.createInput(centerX, centerY);

        // Instruction
        this.hostIdLabel = this.add.text(centerX, centerY - 100, 'Enter Host ID:', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Set listener for receiving updated player list
        netMan.on('update-player-list', (players: string[]) => {
            console.log(players);
            this.updatePlayerList(players);
        });
    }

    private createInput(x: number, y: number ) {
        this.inputWrapper = document.createElement('div');
        this.inputWrapper.style.position = 'absolute';
        this.inputWrapper.style.left = `${x + 100}px`;
        this.inputWrapper.style.top = `${y}px`;

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
        const joinButton = this.add.image(centerX - 20, 550, 'jg').setOrigin(0.5).setInteractive();
        joinButton.setScale(0.18);

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
