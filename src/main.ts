import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale,Types } from 'phaser';
import { MainMenu } from './scenes/MainMenu';
import { HostGame } from './scenes/HostGame';
import { JoinGame } from './scenes/JoinGame';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    pixelArt: true,
    parent: 'game-container',
    backgroundColor: '#222222',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        MainMenu,
        HostGame,
        JoinGame,
        MainGame
    ],
    input: {
        gamepad: true,
        keyboard: true,
        mouse: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            customUpdate: true,
        }
    },
};

export default new Game(config);

export const networkSettings = {
    host: import.meta.env.PEER_URL || "localhost",
    port: import.meta.env.PEER_PORT || "9000"
};
