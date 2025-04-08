import { Scene } from 'phaser';
import { SceneObject } from '../lib/SceneObject';
import { Transform } from '../lib/Behaviours/Transform';
import { SpriteRenderer } from '../lib/Behaviours/SpriteRenderer';
import { ImageRenderer } from '../lib/Behaviours/ImageRenderer';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');
    }

    create ()
    {
        // this.add.image(512, 384, 'background');

        let obj = new SceneObject(this);
        let transform = new Transform(obj);
        transform.position = new Phaser.Math.Vector2(512, 350);
        obj.addBehaviour(transform);

        obj.addBehaviour(new ImageRenderer(obj, 'logo'));

        obj.onStart();

        // this.add.image(512, 350, 'logo').setDepth(100);
        // this.add.text(512, 490, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);
        

        let dir = 1;
        setInterval(() => {
            obj.onTick();

            transform.position.x += 5 * dir;
            if(transform.position.x >= 700) dir = -1;
            else if(transform.position.x <= 300) dir = 1;

            transform.scale = new Phaser.Math.Vector2(transform.position.x / 500, transform.position.x / 500);

            obj.onLateTick();
        }, 20);
    }
}
