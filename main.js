import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { seededRandom } from 'three/src/math/MathUtils';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Load the glb file sol
const loader = new GLTFLoader();

loader.load('POC_sol.glb', function(gltf) {
    var model = gltf.scene;
    model.position.set(0, 0, 0);
    scene.add(model);
});

var modelsToLoad = ['POC_bureau.glb'];
modelsToLoad.forEach(function(modelFile) {
    loader.load(modelFile, function(gltf) {
        var model = gltf.scene;
        model.position.set(Math.random() * 2.5, 0, Math.random() * 2.5);
        scene.add(model);
    });
});

// Set the camera position
camera.position.z = 10;
camera.position.y = 5;
camera.position.x = 0;
camera.lookAt(0, 0, 0);

// Create light
const light = new THREE.AmbientLight( 0xffffff, 0.5 );
scene.add( light );

// Animate the scene
const animate = function () {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

animate();
