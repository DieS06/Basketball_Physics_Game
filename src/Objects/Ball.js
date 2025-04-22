import Engine from '../Core/Engine.js';
import Projectile_Physics from '../Core/Projectile_Physics.js';
import * as THREE from 'three';

export default class Ball {
    constructor() {
        this.engine = new Engine();
        this.scene = this.engine.scene;
        this.resources = this.engine.resources;
        this.debug = this.engine.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Basketball');
        }

        this.resource = this.resources.items.ballModel;

        this.setModel();
        this.setBoundingBox(); // ✅ Correct spelling here
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.position.set(0, 1, 0); // Slight lift off the ground

        this.scene.add(this.model);

        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.projectilePhysics = new Projectile_Physics(this.model);
    }

    setBoundingBox() {
        this.boundingBox = new THREE.Box3().setFromObject(this.model);
        this.boundingBoxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00); // Yellow for visibility
        this.scene.add(this.boundingBoxHelper);
    }

    shoot(time) {
        if (this.projectilePhysics) {
            this.projectilePhysics.shoot(time);
        }
    }

    update(time) {
        if (this.projectilePhysics) {
            this.projectilePhysics.update(time);
        }

        if (this.boundingBox && this.boundingBoxHelper) {
            this.boundingBox.setFromObject(this.model); // 🔁 Sync every frame
        }
    }
}
