import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initControls(camera, domElement) {
	const controls = new OrbitControls(camera, domElement);
	controls.enablePan = false;
	controls.enableZoom = false;
	controls.target.set(0, 1, 0);
	controls.update();

	let userIsInteracting = false;

	controls.addEventListener('start', () => {
		userIsInteracting = true;
	});

	controls.addEventListener('end', () => {
		userIsInteracting = false;
	});

	return { controls, isUserInteracting: () => userIsInteracting };

	return controls;
}

export class CameraControler {
	constructor(config={}) {
		this.model = config.model;
		this.camera = config.camera;
		this.dom = config.dom;
		this.cameraOffset = config.cameraOffset || new THREE.Vector3(3, 2, 2);
		this.cameraTargetOffset = config.cameraTargetOffset || new THREE.Vector3(0,1,0);
		this.cameraTarget = this.model.position.clone().add(this.cameraTargetOffset);
		// ---
		this.controls = new OrbitControls(this.camera, this.dom);
		this.controls.enablePan = false;
		this.controls.enableZoom = true;
		this.controls.target.set(this.cameraTargetOffset);
		this.controls.update(); 
		// ---
		this.camera.position.copy(this.cameraOffset);
		this.camera.lookAt(this.cameraTargetOffset);
		// ---
		this.userIsInteracting = false;
		this.controls.addEventListener('start', function (){
			this.userIsInteracting = true;
		}.bind(this));
		this.controls.addEventListener('end', function (){
			this.userIsInteracting = false;
		}.bind(this));
	}

	update() {
		const rotatedCameraOffset = this.cameraOffset.clone().applyQuaternion(this.model.quaternion)
		if(this.userIsInteracting) {
			// this.cameraOffset.lerp(this.camera.position.clone().sub(this.model.position), 0.1);
		} else {
			this.camera.position.lerp(this.model.position.clone().add(rotatedCameraOffset), 0.03);
		}
		// ---
		this.cameraTarget = this.model.position.clone().add(this.cameraTargetOffset);
		this.controls.target = this.cameraTarget;
		this.camera.lookAt(this.cameraTarget);
	}
}