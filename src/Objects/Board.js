import Engine from '../Core/Engine.js'
import * as THREE from 'three'

export default class Board {
    constructor(){
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.resources = this.engine.resources
        this.debug = this.engine.debug
        this.boundingBox = new THREE.Box3()
        this.boundingBoxHelper = null

        //DEBUG SETUP
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('Board')
        }

        this.resource = this.resources.items.boardModel

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
        this.boundingBox.setFromObject(this.model)
        this.boundingBoxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00)
        this.scene.add(this.boundingBoxHelper)
    }

    update(){
        if(this.boundingBox && this.boundingBoxHelper){
            this.boundingBox.setFromObject(this.model)
        }
    }
}