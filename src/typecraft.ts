import * as THREE from "three";
import TextureLoader from "./utils/texture_loader";
import BlockRegistry from "./block/block_registry";

class TypeCraft {

    private _scene: THREE.Scene;

    private _camera: THREE.Camera;

    private _renderer: THREE.WebGLRenderer;

    constructor() {
        this._scene = new THREE.Scene();
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

        document.body.appendChild(this._renderer.domElement);

        this.load();
        this.renderLoop();
    }

    get scene() : THREE.Scene {
        return this._scene;
    }

    get camera() : THREE.Camera {
        return this._camera;
    }

    get renderer() : THREE.Renderer {
        return this._renderer;
    }

    private load() : void {
        TextureLoader.load();
        BlockRegistry.initialize();
        this._camera.position.z = 5;
    }

    private renderLoop() : void {
        requestAnimationFrame(this.renderLoop.bind(this));



        this._renderer.render(this._scene, this._camera);
    }

};

new TypeCraft();