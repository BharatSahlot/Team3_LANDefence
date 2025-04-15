import Peer, { DataConnection } from 'peerjs';
import { gameEvents } from './GameEvents';
import { networkSettings } from '../main';

type NetworkEventHandler = (data: any, peerId: string) => void;

export class NetworkManager {
    private peer: Peer;
    private connections: Map<string, DataConnection> = new Map();
    private eventHandlers: Map<string, NetworkEventHandler[]> = new Map();

    private isHost = false;
    private playerList: string[] = [];
    private readonly MAX_PLAYERS = 4;

    constructor() {
    }

    public getPlayerList(): string[] {
        return this.playerList;
    }

    private randomString(length: number = 4): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    public async host(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.isHost = true;
            this.peer = new Peer(this.randomString(4), networkSettings);
            this.peer.on('open', (id) => {
                console.log('Hosting as:', id);

                this.playerList.push(id);
                this.emit('update-player-list', this.playerList, this.peer.id);
                resolve(id);
            });

            this.peer.on('connection', (conn) => {
                if (this.playerList.length >= this.MAX_PLAYERS) {
                    console.log(`Lobby full. Rejecting: ${conn.peer}`);
                    conn.on('open', () => {
                        conn.send({ type: 'lobby-full', payload: null });
                        conn.close(); // Optional: close connection after sending message
                    });
                    return;
                }
                this.addConnection(conn);
                this.emit('player-joined', { id: conn.peer }, conn.peer);
                conn.on('open', () => {
                    this.playerList.push(conn.peer);
                    this.emit('update-player-list', this.playerList, conn.peer);
                    this.send({ type: 'update-player-list', payload: this.playerList });
                });
            });

            this.peer.on('error', reject);
        });
    }


    public connectToHost(hostId: string): void {
        this.join(hostId)
        .then(() => {
            console.log('Connected to host:', hostId);
            this.emit('connected-to-host', {}, hostId);
        })
        .catch((err) => {
            console.error('Failed to connect to host:', err);
            this.emit('connection-error', err, hostId);
        });
    }

    public async join(hostId: string): Promise<void> {
        this.isHost = false;
        this.peer = new Peer(this.randomString(4), networkSettings);
        return new Promise((resolve, reject) => {
            this.peer.on('open', () => {
                console.log("connected to peer server");

                this.playerList.push(this.peer.id);
                this.emit('update-player-list', this.playerList, this.peer.id);

                const conn = this.peer.connect(hostId);
                conn.on('open', () => {
                    console.log("connected to peer");
                    this.addConnection(conn);
                    resolve();
                });

                conn.on('error', reject);
            });

            this.peer.on('error', reject);
        });
    }

    private addConnection(conn: DataConnection) {
        this.connections.set(conn.peer, conn);

        conn.on('data', (data) => {
            if (data.type === 'lobby-full') {
                console.log("Received lobby-full from host");
                this.emit('lobby-full', null, conn.peer);
                conn.close(); // Optional: ensure disconnection
                return;
            }
            this.emit(data.type, data.payload, conn.peer);
        });

        conn.on('close', () => {
            this.connections.delete(conn.peer);
            this.emit('player-left', { id: conn.peer }, conn.peer);

            // ✅ If host, also remove from player list and notify others
            if (this.isHost) {
                this.playerList = this.playerList.filter(id => id !== conn.peer);
                this.send({ type: 'update-player-list', payload: this.playerList });
                this.emit('update-player-list', this.playerList, this.peer.id);
            }
        });

        // conn.on('')
    }

    public send(data: { type: string; payload: any }, to?: string) {
        if (this.isHost) {
            // Send to one or all clients
            if (to) {
                this.connections.get(to)?.send(data);
            } else {
                // console.log("sending data: " + data.type + " :");
                // console.log(data.payload);
                this.connections.forEach((conn) => conn.send(data));
            }
        } else {
            // Send to host
            const hostConn = Array.from(this.connections.values())[0];
            hostConn?.send(data);
        }
    }

    public on(event: string, handler: NetworkEventHandler) {
        const handlers = this.eventHandlers.get(event) || [];
        handlers.push(handler);
        this.eventHandlers.set(event, handlers);
    }

    public once(event: string, handler: NetworkEventHandler) {
        const wrapper: NetworkEventHandler = (data, peerId) => {
            handler(data, peerId);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    public off(event: string, handler: NetworkEventHandler) {
        const handlers = this.eventHandlers.get(event) || [];
        this.eventHandlers.set(event, handlers.filter((h) => h !== handler));
    }

    private emit(event: string, data: any, peerId: string) {
        const handlers = this.eventHandlers.get(event) || [];
        for (const handler of handlers) {
            handler(data, peerId);
        }
    }

    public getPeerId(): string {
        return this.peer?.id;
    }

    public isHosting(): boolean {
        return this.isHost;
    }


    public reset() {
        if (this.peer) {
            this.peer.destroy();
        }

        this.isHost = false;
        this.eventHandlers.clear();
    }
}

export const netMan = new NetworkManager();
