import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

localStorage.setItem('fin du jeu', false);

const loader = new GLTFLoader();

// Random function to generate a random number between two values
function random(min, max) {
    return min + Math.random() * (max - min);
}

// Function to detect the object clicked
function onDocumentMouseDown(event) {
    event.preventDefault();

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        switch (intersects[0].object.name) {
            case "Sol":
                console.log("Sol");
                break;
            case "door_001":
                console.log("Door");
                break;
            case "Bureau":
                console.log("Bureau");
                break;
            case "Crayon":
                var crayon = scene.getObjectByName("Crayon");
                crayon.removeFromParent();
                console.log("Crayon retiré");
                var door = scene.getObjectByName("door_001");
                door.rotation.z = -Math.PI / 4;
                console.log("Porte ouverte");
                localStorage.setItem('fin du jeu', true);
                break;
            default:
                console.log("Unknown");
        }
    }
}

// Position of elements
const bureauPosition = [];

// Dimensions of elements
const solDimensions = [];
const doorDimensions = [];
const bureauDimensions = [];
const crayonDimensions = [];
const frameDimensions = [];

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

loadSolPromise.then(() => {
    const loadDoorPromise = new Promise((resolve, reject) => {
        loader.load('PROTO_door.glb', function (gltf) {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            doorDimensions.push(box.getSize(new THREE.Vector3()));
            const fixedX = 0.25;
            const fixedY = 0.1;
            const fixedZ = solDimensions[0].z - doorDimensions[0].z / 4;
            model.position.set(fixedX, fixedY, fixedZ);
            scene.add(model);
            resolve();
        });
    });

    return loadDoorPromise;
}).then(() => {
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

    return loadBureauPromise;
}).then(() => {
    const loadFramePromise = new Promise((resolve, reject) => {
        loader.load('FINAL_frame.glb', function (gltf) {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            frameDimensions.push(box.getSize(new THREE.Vector3()));
            const fixedX = solDimensions[0].x - frameDimensions[0].x / 2;
            const fixedY = frameDimensions[0].y / 2;
            const fixedZ = solDimensions[0].z - frameDimensions[0].z / 2;
            model.position.set(fixedX, fixedY, fixedZ);
            scene.add(model);
            resolve();
        });
    });
}).then(() => {
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
    
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

    animate();
});
