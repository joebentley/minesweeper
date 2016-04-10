'use strict';

var _ = require('underscore');

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
     * Transform pair of grid coordinates to screen coordinates of top-left of square on grid
     * @returns {Object} {x, y} representing coordinates of top-left corner of square
     */
    transformGridToScreen(gridX, gridY) {
        if (gridX < 0 || gridY < 0 || gridX >= this.grid.width || gridY >= this.grid.height) {
            throw RangeError('Out of bounds of grid');
        }
        
        let unitWidth = this.canvas.width / this.grid.width,
            unitHeight = this.canvas.height / this.grid.height;
        
        return { x: gridX * unitWidth, y: gridY * unitHeight };
    }
    
    /**
     * Draw button using context `ctx` at `gridX` and `gridY`, drawing it in a
     * different style if the mouse button is held down on it. The draw position
     * is calculated using the width and height of the canvas and grid.
     */
    drawButton(ctx, gridX, gridY) {
        let screenPos = this.transformGridToScreen(gridX, gridY),
            unitWidth = this.canvas.width / this.grid.width,
            unitHeight = this.canvas.height / this.grid.height,
            x = screenPos.x,
            y = screenPos.y;
        
        ctx.fillStyle = "#ccc";
        ctx.fillRect(x + 2, y + 2, unitWidth - 2, unitHeight - 2);
        
        if (this.clickHeld && _.isEqual({ x: gridX, y: gridY }, this.clickPosition)) {
            // We're clicking on the square
            ctx.fillStyle = "#444";
            ctx.fillRect(x + 4, y + 4, unitWidth - 4, unitHeight - 4);
            ctx.fillStyle = "#888";
            ctx.fillRect(x + 4, y + 4, unitWidth - 6, unitHeight - 6);
        } else {
            ctx.fillStyle = "#222";
            ctx.fillRect(x + 4, y + 4, unitWidth - 4, unitHeight - 4);
            ctx.fillStyle = "#999";
            ctx.fillRect(x + 4, y + 4, unitWidth - 6, unitHeight - 6);
        }
    }
    
    
    drawBombCount(ctx, gridX, gridY) {
        let count = this.grid.bombCounts[gridX][gridY],
            screenPos = this.transformGridToScreen(gridX, gridY),
            unitWidth = this.canvas.width / this.grid.width,
            unitHeight = this.canvas.height / this.grid.height,
            x = screenPos.x,
            y = screenPos.y;
            
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText(count, x + unitWidth / 2 - 5, y + unitHeight / 2 + 4);
    }
    

    /* Event handlers. */
    
    draw(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Draw grid
        for (let x = 0; x < this.grid.width; x++) {
            for (let y = 0; y < this.grid.height; y++) {
                ctx.beginPath();
                
                if (this.grid.isVisible(x, y)) {
                    // If the square if clear, draw the number of neighbouring bombs
                    this.drawBombCount(ctx, x, y);
                } else {
                    this.drawButton(ctx, x, y);
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
