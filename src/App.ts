import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import { Chunk } from "./entities/Chunk";
import { Cursor } from "./core/Cursor";

class App {
	domElement: HTMLElement;

	width: number;
	height: number;

	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;

	controls: OrbitControls;
	cursor: Cursor;

	constructor(domElement: HTMLElement) {
		this.domElement = domElement;

		this.renderer = new THREE.WebGLRenderer();
		domElement.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
		this.camera.position.set(6, 9, 2);
		this.camera.lookAt(new THREE.Vector3(0, 8, 0));

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AxesHelper());
		this.scene.add(new Chunk());

		this.cursor = new Cursor(this);

		this.controls = new OrbitControls(this.camera, this.domElement);

		window.addEventListener("resize", () => this.resize());

		this.resize();
		this.update();
	}

	resize() {
		const { width, height } = this.domElement.getBoundingClientRect();

		this.width = width;
		this.height = height;

		this.renderer.setSize(width, height);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	}

	update() {
		requestAnimationFrame(() => this.update());

		this.cursor.update();

		this.renderer.render(this.scene, this.camera);
	}
}

export { App };
