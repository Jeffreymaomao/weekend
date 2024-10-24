import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { addingLight } from './scene/light.js'
import { addingGround } from './scene/ground.js'
import { CameraControler } from './scene/control.js'
import { initRenderer } from './scene/renderer.js'
import { Character } from './character/loader.js'

const lightOffset = [
	new THREE.Vector3(2, 5, 10),
	new THREE.Vector3(-1, 3.5, 3.5)
];

class App {
	constructor(){
		this.container = document.getElementById('container');
		this.clock = new THREE.Clock();
		this.scene = this.initScene();
		this.renderer = initRenderer();
		this.lights = addingLight(this.scene);
		this.container.appendChild(this.renderer.domElement);
		this.cameraOffset = new THREE.Vector3(3, 2, 2);
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
		this.scene.add(new THREE.CameraHelper(this.camera));
		// ---
		this.character = new Character({scene: this.scene});
		this.character.load('./assets/Xbot.glb').then((character)=>{
			this.model = character.model; 
			this.cameraControler = new CameraControler({
				model: this.model,
				camera: this.camera,
				dom: this.renderer.domElement,
				cameraOffset: new THREE.Vector3(0, 3, -3),
				cameraTargetOffse: new THREE.Vector3(0,1,0)
			});

			this.character.do('walk');
			let i = 0;
			setInterval(()=>{
				this.character.do(['walk', 'run', 'idle'][i%3]);
				i++;
			}, 2000);

			this.lights[0].target = this.model;
			this.lights[1].target = this.model;

			// ---
			this.renderer.render(this.scene, this.camera);
			this.renderer.setAnimationLoop(this.loop.bind(this));
		});
		// ---
		this.stats = new Stats();
		this.container.appendChild(this.stats.dom);
		// ---
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	initScene() {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x050505);
		scene.fog = new THREE.Fog(0x050505, 2.5, 10);
		this.ground = addingGround(scene);
		return scene;
	}

	loop() {
		const deltaTime = Math.min(this.clock.getDelta(), 0.01);
		this.character.update(deltaTime);
		this.renderer.render(this.scene, this.camera);
		this.stats.update();
		this.cameraControler.update();
		// ---
		this.lights[0].position.copy(this.model.position.clone().add(lightOffset[0]));
		this.lights[1].position.copy(this.model.position.clone().add(lightOffset[1]));
		this.ground.position.x = Math.round(this.camera.position.x / 5) * 5;
		this.ground.position.z = Math.round(this.camera.position.z / 5) * 5;
	}
}

// save memory: https://discourse.threejs.org/t/convenient-three-vector3-caculation-and-without-modify-itself/20783/11

window.app = new App();