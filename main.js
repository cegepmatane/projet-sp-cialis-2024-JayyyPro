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

// Function to generate a random position for an object without collision with other objects
function generateRandomWithoutCollision(object, minX, maxX, minZ, maxZ) {
    var objectSize = new THREE.Vector3();
    new THREE.Box3().setFromObject(object.children[0]).getSize(objectSize);

    const halfWidth = objectSize.x / 2;
    const halfDepth = objectSize.z / 2;

    let attempts = 0;
    let initialPosition;
    let collisionDetected;

    const maxAttempts = 1000;

    do {
        initialPosition = new THREE.Vector3(
            random(minX, maxX),
            object.position.y,
            random(minZ, maxZ)
        );

        collisionDetected = false;

        for (const obstacleName of objectsToAvoid) {
            const obstacle = scene.getObjectByName(obstacleName);
            if (obstacle.name !== object.name) {
                var obstacleSize = new THREE.Vector3();
                new THREE.Box3().setFromObject(obstacle.children[0]).getSize(obstacleSize);

                const obstacleHalfWidth = obstacleSize.x / 2;
                const obstacleHalfDepth = obstacleSize.z / 2;

                const obstacleMinX = obstacle.position.x - obstacleHalfWidth;
                const obstacleMaxX = obstacle.position.x + obstacleHalfWidth;
                const obstacleMinZ = obstacle.position.z - obstacleHalfDepth;
                const obstacleMaxZ = obstacle.position.z + obstacleHalfDepth;

                if (
                    initialPosition.x + halfWidth >= obstacleMinX &&
                    initialPosition.x - halfWidth <= obstacleMaxX &&
                    initialPosition.z + halfDepth >= obstacleMinZ &&
                    initialPosition.z - halfDepth <= obstacleMaxZ
                ) {
                    collisionDetected = true;
                    break;
                }
            }
        }
        attempts++;
    } while (collisionDetected && attempts < maxAttempts);
    if (attempts === maxAttempts) {
        console.log("Max attempts reached");
    }
    console.log(attempts);

    return initialPosition;
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
            case "Door":
                console.log("Door");
                break;
            case "Bureau":
                console.log("Bureau");
                break;
            case "Lit":
                console.log("Lit");
                break;
            case "dresser_001":
                console.log("Dresser");
                if(scene.getObjectByName("Scratching") === undefined) {
                    removeFromScene("Dresser");
                }
                break;
            case "bathroom_item_001":
                console.log("Laundry");
                break;
            case "closet_001":
                console.log("Closet");
                break;
            case "musical_instrument_001":
                console.log("Piano");
                removeFromScene("Piano");
                break;
            case "scratching_post_001":
                console.log("Scratching");
                if(scene.getObjectByName("Piano") === undefined) {
                    removeFromScene("Scratching");
                }
                break;
            case "lamp_002":
                console.log("Lamp");
                if(scene.getObjectByName("Dresser") === undefined) {
                    removeFromScene("Lamp");
                }
                break;
            case "Cube":
                console.log("Frame");
                if(scene.getObjectByName("Lamp") === undefined) {
                    removeFromScene("Frame");
                }
                break;
            case "flower_001":
                if(scene.getObjectByName("Frame") === undefined) {
                    removeFromScene("Plant");
                    var door = scene.getObjectByName("Door");
                    door.rotation.y = Math.PI / 4;
                    console.log("Porte ouverte");
                    localStorage.setItem('fin du jeu', true);
                }
                break;
            default:
                console.log("Unknown");
        }
    }
}

function loadObject(url, name, dimensions) {
    return new Promise((resolve, reject) => {
        loader.load(url, function (gltf) {
            const model = gltf.scene;
            model.name = name;
            const box = new THREE.Box3().setFromObject(model);
            dimensions.push(box.getSize(new THREE.Vector3()));
            model.dimension = dimensions[0];
            scene.add(model);
            resolve();
        });
    })
}

function positionObject(name, positions, x, y, z) {
    return new Promise((resolve, reject) => {
        const model = scene.getObjectByName(name);
        model.position.set(x, y, z);
        positions.push(model.position);
        resolve();
    });
}

function removeFromScene(name) {
    const model = scene.getObjectByName(name);
    scene.remove(model);
}

// Objects to avoid collision with
const objectsToAvoid = [];

// Position of elements
const solPosition = [];
const doorPosition = [];
const doorOpenPosition = [];
const bureauPosition = [];
const litPosition = [];
const dresserPosition = [];
const laundryPosition = [];
const closetPosition = [];
const pianoPosition = [];
const scratchingPosition = [];
const lampPosition = [];
const framePosition = [];
const plantPosition = [];

// Dimensions of elements
const solDimensions = [];
const doorDimensions = [];
const doorOpenDimensions = [];
const bureauDimensions = [];
const litDimensions = [];
const dresserDimensions = [];
const laundryDimensions = [];
const closetDimensions = [];
const pianoDimensions = [];
const scratchingDimensions = [];
const lampDimensions = [];
const frameDimensions = [];
const plantDimensions = [];

const loadSolPromise = loadObject('FINAL_sol.glb', 'Sol', solDimensions);
const loadDoorPromise = loadObject('door.glb', 'Door', doorDimensions);
const loadDoorOpenPromise = loadObject('door.glb', 'DoorOpen', doorOpenDimensions);
const loadBureauPromise = loadObject('bureau.glb', 'Bureau', bureauDimensions);
const loadLitPromise = loadObject('lit.glb', 'Lit', litDimensions);
const loadDresserPromise = loadObject('dresser.glb', 'Dresser', dresserDimensions);
const loadLaundryPromise = loadObject('laundry.glb', 'Laundry', laundryDimensions);
const loadClosetPromise = loadObject('closet.glb', 'Closet', closetDimensions);
const loadPianoPromise = loadObject('piano.glb', 'Piano', pianoDimensions);
const loadScratchingPromise = loadObject('scratching.glb', 'Scratching', scratchingDimensions);
const loadLampPromise = loadObject('lamp.glb', 'Lamp', lampDimensions);
const loadFramePromise = loadObject('FINAL_frame.glb', 'Frame', frameDimensions);
const loadPlantPromise = loadObject('plant.glb', 'Plant', plantDimensions);

Promise.all([
    loadSolPromise,
    loadDoorPromise,
    loadDoorOpenPromise,
    loadBureauPromise,
    loadLitPromise,
    loadDresserPromise,
    loadLaundryPromise,
    loadClosetPromise,
    loadPianoPromise,
    loadScratchingPromise,
    loadLampPromise,
    loadFramePromise,
    loadPlantPromise
]).then(() => {

    const positionSolPromise = positionObject('Sol', solPosition, solDimensions[0].x / 2, 0, solDimensions[0].z / 2);
    const positionDoorPromise = positionObject('Door', doorPosition, 0.25, 0.1, solDimensions[0].z - doorDimensions[0].z / 4);
    objectsToAvoid.push("Door");
    const positionDoorOpenPromise = positionObject('DoorOpen', doorOpenPosition, 0.25, 0.1, solDimensions[0].z - doorOpenDimensions[0].z / 4 - 1.5);
    objectsToAvoid.push("DoorOpen");
    const positionBureau = generateRandomWithoutCollision(scene.getObjectByName('Bureau'), bureauDimensions[0].x / 2, solDimensions[0].x - bureauDimensions[0].x / 2, bureauDimensions[0].z / 2, solDimensions[0].z - bureauDimensions[0].z / 2);
    const positionBureauPromise = positionObject('Bureau', bureauPosition, positionBureau.x, 0, positionBureau.z);
    objectsToAvoid.push("Bureau");
    const positionLit = generateRandomWithoutCollision(scene.getObjectByName('Lit'), litDimensions[0].x / 2, solDimensions[0].x - litDimensions[0].x / 2, litDimensions[0].z / 2, solDimensions[0].z - litDimensions[0].z / 2);
    const positionLitPromise = positionObject('Lit', litPosition, positionLit.x, 0, positionLit.z);
    objectsToAvoid.push("Lit");
    const positionDresser = generateRandomWithoutCollision(scene.getObjectByName('Dresser'), dresserDimensions[0].x / 2, solDimensions[0].x - dresserDimensions[0].x / 2, dresserDimensions[0].z / 2, solDimensions[0].z - dresserDimensions[0].z / 2);
    const positionDresserPromise = positionObject('Dresser', dresserPosition, positionDresser.x, 0, positionDresser.z);
    objectsToAvoid.push("Dresser");
    const positionLaundry = generateRandomWithoutCollision(scene.getObjectByName('Laundry'), laundryDimensions[0].x / 2, solDimensions[0].x - laundryDimensions[0].x / 2, laundryDimensions[0].z / 2, solDimensions[0].z - laundryDimensions[0].z / 2);
    const positionLaundryPromise = positionObject('Laundry', laundryPosition, positionLaundry.x, 0, positionLaundry.z);
    objectsToAvoid.push("Laundry");
    const positionCloset = generateRandomWithoutCollision(scene.getObjectByName('Closet'), closetDimensions[0].x / 2, solDimensions[0].x - closetDimensions[0].x / 2, closetDimensions[0].z / 2, solDimensions[0].z - closetDimensions[0].z / 2);
    const positionClosetPromise = positionObject('Closet', closetPosition, positionCloset.x, 0, positionCloset.z);
    objectsToAvoid.push("Closet");
    const positionPiano = generateRandomWithoutCollision(scene.getObjectByName('Piano'), pianoDimensions[0].x / 2, solDimensions[0].x - pianoDimensions[0].x / 2, pianoDimensions[0].z / 2, solDimensions[0].z - pianoDimensions[0].z / 2);
    const positionPianoPromise = positionObject('Piano', pianoPosition, positionPiano.x, 0, positionPiano.z);
    objectsToAvoid.push("Piano");
    const positionScratching = generateRandomWithoutCollision(scene.getObjectByName('Scratching'), scratchingDimensions[0].x / 2, solDimensions[0].x - scratchingDimensions[0].x / 2, scratchingDimensions[0].z / 2, solDimensions[0].z - scratchingDimensions[0].z / 2);
    const positionScratchingPromise = positionObject('Scratching', scratchingPosition, positionScratching.x, 0, positionScratching.z);
    objectsToAvoid.push("Scratching");
    const positionLamp = generateRandomWithoutCollision(scene.getObjectByName('Lamp'), lampDimensions[0].x / 2, solDimensions[0].x - lampDimensions[0].x / 2, lampDimensions[0].z / 2, solDimensions[0].z - lampDimensions[0].z / 2);
    const positionLampPromise = positionObject('Lamp', lampPosition, positionLamp.x, 0, positionLamp.z);
    objectsToAvoid.push("Lamp");
    const positionFramePromise = positionObject('Frame', framePosition, laundryPosition[0].x, frameDimensions[0].y / 2, laundryPosition[0].z);
    objectsToAvoid.push("Frame");
    const positionPlantPromise = positionObject('Plant', plantPosition, 
        random(
            bureauPosition[0].x - bureauDimensions[0].x / 2 + plantDimensions[0].x / 2, 
            bureauPosition[0].x + bureauDimensions[0].x / 2 - plantDimensions[0].x / 2
        ), 
        bureauDimensions[0].y,
        random(
            bureauPosition[0].z - bureauDimensions[0].z / 2 + plantDimensions[0].z / 2, 
            bureauPosition[0].z + bureauDimensions[0].z / 2 - plantDimensions[0].z / 2
        )
    );

    removeFromScene('DoorOpen');

    return Promise.all([
        positionSolPromise,
        positionDoorPromise,
        positionDoorOpenPromise,
        positionBureauPromise,
        positionLitPromise,
        positionDresserPromise,
        positionLaundryPromise,
        positionClosetPromise,
        positionPianoPromise,
        positionScratchingPromise,
        positionLampPromise,
        positionFramePromise,
        positionPlantPromise
    ]);
}).then(() => {
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
