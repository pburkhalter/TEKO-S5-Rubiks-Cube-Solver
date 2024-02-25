import * as THREE from 'three';
import * as wasm from "wasm-rubiks-cube-solver";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { initCube, animateCube, onMouseClick } from './controls.js';
import config from '../config/config.json';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable anti-aliasing
const composer = new EffectComposer(renderer);
const controls = new OrbitControls(camera, renderer.domElement);
const cube = initCube(scene);

// todo: assign actual functions once possible
document.getElementById("start").addEventListener("click", () => { cube.rotateFace("f"); });
document.getElementById("prev").addEventListener("click", () => { cube.rotateFace("B"); });
document.getElementById("playPause").addEventListener("click", () => { cube.rotateFace("L"); });
document.getElementById("next").addEventListener("click", () => { cube.rotateFace("r"); });
document.getElementById("end").addEventListener("click", () => { cube.rotateFace("d'"); });
document.getElementById("reset").addEventListener("click", () => { cube.rotateFace("u'"); });

// B = green
// D = orange
// F = red
// L = yellow
// R = white
// U = blue

document.getElementById("solve").addEventListener("click", () => {
    let cube_state = cube.getCubeState();
    let names = Object.getOwnPropertyNames(cube_state);

    let map = {}
    names.map(name => cube_state[name].map(mapFrontend2Backend).join("")).forEach(face => {
        map[face[4]] = face
    });

    let cube_str = map["W"] + map["R"] + map["G"] + map["Y"] + map["O"] + map["B"];
    console.log(JSON.stringify(cube_str));

    let steps = wasm.solve_cube(cube_str);
    console.log(JSON.stringify(steps));
});

function mapFrontend2Backend(color){
    if (color === "green") {
        return "G"
    }
    if (color === "orange") {
        return "O"
    }
    if (color === "red") {
        return "R"
    }
    if (color === "yellow") {
        return "Y"
    }
    if (color === "white") {
        return "W"
    }
    if (color === "blue") {
        return "B"
    }
    throw new Error("The color name: '" + color + "' is invalid")
}



function onWindowResize() {
    // Update the camera's aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer and composer sizes
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}


// Event-listener setup
function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', event => onMouseClick(event, scene, camera, renderer));
}


// Lighting setup
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(config.ambientLightColor, config.ambientLightIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(config.directionalLightColor, config.directionalLightIntensity);
    directionalLight.position.set(config.directionalLightPosition.x, config.directionalLightPosition.y, config.directionalLightPosition.z);
    scene.add(directionalLight);
}


// Camera setup
function setupCamera() {
    camera.position.set(
        config.cameraPosition.x,
        config.cameraPosition.y,
        config.cameraPosition.z
    );
}


// Scene setup
function setupScene() {
    renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size
    renderer.setClearColor(config.backgroundColor); // Set clear color for the renderer

    document.body.appendChild(renderer.domElement);

    setupLighting();
    setupCamera();

    if (config.debug) {
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
    }

    setupEventListeners();

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
}


function animate() {
    requestAnimationFrame(animate);
    animateCube();
    controls.update();
    renderer.render(scene, camera);

    // Render the scene using the composer
    composer.render();
}

setupScene();
animate();
