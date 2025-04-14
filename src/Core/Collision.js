import Engine from './Engine.js'
import * as THREE from 'three';

export default class Collision {
    constructor(projectile, collider){
        this.engine = new Engine()
        this.scene = this.engine.scene

        this.collider = collider
        this.projectile = projectile

        this.isValid = true
        this.activeCollision = false
        this.angle = 0
        this.initialVelocity = 0
        this.restitution = 0.8
        this.ballMass = this.projectileMass()
    }

    collideCheck(){
        if (!this.collider) {return console.error('No collider object found')}
        if (!this.projectile) {return console.error('No projectile object found')}
        
        const normalVector = new THREE.Vector3(1, 0, 0)
        // this.angle = parseFloat(document.getElementById('angle').value)
        this.initialVelocity = parseFloat(document.getElementById('velocity').value)

        //Componente normal PERPENDICULAR al vector normal
        let normalComponent = (this.initialVelocity * normalVector.x) *  normalVector.x 
        //Componente tangencial PARALLELO al vector normal
        let tangentialComponent = this.initialVelocity - normalComponent
        //Aplicación del coheficiente de restitución
        this.finalVelocity = -(this.restitution * normalComponent)
        this.totalVelocity = this.finalVelocity + tangentialComponent
        //Impulso aplicado al balón
        this.impulse = this.ballMass * (this.totalVelocity - this.initialVelocity)
        
        // //Polar a cartesiano
        // this.initialVelocityVector = new THREE.Vector3(this.initialVelocity * Math.cos(this.angle), this.initialVelocity * Math.sin(this.angle), 0)
        // //Rebote
        // this.finalVelocityVector = new THREE.Vector3(this.initialVelocityVector.x * restitution, this.initialVelocityVector.y * restitution, 0)
        // //Proyectar el vector de velocidad inicial sobre el vector normal
        // this.finalVelocityVector.projectOnVector(normalVector).multiplyScalar(-1 * restitution)

        return this.impulse
    }

    projectileMass(){
        const density = 0.09
        const volume = 7130
        const mass = density * volume
        return mass
    }

    rebounceValidation(reboundVelocity = new THREE.Vector3(), projectilePhysics){
        if (!isFinite(reboundVelocity.x) || !isFinite(reboundVelocity.y)) {
            console.warn("¡Velocidad inválida detectada!");
            if (projectilePhysics){
                projectilePhysics.inMovement = false;
            }
            return false;
        }
        return true;
    }
    
    update(){
        if (!this.projectile || !this.collider) {return}
        if(!this.collider.boundingBox || !this.projectile.boundingBox){return}

        this.collider.model.updateMatrixWorld(true);
        this.projectile.model.updateMatrixWorld(true);

        this.collider.boundingBox.setFromObject(this.collider.model)
        this.projectile.boundingBox.setFromObject(this.projectile.model)

        if(this.projectile.boundingBox.intersectsBox(this.collider.boundingBox)){
            if(!this.activeCollision) {
                this.activeCollision = true;
                console.log('Collision detected!');
        
                this.projectile.boundingBoxHelper.material.color.set(0xff0000);
                this.collider.boundingBoxHelper.material.color.set(0xff0000);

                const projectilePhysics = this.projectile.projectilePhysics;

                const velocity = new THREE.Vector3(
                    projectilePhysics.velocityX, 
                    projectilePhysics.velocityY, 
                    projectilePhysics.velocityZ
                );

                const normalVector = new THREE.Vector3(1, 0, 0); // Suponiendo plano vertical
                const normalComponent = velocity.clone().projectOnVector(normalVector).multiplyScalar(-this.restitution);
                const tangentialComponent = velocity.clone().sub(velocity.clone().projectOnVector(normalVector));
                const reboundVelocity = normalComponent.add(tangentialComponent);

                projectilePhysics.velocityX = reboundVelocity.x;
                projectilePhysics.velocityY = reboundVelocity.y;
                projectilePhysics.velocityZ = reboundVelocity.z;

                projectilePhysics.originalPosition.copy(this.projectile.model.position); 
                projectilePhysics.startTime = this.engine.time.current;

                console.log('Velocidad después del rebote:', reboundVelocity);
                console.log('Rebote en posición:', this.projectile.model.position);
            }
            //AÑADIR EN CASO DE HORIZONTAL O VERTICAL | Suelo o pared
        }else{
            this.activeCollision = false

            this.projectile.boundingBoxHelper.material.color.set(0xffff00);
            this.collider.boundingBoxHelper.material.color.set(0xffff00);
        }
    }
}