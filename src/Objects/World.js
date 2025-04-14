import Engine from '../Core/Engine.js'
import Court_Floor from './Court_Floor.js'
import Court_Fence from './Court_Fence.js'
import Court_Fence_Single from './Court_Fence_Single.js'
import Board_Structure from './Board_Structure.js'
import Board from './Board.js'
import Board_Ring from './Board_Ring.js'
import Ball from './Ball.js'
import Environment from './Environment.js'
import Collision from '../Core/Collision.js'

export default class World {
    constructor() {
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.resources = this.engine.resources

        this.resources.on('ready', () =>
        {
            this.Court_Floor = new Court_Floor()
            //this.Court_Fence = new Court_Fence()
            this.Court_Fence_Single = new Court_Fence_Single()
            this.Board_Structure = new Board_Structure()
            this.Board = new Board()
            this.Board_Ring = new Board_Ring()
            this.Ball = new Ball()
            this.environment = new Environment()
            this.Collision = new Collision(this.Ball, this.Board)
            this.setupUI();
        })
        this.engine.time.on('tick', () => {
            this.update();
        });

    }

    setupUI() {
        const shootBtn = document.getElementById('shoot-btn');
        if (shootBtn) {
            shootBtn.addEventListener('click', () => {
                if (this.Ball) {
                    console.log("Lanzando el proyectil...");
                    this.Ball.shoot(this.engine.time);
                } else {
                    console.error("No se pudo encontrar la bola.");
                }
                console.log("Salio de lanzando");
            });
        }
    }

    update() {
        if (this.Ball) {
            this.Ball.update(this.engine.time);
        }

        if (this.Board) {
            this.Board.update();
        }

        if (this.Collision) {
            this.Collision.update();
        }
    }
}