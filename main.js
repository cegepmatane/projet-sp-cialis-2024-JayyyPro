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

const solPosition = [];
const solDimensions = [];
loader.load('POC_sol.glb', function(gltf) {
    var model = gltf.scene;
    model.position.set(0, 0, 0);
    solPosition.push(model.position);
    solDimensions.push(model.scale);
    scene.add(model);
});

const bureauPosition = [];
const bureauDimensions = [];
loader.load('POC_bureau.glb', function(gltf) {
    var model = gltf.scene;
    model.position.set(
        Math.random() * 5, 
        0, 
        Math.random() * 5);
    bureauPosition.push(model.position);
    bureauDimensions.push(model.scale);
    scene.add(model);
});

const crayonPosition = [];
loader.load('POC_crayon.glb', function(gltf) {
    var model = gltf.scene;
    // Positionner le crayon sur le bureau en utilisant ses dimensions et sa position
    model.position.set(
        bureauPosition[0].x + (- bureauDimensions[0].x + Math.random() * (bureauDimensions[0].x * 2)), 
        bureauDimensions[0].y * 2 + 0.4, 
        bureauPosition[0].z + (- bureauDimensions[0].z + Math.random() * (bureauDimensions[0].z * 2)));
    crayonPosition.push(model.position);
    scene.add(model);
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
