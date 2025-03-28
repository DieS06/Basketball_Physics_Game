import * as THREE from 'three';
import { gsap } from 'gsap';
import Engine from '../Core/Engine.js';

export default class LoadingScreen {
    constructor() {
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.overlayMaterial
        this.overlayGeometry

        this.setOverlay()

        this.loadingManager = new THREE.LoadingManager(
            () => {
                console.log('LOADED!')
                gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })
            },
            () => {
                console.log('PROGRESS!')
            }
        );
    }


    setOverlay(){
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)

        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            wireframe: false,
            uniforms: {
                uAlpha: { value: 1 }
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;

                void main()
                {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `,
        })

        const overlay = new THREE.Mesh(overlayGeometry, this.overlayMaterial)

        this.scene.add(overlay)
    }
}