import Engine from '../Core/Engine.js'
import Projectile_Physics from '../Core/Projectile_Physics.js'

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

    // setAnim(){
        //INITIAL SETUP ANIMATION
        // this.animation = {}
        // this.animation.mixer = new THREE.AnimationMixer(this.model)

        //ANIMATION MENU SETUP
        // this.animation.actions = {}
        // this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        // this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[1])
        // this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[2])

        //RUN CURRENT ANIMATION
        // this.animation.actions.current = this.animation.actions.run
        // this.animation.actions.current.play()

        // this.animation.play = (name) => {
        //     const newAction = this.animation.actions[name]
        //     const oldACtion = this.animation.actions.current

        //     newAction.reset()
        //     newAction.play()
        //     newAction.crossFadeFrom(oldACtion, 0.5, true)
            
        //     this.animation.actions.current = newAction
        // }

        //DEBUG SETUP
        // if(this.debug.active){
            // const debugObject = {

            // }
            // this.debugFolder.add(debugObject, 'playIdle')
            // this.debugFolder.add(debugObject, 'playWalk')
            // this.debugFolder.add(debugObject, 'playRun')
        // }
    // }

    // update(){
        // if(this.animation.mixer)
        //     this.animation.mixer.update(this.time.delta * 0.0015)
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
    }
}