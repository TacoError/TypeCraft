import * as THREE from "three";
import TextureLoader from "./utils/texture_loader";
import BlockRegistry from "./block/block_registry";
import World from "./world/world";
import FlatGenerator from "./world/generator/types/flat_generator";
import Vector2 from "./math/vector2";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Movement from "./controls/movement";


export default class TypeCraft {

    private _scene: THREE.Scene;

    private _camera: THREE.Camera;

    private _renderer: THREE.WebGLRenderer;
    
    private _world: World;

    private movement: Movement;

    private orbit: OrbitControls;

    constructor() {
        this._scene = new THREE.Scene();
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        //this.movement = new Movement(this, this._camera);
        this.orbit = new OrbitControls(this._camera, this._renderer.domElement);
        
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
        this._world = new World("World", new FlatGenerator(), this._scene);
        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
                this._world.loadChunk(new Vector2(x, z));
            }
        }
        this._camera.position.z = 5;
        this._camera.position.y = 50;
    }

    private renderLoop() : void {
        requestAnimationFrame(this.renderLoop.bind(this));

        //this.movement.update();
        this.orbit.update();

        this._renderer.render(this._scene, this._camera);
    }

};
try{
new TypeCraft();
}catch(e) {
alert(e);
}