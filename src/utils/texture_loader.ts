import * as THREE from "three";

interface TextureData {
    name: string;
    sameAround: boolean;
    toLoad: string | string[];
}

export default class TextureLoader {

    private static textures: Map<string, THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[]>;

    static load() : void {
        const loader: THREE.TextureLoader = new THREE.TextureLoader();
        const toLoad: TextureData[] = [
            {
                name: "Grass",
                sameAround: false,
                toLoad: [
                    "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.8.9/assets/minecraft/textures/blocks/grass_side.png",
                    "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.8.9/assets/minecraft/textures/blocks/grass_side.png",
                    "https://i.ibb.co/LnGXqJW/image.png", // this is grass top (gray in cdn?)
                    "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.8.9/assets/minecraft/textures/blocks/dirt.png",
                    "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.8.9/assets/minecraft/textures/blocks/grass_side.png",
                    "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.8.9/assets/minecraft/textures/blocks/grass_side.png"
                ],
            }
        ];
        for (const data of toLoad) {
            if (data.sameAround) {
                this.textures.set(data.name, new THREE.MeshBasicMaterial({map: loader.load(data.toLoad as string)}));
                continue;
            }
            const array: string[] = data.toLoad as string[];
            this.textures.set(data.name, array.map(url => new THREE.MeshBasicMaterial({map: loader.load(url)})))
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