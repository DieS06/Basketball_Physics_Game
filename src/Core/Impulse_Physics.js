import * as THREE from 'three';

export default class Impulse_Physics {
    constructor(mass, force, deltaT, angleDeg) {
        this.mass = mass;
        this.force = force;
        this.deltaT = deltaT;
        this.angleDeg = angleDeg;
    }

    calculateVelocityComponents() {
        const angleRad = THREE.MathUtils.degToRad(this.angleDeg);
        const impulse = this.force * this.deltaT;
        const vf = impulse / this.mass;

        const vx = vf * Math.cos(angleRad);
        const vy = vf * Math.sin(angleRad);

        // 👇 Mostrar resultados en consola
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
