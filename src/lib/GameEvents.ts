import { netMan } from "./NetworkManager";

type GameEventHandler = (data: any, peerId: string) => void;

export class GameEvents {
    private handlers: Map<string, GameEventHandler[]> = new Map();

    constructor() {
        // Listen to all incoming data through the network manager
        netMan.on('game-event', (payload, peerId) => {
            this.handleEvent(payload, peerId);
        });
    }

    private handleEvent(payload: any, peerId: string) {
        const { eventId, data } = payload;
        const handlers = this.handlers.get(eventId) || [];

        for (const handler of handlers) {
            handler(data, peerId);
        }
    }

    public on(eventId: string, handler: GameEventHandler) {
        const list = this.handlers.get(eventId) || [];
        list.push(handler);
        this.handlers.set(eventId, list);
    }

    public once(eventId: string, handler: GameEventHandler) {
        const wrapper: GameEventHandler = (data, peerId) => {
            handler(data, peerId);
            this.off(eventId, wrapper);
        };
        this.on(eventId, wrapper);
    }

    public off(eventId: string, handler: GameEventHandler) {
        const list = this.handlers.get(eventId) || [];
        this.handlers.set(eventId, list.filter(h => h !== handler));
    }

    public emit(eventId: string, data: any, to?: string) {
        netMan.send({ type: 'game-event', payload: { eventId, data } }, to);
    }

    public reset() {
        this.handlers.clear();
    }
}

export const gameEvents = new GameEvents();
