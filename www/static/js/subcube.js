import * as THREE from 'three';
import {FaceDirection} from './face.js'

class SubCube {
    constructor(x, y, z, faceColors, cubeSize, cubeGap, scene) {
        this.objGroup = new THREE.Group();
        this.objGroup.userData.isSubCube = true;
        this.objGroup.userData.subCubeInstance = this;

        this.scene = scene;

        // these are the static cubes (in the middle of each layer) [x, y, z]
        this.staticCubes = [
            [0, 0, 1],
            [1, 0, 0],
            [0, 0, -1],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
        ]

        this.faces = {
            front: null,
            back: null,
            up: null,
            down: null,
            right: null,
            left: null,
        };

        this.x = x;
        this.y = y;
        this.z = z;

        this.faceColors = faceColors;

        this.init(faceColors, cubeSize, cubeGap);
    }

    init(faceColors, cubeSize, cubeGap) {
        for (let i = 0; i < 6; i++) {
            const face = this.createFace(i, faceColors, cubeSize);
            this.objGroup.add(face);
        }

        this.objGroup.position.set(
            this.x + Math.sign(this.x) * cubeGap,
            this.y + Math.sign(this.y) * cubeGap,
            this.z + Math.sign(this.z) * cubeGap
        );
    }

    createFace(index, faceColors, cubeSize) {
        const color = this.getFaceColor(index, faceColors)
        const faceGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize);
        const faceMaterial = new THREE.MeshStandardMaterial({
            color: color.hex,
            side: THREE.DoubleSide
        });

        const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);

        faceMesh.userData.faceColorName = color.name;
        faceMesh.userData.faceIndex = index;
        faceMesh.userData.parentSubCube = this;

        switch (index) {
            case FaceDirection.FRONT:
                faceMesh.position.z = cubeSize / 2;
                this.faces.front = faceMesh;
                break;
            case FaceDirection.BACK:
                faceMesh.position.z = -cubeSize / 2;
                faceMesh.rotation.y = Math.PI;
                this.faces.back = faceMesh;
                break;
            case FaceDirection.UP:
                faceMesh.position.y = cubeSize / 2;
                faceMesh.rotation.x = -Math.PI / 2;
                this.faces.up = faceMesh;
                break;
            case FaceDirection.DOWN:
                faceMesh.position.y = -cubeSize / 2;
                faceMesh.rotation.x = Math.PI / 2;
                this.faces.down = faceMesh;
                break;
            case FaceDirection.RIGHT:
                faceMesh.position.x = cubeSize / 2;
                faceMesh.rotation.y = -Math.PI / 2;
                this.faces.right = faceMesh;
                break;
            case FaceDirection.LEFT:
                faceMesh.position.x = -cubeSize / 2;
                faceMesh.rotation.y = Math.PI / 2;
                this.faces.left = faceMesh;
                break;
        }

        return faceMesh;
    }

    getFaceColor(index, faceColors) {
        let colorValue;

        switch (index) {
            case FaceDirection.FRONT:
                colorValue = this.z === 1 ? faceColors.red : faceColors.default;
                break;
            case FaceDirection.BACK:
                colorValue = this.z === -1 ? faceColors.orange : faceColors.default;
                break;
            case FaceDirection.UP:
                colorValue = this.y === 1 ? faceColors.white : faceColors.default;
                break;
            case FaceDirection.DOWN:
                colorValue = this.y === -1 ? faceColors.yellow : faceColors.default;
                break;
            case FaceDirection.RIGHT:
                colorValue = this.x === 1 ? faceColors.blue : faceColors.default;
                break;
            case FaceDirection.LEFT:
                colorValue = this.x === -1 ? faceColors.green : faceColors.default;
                break;
            default:
                colorValue = faceColors.default;
                break;
        }

        return {
            name: Object.keys(faceColors).find(key => faceColors[key] === colorValue),
            hex: colorValue
        };
    }

    getNextFaceColorByName(faceColorName) {
        // Find the position of the current color inside the faceColors object
        const currentIndex = Object.keys(this.faceColors).indexOf(faceColorName);
        const nextIndex = (currentIndex + 1) % (Object.keys(this.faceColors).length - 1);

        // Get the value of the next color
        const nextColorName = Object.keys(this.faceColors)[nextIndex];
        const nextColorValue = this.faceColors[nextColorName];

        return {
            name: nextColorName,
            hex: nextColorValue
        };
    }

    changeFaceColor(faceIndex) {
        // Find the specific face mesh using the faceIndex
        const faceMesh = this.objGroup.children.find(mesh => mesh.userData.faceIndex === faceIndex);

        if (faceMesh) {
            // Get the current and new colors
            const currentFaceColorName = faceMesh.userData.faceColorName;
            const newFaceColor = this.getNextFaceColorByName(currentFaceColorName)

            // Get the coordinates of the cube
            const cubeCoordinates = JSON.stringify([
                this.x,
                this.y,
                this.z
            ]);

            // Check if cube is static (middle of each layer)
            const cubeIsStatic = this.staticCubes.some(arr => JSON.stringify(arr) === cubeCoordinates);

            if (!cubeIsStatic) {
                // Create a new material with the desired color and make it double-sided
                // Replace the existing material of the face with the new material
                faceMesh.material = new THREE.MeshStandardMaterial({ color: newFaceColor.hex, side: THREE.DoubleSide });
                faceMesh.userData.faceColorName = newFaceColor.name;
            }
            else {
                console.log("Cannot change center cube!");
            }
        }
    }

    castRayPerpendicularFromFace(mesh) {
        // Assuming mesh is the face mesh and has userData indicating its orientation
        const geometry = mesh.geometry;
        const normal = new THREE.Vector3();

        // Set the normal based on face orientation
        // This is a simplified example; adjust based on your actual face orientation logic
        switch (mesh.userData.faceIndex) {
            // Assuming these faceIndex values correspond to your cube's faces
            case FaceDirection.FRONT:
            case FaceDirection.BACK:
                normal.set(0, 0, mesh.userData.faceIndex === FaceDirection.FRONT ? 1 : -1);
                break;
            case FaceDirection.UP:
            case FaceDirection.DOWN:
                normal.set(0, mesh.userData.faceIndex === FaceDirection.UP ? 1 : -1, 0);
                break;
            case FaceDirection.RIGHT:
            case FaceDirection.LEFT:
                normal.set(mesh.userData.faceIndex === FaceDirection.RIGHT ? 1 : -1, 0, 0);
                break;
        }

        // Calculate the center of the face
        // For simplicity, assuming the mesh's position is the center of the face
        const center = mesh.position.clone();

        // Perform raycasting from the center in the direction of the normal
        const raycaster = new THREE.Raycaster(center, normal);
        const intersects = raycaster.intersectObjects(this.scene.children, true);

        // Process intersections
        if (intersects.length > 0) {
            for(const isect in intersects){
                console.log(intersects[isect])
                if('name' in intersects[isect].object.userData){
                    if(intersects[isect].distance > 2){ // skybox is far away, so we ignore all near intersects...
                        console.log("Found intersect with " + intersects[isect].object.userData.name + " Skybox")
                    }
                }
            }
        } else {
            console.log('No intersections found.');
        }
    }
}

export default SubCube;
