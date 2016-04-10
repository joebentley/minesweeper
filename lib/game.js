'use strict';

var Grid = require('./grid');

class Game {
    constructor() {
        this.startTime = new Date();
        
        this.grid = new Grid(16, 16);
    }
    
    getSecondsSinceStart() {
        return (new Date()).getSeconds() - this.startTime.getSeconds();
    }
};

module.exports = Game;