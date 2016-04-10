'use strict';

var Grid = require('./grid');
var Square = require('./square');

class UI {
    constructor(canvas, grid) {
        if (typeof grid === 'undefined') {
            grid = new Grid.randomGrid(16, 16, 20);
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
    
    /**
     * Draw button using context `ctx` at `x` and `y` of `width` by `height`
     * and draws it in a different style if the mouse click is held down on the button
     */
    drawButton(ctx, x, y, width, height) {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(x * width + 2, y * height + 2, width - 2, height - 2);
        
        if (this.clickHeld && x === this.clickPosition.x && y === this.clickPosition.y) {
            ctx.fillStyle = "#444";
            ctx.fillRect(x * width + 4, y * height + 4, width - 4, height - 4);
            ctx.fillStyle = "#888";
            ctx.fillRect(x * width + 4, y * height + 4, width - 6, height - 6);
        } else {
            ctx.fillStyle = "#222";
            ctx.fillRect(x * width + 4, y * height + 4, width - 4, height - 4);
            ctx.fillStyle = "#999";
            ctx.fillRect(x * width + 4, y * height + 4, width - 6, height - 6);
        }
    }

    /* Event handlers. */
    
    draw(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // draw grid
        let unitWidth = this.canvas.width / this.grid.width,
            unitHeight = this.canvas.height / this.grid.height;

        for (let x = 0; x < this.grid.width; x++) {
            for (let y = 0; y < this.grid.height; y++) {
                ctx.beginPath();
                
                if (!this.grid.isVisible(x, y)) {
                    this.drawButton(ctx, x, y, unitHeight, unitWidth);
                }
                
                ctx.closePath();
            }
        }
    }
    
    onMouseUp(e) {
        let gridX = this.clickPosition.x,
            gridY = this.clickPosition.y;
        
        if (!this.grid.isBomb(gridX, gridY)) {
            this.grid.getSquare(gridX, gridY).visible = true;
        }
        this.clickHeld = false;
    }
    
    onMouseDown(e) {
        let rect = this.canvas.getBoundingClientRect(),
            x =  e.clientX - rect.left,
            y = e.clientY - rect.top;
            
        let gridPos = this.transformScreenToGrid(x, y),
            gridY = gridPos.y,
            gridX = gridPos.x;
        
        this.clickPosition = { x: gridX, y: gridY };
        this.clickHeld = true;
    }
}

module.exports = UI;
