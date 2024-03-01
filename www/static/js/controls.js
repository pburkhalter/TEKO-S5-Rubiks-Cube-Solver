import * as THREE from 'three';
import Cube from './cube.js';


export function initCube(scene) {
    return new Cube(scene)
}

export function onMouseClick(event, scene, camera, renderer) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Get the canvas element and its bounding rectangle
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    // Convert the mouse position to a coordinate system where the top left of the canvas is (0,0)
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert the mouse position to normalized device coordinates (NDC)
    mouse.x = (mouseX / canvas.width) * 2 - 1;
    mouse.y = - (mouseY / canvas.height) * 2 + 1;

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
