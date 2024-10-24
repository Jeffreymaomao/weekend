import * as THREE from 'three';

export function addingLight(scene) {
	// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
	// hemiLight.position.set(0, 20, 0);
	// scene.add(hemiLight);

	// const dirLight = new THREE.DirectionalLight(0xffffff, 3);
	// dirLight.position.set(3, 10, 10);
	// dirLight.castShadow           = true;
	// dirLight.shadow.camera.top    = 2;
	// dirLight.shadow.camera.bottom = -2;
	// dirLight.shadow.camera.left   = -2;
	// dirLight.shadow.camera.right  = 2;
	// dirLight.shadow.camera.near   = 0.1;
	// dirLight.shadow.camera.far    = 40;
	// scene.add(dirLight);

	const hemiLight = new THREE.AmbientLight( 0x666666 )
	scene.add(hemiLight);

	const light1 = new THREE.SpotLight( 0xffffff, 200 );
	light1.position.set( 2, 5, 10 );
	light1.angle = 0.5;
	light1.penumbra = 0.5;

	light1.castShadow = true;
	light1.shadow.mapSize.width = 1024;
	light1.shadow.mapSize.height = 1024;
	scene.add( light1 );

	const light2 = new THREE.SpotLight( 0xffffff, 200 );
	light2.position.set( -1, 3.5, 3.5 );
	light2.angle = 0.5;
	light2.penumbra = 0.5;

	light2.castShadow = true;
	light2.shadow.mapSize.width = 1024;
	light2.shadow.mapSize.height = 1024;
	scene.add( light2 );

	return [light1, light2];
}