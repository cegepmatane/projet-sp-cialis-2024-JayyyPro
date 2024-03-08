import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 0, 20, 100 );

const controls = new MapControls( camera, renderer.domElement );
controls.enableDamping = true;

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

animate();
