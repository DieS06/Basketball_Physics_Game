import Engine from "./Engine.js";
import ReScale from "../Utils/ReScale.js";
import * as THREE from "three";

export default class Collision {
  constructor(projectile, collider, circleCollider) {
    this.engine = new Engine();
    this.scene = this.engine.scene;
    this.reScale = new ReScale(0.25);

    this.collider = collider;
    this.circleCollider = circleCollider;
    this.projectile = projectile;

    this.isValid = true;
    this.activeCollision = false;
    this.angle = 0;
    this.initialVelocity = 0;
    this.restitution = 0.85;
    this.ballMass = this.projectileMass();
  }

  collideCheck() {
    if (!this.collider) {
      return console.error("No collider object found");
    }
    if (!this.projectile) {
      return console.error("No projectile object found");
    }

    const normalVector = new THREE.Vector3(1, 0, 0);
    // this.angle = parseFloat(document.getElementById('angle').value)
    this.initialVelocity = parseFloat(
      document.getElementById("velocity").value
    );

    //Componente normal PERPENDICULAR al vector normal
    let normalComponent =
      this.initialVelocity * normalVector.x * normalVector.x;
    //Componente tangencial PARALLELO al vector normal
    let tangentialComponent = this.initialVelocity - normalComponent;
    //Aplicación del coheficiente de restitución
    this.finalVelocity = -(this.restitution * normalComponent);
    this.totalVelocity = this.finalVelocity + tangentialComponent;
    //Impulso aplicado al balón
    this.impulse = this.ballMass * (this.totalVelocity - this.initialVelocity);

    // //Polar a cartesiano
    // this.initialVelocityVector = new THREE.Vector3(this.initialVelocity * Math.cos(this.angle), this.initialVelocity * Math.sin(this.angle), 0)
    // //Rebote
    // this.finalVelocityVector = new THREE.Vector3(this.initialVelocityVector.x * restitution, this.initialVelocityVector.y * restitution, 0)
    // //Proyectar el vector de velocidad inicial sobre el vector normal
    // this.finalVelocityVector.projectOnVector(normalVector).multiplyScalar(-1 * restitution)

    return this.impulse;
  }

  projectileMass() {
    const density = 0.09;
    const volume = 7130;
    const mass = density * volume;
    return mass;
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
    if (!this.projectile || !this.collider) {
      return;
    }
    if (!this.collider.boundingBox || !this.projectile.boundingBox) {
      return;
    }

    this.collider.model.updateMatrixWorld(true);
    this.projectile.model.updateMatrixWorld(true);

    this.collider.boundingBox.setFromObject(this.collider.model);
    this.projectile.boundingBox.setFromObject(this.projectile.model);

    if (
      this.projectile.boundingSphere.intersectsBox(this.collider.boundingBox)
    ) {
      if (!this.activeCollision) {
        this.activeCollision = true;
        console.log(
          "Collision detected!",
          this.projectile.boundingSphere.center
        );

        this.projectile.boundingBoxHelper.material.color.set(0xff0000);
        this.collider.boundingBoxHelper.material.color.set(0xff0000);

        const projectilePhysics = this.projectile.projectilePhysics;

        const velocity = new THREE.Vector3(
          projectilePhysics.velocityX,
          projectilePhysics.velocityY,
          projectilePhysics.velocityZ
        );

        const normalVector = new THREE.Vector3(1, 0, 0); // Suponiendo plano vertical
        const normalComponent = velocity
          .clone()
          .projectOnVector(normalVector)
          .multiplyScalar(-this.restitution);
        const tangentialComponent = velocity
          .clone()
          .sub(velocity.clone().projectOnVector(normalVector));
        const reboundVelocity = normalComponent.add(
          tangentialComponent.multiplyScalar(this.restitution)
        );

        projectilePhysics.velocityX = reboundVelocity.x;
        projectilePhysics.velocityY = reboundVelocity.y;
        projectilePhysics.velocityZ = reboundVelocity.z;

        projectilePhysics.originalPosition.copy(this.projectile.model.position);
        projectilePhysics.startTime = this.engine.time.current;

        console.log("Velocidad después del rebote:", reboundVelocity);
        console.log("Rebote en posición:", this.projectile.model.position);
      }
      //AÑADIR EN CASO DE HORIZONTAL O VERTICAL | Suelo o pared
    } else if (
      this.projectile.boundingSphere.intersectsSphere(
        this.circleCollider.boundingSphere
      )
    ) {
      const coeficientR = 0.75;
      const ballCenter = this.projectile.boundingSphere.center;
      const ringCenter = this.circleCollider.boundingSphere.center;
      const projectilePhysics = this.projectile.projectilePhysics;

      const velocity3 = new THREE.Vector3(
        projectilePhysics.velocityX,
        projectilePhysics.velocityY,
        projectilePhysics.velocityZ
      );

      // Direction vector from the ring center to the ball center
      const direction = new THREE.Vector3()
        .subVectors(ballCenter, ringCenter)
        .normalize();

      // Collision point on the surface of the board ring
      const collisionPoint = new THREE.Vector3().addVectors(
        ringCenter,
        direction.multiplyScalar(this.circleCollider.boundingSphere.radius)
      );

      const collisionDirection = new THREE.Vector3()
        .subVectors(collisionPoint, ringCenter)
        .normalize();

      if (
        Math.abs(collisionDirection.x) > 0.5 &&
        Math.abs(collisionDirection.y) < 0.85
      ) {
        console.log("direction", direction);
        console.log("collisionDirection", collisionDirection);
        const finalVelocity3 = new THREE.Vector3().subVectors(
          velocity3,
          collisionDirection.multiplyScalar(
            (1 + coeficientR) * velocity3.dot(collisionDirection)
          )
        );

        projectilePhysics.velocityX = finalVelocity3.x;
        projectilePhysics.velocityY = finalVelocity3.y;
        projectilePhysics.velocityZ = finalVelocity3.z;

        projectilePhysics.originalPosition.copy(this.projectile.model.position);
        projectilePhysics.startTime = this.engine.time.current;
      }
    } else {
      this.activeCollision = false;

      this.projectile.boundingBoxHelper.material.color.set(0xffff00);
      this.collider.boundingBoxHelper.material.color.set(0xffff00);
    }
  }
}
