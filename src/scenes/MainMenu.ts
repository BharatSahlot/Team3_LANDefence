import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('bg', 'public/assets/bg_1.jpeg');
        this.load.image('logo', 'public/assets/logo_1.png');
        this.load.image('hg', 'public/assets/hg.png');
        this.load.image('jg', 'public/assets/jg.png');
        this.load.image('st', 'public/assets/st.png');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Background
        // this.add.image(this.scale.width / 2 + 50, this.scale.height / 2, 'bg').setOrigin(0.5, 0.5);

        // Game Title image logo
        const logo = this.add.image(centerX, 120, 'logo').setOrigin(0.5);
        logo.setScale(0.3);   

        // Host Button
        const hostButton = this.add.image(centerX * 0.5 , centerY * 1 , 'hg').setOrigin(0.5).setInteractive();
        hostButton.setScale(0.4);

        // Join Button
        const joinButton = this.add.image(centerX * 0.5 , centerY * 1.3 , 'jg').setOrigin(0.5).setInteractive();
        joinButton.setScale(0.4);

        // Settings Button
        const settingsButton = this.add.image(centerX * 0.4 , centerY * 1.6 , 'st').setOrigin(0.5).setInteractive();
        settingsButton.setScale(0.3);

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
