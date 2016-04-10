'use strict';

var expect = require('chai').expect;

var UI = require('../lib/ui');
var Grid = require('../lib/grid');

describe('UI', () => {
    let ui, grid, canvas;
    
    beforeEach(() => {
        canvas = {
            width: 200,
            height: 300
        };
        
        grid = new Grid(16, 16);
        ui = new UI(canvas, grid);
    });
    
    describe('constructor()', () => {
        it('should set the game grid', () => {
            expect(ui.grid).to.equal(grid);
            expect(ui.canvas).to.equal(canvas);
        });
    });
    
    describe('transformScreenToGrid()', () => {
        it('should raise exception if out of bounds of canvas', () => {
            expect(ui.transformScreenToGrid.bind(ui, 205, 300)).to.throw(RangeError);
            expect(ui.transformScreenToGrid.bind(ui, -20, 150)).to.throw(RangeError);
            expect(ui.transformScreenToGrid.bind(ui, 0, 300)).to.throw(RangeError);
            expect(ui.transformScreenToGrid.bind(ui, 0, 150)).to.not.throw(RangeError);
        });
        
        it('should transform to grid coordinates as expected', () => {
            let unitWidth = canvas.width / grid.width,
                unitHeight = canvas.height / grid.height;
                
            expect(ui.transformScreenToGrid(0, 0)).to.deep.equal({ x: 0, y: 0 });
            expect(ui.transformScreenToGrid(unitWidth * 2, 0)).to.deep.equal({ x: 2, y: 0 });
            expect(ui.transformScreenToGrid(unitWidth * 2 + unitWidth / 2, unitHeight)).to.deep.equal({ x: 2, y: 1 });
            expect(ui.transformScreenToGrid(canvas.width - 1, canvas.height - 1)).to.deep.equal({ x: 15, y: 15 });
        });
    });
    
    describe('transformGridToScreen()', () => {
        it('should raise exception if out of bounds of canvas', () => {
            expect(ui.transformGridToScreen.bind(ui, 3, 17)).to.throw(RangeError);
            expect(ui.transformGridToScreen.bind(ui, -1, 8)).to.throw(RangeError);
            expect(ui.transformGridToScreen.bind(ui, 17, 1)).to.throw(RangeError);
            expect(ui.transformGridToScreen.bind(ui, 14, 1)).to.not.throw(RangeError);
        });
        
        it('should transform to screen coordinates as expected', () => {
            let unitWidth = canvas.width / grid.width,
                unitHeight = canvas.height / grid.height;
            
            expect(ui.transformGridToScreen(0, 0)).to.deep.equal({ x: 0, y: 0 });
            expect(ui.transformGridToScreen(2, 0)).to.deep.equal({ x: 2 * unitWidth, y: 0 });
            expect(ui.transformGridToScreen(2, 1)).to.deep.equal({ x: 2 * unitWidth, y: unitHeight });
            expect(ui.transformGridToScreen(15, 15)).to.deep.equal({ x: 15 * unitWidth, y: 15 * unitHeight });
        });
    });
});
