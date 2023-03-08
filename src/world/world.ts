import Generator from "./generator/generator";
import * as THREE from "three";
import Vector2 from "../math/vector2";
import Chunk from "./chunk";

export default class World {

    private _name: string;

    private generator: Generator;

    private scene: THREE.Scene;

    private chunks: Map<string, Chunk>;

    constructor(name: string, generator: Generator, scene: THREE.Scene) {
        this._name = name;
        this.generator = generator;
        this.scene = scene;
        this.chunks = new Map();
    }

    get name() : string {
        return this._name;
    }

    loadChunk(at: Vector2) : void {
        if (!this.chunks.has(at.toString())) {
            const chunk: Chunk = new Chunk(at);
            this.generator.generateChunk(chunk);
            this.generator.populateChunk(chunk);
            this.chunks.set(at.toString(), chunk);
        }
        this.chunks.get(at.toString())?.addToScene(this.scene);
    }

    unloadChunk(at: Vector2) : void {
        if (!this.chunks.has(at.toString())) {
            return;
        }
        this.chunks.get(at.toString())?.unload(this.scene);
    }

};