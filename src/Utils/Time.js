import EventEmitter from "./EventEmitter"
import FPSStats from "./FPSStats"
import Engine from "../Core/Engine"

export default class Time extends EventEmitter {
    constructor() {
        //INHERITANCE
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16.666
        this.stats = new FPSStats()

        window.requestAnimationFrame(() => {
            // console.log('tick')
            // console.log(this)
            this.tick()
        })
    }

    tick(){
        this.stats.begin()
        
        const currentTime = Date.now()
        //console.log(this)
        this.delta = currentTime - this.current
        //console.log(this.delta)
        this.current = currentTime
        //console.log(this.current)
        this.elapsed = currentTime - this.start
        //console.log(this.elapsed)

        this.trigger('tick')
        
        window.requestAnimationFrame(() => {
            this.tick()
        })

        this.stats.end()
        }
}