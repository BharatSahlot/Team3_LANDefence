import { Scene } from 'phaser';
import { setupPlayerAnimations } from './Game/setupPlayerAnimations';
import { Player } from '../lib/Actors/Player';
import { netMan } from '../lib/NetworkManager';
import { gameEvents } from '../lib/GameEvents';
import { Transform } from '../lib/Behaviours/Transform';
import { ISerializable } from '../lib/ISerializable';
import { SceneObject } from '../lib/SceneObject';

export class Game extends Scene
{
    private setupPlayerAnimations: (this: Game) => void;

    private objectsStates: Map<string, ISerializable> = new Map<string, any>();
    private transforms: Map<string, Transform> = new Map<string, Transform>();

    private objects: SceneObject[] = [];

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

        if(netMan.isHosting()) {
            setInterval(() => {
                let state: any = {};
                for (const [id, element] of this.objectsStates) {
                    state[id] = {
                        type: element.getType(),
                        data: element?.serialize(),
                    };
                }
                gameEvents.emit("state-update", state);
            }, 500);

            setInterval(() => {
                let state: any = {};
                for (const [id, transform] of this.transforms) {
                    state[id] = {
                        position: { x: transform.position.x, y: transform.position.y },
                        rotation: transform.rotation,
                        scale: { x: transform.scale.x, y: transform.scale.y }
                    };
                }
                gameEvents.emit("transform-update", state);
            }, 5);

            let player = new Player(this);
            player.onStart();
            this.transforms.set(player.getId(), player.transform);
            this.objectsStates.set(player.getId(), player);
            this.objects.push(player);
        } else {
            // peer side
            gameEvents.on('state-update', (data: any, _) => {
                for (const id in data) {
                    if(!data.hasOwnProperty(id)) continue;

                    if(this.objectsStates.has(id)) {
                        const obj = this.objectsStates.get(id);
                        if(obj) obj.deserialize(data[id].data);
                    } else {
                        if(data[id].type == 'Player') {
                            let player = new Player(this);
                            player.setId(id);
                            player.onStart();

                            this.transforms.set(player.getId(), player.transform);
                            this.objectsStates.set(player.getId(), player);

                            this.objects.push(player);
                        }
                    }
                }
            });

            gameEvents.on('transform-update', (data: any, _) => {
                for (const id in data) {
                    if(!data.hasOwnProperty(id)) continue;

                    const obj = this.transforms.get(id);
                    if(obj) {
                        obj.position = new Phaser.Math.Vector2(data[id].position.x, data[id].position.y);
                        obj.rotation = data[id].rotation;
                        obj.scale = new Phaser.Math.Vector2(data[id].scale.x, data[id].scale.y);
                    }
                }
            });
        }

        setInterval(() => {
            this.objects.forEach(obj => obj.onTick());

            this.objects.forEach(obj => obj.onLateTick());
        }, 20);
    }
}
