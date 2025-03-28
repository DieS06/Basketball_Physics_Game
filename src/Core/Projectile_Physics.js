import Engine from '../Core/Engine.js'
import Interface from '../Utils/Interface.js'
import * as THREE from 'three'

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
        if (!this.model) {return console.error('No model found')}
        if (!time) { return }

        this.angle = parseFloat(document.getElementById('angle').value)
        this.initialVelocity = parseFloat(document.getElementById('velocity').value)

        //VALIDACIONES Y RESET DE MENSAJES
        this.interface.resetErrorMessages()
        this.validateAngle(this.angle)
        this.validateVelocity(this.initialVelocity)

        if (!this.isValid) { return }

        this.angle = THREE.MathUtils.degToRad(this.angle)

        //MODIFICAR SEGUN LA DIRECCION DEL TIRO - HAY QUE HACER PRUEBAS
        this.velocityX = this.initialVelocity * Math.cos(this.angle)
        this.velocityY = this.initialVelocity * Math.sin(this.angle)
        this.velocityZ = 0
        
        this.model.position.set(0, 1, 0)
        this.inMovement = true
        this.startTime = time.getElapsedTime()
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

    update(){

    }
}