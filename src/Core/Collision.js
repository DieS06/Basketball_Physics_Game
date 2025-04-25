import Engine from './Engine.js'
import ReScale from '../Utils/ReScale.js';
import * as THREE from 'three';

export default class Collision {
    constructor(projectile, colliders, circleCollider) {
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.reScale = new ReScale(0.25)

        this.projectile = projectile
        this.colliders = colliders 
        this.circleCollider = circleCollider

        this.restitution = 0.85
        this.ballMass = this.projectileMass()
        this.activeCollisions = new Set()
    }

    projectileMass() {
        const density = 0.09
        const volume = 7130
        return density * volume
    }

    rebounceValidation(reboundVelocity = new THREE.Vector3(), projectilePhysics) {
        if (!isFinite(reboundVelocity.x) || !isFinite(reboundVelocity.y)) {
            console.warn("¡Velocidad inválida detectada!");
            if (projectilePhysics) projectilePhysics.inMovement = false;
            return false;
        }
        return true;
    }

    update() {
        if (!this.projectile || !this.colliders || !this.projectile.boundingBox) return;

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

                    const normalVector = new THREE.Vector3(1, 0, 0); 
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
                const id = collider.model.uuid;
                if (this.activeCollisions.has(id)) {
                    this.activeCollisions.delete(id);
                    this.projectile.boundingBoxHelper.material.color.set(0xffff00);
                    collider.boundingBoxHelper.material.color.set(0xffff00);
                }
            }
        }

            if (this.circleCollider && this.projectile.boundingSphere && this.circleCollider.boundingSphere) {
                if (this.projectile.boundingSphere.intersectsSphere(this.circleCollider.boundingSphere)) {
                    const coeficientR = 0.75;
                    const ballCenter = this.projectile.boundingSphere.center;
                    const ringCenter = this.circleCollider.boundingSphere.center;
                    const projectilePhysics = this.projectile.projectilePhysics;
    
                    const velocity3 = new THREE.Vector3(
                        projectilePhysics.velocityX,
                        projectilePhysics.velocityY,
                        projectilePhysics.velocityZ
                    );
    
                    const direction = new THREE.Vector3().subVectors(ballCenter, ringCenter).normalize();
                    const collisionPoint = new THREE.Vector3().addVectors(
                        ringCenter,
                        direction.multiplyScalar(this.circleCollider.boundingSphere.radius)
                    );
                    const collisionDirection = new THREE.Vector3().subVectors(collisionPoint, ringCenter).normalize();
    
                    if (Math.abs(collisionDirection.x) > 0.5 && Math.abs(collisionDirection.y) < 0.85) {
                        const finalVelocity3 = new THREE.Vector3().subVectors(
                            velocity3,
                            collisionDirection.multiplyScalar((1 + coeficientR) * velocity3.dot(collisionDirection))
                        );
    
                        projectilePhysics.velocityX = finalVelocity3.x;
                        projectilePhysics.velocityY = finalVelocity3.y;
                        projectilePhysics.velocityZ = finalVelocity3.z;
    
                        projectilePhysics.originalPosition.copy(this.projectile.model.position);
                        projectilePhysics.startTime = this.engine.time.current;
    
                        console.log("Colisión con el aro. Velocidad final:", finalVelocity3);
                    }
                }
            }
    }
}
