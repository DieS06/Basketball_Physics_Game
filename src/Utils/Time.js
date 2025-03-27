import EventEmitter from "./EventEmitter"

export default class Time extends EventEmitter {
    constructor() {
        //INHERITANCE
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16.666

        window.requestAnimationFrame(() => {
            // console.log('tick')
            // console.log(this)
            this.tick()
        })
    }

    tick(){
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
        })}
}