import EventEmitter from "./EventEmitter"

export default class Sizes extends EventEmitter{
    constructor(){
        //INHERITANCE
        super()
        //ATTRIBUTES
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        //RESIZE EVENT
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            
            this.trigger('resize')            
        })

    }
}