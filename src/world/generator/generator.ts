import Chunk from "../chunk";

export default abstract class Generator {

    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name() : string {
        return this._name;
    }

    abstract generateChunk(chunk: Chunk) : void;

    abstract populateChunk(chunk: Chunk) : void;

};