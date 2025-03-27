import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Engine from './Engine.js'


export default class Camera{
    constructor(){ 
        this.engine = new Engine()
        this.sizes = this.engine.sizes
        this.scene = this.engine.scene
        this.canvas = this.engine.canvas
        //CAMERA
        this.setInstance()
        this.setOrbitControls()
    }

    setInstance(){
        this.instance = new THREE.PerspectiveCamera(
            20, 
            this.sizes.width / this.sizes.height, 
            0.1,
            100
        )
        this.instance.position.set(4, 0.6, 0)
        this.scene.add(this.instance)
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update(){
        this.controls.update()
    }

}