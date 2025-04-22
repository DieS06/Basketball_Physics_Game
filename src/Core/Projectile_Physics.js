import Engine from '../Core/Engine.js';
import Interface from '../Utils/Interface.js';
import Impulse_Physics from './Impulse_Physics.js';
import Board_Ring from '../Objects/Board_Ring.js';
import * as THREE from 'three';

export default class Projectile_Physics {

    constructor(projectile) {
        this.engine = new Engine();
        this.interface = new Interface();
        this.scene = this.engine.scene;
        this.model = projectile;

        this.inMovement = false;
        this.isValid = true;
        this.gravity = -9.81;
        this.angle = 0;
        this.initialVelocity = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.velocityZ = 0;
        this.startTime = 0;
        this.previousY = null;


        this.originalPosition = new THREE.Vector3(0, 1, 0);

    }

    shoot(time) {
        if (!this.model || !time) return;

        const angle = parseFloat(document.getElementById('angle').value);
        const force = parseFloat(document.getElementById('force').value);     
        const deltaT = parseFloat(document.getElementById('duration').value);  
        const mass = 0.6;

        this.interface.resetErrorMessages();
        this.validateAngle(angle);
        this.validateForce(force);
        this.validateDuration(deltaT);
        
        if (!this.isValid) return;

        const impulsePhysics = new Impulse_Physics(mass, force, deltaT, angle);
        const { vx, vy } = impulsePhysics.calculateVelocityComponents();

        this.velocityX = vx;
        this.velocityY = vy;
        this.velocityZ = 0;

        this.originalPosition.set(0, 1, 0);
        this.model.position.copy(this.originalPosition);
        this.inMovement = true;
        this.startTime = time.current;
    }

    update(time, boardRing) {
        if (!this.model || !this.inMovement) return;

        const elapsedTime = (time.current - this.startTime) / 1000;

        const displacementX = this.velocityX * elapsedTime;
        const displacementY = this.velocityY * elapsedTime + 0.5 * this.gravity * Math.pow(elapsedTime, 2);
        const displacementZ = this.velocityZ * elapsedTime;
        
        const newX = this.originalPosition.x + displacementX;
        const newY = this.originalPosition.y + displacementY;
        const newZ = this.originalPosition.z + displacementZ;

      

        // Simple pass-through detection
        if (boardRing && boardRing.scoreZone) {
            const ballPos = this.model.getWorldPosition(new THREE.Vector3());
            const scoreZonePos = boardRing.scoreZone.getWorldPosition(new THREE.Vector3());
            const distance = ballPos.distanceTo(scoreZonePos);
        
            if (
                this.previousY !== null &&
                this.previousY > scoreZonePos.y &&      // Came from above
                newY <= scoreZonePos.y &&               // Passed below
                distance < 0.4                          // Inside hoop radius
            ) {
                console.log("🏆 Score! Clean shot or dunk!");
            }
        }
        this.previousY = newY; // Store the current Y position for next frame        
        
        if (newY <= 0) {
            console.log("La bola ha tocado el suelo.");
            this.velocityY *= -0.6; 
            if (Math.abs(this.velocityY) < 0.5) {
                this.inMovement = false;
                this.model.position.set(newX, 0, newZ);
                console.log("El balón se ha detenido tras perder energía.");
            } else {
                this.originalPosition.set(newX, 0, newZ);
                this.startTime = time.current;
                this.previousY = null; // Reset dunk detection
            }
        } else {
            this.model.position.set(newX, newY, newZ);
        }
        

        
        this.interface.update(elapsedTime, newX, newY, newZ, this.velocityX, this.velocityY);
        
    }

    validateAngle(angle) {
        let valueAngle = parseInt(angle);
        if (isNaN(valueAngle) || valueAngle < 0 || valueAngle > 180) {
            document.getElementById('error-angulo').textContent = 'El ángulo debe estar entre 0 y 180 grados.';
            this.isValid = false;
        }
    }

    validateVelocity(velocity) {
        let valueVi = parseFloat(velocity).toFixed(2);
        if (isNaN(valueVi) || valueVi <= 0) {
            document.getElementById('error-velocidad').textContent = 'La velocidad debe ser positiva.';
            this.isValid = false;
        }
    }

    validateForce(force) {
        let valueForce = parseFloat(force).toFixed(2);
        if (isNaN(valueForce) || valueForce <= 0) {
            document.getElementById('error-force').textContent = 'La fuerza debe ser un valor positivo.';
            this.isValid = false;
        }
    }

    validateDuration(duration) {
        let valueDuration = parseFloat(duration).toFixed(2);
        if (isNaN(valueDuration) || valueDuration <= 0) {
            document.getElementById('error-duration').textContent = 'La duración del impulso debe ser un valor positivo.';
            this.isValid = false;
        }
    }

    checkCollisionRing(ring){
        const ballBoundingBox = new THREE.Box3().setFromObject(this.model);

        if(ballBoundingBox.intersectsBox(ring.boundingBox)){
            console.log("Colisión con el aro detectada!");

            const Xp = this.model.position.clone();
            const Xc = ring.boundingBox.getCenter(new THREE.Vector3());
            const R = new THREE.Vector3().subVectors(Xp,Xc);
            const N = R.clone().normalize(); // Normal del aro

            const Vi = new THREE.Vector3(this.velocityX, this.velocityY, this.velocityZ);
            const e = 0.75;// Coeficiente de restitución

            const dot = Vi.dot(N);
            
            const Vf = Vi.clone().sub(N.clone().multiplyScalar((1 + e) * dot));

            this.velocityX = Vf.x;
            this.velocityY = Vf.y;
            this.velocityZ = Vf.z;
            
            console.log("New velocity after impact:", Vf);
            
        }
    }
}
