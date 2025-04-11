import * as THREE from 'three'

import Sizes from '../Utils/Sizes.js'
import Time from '../Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from '../Objects/World.js'
import Resources from '../Utils/Resources.js'
import Debug from '../Utils/Debug.js'

import sources from './sources.js'

let instance = null

export default class Engine {
    constructor(canvas){
        //Singleton
        if(instance)
        {
            return instance
        }    
        instance = this

        //GLOBAL ACCESS
        window.engine = this

        //OPTIONS/PARAMETERS
        this.canvas = canvas

        //SETUP
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.debug = new Debug()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.axes = new THREE.AxesHelper(5)
        this.grid = new THREE.GridHelper(30, 30)

        this.scene.add(this.axes, this.grid)

        //RESIZE EVENT
        this.sizes.on('resize', () => {
            this.resize()
        })
        //TIME TICK EVENT
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize(){
        this.camera.resize()
        this.renderer.resize()
    }

    update(){
        this.camera.update()
        // console.log(this.camera.instance.position)
        // console.log(this.camera.instance.rotation)
        this.world.update()
        this.renderer.update()
    }

    destroy(){
        this.sizes.off('resize')
        this.time.off('tick')

        //TRAVERSE SCENE AND CLEANUP
        this.scene.traverse((child) =>{
            if(child instanceof THREE.Mesh){
                child.geometry.dispose()

                for(const key in child.material){
                    const value = child.material[key]
                    if(value && typeof value.dispose === 'function'){
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active){
            this.debug.destroy()
        }
    }

    
}