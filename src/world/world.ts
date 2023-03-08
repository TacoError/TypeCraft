import Generator from "./generator/generator";
import * as THREE from "three";
import Vector2 from "../math/vector2";
import Chunk from "./chunk";
import Block from "../block/block";
import Vector3 from "../math/vector3";

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
            const chunk: Chunk = new Chunk(at, this);
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

    getChunk(at: Vector2) : Chunk {
        const chunk: Chunk | undefined = this.chunks.get(at.toString());
        if (chunk == undefined) {
            throw new Error(`Tried to get non-existent chunk at ${at.toString()}`);
        }
        return chunk;
    }

    chunkExists(at: Vector2) : boolean {
        return this.chunks.has(at.toString());
    }

    getChunkFromWorldPosition(position: Vector3) : Chunk {
        const chunk: Chunk | undefined = this.chunks.get(new Vector2(position.x << 4, position.z << 4).toString());
        if (chunk == undefined) {
            throw new Error(`Tried to get chunk from world position, but no chunk there. ${position.toString()}`);
        }
        return chunk;
    }

    chunkExistsAtWorldPosition(position: Vector3) : boolean {
        return this.chunks.get(new Vector2(position.x << 4, position.z << 4).toString()) !== undefined;
    }

    private getBlockUnsafe(position: Vector3) : Block | undefined {
        const chunkX: number = position.x << 4;
        const chunkZ: number = position.z << 4;
        const chunkPos: Vector2 = new Vector2(chunkX, chunkZ);
        if (!this.chunkExists(chunkPos)) {
            return undefined;
        }
        const chunk: Chunk = this.getChunk(chunkPos);
        const chunkBlockPos: Vector3 = new Vector3(position.x - chunkX, position.y, position.z - chunkZ);
        if (!chunk.isBlockAt(chunkBlockPos)) {
            return undefined;
        }
        return chunk.getBlock(chunkBlockPos);
    }

    isBlockAt(position: Vector3) : boolean {
        return this.getBlockUnsafe(position) !== undefined;
    }

    getBlock(position: Vector3) : Block {
        const block: Block | undefined = this.getBlockUnsafe(position);
        if (block == undefined) {
            throw new Error(`Tried to get block at ${position.toString()} but it doesn't exist.`);
        }
        return block;
    }

};