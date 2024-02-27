import * as THREE from "three";
import {FaceDirection} from "./face";
import {Color} from "three";


export class Skybox {

    constructor(scene){
        this.scene = scene

        for(const name of [
            FaceDirection.UP,
            FaceDirection.BACK,
            FaceDirection.LEFT,
            FaceDirection.DOWN,
            FaceDirection.RIGHT,
            FaceDirection.FRONT]){
            this.createBigFace(name)
        }
    }

    createBigFace(name, position){
        const faceGeometry = new THREE.PlaneGeometry(100000, 100000);
        const faceMaterial = new THREE.MeshStandardMaterial({
            color: "#FF0000",
            side: THREE.DoubleSide
        });

        const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
        faceMesh.userData.name = name;

        switch (name) {
            case FaceDirection.FRONT:
                faceMesh.position.z = -1000;
                break;
            case FaceDirection.BACK:
                faceMesh.position.z = 1000;
                break;
            case FaceDirection.UP:
                faceMesh.position.y = 1000;
                faceMesh.rotation.x = Math.PI / 2;
                break;
            case FaceDirection.DOWN:
                faceMesh.position.y = -1000;
                faceMesh.rotation.x = Math.PI / 2;
                break;
            case FaceDirection.RIGHT:
                faceMesh.position.x = 1000;
                faceMesh.rotation.y = -Math.PI / 2;
                break;
            case FaceDirection.LEFT:
                faceMesh.position.x = -1000;
                faceMesh.rotation.y = Math.PI / 2;
                break;
        }

        this.scene.add(faceMesh)
    }

}

