import Block from "./block";
import TextureLoader from "../utils/texture_loader";
import { BoxGeometry } from "three";

export default class BlockRegistry {

    private static blocks: Map<string, Block>;

    static initialize() : void {
        this.blocks = new Map();
        const defaultBoxGeometry: BoxGeometry = new BoxGeometry(1, 1, 1);
        this.blocks.set("Grass", new Block("Grass", TextureLoader.getTexture("Grass"), defaultBoxGeometry));
    }

    static getBlock(name: string) : Block {
        const block: Block | undefined = this.blocks.get(name);
        if (block == undefined) {
            throw new Error(`Tried to get block with name ${name}, but it doesn't exist.`);
        }
        return block;
    }

};