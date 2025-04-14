import { Scene } from "phaser";
import { Behaviour } from "./Behaviour";
import { BaseScene } from "./BaseScene";

export class SceneObject {
    protected scene: BaseScene;

    private behaviours: Behaviour[];
    private newBehaviours: Behaviour[];

    protected id: string = this.randomString(24);

    constructor(scene: BaseScene) {
        this.scene = scene;
        this.behaviours = [];
        this.newBehaviours = [];
    }

    private randomString(length: number = 4): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    public getId() {
        return this.id;
    }

    public setId(id: string) {
        this.id = id;
    }

    public getScene(): BaseScene { return this.scene; }

    public addBehaviour<T extends Behaviour>(b: T): void {
        this.newBehaviours = [...this.newBehaviours, b];
    }

    getComponent<T extends Behaviour>(type: new (...args: any[]) => T): T | undefined {
        return this.behaviours.find(b => b instanceof type) as T;
    }

    public removeBehaviour<T extends Behaviour>(b: T): void {
        let ind = this.behaviours.findIndex(_b => b === _b);
        if(ind != -1) {
            this.behaviours.splice(ind, 1);
            return;
        }

        // theres a chance that the component was added this fram eonly
        ind = this.newBehaviours.findIndex(_b => b === _b);
        if(ind != -1) {
            this.newBehaviours.splice(ind, 1);
            return;
        }
    }

    public onStart(): void {
        this.behaviours = [...this.newBehaviours];
        this.newBehaviours = [];

        this.behaviours.forEach(b => {
            b.onStart?.();
        });
    }

    public onTick(delta: number): void {
        this.behaviours.forEach(b => {
            b.onTick?.();
        });

        this.newBehaviours.forEach(b => {
            b.onStart?.();
        });

        this.behaviours = [...this.behaviours, ...this.newBehaviours];
        this.newBehaviours = [];
    }

    public onLateTick(): void {
        this.behaviours.forEach(b => {
            b.onLateTick?.();
        });
    }

    public onDestroy(): void {
        this.behaviours.forEach(b => {
            b.onDestroy?.();
        });
    }
}
