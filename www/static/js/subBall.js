import * as THREE from 'three';

class SubBall {
    constructor(x, y, z, sphereRadius) {
        // Create geometry and material for the sphere (ball)
        const geometry = new THREE.SphereGeometry(sphereRadius / 5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        // Create a mesh using the geometry and material and assign it to this.object
        this.object = new THREE.Mesh(geometry, material);

        this.object.name = "subball"

        // Set user data properties on the object if needed
        this.object.userData.isSubBall = true;
        this.object.userData.subBallInstance = this;

        this.object.userData.name = `${x}.${y}.${z}`

        // Correctly set the position of the object
        this.object.position.set(x, y, z);
    }
}

export default SubBall;
