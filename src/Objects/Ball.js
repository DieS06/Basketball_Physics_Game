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

    shoot(time) {
        if (this.projectilePhysics) {
            this.projectilePhysics.shoot(time);
        }
    }

    update(time) {
        if (this.projectilePhysics) {
            this.projectilePhysics.update(time);
        }
    }
}