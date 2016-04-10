'use strict';

var Grid = require('./grid');
var Square = require('./square');

class UI {
    constructor(canvas, grid) {
        if (typeof grid === 'undefined') {
            grid = new Grid();
        }
        
        this.grid = grid;
        this.canvas = canvas;
    }
    
    transformScreenToGrid(x, y) {
        if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) {
            throw RangeError('Out of bounds of canvas');
        }
        
        let gridX = Math.floor(x / this.canvas.width * this.grid.width); 
        let gridY = Math.floor(y / this.canvas.height * this.grid.height); 
        
        return { x: gridX, y: gridY };
    }
    
    draw(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // draw grid
        let unitWidth = this.canvas.width / this.grid.width,
            unitHeight = this.canvas.height / this.grid.height;

        for (let x = 0; x < this.grid.width; x++) {
            for (let y = 0; y < this.grid.height; y++) {
                ctx.beginPath();
                // ctx.strokeStyle = "#000";
                // ctx.strokeRect(x * unitWidth, y * unitHeight, unitWidth, unitHeight);
                
                if (!this.grid.isVisible(x, y)) {
                    ctx.fillStyle = "#ccc";
                    ctx.fillRect(x * unitWidth + 2, y * unitHeight + 2, unitWidth - 2, unitHeight - 2);
                    
                    ctx.fillStyle = "#222";
                    ctx.fillRect(x * unitWidth + 4, y * unitHeight + 4, unitWidth - 4, unitHeight - 4);
                    
                    ctx.fillStyle = "#999";
                    ctx.fillRect(x * unitWidth + 4, y * unitHeight + 4, unitWidth - 6, unitHeight - 6);
                }
                
                ctx.closePath();
            }
        }
    }
    
    onMouseDown(e) {
        let rect = this.canvas.getBoundingClientRect(),
            x =  e.clientX - rect.left,
            y = e.clientY - rect.top;
            
        let gridPos = this.transformScreenToGrid(x, y),
            gridY = gridPos.y,
            gridX = gridPos.x;
        
        if (!this.grid.isBomb(gridX, gridY)) {
            this.grid.getSquare(gridX, gridY).visible = true;
        }
    }
}

module.exports = UI;