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
        netMan.on('update-player-list', (players: { id: string; className?: string }[]) => {
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

    shutdown() {
        this.inputWrapper?.remove();
    }

    destroy() {
        this.shutdown();
    }
}
