import Engine from '../Core/Engine.js'

export default class Board_Ring {
    constructor(){
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.resources = this.engine.resources
        this.debug = this.engine.debug

        //DEBUG SETUP
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('Board_Ring')
            this.debugFolder = this.debug.ui.addFolder('Target_Board_Ring')
        }

        this.resource = this.resources.items.ringModel
        this.resorce = this.resources.items.targetModel

        this.setModel()
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
}