export interface ISerializable {
    getId(): string;
    getType(): string;

    serialize(): any;
    deserialize(data: any): void;
}
