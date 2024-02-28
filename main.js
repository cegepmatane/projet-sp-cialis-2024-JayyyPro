import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

// Random function to generate a random number between two values
function random(min, max) {
    return min + Math.random() * (max - min);
}

// Position of elements
const bureauPosition = [];

// Dimensions of elements
const solDimensions = [];
const bureauDimensions = [];
const crayonDimensions = [];

const loadSolPromise = new Promise((resolve, reject) => {
    loader.load('POC_sol.glb', function (gltf) {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        solDimensions.push(box.getSize(new THREE.Vector3()));
        model.position.set(
            solDimensions[0].x / 2, 
            0, 
            solDimensions[0].z / 2);
        scene.add(model);
        resolve();
    });
});

console.log(solDimensions);

const loadBureauPromise = new Promise((resolve, reject) => {
    loader.load('POC_bureau.glb', function (gltf) {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        bureauDimensions.push(box.getSize(new THREE.Vector3()));
        model.position.set(
            random(bureauDimensions[0].x / 2, solDimensions[0].x - bureauDimensions[0].x / 2),
            0,
            random(bureauDimensions[0].z / 2, solDimensions[0].z - bureauDimensions[0].z / 2));
        bureauPosition.push(model.position);
        scene.add(model);
        resolve();
    });
});

Promise.all([loadSolPromise, loadBureauPromise]).then(() => {
    const crayonPosition = [];
    loader.load('POC_crayon.glb', function (gltf) {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        crayonDimensions.push(box.getSize(new THREE.Vector3()));
        model.position.set(
            bureauPosition[0].x,
            bureauDimensions[0].y + crayonDimensions[0].y,
            bureauPosition[0].z);
        crayonPosition.push(model.position);
        scene.add(model);
    });

    camera.position.z = 10 + solDimensions[0].z / 2;
    camera.position.y = 5;
    camera.position.x = 0 + solDimensions[0].x / 2;
    camera.lookAt(
        0 + solDimensions[0].x / 2, 
        0, 
        0 + solDimensions[0].z / 2);

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
});
