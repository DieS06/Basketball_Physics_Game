import Engine from '../Core/Engine.js'
import Projectile_Physics from '../Core/Projectile_Physics.js'
import * as THREE from 'three'

export default class Ball {
    constructor(){
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.resources = this.engine.resources
        this.debug = this.engine.debug

        //DEBUG SETUP
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('Basketball')
        }

        this.resource = this.resources.items.ballModel

        this.setModel()
        this.setBoungindBox()
    }

    setModel(){
        this.model = this.resource.scene
        this.model.position.set(0, 0, 0)
        this.scene.add(this.model)

        this.model.traverse((child) =>{
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        this.projectilePhysics = new Projectile_Physics(this.model);
    }

    setBoungindBox(){
        this.boundingBox = new THREE.Box3().setFromObject(this.model)
        this.boundingBoxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00)
        this.scene.add(this.boundingBoxHelper)
    }

    // setSphereHelper(sphere, color) {
    //     const geometry = new THREE.SphereGeometry(sphere.radius, 16, 16)
    //     const material = new THREE.MeshBasicMaterial({ color, wireframe: true, depthTest: false })
    //     const mesh = new THREE.Mesh(geometry, material)
    //     mesh.scale.set(1.05)
    //     mesh.visible = true
    //     mesh.position.copy(sphere.center)
    //     return mesh
    // }

    // setBoundingSphere(){
    //     this.model.traverse((child) => {
    //         if (child.isMesh && child.geometry) {
    //             child.geometry.computeBoundingSphere()
    
    //             const sphere = child.geometry.boundingSphere.clone()
    //             sphere.center.applyMatrix4(child.matrixWorld)
    
    //             this.boundingSphere = sphere
    
    //             if (this.debug.active) {
    //                 this.sphereHelper = this.setSphereHelper(sphere, 0x00ff00)
    //                 this.scene.add(this.sphereHelper)
    //             }
    //         }
    //     })
    // }

    shoot(time) {
        if (this.projectilePhysics) {
            this.projectilePhysics.shoot(time);
        }
    }

    update(time) {
        if (this.projectilePhysics) {
            this.projectilePhysics.update(time);
        }

        if (this.boundingBox && this.boundingBoxHelper) {
            this.boundingBox.setFromObject(this.model);
        }
    }
}