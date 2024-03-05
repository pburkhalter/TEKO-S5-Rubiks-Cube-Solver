import * as THREE from 'three';
import * as wasm from "wasm-rubiks-cube-solver";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { initCube, animateCube, onMouseClick } from './controls.js';
import {initSteps, convertMovesToSteps} from './steps.js';
import { Skybox } from './skybox';
import config from '../config/config.json';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable anti-aliasing
const composer = new EffectComposer(renderer);
const controls = new OrbitControls(camera, renderer.domElement);
const skyBox = new Skybox(scene);  // eslint-disable-line no-unused-vars
let cube = initCube(scene);
let steps_state = initSteps(convertMovesToSteps(["L", "R", "U2", "R'"]));

// todo: assign actual functions once possible
document.getElementById("start").addEventListener("click", () => {
    let moves = null;
    while ((moves = steps_state.undo()) != null) {
        moves.forEach(move => {
            cube.rotateFace(move);
            setActiveStep(steps_state)
        });
    }
});
document.getElementById("prev").addEventListener("click", () => {
    let moves = steps_state.undo();
    if (moves == null) {
        return;
    }
    moves.forEach(move => {
        cube.rotateFace(move);
        setActiveStep(steps_state);
    });
});
document.getElementById("playPause").addEventListener("click", async () => {
    //ToDo add a pause function
    let move = null;
    while((move = steps_state.do()) != null){
        await new Promise(resolve => setTimeout(resolve, config.timeout));

        cube.rotateFace(move);
        setActiveStep(steps_state);
    }
});
document.getElementById("next").addEventListener("click", () => {
    let move = steps_state.do();
    if (move == null) {
        return;
    }
    cube.rotateFace(move);
    setActiveStep(steps_state);
});
document.getElementById("end").addEventListener("click", () => {
    let move = null;
    while((move = steps_state.do()) != null){
        cube.rotateFace(move);
        setActiveStep(steps_state);
    }
});
document.getElementById("reset").addEventListener("click", () => {
    cube = initCube(scene);
    steps_state = initSteps();
});

// B = green
// D = orange
// F = red
// L = yellow
// R = white
// U = blue

document.getElementById("solve").addEventListener("click", () => {
    const cube_state = cube.getCubeState();
    const moves = wasm.solve_cube(cube_state);
    const steps = convertMovesToSteps(moves);
    steps_state.setSteps(steps);

    const steps_span = document.getElementById('steps');
    steps_state.steps.forEach(step => {
        const step_span = document.createElement('span');
        step_span.innerText = step.move;
        steps_span.appendChild(step_span);
    });

    setActiveStep(steps_state);

    if(config.debug) {
        console.log(JSON.stringify(steps));
    }
});



document.getElementById("show").addEventListener("click", () => {
    const cube_state = cube.getCubeState();
    console.log(cube_state);
});

function setActiveStep(steps_state){
    const steps_span = document.getElementById('steps');

    const children = Array.from(steps_span.children);
    children.forEach(child => child.classList.remove('step-active'));

    if (steps_span.children[steps_state.index]){
        steps_span.children[steps_state.index].classList.add('step-active');
    }
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
