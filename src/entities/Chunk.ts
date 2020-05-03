import * as THREE from "three";
import SimplexNoise from "simplex-noise";

enum Flag {
	North = 0x000f,
	East = 0x00f0,
	South = 0x0f00,
	West = 0xf000,
}

class Chunk extends THREE.Group {
	size: THREE.Vector3;
	data: number[];

	pointer: THREE.Mesh;

	constructor() {
		super();
		this.size = new THREE.Vector3(32, 8, 32);
		this.data = [];
		this.name = "chunk";

		// this.add(
		//   new THREE.Mesh(
		//     new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
		//     new THREE.MeshNormalMaterial({ wireframe: true })
		//   )
		// );

		this.pointer = new THREE.Mesh(
			new THREE.BoxGeometry(0.1, 0.1, 0.1),
			new THREE.MeshNormalMaterial({ wireframe: false })
		);
		this.add(this.pointer);

		this.build();
	}

	build() {
		const tiles = this.size.x * this.size.z;

		const simplex = new SimplexNoise();
		const h = (x, y) => Math.floor((1 + simplex.noise2D(x / 8, y / 8)) * 2) / 2;

		for (let i = 0; i < tiles; i++) {
			const x = (i % this.size.x) - this.size.x / 2;
			const z = Math.floor(i / this.size.x) - this.size.z / 2;

			const northeast = h(x, z);
			const southeast = h(x + 1, z);
			const southwest = h(x + 1, z + 1);
			const northwest = h(x, z + 1);

			const geometry = new THREE.Geometry();

			geometry.vertices.push(new THREE.Vector3(x, 0, z));
			geometry.vertices.push(new THREE.Vector3(x + 1, 0, z));
			geometry.vertices.push(new THREE.Vector3(x + 1, 0, z + 1));
			geometry.vertices.push(new THREE.Vector3(x, 0, z + 1));

			geometry.vertices.push(new THREE.Vector3(x, northeast, z));
			geometry.vertices.push(new THREE.Vector3(x + 1, southeast, z));
			geometry.vertices.push(new THREE.Vector3(x + 1, southwest, z + 1));
			geometry.vertices.push(new THREE.Vector3(x, northwest, z + 1));

			// floor
			geometry.faces.push(new THREE.Face3(0, 1, 2));
			geometry.faces.push(new THREE.Face3(2, 3, 0));

			// north
			geometry.faces.push(new THREE.Face3(0, 3, 4));
			geometry.faces.push(new THREE.Face3(3, 7, 4));

			// east
			geometry.faces.push(new THREE.Face3(0, 5, 1));
			geometry.faces.push(new THREE.Face3(0, 4, 5));

			// south
			geometry.faces.push(new THREE.Face3(1, 6, 2));
			geometry.faces.push(new THREE.Face3(1, 5, 6));

			// west
			geometry.faces.push(new THREE.Face3(2, 7, 3));
			geometry.faces.push(new THREE.Face3(2, 6, 7));

			// top
			if (northwest !== southeast) {
				geometry.faces.push(new THREE.Face3(5, 4, 6));
				geometry.faces.push(new THREE.Face3(4, 7, 6));
			} else {
				geometry.faces.push(new THREE.Face3(5, 4, 7));
				geometry.faces.push(new THREE.Face3(6, 5, 7));
			}

			geometry.computeFaceNormals();
			// geometry.computeVertexNormals();

			const mesh = new THREE.Mesh(
				geometry,
				new THREE.MeshNormalMaterial({ wireframe: false })
			);

			mesh.name = "tile";
			mesh.userData.onMouseover = (intersect: THREE.Intersection) => {
				this.pointer.position.copy(intersect.point);
			};

			this.add(mesh);
		}
	}
}

export { Chunk };
