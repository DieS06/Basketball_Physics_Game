import Stats from 'stats.js';

export default class FPSStats {
    constructor() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    begin() {
        this.stats.begin();
    }

    end() {
        this.stats.end();
    }
    
    update() {
        this.stats.update();
    }
}