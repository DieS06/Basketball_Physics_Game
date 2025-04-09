import Engine from '../Core/Engine.js'
import Interface from '../Utils/Interface.js'
import * as THREE from 'three'
import Impulse_Physics from './Impulse_Physics.js'

export default class Projectile_Physics {
    constructor(projectile){
        this.engine = new Engine()
        this.interface = new Interface()
        this.scene = this.engine.scene
        this.model = projectile

        this.inMovement = false
        this.isValid = true
        this.gravity = -9.81
        this.angle = 0
        this.initialVelocity = 0
        this.velocityX = 0
        this.velocityY = 0
        this.velocityZ = 0
        this.startTime = 0
    }

    shoot(time){
        if (!this.model || !time) return;

    // Obtener valores del DOM
    const angle = parseFloat(document.getElementById('angle').value);
    const force = parseFloat(document.getElementById('force').value);     
    const deltaT = parseFloat(document.getElementById('duration').value);  
    const mass = 0.6 ;

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

    update(time){
        if (!this.model || !this.inMovement) return;

        const elapsedTime = (time.current - this.startTime) / 1000;

        // Ecuaciones del movimiento parabólico
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

        //Se debe actualizar el interface
        this.interface.update(elapsedTime, positionX, positionY, positionZ, this.velocityX, this.velocityY);
    }

    //VALIDAR - PROBAR -VERIFICAR
    validateAngle(angle){
        let valueAngle = parseInt(angle);
        if (isNaN(valueAngle) || valueAngle < 0 || valueAngle > 180) {
            document.getElementById('error-angulo').textContent = 'El ángulo debe estar entre 0 y 180 grados.';
            this.isValid = false;
        }
    }
    
    //VALIDAR - PROBAR -VERIFICAR
    validateVelocity(velocity){
        let valueVi = parseFloat(velocity).toFixed(2);
        if (isNaN(valueVi) || valueVi <= 0) {
            document.getElementById('error-velocidad').textContent = 'La velocidad debe ser positiva.';
            this.isValid = false;
        }    
    }
    validateForce(force) {
        let valueForce = parseFloat(force).toFixed(2);
        if (isNaN(valueForce) || valueForce <= 0) {
            document.getElementById('error-fuerza').textContent = 'La fuerza debe ser un valor positivo.';
            this.isValid = false;
        }
    }
    validateDuration(duration) {
        let valueDuration = parseFloat(duration).toFixed(2);
        if (isNaN(valueDuration) || valueDuration <= 0) {
            document.getElementById('error-duracion').textContent = 'La duración del impulso debe ser un valor positivo.';
            this.isValid = false;
        }
    }
    
    
}