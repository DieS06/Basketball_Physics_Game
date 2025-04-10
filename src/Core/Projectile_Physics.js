import Engine from '../Core/Engine.js';
import Interface from '../Utils/Interface.js';
import * as THREE from 'three';
import Impulse_Physics from './Impulse_Physics.js';

/**
 * @class Projectile_Physics
 * @classdesc Simula el movimiento parabólico de un proyectil disparado mediante un impulso.
 */
export default class Projectile_Physics {
    /**
     * Crea una instancia de la simulación de física de proyectil.
     * 
     * @param {THREE.Object3D} projectile - El modelo 3D del proyectil.
     */
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
    }

    /**
     * Dispara el proyectil con los parámetros extraídos del DOM.
     * 
     * @param {Object} time - Objeto con la propiedad `current` que representa el tiempo actual.
     */
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

        this.model.position.set(0, 1, 0);
        this.inMovement = true;
        this.startTime = time.current;
    }

    /**
     * Actualiza la posición del proyectil según el tiempo transcurrido.
     * 
     * @param {Object} time - Objeto con la propiedad `current` que representa el tiempo actual.
     */
    update(time) {
        if (!this.model || !this.inMovement) return;

        const elapsedTime = (time.current - this.startTime) / 1000;

        const positionX = this.velocityX * elapsedTime;
        const positionY = this.velocityY * elapsedTime + 0.5 * this.gravity * Math.pow(elapsedTime, 2);
        const positionZ = this.velocityZ * elapsedTime;

        if (positionY <= 0) {
            console.log("La bola ha tocado el suelo.");
            this.inMovement = false;
            this.model.position.set(positionX, 0, positionZ);
        } else {
            this.model.position.set(positionX, positionY, positionZ);
        }

        this.interface.update(elapsedTime, positionX, positionY, positionZ, this.velocityX, this.velocityY);
    }

    /**
     * Valida que el ángulo esté dentro del rango permitido.
     * 
     * @param {number} angle - Ángulo de disparo en grados.
     */
    validateAngle(angle) {
        let valueAngle = parseInt(angle);
        if (isNaN(valueAngle) || valueAngle < 0 || valueAngle > 180) {
            document.getElementById('error-angulo').textContent = 'El ángulo debe estar entre 0 y 180 grados.';
            this.isValid = false;
        }
    }

    /**
     * Valida que la velocidad inicial sea válida.
     * 
     * @param {number} velocity - Velocidad inicial.
     */
    validateVelocity(velocity) {
        let valueVi = parseFloat(velocity).toFixed(2);
        if (isNaN(valueVi) || valueVi <= 0) {
            document.getElementById('error-velocidad').textContent = 'La velocidad debe ser positiva.';
            this.isValid = false;
        }
    }

    /**
     * Valida que la fuerza aplicada sea válida.
     * 
     * @param {number} force - Fuerza en Newtons.
     */
    validateForce(force) {
        let valueForce = parseFloat(force).toFixed(2);
        if (isNaN(valueForce) || valueForce <= 0) {
            document.getElementById('error-force').textContent = 'La fuerza debe ser un valor positivo.';
            this.isValid = false;
        }
    }

    /**
     * Valida que la duración del impulso sea válida.
     * 
     * @param {number} duration - Tiempo durante el cual se aplica la fuerza (en segundos).
     */
    validateDuration(duration) {
        let valueDuration = parseFloat(duration).toFixed(2);
        if (isNaN(valueDuration) || valueDuration <= 0) {
            document.getElementById('error-duration').textContent = 'La duración del impulso debe ser un valor positivo.';
            this.isValid = false;
        }
    }
}
