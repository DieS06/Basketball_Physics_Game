import Engine from './Engine.js'
import ReScale from '../Utils/ReScale.js';
import * as THREE from 'three';

export default class Collision {
    constructor(projectile, colliders) {
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.reScale = new ReScale(0.25)

        this.projectile = projectile
        this.colliders = colliders // ahora es un array
        this.restitution = 0.85
        this.ballMass = this.projectileMass()

        this.activeCollisions = new Set() // para manejar múltiples colisiones activas
    }

    projectileMass() {
        const density = 0.09
        const volume = 7130
        return density * volume
    }

    rebounceValidation(reboundVelocity = new THREE.Vector3(), projectilePhysics) {
        if (!isFinite(reboundVelocity.x) || !isFinite(reboundVelocity.y)) {
            console.warn("¡Velocidad inválida detectada!");
            if (projectilePhysics) {
                projectilePhysics.inMovement = false;
            }
            return false;
        }
        return true;
    }

    update() {
        if (!this.projectile || !this.colliders || this.colliders.length === 0) return;
        if (!this.projectile.boundingBox) return;

        this.projectile.model.updateMatrixWorld(true);
        this.projectile.boundingBox.setFromObject(this.projectile.model);

        for (const collider of this.colliders) {
            if (!collider.boundingBox) continue;

            collider.model.updateMatrixWorld(true);
            collider.boundingBox.setFromObject(collider.model);

            const id = collider.model.uuid;

            if (this.projectile.boundingBox.intersectsBox(collider.boundingBox)) {
                if (!this.activeCollisions.has(id)) {
                    this.activeCollisions.add(id);
                    console.log(`Collision detected with object ${id}`);

                    this.projectile.boundingBoxHelper.material.color.set(0xff0000);
                    collider.boundingBoxHelper.material.color.set(0xff0000);

                    const projectilePhysics = this.projectile.projectilePhysics;

                    const velocity = new THREE.Vector3(
                        projectilePhysics.velocityX,
                        projectilePhysics.velocityY,
                        projectilePhysics.velocityZ
                    );

                    const normalVector = new THREE.Vector3(1, 0, 0); // Este deberías ajustarlo según la orientación real del objeto
                    const normalComponent = velocity.clone().projectOnVector(normalVector).multiplyScalar(-this.restitution);
                    const tangentialComponent = velocity.clone().sub(velocity.clone().projectOnVector(normalVector));
                    const reboundVelocity = normalComponent.add(tangentialComponent.multiplyScalar(this.restitution));

                    if (this.rebounceValidation(reboundVelocity, projectilePhysics)) {
                        projectilePhysics.velocityX = reboundVelocity.x;
                        projectilePhysics.velocityY = reboundVelocity.y;
                        projectilePhysics.velocityZ = reboundVelocity.z;

                        projectilePhysics.originalPosition.copy(this.projectile.model.position);
                        projectilePhysics.startTime = this.engine.time.current;

                        console.log('Velocidad después del rebote:', reboundVelocity);
                        console.log('Rebote en posición:', this.projectile.model.position);
                    }
                }
            } else {
                if (this.activeCollisions.has(id)) {
                    this.activeCollisions.delete(id);
                    this.projectile.boundingBoxHelper.material.color.set(0xffff00);
                    collider.boundingBoxHelper.material.color.set(0xffff00);
                }
            }
        }
    }
}
