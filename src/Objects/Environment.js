import Engine from '../Core/Engine.js'
import * as THREE from 'three'

export default class Environment {
    constructor() {
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.resources = this.engine.resources
        this.debug = this.engine.debug

        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('Environment')   
        }

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)

        if(this.debug.active){
            this.debugFolder.add(this.sunLight, 'intensity')
            .min(0).max(10).step(0.001)
            .name('Sun Intensity')

            this.debugFolder.add(this.sunLight.position, 'x')
            .min(-5).max(5).step(0.001)
            .name('Position X')

            this.debugFolder.add(this.sunLight.position, 'y')
            .min(-5).max(5).step(0.001)
            .name('Position Y')

            this.debugFolder.add(this.sunLight.position, 'z')
            .min(-5).max(5).step(0.001)
            .name('Position Z')
        }
    }
    
    setEnvironmentMap(){
        this.environmentMap = {}
        this.environmentMap.intensity = 0.08
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            }
        )}

        this.environmentMap.updateMaterials()

        if(this.debug.active){
            this.debugFolder.add(this.environmentMap, 'intensity')
            .min(0).max(4).step(0.001)
            .name('Env Intensity').onChange(this.environmentMap.updateMaterials)
        }
    }
}