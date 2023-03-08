import Generator from "../generator";
import Chunk from "../../chunk";
import BlockRegistry from "../../../block/block_registry";
import Vector3 from "../../../math/vector3";

export default class FlatGenerator extends Generator {

    constructor() {
        super("Flat");
    }

    generateChunk(chunk: Chunk) : void {
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                chunk.setBlock(new Vector3(x, 5, z), BlockRegistry.getBlock("Grass"));
                for (let y = 4; y >= 0; y--) {
                    chunk.setBlock(new Vector3(x, y, z), BlockRegistry.getBlock("Dirt"));
                }
            }
        }
    }

    populateChunk(chunk: Chunk) : void {
        // Flat worlds do not have grass, etc
    }

};