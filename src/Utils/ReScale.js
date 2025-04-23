export default class ReScale {
    constructor(reScale = 0.25) {
        this.reScale = reScale;
    }

    scaleValue(value) {
        return value * this.reScale;
    }

    scaleVector(vector3) {
        return vector3.clone().multiplyScalar(this.reScale);
    }

    scaleGravity(gravity = -9.81) {
        return gravity * this.reScale;
    }

    deScaleValue(value) {
        return value / this.reScale;
    }

    scaleComponents(x, y, z = 0) {
        return {
            x: x * this.reScale,
            y: y * this.reScale,
            z: z * this.reScale
        };
    }
}