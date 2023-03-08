import TypeCraft from "../typecraft";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export default class Movement {

    private parent: TypeCraft;

    private camera: THREE.Camera;

    private oldPosition: THREE.Vector3;

    private pressedKeys: string[];

    private plc: PointerLockControls;
        
    constructor(parent: TypeCraft, camera: THREE.Camera) {
        this.parent = parent;
        this.camera = camera;
        this.oldPosition = this.camera.position;
        this.pressedKeys = [];
        this.plc = new PointerLockControls(camera, parent.renderer.domElement);
        document.addEventListener("click", () => {
            if (!this.plc.isLocked) {
                this.plc.lock();
            }
        });
        this.initListeners();
        parent.scene.add(this.plc.getObject());
    }

    private initListeners() : void {
        document.addEventListener("keydown", (key) => {
            this.pressedKeys.push(key.key.toLowerCase());
        });
        document.addEventListener("keyup", (key) => {
            this.pressedKeys = this.pressedKeys.filter(up => up !== key.key.toLowerCase())
        });
    }

    update() : void {
        for (const key of this.pressedKeys) {
            switch(key) {
                case "w":

                break;
                case "a":

                break;
                case "s":

                break;
                case "d":

                break;
            }
        }

    }

};