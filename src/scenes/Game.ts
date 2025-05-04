import { setupPlayerAnimations } from './Game/setupPlayerAnimations';
import { Player } from '../lib/Actors/Player';
import { netMan } from '../lib/NetworkManager';
import { gameEvents } from '../lib/GameEvents';
import { Transform } from '../lib/Behaviours/Transform';
import { ISerializable } from '../lib/ISerializable';
import { BaseScene } from '../lib/BaseScene';
import { BaseEnemy } from '../lib/Actors/BaseEnemy';
import { Map as GameMap } from '../lib/Map/Map';
import { EnemyManager } from '../lib/EnemyManager';

export class Game extends BaseScene
{
    private setupPlayerAnimations: (this: Game) => void;
    private objectsStates: Map<string, ISerializable> = new Map<string, any>();
    private transforms: Map<string, Transform> = new Map<string, Transform>();

    private players: Map<string, Player> = new Map<string, Player>();

    public map: GameMap;

    public enemyManager: EnemyManager;

    constructor ()
    {
        super('Game');

        this.enemyManager = new EnemyManager(this);

        this.map = new GameMap(1000, 1000, 16, -1400, -1400);
    }

    preload ()
    {
        this.physics.world.defaults.debugShowVelocity = true;

        this.load.setPath('assets');

        this.load.spritesheet('gold-knight', './NinjaPack/Actor/Characters/KnightGold/SpriteSheet.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.image('arrow', './NinjaPack/Items/Projectile/Arrow.png');

        this.load.spritesheet('blue-bat', './NinjaPack/Actor/Monsters/BlueBat/SpriteSheet.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.image('tiles', './NinjaPack/Backgrounds/Tilesets/TilesetFloor.png');
        this.load.tilemapTiledJSON('map', './floor.tmj');

        this.setupPlayerAnimations = setupPlayerAnimations;

        if(netMan.isHosting())
        {
            gameEvents.emit('start-game', {});
        }
    }

    create ()
    {
        super.create();

        this.setupPlayerAnimations();

        this.loadTilemap();

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

            netMan.getPlayerList().forEach(playerId => {
                let player = new Player(this, playerId != netMan.getPeerId());

                player.peerId = playerId;
                this.transforms.set(player.getId(), player.transform);

                this.players.set(playerId, player);
                this.objectsStates.set(player.getId(), player);
                this.objects.push(player);

                this.enemyManager.registerTarget(player.transform);

                player.onStart();
            });

            gameEvents.on('player-move', (data: any, peerId: string) => {
                let player = this.players.get(peerId);
                if(!player) return;

                player.transform.position.x = data.x;
                player.transform.position.y = data.y;
            });

            let i = 0;
            while(i < 200) {
                let enemy = new BaseEnemy(this, "blue-bat");
                let transform = enemy.getComponent(Transform);
                if(transform) {
                    this.transforms.set(enemy.getId(), transform);
                }

                this.objectsStates.set(enemy.getId(), enemy);
                this.objects.push(enemy);

                this.enemyManager.registerEnemy(enemy);

                enemy.onStart();
                i++;
            }

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
                            let player = new Player(this, true);
                            player.setId(id);

                            player.deserialize(data[id].data);

                            this.transforms.set(player.getId(), player.transform);
                            this.players.set(player.peerId, player);
                            this.objectsStates.set(player.getId(), player);

                            this.objects.push(player);
                            player.onStart();
                        } else if(data[id].type == 'BaseEnemy') {
                            let enemy = new BaseEnemy(this, "blue-bat");
                            enemy.setId(id);
                            enemy.deserialize(data[id].data);

                            this.transforms.set(id, enemy.transform);
                            this.objectsStates.set(id, enemy);
                            this.objects.push(enemy);

                            enemy.onStart();
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
    }

    override update(time: number, delta: number) {
        const objs = [...this.objects];

        objs.forEach(obj => obj.onTick(delta));
        objs.forEach(obj => obj.onLateTick());

        this.physics.world.update(time, delta);
    }

    private loadTilemap()
    {
        const map = this.make.tilemap({ key: 'map' });

        const tileset = map.addTilesetImage('TilesetFloor', 'tiles', 16, 16, 0, 0);

        if(tileset) {
            const layer = map.createLayer('Tile Layer 1', tileset, -1400, -1400);
            layer?.setScale(3);
        }
    }
}
