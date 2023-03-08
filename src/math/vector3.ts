import * as THREE from "three";

export default class Vector3 {

    private _x: number;

    private _y: number;

    private _z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    get x() : number {
        return this._x;
    }

    get y() : number {
        return this._y;
    }

    get z() : number {
        return this._z;
    }

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    set z(z: number) {
        this._z = z;
    } 

    add(add: Vector3) : void {
        this._x += add.x;
        this._y += add.y;
        this._z = add.z;
    }

    subtract(subtract: Vector3) : void {
        this._x -= subtract.x;
        this._y -= subtract.y;
        this._z -= subtract.z;
    }

    clone(clone: Vector3) : void {
        this._x = clone.x;
        this._y = clone.y;
        this._z = clone.z;
    }

    toString() : string {
        return `${this._x}:${this._y}:${this._z}`;
    }

    toThreeVector3() : THREE.Vector3 {
        return new THREE.Vector3(this._x, this._y, this._z);
    }

    static fromString(vector3: string) : Vector3 {
        const split: number[] = vector3.split(":").map(coordinate => parseInt(coordinate));
        return new Vector3(split[0], split[1], split[2]);   
    }

}