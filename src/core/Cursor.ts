import * as THREE from "three";
import { App } from "../App";

class Cursor {
	app: App;
	raycaster: THREE.Raycaster;
	position: THREE.Vector2;

	constructor(app: App) {
		this.app = app;
		this.raycaster = new THREE.Raycaster();
		this.position = new THREE.Vector2();

		this.onMousemove = this.onMousemove.bind(this);

		document.addEventListener("mousemove", this.onMousemove);
	}

	onMousemove(event: MouseEvent) {
		this.position.x = (event.clientX / this.app.width) * 2 - 1;
		this.position.y = -(event.clientY / this.app.height) * 2 + 1;
	}

	update() {
		this.raycaster.setFromCamera(this.position, this.app.camera);
		const intersect = this.raycaster
			.intersectObject(this.app.scene, true)
			.filter((x) => x.object.name === "tile")[0];

		if (intersect?.object?.name === "tile") {
			intersect.object.userData.onMouseover(intersect);
		}
	}
}

export { Cursor };
