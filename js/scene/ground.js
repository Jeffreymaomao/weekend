import * as THREE from 'three';

export function addingGround(scene) {
	// const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
	// mesh.rotation.x = -Math.PI / 2;
	// mesh.receiveShadow = true;
	// scene.add(mesh);

	const gt = new THREE.TextureLoader()
	// .load( './assets/DirtTextureSeamless17.jpg');
	// .load( './assets/grasslight-big.jpg');
	.load( './assets/blocks.jpg');
	const gg = new THREE.PlaneGeometry( 20, 20 );
	const gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

	const ground = new THREE.Mesh( gg, gm );
	ground.rotation.x = - Math.PI / 2;
	ground.material.map.repeat.set( 8, 8 );
	ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
	ground.material.map.colorSpace = THREE.SRGBColorSpace;
	ground.receiveShadow = true;

	scene.add( ground );
	return ground;
}