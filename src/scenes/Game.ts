import { Scene } from 'phaser';
import { setupPlayerAnimations } from './Game/setupPlayerAnimations';
import { Player } from '../lib/Actors/Player';
import { netMan } from '../lib/NetworkManager';
import { gameEvents } from '../lib/GameEvents';
import { InputManager } from '../controls/InputManager';
export class Game extends Scene
{
    private setupPlayerAnimations: (this: Game) => void;
    private inputManager: InputManager;

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.spritesheet('gold-knight', './NinjaPack/Actor/Characters/KnightGold/SpriteSheet.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.setupPlayerAnimations = setupPlayerAnimations;

        if(netMan.isHosting())
        {
            gameEvents.emit('start-game', {});
        }
    }

    create ()
    {
        this.inputManager = new InputManager(this);
        console.log("InputManager initialized:", this.inputManager);
        this.setupPlayerAnimations();

        let player = new Player(this, this.inputManager);
        player.onStart();
        
        setInterval(() => {
            player.onTick();
        
            player.onLateTick();
        }, 20);
    }
}
