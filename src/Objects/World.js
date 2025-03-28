import Engine from '../Core/Engine.js'
import Court_Floor from './Court_Floor.js'
import Court_Fence from './Court_Fence.js'
import Court_Housing from './Court_Housing.js'
import Board_Structure from './Board_Structure.js'
import Board from './Board.js'
import Board_Ring from './Board_Ring.js'
import Ball from './Ball.js'
import Environment from './Environment.js'

export default class World {
    constructor() {
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.resources = this.engine.resources
        
        this.resources.on('ready', () =>
        {
            this.Court_Floor = new Court_Floor()
            this.Court_Fence = new Court_Fence()
            this.Court_Housing = new Court_Housing()
            this.Board_Structure = new Board_Structure()
            this.Board = new Board()
            this.Board_Ring = new Board_Ring()
            this.Ball = new Ball()
            this.environment = new Environment()
        })

    }

    update(){
    }
}