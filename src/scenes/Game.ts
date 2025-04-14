import { Scene } from 'phaser';
import { setupPlayerAnimations } from './Game/setupPlayerAnimations';
import { Player } from '../lib/Actors/Player';
import { netMan } from '../lib/NetworkManager';
import { gameEvents } from '../lib/GameEvents';

export class Game extends Scene
{
    private setupPlayerAnimations: (this: Game) => void;

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
        this.setupPlayerAnimations();

        // let player = new Player(this);
        // player.onStart();
        //
        // setInterval(() => {
        //     player.onTick();
        //
        //     player.onLateTick();
        // }, 20);
    }
}
