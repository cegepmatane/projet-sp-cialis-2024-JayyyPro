import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
        const fixedX = solDimensions[0].x / 2;
        const fixedY = 0;
        const fixedZ = solDimensions[0].z / 2;
        model.position.set(fixedX, fixedY, fixedZ);
        scene.add(model);
        resolve();
    });
});

const loadBureauPromise = new Promise((resolve, reject) => {
    loader.load('POC_bureau.glb', function (gltf) {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        bureauDimensions.push(box.getSize(new THREE.Vector3()));
        const randomX = random(
            bureauDimensions[0].x / 2, 
            solDimensions[0].x - bureauDimensions[0].x / 2
            );
        const randomZ = random(
            bureauDimensions[0].z / 2, 
            solDimensions[0].z - bureauDimensions[0].z / 2
            );
        model.position.set(randomX, 0, randomZ);

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
        const randomX = random(
            bureauPosition[0].x - bureauDimensions[0].x / 2 + crayonDimensions[0].x / 2, 
            bureauPosition[0].x + bureauDimensions[0].x / 2 - crayonDimensions[0].x / 2
            );
        const fixedY = bureauDimensions[0].y + crayonDimensions[0].y;
        const randomZ = random(
            bureauPosition[0].z - bureauDimensions[0].z / 2 + crayonDimensions[0].z / 2, 
            bureauPosition[0].z + bureauDimensions[0].z / 2 - crayonDimensions[0].z / 2
            );
        model.position.set(randomX, fixedY, randomZ);
        crayonPosition.push(model.position);
        scene.add(model);
    });

    var centreScene = new THREE.Vector3(0 + solDimensions[0].x / 2, 0, 0 + solDimensions[0].z / 2);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(centreScene);
    controls.enablePan = false;

    camera.position.z = 10 + solDimensions[0].z / 2;
    camera.position.y = 5;
    camera.position.x = 0 + solDimensions[0].x / 2;
    camera.lookAt(centreScene);

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();
});
