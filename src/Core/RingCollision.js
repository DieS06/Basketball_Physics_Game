import Engine from './Engine.js';
import * as THREE from 'three';

export default class RingCollision {
    constructor(projectile, ring) {
        this.engine = new Engine();
        this.scene = this.engine.scene;

        this.projectile = projectile;
        this.ring = ring;

        this.restitution = 0.75;
        this.activeCollision = false;
        this.ballMass = this.projectileMass();
    }

    projectileMass() {
        const density = 0.09;     // kg/m³ (placeholder)
        const volume = 7130;      // cm³ or mm³ based on your model scale
        return density * volume;
    }

    update() {
        if (!this.projectile || !this.ring) return;
        if (!this.ring.boundingBox || !this.projectile.boundingBox) return;
        // console.log("🌀 RingCollision.update called");
        // console.log("Ball position:", this.projectile.model.position);
        // console.log("Ring position:", this.ring.model.position);

        // const ballPos = this.projectile.model.getWorldPosition(new THREE.Vector3());
        // const ringPos = this.ring.model.getWorldPosition(new THREE.Vector3());
        // const distance = ballPos.distanceTo(ringPos);

        // console.log("📍 Ball World Position:", ballPos);
        // console.log("📍 Ring World Position:", ringPos);
        // console.log("📏 Distance Between:", distance.toFixed(2));

        this.ring.model.updateMatrixWorld(true);
        this.projectile.model.updateMatrixWorld(true);

        this.ring.boundingBox.setFromObject(this.ring.model);
        this.projectile.boundingBox.setFromObject(this.projectile.model);
        // console.log("Ball box:", this.projectile.boundingBox);
        // console.log("Ring box:", this.ring.boundingBox);
        // const distance = this.projectile.model.position.distanceTo(this.ring.model.position);
        // console.log("Distance to ring:", distance);

        if (this.projectile.boundingBox.intersectsBox(this.ring.boundingBox)) {
            if (!this.activeCollision) {
                this.activeCollision = true;

                console.log('🟠 Ring collision detected!');

                this.projectile.boundingBoxHelper.material.color.set(0xff0000);
                this.ring.boundingBoxHelper.material.color.set(0xff0000);

                const projectilePhysics = this.projectile.projectilePhysics;
                const velocity = new THREE.Vector3(
                    projectilePhysics.velocityX,
                    projectilePhysics.velocityY,
                    projectilePhysics.velocityZ
                );

                // 🧠 Compute normal vector from center of ring to collision point
                const Xp = this.projectile.model.position.clone();
                const Xc = this.ring.boundingBox.getCenter(new THREE.Vector3());
                const R = new THREE.Vector3().subVectors(Xp, Xc);
                const N = R.clone().normalize();

                // 🔁 Apply inelastic collision equation
                const dot = velocity.dot(N);
                const Vf = velocity.clone().sub(N.multiplyScalar((1 + this.restitution) * dot));

                // 💾 Update projectile physics velocities
                projectilePhysics.velocityX = Vf.x;
                projectilePhysics.velocityY = Vf.y;
                projectilePhysics.velocityZ = Vf.z;

                // ⏱ Reset timing to apply new motion
                projectilePhysics.originalPosition.copy(this.projectile.model.position);
                projectilePhysics.startTime = this.engine.time.current;

                console.log('📊 Post-ring velocity:', Vf);
            }
        } else {
            this.activeCollision = false;

            this.projectile.boundingBoxHelper.material.color.set(0xffff00);
            this.ring.boundingBoxHelper.material.color.set(0xffff00);
        }
    }
}
