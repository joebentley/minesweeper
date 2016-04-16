'use strict';

/* jshint expr:true */

var expect = require('chai').expect;

var Grid = require('../lib/grid');
var Square = require('../lib/square');

describe('Grid', () => {
    let grid;

    beforeEach(() => {
        grid = new Grid(16, 16);
    });

    describe('constructor()', () => {
        it('should set default grid to 16x16', () => {
            grid = new Grid();

            expect(grid.width).to.equal(grid.height).to.equal(16);
        });

        it('should initialise grid', () => {
            expect(grid.grid).to.deep.equal(grid.initialiseGrid().grid);
        });

        it('should set width/height properly', () => {
            grid = new Grid(16, 32);

            expect(grid.width).to.equal(16);
            expect(grid.height).to.equal(32);
        });
    });

    describe('initialiseGrid()', () => {
        it('should produce grid with correct width/height', () => {
            expect(grid.grid).to.have.length(16); // column arrays
            expect(grid.grid[0]).to.have.length(16); // nested (row) arrays
        });
        
        it('should set every square to invisible with no bombs', () => {
            for (let x = 0; x < grid.width; x++) {
                for (let y = 0; y < grid.height; y++) {
                    expect(grid.grid[x][y]).to.deep.equal(new Square(false, false));
                }
            }
        });
        
        it('should set bombCounts', () => {
            expect(grid).to.have.property('bombCounts');
        });
    });

    describe('setSquare()', () => {
        it('should set the value in the correct square', () => {
            grid.setSquare(3, 4, 'hello');

            expect(grid.grid[3][4]).to.equal('hello');
        });

        it('should throw exception when out of bounds', () => {
            expect(grid.setSquare.bind(grid, -1, 0, '0')).to.throw(RangeError);
            expect(grid.setSquare.bind(grid, 1, 17, '0')).to.throw(RangeError);
        });
    });

    describe('getSquare()', () => {
        it('should get the value that the square is set to', () => {
            grid.setSquare(3, 4, 'hello');

            expect(grid.getSquare(3, 4)).to.equal('hello');
        });

        it('should throw exception when out of bounds', () => {
            expect(grid.getSquare.bind(grid, -1, 0)).to.throw(RangeError);
            expect(grid.getSquare.bind(grid, 1, 17)).to.throw(RangeError);
        });
    });

    describe('isBomb()', () => {
        it('should return true if square is bomb', () => {
            grid.setSquare(10, 10, Square(true, false));

            expect(grid.isBomb(10, 10)).to.be.true;
        });

        it('should return false if square not a bomb or not a Square object', () => {
            expect(grid.isBomb(12, 8)).to.be.false;

            grid.setSquare(10, 10, 'hello');
            expect(grid.isBomb(10, 10)).to.be.false;

            grid.setSquare(10, 10, Square(false, false));
            expect(grid.isBomb(10, 10)).to.be.false;
        });

        it('should throw exception when out of bounds', () => {
            expect(grid.isBomb.bind(grid, -1, 0)).to.throw(RangeError);
            expect(grid.isBomb.bind(grid, 1, 17)).to.throw(RangeError);
        });
    });

    describe('isVisible()', () => {
        it('should return true if square is visible', () => {
            grid.setSquare(10, 10, Square(false, true));

            expect(grid.isVisible(10, 10)).to.be.true;
        });

        it('should return false if square not visible or not a Square object', () => {
            expect(grid.isVisible(12, 8)).to.be.false;

            grid.setSquare(10, 10, 'hello');
            expect(grid.isVisible(10, 10)).to.be.false;

            grid.setSquare(10, 10, Square(false, false));
            expect(grid.isVisible(10, 10)).to.be.false;
        });

        it('should throw exception when out of bounds', () => {
            expect(grid.isVisible.bind(grid, -1, 0)).to.throw(RangeError);
            expect(grid.isVisible.bind(grid, 1, 17)).to.throw(RangeError);
        });
    });

    describe('getNeighbours()', () => {
        it('should return an object representing the neighbour', () => {
            var square = Square(true, true);
            grid.setSquare(9, 12, square);

            var neighbours = grid.getNeighbours(10, 11);

            expect(neighbours).to.contain({ x: 9, y: 12, square: square });

            neighbours = grid.getNeighbours(12, 12);
            expect(neighbours).to.not.contain({ x: 9, y: 11, square: square });
        });
        
        it('should detect squares on the edges', () => {
            var bomb = Square(true);
            grid.setSquare(4, 0, bomb);
            
            var neighbours = grid.getNeighbours(3, 0);
            expect(neighbours).to.contain({ x: 4, y: 0, square: bomb});
            
            grid.setSquare(0, 5, bomb);
            
            neighbours = grid.getNeighbours(0, 4);
            expect(neighbours).to.contain({ x: 0, y: 5, square: bomb});
        });

        it('should throw exception when out of bounds', () => {
            expect(grid.getNeighbours.bind(grid, -1, 0)).to.throw(RangeError);
            expect(grid.getNeighbours.bind(grid, 1, 16)).to.throw(RangeError);
        });

        it('should handle being at the edge of the screen fine', () => {
            expect(grid.getNeighbours.bind(grid, 0, 0)).to.not.throw(RangeError);
            expect(grid.getNeighbours.bind(grid, 0, 15)).to.not.throw(RangeError);
            expect(grid.getNeighbours.bind(grid, 15, 0)).to.not.throw(RangeError);
            expect(grid.getNeighbours.bind(grid, 15, 15)).to.not.throw(RangeError);
        });

        it('should not error if any of the squares are not Square objects', () => {
            grid.setSquare(10, 10, 'hello');
            expect(grid.getNeighbours.bind(grid, 10, 11)).to.not.throw(Error);
        });
    });

    describe('getBombNeighbours()', () => {
        it('should return only the neighbours that are bombs', () => {
            var square = Square();
            grid.setSquare(10, 12, square);

            var neighbours = grid.getBombNeighbours(10, 11);
            expect(neighbours).to.have.length(0);

            var bomb = Square(true);
            grid.setSquare(9, 11, bomb);
            neighbours = grid.getBombNeighbours(10, 11);

            expect(neighbours).to.contain({ x: 9, y: 11, square: bomb });

            neighbours = grid.getNeighbours(14, 14);
            expect(neighbours).to.not.contain({ x: 9, y: 11, square: bomb });
        });

        it('should throw exception when out of bounds', () => {
            expect(grid.getBombNeighbours.bind(grid, -1, 0)).to.throw(RangeError);
            expect(grid.getBombNeighbours.bind(grid, 1, 17)).to.throw(RangeError);
        });

        it('should handle being at the edge of the screen fine', () => {
            expect(grid.getBombNeighbours.bind(grid, 0, 0)).to.not.throw(RangeError);
            expect(grid.getBombNeighbours.bind(grid, 0, 15)).to.not.throw(RangeError);
            expect(grid.getBombNeighbours.bind(grid, 15, 0)).to.not.throw(RangeError);
            expect(grid.getBombNeighbours.bind(grid, 15, 15)).to.not.throw(RangeError);
        });

        it('should not error if any of the squares are not Square objects', () => {
            grid.setSquare(10, 10, 'hello');
            expect(grid.getBombNeighbours.bind(grid, 10, 11)).to.not.throw(Error);
        });
    });

    describe('countBombNeighbours()', () => {
        it('should count only the neighbours that are bombs', () => {
            var square = Square();
            grid.setSquare(10, 12, square);
            expect(grid.countBombNeighbours(10, 11)).to.equal(0);

            var bomb = Square(true);
            grid.setSquare(9, 11, bomb);
            expect(grid.countBombNeighbours(10, 11)).to.equal(1);

            grid.setSquare(11, 11, bomb);
            expect(grid.countBombNeighbours(10, 11)).to.equal(2);
            expect(grid.countBombNeighbours(14, 14)).to.equal(0);
        });

        it('should throw exception when out of bounds', () => {
            expect(grid.countBombNeighbours.bind(grid, -1, 0)).to.throw(RangeError);
            expect(grid.countBombNeighbours.bind(grid, 1, 17)).to.throw(RangeError);
        });

        it('should handle being at the edge of the screen fine', () => {
            expect(grid.countBombNeighbours.bind(grid, 0, 0)).to.not.throw(RangeError);
            expect(grid.countBombNeighbours.bind(grid, 0, 15)).to.not.throw(RangeError);
            expect(grid.countBombNeighbours.bind(grid, 15, 0)).to.not.throw(RangeError);
            expect(grid.countBombNeighbours.bind(grid, 15, 15)).to.not.throw(RangeError);
        });

        it('should not error if any of the squares are not Square objects', () => {
            grid.setSquare(10, 10, 'hello');
            expect(grid.countBombNeighbours.bind(grid, 10, 11)).to.not.throw(Error);
        });
    });

    describe('computeBombNeighbourCounts()', () => {
        it('should calculate number of bomb neighbours for each square', () => {
            grid.setSquare(3, 3, Square(true, false));
            grid.setSquare(3, 4, Square(true, false));

            let neighbours = grid.computeBombNeighbourCounts();

            // should be same dimensions as grid
            expect(neighbours).to.have.length(grid.grid.length); // column arrays
            expect(neighbours[0]).to.have.length(grid.grid[0].length); // nested (row) arrays

            expect(neighbours[3][3]).to.equal(1);
            expect(neighbours[4][3]).to.equal(2);

            expect(grid.bombCounts).to.equal(neighbours);
        });

        it('should not error if any of the squares are not Square objects', () => {
            grid.setSquare(10, 10, 'hello');
            expect(grid.computeBombNeighbourCounts.bind(grid)).to.not.throw(Error);
        });
    });

    describe('isBoardClear()', () => {
        it('should be true if every square is null or visible', () => {
            // set all to visible
            grid.grid.forEach(column => {
                column.forEach(square => {
                    square.visible = true;
                });
            });

            grid.setSquare(10, 10, Square(true, false));
            grid.setSquare(10, 12, Square(true, true));

            expect(grid.isBoardClear()).to.be.false;

            grid.getSquare(10, 10).visible = true;

            expect(grid.isBoardClear()).to.be.true;
        });

        it('should not error if any of the squares are not Square objects', () => {
            grid.setSquare(10, 10, 'hello');
            expect(grid.isBoardClear.bind(grid)).to.not.throw(Error);
        });
    });

    describe('hasAnyBombs()', () => {
        it('should detect whether or not there are bombs', () => {
            expect(grid.hasAnyBombs()).to.be.false;

            grid.setSquare(10, 10, new Square(true, false));

            expect(grid.hasAnyBombs()).to.be.true;
        });
    });

    describe('getNumBombs()', () => {
        it('should detect how many bombs', () => {
            expect(grid.getNumBombs()).to.equal(0);

            grid.setSquare(10, 10, new Square(true, false));
            expect(grid.getNumBombs()).to.equal(1);
            grid.setSquare(10, 11, new Square(true, false));
            expect(grid.getNumBombs()).to.equal(2);
        });
    });

    describe('addRandomBombs()', () => {
        it('should add random bombs to the grid', () => {
            grid.initialiseGrid();

            expect(grid.hasAnyBombs()).to.be.false;

            grid = grid.addRandomBombs(4);
            expect(grid.getNumBombs()).to.equal(4);
        });
        
        it('should update the bomb counts', () => {
            expect(grid.addRandomBombs.bind(grid, 20)).to.change(grid, 'bombCounts');
        });
    });
    
    describe('fillVisibleSquares()', () => {
        it('should fill all squares on a blank board', () => {
            grid.fillVisibleSquares(10, 10);
            
            for (let x = 0; x < grid.width; x++) {
                for (let y = 0; y < grid.height; y++) {
                    expect(grid.grid[x][y]).to.deep.equal(new Square(false, true));
                }
            }
        });
        
        it('should fill all squares but not a bomb', () => {
            grid.setSquare(2, 2, new Square(true, false));
            
            grid.fillVisibleSquares(10, 10);
            
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    if (x !== 0 && y !== 0) {
                        expect(grid.getSquare(2 + x, 2 + y)).to.have.property('visible', true);
                    }
                }
            }
            
            expect(grid.getSquare(2, 2)).to.have.property('visible', false);
        });
        
        it('should fill diagonals', () => {
            grid.setSquare(2, 2, new Square(true));
            grid.setSquare(2, 3, new Square(true));
            grid.setSquare(3, 2, new Square(true));
            
            grid.fillVisibleSquares(5, 5);
            
            expect(grid.getSquare(3, 3)).to.have.property('visible', true);
        });
        
        it('should not error at edge of board', () => {
            expect(grid.fillVisibleSquares.bind(grid, 0, 0)).to.not.throw(Error);
            expect(grid.fillVisibleSquares.bind(grid, 15, 15)).to.not.throw(Error);
        });
    });
});