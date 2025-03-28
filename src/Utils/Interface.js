export default class Interface {
    constructor() {

    }

    resetErrorMessages() {
        document.getElementById('error-velocidad').textContent = '';
        document.getElementById('velocidad').textContent = '';
        document.getElementById('error-angulo').textContent = '';  
    }

    update(time, positionX, positionY, positionZ, initialVelocityX, finalVelocityY) {
        document.getElementById('data').innerHTML = `
        Tiempo: ${time.toFixed(2)} s | 
        Posición: ${positionX.toFixed(2)} en X, ${positionY.toFixed(2)} en Y, ${positionZ.toFixed(2)} en Z | 
        Velocidad Final: ${initialVelocityX.toFixed(2)} m/s en Y, ${finalVelocityY.toFixed(2)} m/s en Z`;
    }
}