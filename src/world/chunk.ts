import * as THREE from "three";
import Vector2 from "../math/vector2";
import Block from "../block/block";
import Vector3 from "../math/vector3";

interface ChunkBlockInfo {
    position: Vector3,
    block: Block
};

export default class Chunk {

    private _position: Vector2;

    private blocks: Map<string, ChunkBlockInfo>;

    private meshes: THREE.InstancedMesh[];

    private _isGenerated: boolean;

    constructor(position: Vector2) {
       this._position = position;
       this.blocks = new Map();
       this.meshes = [];
       this._isGenerated = false;
    }

    get position() : Vector2 {
        return this._position;
    }

    get isGenerated() : boolean {
        return this._isGenerated;
    }

    set isGenerated(value: boolean) {
        this._isGenerated = value;
    }

    private isInChunkBounds(spot: Vector3) : boolean {
        return spot.x > -1 && spot.x < 16 && spot.y > -1 && spot.y < 129 && spot.z > -1 && spot.z < 16;
    }

    getBlock(position: Vector3) : Block {
        const block: ChunkBlockInfo | undefined = this.blocks.get(position.toString());
        if (block == undefined) {
            throw new Error(`Tried to get non-existent block at ${position.toString()}`);
        }
        return block.block;
    }

    setBlock(position: Vector3, block: Block) {
        if (!this.isInChunkBounds(position)) {
            throw new Error(`Tried to place block at ${position.toString()} in chunk at ${this._position.toString()}. Yet block is out of chunk bounds.`);
        }
        this.blocks.set(position.toString(), {
            position: position,
            block: block,
        });
    }

    unload(scene: THREE.Scene) : void {
        for (const mesh of this.meshes) {
            scene.remove(mesh);
        }
        this.meshes = [];
    }

    isBlockAt(position: Vector3) : boolean {
        return this.blocks.get(position.toString()) !== undefined;
    }

    // Todo: This function is weird, but any other way I tried didn't work?
    private isFullyCovered(position: Vector3) : boolean {
        return this.isBlockAt(new Vector3(position.x + 1, position.y, position.z)) &&
            this.isBlockAt(new Vector3(position.x - 1, position.y, position.z)) &&
            this.isBlockAt(new Vector3(position.x, position.y + 1, position.z)) &&
            this.isBlockAt(new Vector3(position.x, position.y - 1, position.z)) &&
            this.isBlockAt(new Vector3(position.x, position.y, position.z + 1)) &&
            this.isBlockAt(new Vector3(position.x, position.y, position.z - 1))
    }

    addToScene(scene: THREE.Scene) : void {
        const blocks: Map<string, ChunkBlockInfo[]> = new Map();
        this.blocks.forEach((block: ChunkBlockInfo, name: string) => {
            if (this.isFullyCovered(block.position)) {
                return;
            }
            if (!blocks.has(name)) {
                blocks.set(name, [block]);
                return;
            }
            blocks.set(name, [...(blocks.get(name) as ChunkBlockInfo[]), block]);
        });
        let tempMesh: THREE.InstancedMesh;
        const object3D: THREE.Object3D = new THREE.Object3D();
        let tempPlaceHolder: number = 0;
        blocks.forEach((_blocks: ChunkBlockInfo[]) => {
            tempMesh = new THREE.InstancedMesh(_blocks[0].block.geometry, _blocks[0].block.texture, _blocks.length);
            for (const block of _blocks) {
                object3D.matrix.setPosition(block.position.shiftChunk(this._position).toThreeVector3());
                tempMesh.setMatrixAt(tempPlaceHolder, object3D.matrix);
                tempPlaceHolder++;
            }
            tempMesh.instanceMatrix.needsUpdate = true;
            scene.add(tempMesh);
            this.meshes.push(tempMesh);
            tempPlaceHolder = 0;
        });
    }
 
};