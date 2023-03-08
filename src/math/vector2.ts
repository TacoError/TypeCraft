export default class Vector2 {

    private _x: number;

    private _z: number;

    constructor(x: number = 0, z: number = 0) {
        this._x = x;
        this._z = z;
    }

    get x() : number {
        return this._x;
    }

    get z() : number {
        return this._z;
    }

    set x(x: number) {
        this._x = x;
    }

    set z(z: number) {
        this._z = z;
    }

    add(add: Vector2) : void {
        this._x += add.x;
        this._z += add.z;
    }

    subtract(subtract: Vector2) : void {
        this._x -= subtract.x;
        this._z -= subtract.z;
    }

    clone(clone: Vector2) : void {
        this._x = clone.x;
        this._z = clone.z;
    }

    toString() : string {
        return `${this._x}:${this._z}`;
    }

    static fromString(vector2: string) : Vector2 {
        const split: number[] = vector2.split(":").map(coordinate => parseInt(coordinate));
        return new Vector2(split[0], split[1]);
    }

}