import * as THREE from "three";
import { FaceDirection } from "./face";
import config from '../config/config.json';


export class Skybox {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group()
        this.group.name = "skybox";

        // Define a color for each face direction
        this.faceColors = {
            [FaceDirection.UP]: config.faceColors.white,
            [FaceDirection.BACK]: config.faceColors.orange,
            [FaceDirection.LEFT]: config.faceColors.green,
            [FaceDirection.DOWN]: config.faceColors.yellow,
            [FaceDirection.RIGHT]: config.faceColors.blue,
            [FaceDirection.FRONT]: config.faceColors.red,
        };

        for (const direction of [
            FaceDirection.UP,
            FaceDirection.BACK,
            FaceDirection.LEFT,
            FaceDirection.DOWN,
            FaceDirection.RIGHT,
            FaceDirection.FRONT,
        ]) {
            this.createBigFace(direction);
        }
    }

    createBigFace(direction) {
        const faceGeometry = new THREE.PlaneGeometry(250, 250);
        const faceColor = this.faceColors[direction];
        const faceMaterial = new THREE.MeshStandardMaterial({
            color: faceColor,
            transparent: true,
            opacity: 0
        });
        if(config.debug){
            faceMaterial.transparent = false;
            faceMaterial.opacity = 1;
        }


        const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);

        // Assign positions and rotations based on the direction
        switch (direction) {
            case FaceDirection.FRONT:
                faceMesh.userData.name = "FRONT";
                faceMesh.position.z = 100;
                faceMesh.rotation.x = Math.PI;
                break;
            case FaceDirection.BACK:
                faceMesh.userData.name = "BACK";
                faceMesh.position.z = -100;
                break;
            case FaceDirection.UP:
                faceMesh.userData.name = "UP";
                faceMesh.position.y = 100;
                faceMesh.rotation.x = Math.PI / 2;
                break;
            case FaceDirection.DOWN:
                faceMesh.userData.name = "DOWN";
                faceMesh.position.y = -100;
                faceMesh.rotation.x = Math.PI / 2;
                faceMesh.rotation.y = Math.PI;
                break;
            case FaceDirection.RIGHT:
                faceMesh.userData.name = "RIGHT";
                faceMesh.position.x = 100;
                faceMesh.rotation.y = -Math.PI / 2;
                break;
            case FaceDirection.LEFT:
                faceMesh.userData.name = "LEFT";
                faceMesh.position.x = -100;
                faceMesh.rotation.y = Math.PI / 2;
                break;
        }

        this.group.add(faceMesh);
        this.scene.add(this.group);
    }
}
