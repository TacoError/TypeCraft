import * as THREE from "three";
import Vector2 from "../math/vector2";
import Block from "../block/block";
import Vector3 from "../math/vector3";
import World from "./world";
import TextureLoader from "../utils/texture_loader";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

export interface ChunkBlockInfo {
    position: Vector3,
    block: Block
};

export default class Chunk {

    private _position: Vector2;

    private blocks: Map<string, ChunkBlockInfo>;

    private _meshes: THREE.InstancedMesh[];

    private _isGenerated: boolean;

    private parent: World;

    constructor(position: Vector2, parent: World) {
       this._position = position;
       this.blocks = new Map();
       this._meshes = [];
       this._isGenerated = false;
       this.parent = parent;
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
        for (const mesh of this._meshes) {
            scene.remove(mesh);
        }
        this._meshes = [];
    }

    get meshes() : THREE.InstancedMesh[] {
        return this._meshes;
    }

    isBlockAt(position: Vector3) : boolean {
        return this.blocks.get(position.toString()) !== undefined;
    }

    private isFullyCovered(position: Vector3) : boolean {
        return this.isBlockAt(position.addNoEffect(new Vector3(1, 0, 0))) &&
            this.isBlockAt(position.addNoEffect(new Vector3(-1, 0, 0))) &&
            this.isBlockAt(position.addNoEffect(new Vector3(0, 1, 0))) &&
            this.isBlockAt(position.addNoEffect(new Vector3(0, -1, 0))) &&
            this.isBlockAt(position.addNoEffect(new Vector3(0, 0, 1))) &&
            this.isBlockAt(position.addNoEffect(new Vector3(0, 0, -1)))
    }

    addToScene(scene: THREE.Scene) : void {
        const sortedBlocks: Map<string, ChunkBlockInfo[]> = new Map();
        this.blocks.forEach((info: ChunkBlockInfo) => {
            if (this.isFullyCovered(info.position)) return;
            if (sortedBlocks.has(info.block.name)) {
                const values: ChunkBlockInfo[] = sortedBlocks.get(info.block.name) as ChunkBlockInfo[];
                values.push(info);
                sortedBlocks.set(info.block.name, values);
                return;
            }
            sortedBlocks.set(info.block.name, [info]);
        });
        const xForward: THREE.PlaneGeometry = new THREE.PlaneGeometry(1, 1);
        xForward.rotateY(Math.PI / 2);
        xForward.translate(0.5, 0, 0);
        const xBackward: THREE.PlaneGeometry = new THREE.PlaneGeometry(1, 1);
        xBackward.rotateY(-Math.PI / 2)
        xBackward.translate(-0.5, 0, 0);
        const top: THREE.PlaneGeometry = new THREE.PlaneGeometry(1, 1);
        let base: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | THREE.GLBufferAttribute = top.getAttribute("uv");
        base[5] = 0.5;
        base[7] = 0.5;
        top.setAttribute("uv", base);
        top.rotateX(-Math.PI / 2);
        top.translate(0, 0.5, 0);
        const zForward: THREE.PlaneGeometry = new THREE.PlaneGeometry(1, 1);
        zForward.translate(0, 0, 0.5);
        const zBackward: THREE.PlaneGeometry = new THREE.PlaneGeometry(1, 1);
        zBackward.rotateY(Math.PI);
        zBackward.translate(0, 0, -0.5);
        for (const geometries of [xForward, xBackward, zForward, zBackward]) {
            base = geometries.getAttribute("uv");
            base[1] = 0.5;
            base[3] = 0.5;
            geometries.setAttribute("uv", base);
        }
        const tempMatrix: THREE.Matrix4 = new THREE.Matrix4();
        const geometries: THREE.BufferGeometry[] = [];
        sortedBlocks.forEach((blocks: ChunkBlockInfo[]) => {
            for (const block of blocks) {
                tempMatrix.makeTranslation(block.position.x, block.position.y, block.position.z);
                for (const geometry of [xForward, xBackward, zForward, zBackward, top]) {
                    geometries.push(geometry.clone().applyMatrix4(tempMatrix));
                }
            }
        });
        scene.add(new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(geometries), TextureLoader.getTexture("Atlas")))
    }
 
};