import * as THREE from "three";

export default class Block {

    private _name: string;

    private _texture: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[];

    private _geometry: THREE.BoxGeometry;

    constructor(name: string, texture: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[], geometry: THREE.BoxGeometry) {
        this._name = name;
        this._texture = texture;
        this._geometry = geometry;
    }

    get name() : string {
        return this._name;
    }

    get geometry() : THREE.BoxGeometry {
        return this._geometry;
    }

    get texture() : THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] {
        return this._texture;
    }

};