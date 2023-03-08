import * as THREE from "three";

export default class Block {

    private _name: string;

    private _id: number;

    constructor(name: string, id: number) {
        this._name = name;
        this._id = id;
    }

    get name() : string {
        return this._name;
    }

    get id() : number {
        return this._id;
    }

};