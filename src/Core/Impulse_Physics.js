import * as THREE from 'three';

/**
 * @class Impulse_Physics
 * @classdesc Clase para calcular el impulso y las componentes de la velocidad
 * de un objeto disparado con una fuerza durante un intervalo de tiempo.
 */
export default class Impulse_Physics {
    /**
     * Crea una instancia de la clase Impulse_Physics.
     * 
     * @param {number} mass - Masa del objeto en kilogramos (kg).
     * @param {number} force - Fuerza aplicada en Newtons (N).
     * @param {number} deltaT - Tiempo durante el cual se aplica la fuerza en segundos (s).
     * @param {number} angleDeg - Ángulo de aplicación de la fuerza en grados.
     */
    constructor(mass, force, deltaT, angleDeg) {
        this.mass = mass;
        this.force = force;
        this.deltaT = deltaT;
        this.angleDeg = angleDeg;
    }

    /**
     * Calcula el impulso, la velocidad final y sus componentes.
     *
     * @returns {Object} Objeto con las propiedades:
     *  - {number} vf: Velocidad final (m/s).
     *  - {number} vx: Componente horizontal de la velocidad (m/s).
     *  - {number} vy: Componente vertical de la velocidad (m/s).
     */
    calculateVelocityComponents() {
        const angleRad = THREE.MathUtils.degToRad(this.angleDeg);
        const impulse = this.force * this.deltaT;
        const vf = impulse / this.mass;

        const vx = vf * Math.cos(angleRad);
        const vy = vf * Math.sin(angleRad);
        console.log(`--- IMPULSO CALCULADO ---`);
        console.log(`Impulso (I) = ${impulse.toFixed(2)} N·s`);
        console.log(`Velocidad final (vf) = ${vf.toFixed(2)} m/s`);
        console.log(`Componentes: vx = ${vx.toFixed(2)} m/s, vy = ${vy.toFixed(2)} m/s`);

        return {
            vf: vf,
            vx: vx,
            vy: vy
        };
    }
}
