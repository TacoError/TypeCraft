import Block from "./block";
import TextureLoader from "../utils/texture_loader";
import { BoxGeometry } from "three";

export default class BlockRegistry {

    private static blocks: Map<string, Block>;

    static initialize() : void {
        this.blocks = new Map();
        this.blocks.set("Grass", new Block("Grass", 0));
        this.blocks.set("Dirt", new Block("Dirt", 1));
    }

    static getBlock(name: string) : Block {
        const block: Block | undefined = this.blocks.get(name);
        if (block == undefined) {
            throw new Error(`Tried to get block with name ${name}, but it doesn't exist.`);
        }
        return block;
    }

};