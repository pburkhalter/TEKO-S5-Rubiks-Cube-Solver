import * as THREE from "three";
import { FaceDirection } from "./face";
import config from '../config/config.json';


export class Skybox {
    constructor(scene) {
        this.scene = scene;

        // Define a color for each face direction
        this.faceColors = {
            [FaceDirection.UP]: config.faceColors.white,
            [FaceDirection.BACK]: config.faceColors.red,
            [FaceDirection.LEFT]: config.faceColors.green,
            [FaceDirection.DOWN]: config.faceColors.yellow,
            [FaceDirection.RIGHT]: config.faceColors.blue,
            [FaceDirection.FRONT]: config.faceColors.orange,
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
            side: THREE.DoubleSide,
            color: faceColor,
            //transparent: true,
            //opacity:
        });

        const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);

        // Assign positions and rotations based on the direction
        switch (direction) {
            case FaceDirection.FRONT:
                faceMesh.position.z = -500;
                break;
            case FaceDirection.BACK:
                faceMesh.position.z = 500;
                break;
            case FaceDirection.UP:
                faceMesh.position.y = 500;
                faceMesh.rotation.x = Math.PI / 2;
                break;
            case FaceDirection.DOWN:
                faceMesh.position.y = -500;
                faceMesh.rotation.x = Math.PI / 2;
                break;
            case FaceDirection.RIGHT:
                faceMesh.position.x = 500;
                faceMesh.rotation.y = -Math.PI / 2;
                break;
            case FaceDirection.LEFT:
                faceMesh.position.x = -500;
                faceMesh.rotation.y = Math.PI / 2;
                break;
        }

        this.scene.add(faceMesh);
    }
}
