import * as THREE from 'three';
import Cube from './cube.js';


export function initCube(scene) {
    let cube = new Cube(scene);

    return cube
}

export function onMouseClick(event, scene, camera) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Convert the mouse position to normalized device coordinates (NDC)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersected by the ray
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const firstIntersectedObject = intersects[0].object;

        if (firstIntersectedObject.userData.parentSubCube) {
            const faceIndex = firstIntersectedObject.userData.faceIndex;
            const subCube = firstIntersectedObject.userData.parentSubCube;

            console.log(subCube.objGroup.position)

            subCube.changeFaceColor(faceIndex);
        }
    }
}

export function animateCube() {
    // Add any animations or updates here if needed
}
