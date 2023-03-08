import * as THREE from "three";

interface TextureData {
    name: string;
    sameAround: boolean;
    toLoad: string | string[];
}

// No longer really needed, now that I use an atlas, but whatever.
export default class TextureLoader {

    private static textures: Map<string, THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[]>;

    static load() : void {
        this.textures = new Map();
        const loader: THREE.TextureLoader = new THREE.TextureLoader();
        const toLoad: TextureData[] = [
            {
                name: "Atlas",
                sameAround: true,
                toLoad: "https://i.ibb.co/vjcjxLQ/terrain.png" // 16x16
            }
        ];
        for (const data of toLoad) {
            if (data.sameAround) {
                this.textures.set(data.name, new THREE.MeshBasicMaterial({map: loader.load(data.toLoad as string)}));
                continue;
            }
            const array: string[] = data.toLoad as string[];
            this.textures.set(data.name, array.map(url => new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: loader.load(url)})))
        }
    }

    static getTexture(name: string) : THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] {
        const texture: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] | undefined = this.textures.get(name);
        if (texture == undefined) {
            throw new Error(`Tried to get non-existent texture with name ${name}`);
        }
        return texture;
    }

};