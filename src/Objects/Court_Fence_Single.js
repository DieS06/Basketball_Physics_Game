import Engine from '../Core/Engine.js'
import * as THREE from 'three'

export default class Court_Fence_Single {
    constructor(){
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.resources = this.engine.resources
        this.debug = this.engine.debug

        //DEBUG SETUP
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('Court_Fence_Single')
        }

        this.resource = this.resources.items.fenceSingleModel

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
    }

    setBoungindBox(){
        this.boundingBox = new THREE.Box3().setFromObject(this.model)
        this.boundingBoxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00)
        this.scene.add(this.boundingBoxHelper)
    }
}