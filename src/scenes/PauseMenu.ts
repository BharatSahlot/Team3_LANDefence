import { netMan } from '../lib/NetworkManager';

export class PauseMenu extends Phaser.Scene {
    constructor() {
        super('PauseMenu');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Pause Menu Title
        this.add.text(centerX, centerY - 100, 'Paused', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Resume Button
        const resumeButton = this.add.text(centerX, centerY, 'Resume', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        resumeButton.on('pointerdown', () => {
            this.scene.stop(); // Close the pause menu
            const gameScene = this.scene.get('Game');
            gameScene.events.emit('resume-game'); // Emit custom event
            this.scene.resume('Game'); // Resume the game scene
            netMan.sendPauseState(false); // Notify all players
        });

        // Quit Button
        const quitButton = this.add.text(centerX, centerY + 60, 'Quit', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        quitButton.on('pointerdown', () => {
            this.scene.stop('Game'); // Stop the game scene
            this.scene.start('MainMenu'); // Go back to the main menu
            window.location.reload(); // Reload the page to reset the game state
        });
    }
}