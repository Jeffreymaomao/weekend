import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { setWeight, crossFadeAction } from './animations.js';

const _velocityMappingConfig = {
	'run': 3.8,
	'walk': 1.6
}

export class Character {
	constructor(config={}) {
		this.scene = config.scene;
		this.actionStates = {};
		this.poseStates = {};
		this.currentActionName = null; // start from no action
		this.model = null; // loading after user call `load()`
		this.mixer = null; // loading after user call `load()`
		this.speed = 0;
		this.targetSpeed = 0;
		// this.direction = THREE.Vector3(0, 0, 0);
	}

	updatePositionEuler(obj, v={x:0, y:0, z:0}, dt) {
		obj.position.x = obj.position.x + v.x * dt;
		obj.position.y = obj.position.y + v.y * dt;
		obj.position.z = obj.position.z + v.z * dt;
	}

	do(actionName) {
		const currentActionState = this.actionStates[this.currentActionName];
		const nextActionState    = this.actionStates[actionName];
		if(!nextActionState) throw Error(`Action "${actionName}" is not in this character.`);
		crossFadeAction(this.mixer, currentActionState, nextActionState, 0.4);
		this.currentActionName = actionName;
		this.targetSpeed = nextActionState.speed || 0;
	}

	update(deltaTime=0.0) {
		this.mixer.update(deltaTime);

		const transitionRate = 40.0 * Math.exp(-this.targetSpeed);
		this.speed += (this.targetSpeed - this.speed) * transitionRate * deltaTime;
		
		this.updatePositionEuler(this.model, {x:0, y:0, z: this.speed*this.mixer.timeScale}, deltaTime);
	}

	load(modelURL) {
		const scene = this.scene;
		const loader = new GLTFLoader();
		return new Promise((resolve, reject) => {
			loader.load(modelURL, (gltf)=>{
				const model = gltf.scene;
				scene.add(model);
				// ---
				model.traverse((object)=>{
					// object.visible = false
					if (object.isMesh) object.castShadow = true;
				});
				// ---
				const skeleton = new THREE.SkeletonHelper(model);
				skeleton.visible = false;
				scene.add(skeleton);
				// ---
				const animations = gltf.animations;
				const mixer = new THREE.AnimationMixer(model);
				const actionStates={}, poseStates={};
				Object.values(animations).forEach((animation)=>{
					const name = animation.name;
					const isPoseAnimation = name.endsWith('_pose');
					if (isPoseAnimation) {
						THREE.AnimationUtils.makeClipAdditive(animation);
						animation = THREE.AnimationUtils.subclip(animation, name, 2, 3, 30);
					}
					const action = mixer.clipAction(animation);
					setWeight(action, { weight: 0 });
					action.play();
					if(isPoseAnimation){
						poseStates[name] = { name: name, weight: 0, action: action };
					} else {
						actionStates[name] = { name: name, weight: 0, action: action, speed: 0};
					}
				});

				if(_velocityMappingConfig) {
					Object.keys(_velocityMappingConfig).forEach((_actionName)=>{
						if(_actionName in actionStates){
							actionStates[_actionName].speed = _velocityMappingConfig[_actionName];
						}
					});
				}

				this.model = model;
				this.actionStates = actionStates;
				this.poseStates = poseStates;
				this.mixer = mixer;

				resolve({'model'  : model});
			});
		});
	}
}