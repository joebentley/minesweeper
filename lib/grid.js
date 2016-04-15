'use strict';

var Square = require('./square');

class Grid {
    constructor(width, height) {
        if (typeof width === 'undefined') {
            width = 16;
        }
        if (typeof height === 'undefined') {
            height = 16;
        }

        this.width = width;
        this.height = height;

        this.initialiseGrid();
    }

    initialiseGrid() {
        this.grid = [];

        for (let x = 0; x < this.width; x++) {
            var subArray = [];

            for (let y = 0; y < this.height; y++) {
                subArray[y] = new Square(false, false);
            }

            this.grid[x] = subArray;
        }
        
        this.computeBombNeighbourCounts();

        return this;
    }
    
    /**
     * Set object at (x, y)
     * @param {Number} x - x coordinate of cell
     * @param {Number} y - y coordinate of cell
     * @param {Square} square - square to set (x, y) cell to
     * @throws {RangeError} if x or y coordinate out of grid bounds
     */
    setSquare(x, y, square) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError('Out of bounds of grid');
        }

        this.grid[x][y] = square;
    }

    /**
     * Return Square object at (x, y)
     * @param {Number} x - x coordinate of cell
     * @param {Number} y - y coordinate of cell
     * @throws {RangeError} if x or y coordinate out of grid bounds
     * @returns {Square} square at (x, y)
     */
    getSquare(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError('Out of bounds of grid');
        }

        return this.grid[x][y];
    }

    /**
     * Return true if cell at (x, y) is a bomb
     * @param {Number} x - x coordinate of cell
     * @param {Number} y - y coordinate of cell
     * @throws {RangeError} if x or y coordinate out of grid bounds
     */
    isBomb(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError('Out of bounds of grid');
        }

        let square = this.getSquare(x, y);

        if (square !== null && square.hasOwnProperty('bomb')) {
            return square.bomb;
        } else {
            return false;
        }
    }
    
    /**
     * Return true if cell at (x, y) is visible
     * @param {Number} x - x coordinate of cell
     * @param {Number} y - y coordinate of cell
     * @throws {RangeError} if x or y coordinate out of grid bounds
     */
    isVisible(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError('Out of bounds of grid');
        }

        let square = this.getSquare(x, y);

        if (square !== null && square.hasOwnProperty('visible')) {
            return square.visible;
        } else {
            return false;
        }
    }

    /**
     * Return true if any of the squares are bombs
     * @returns {Boolean} whether or not there are any bombs
     */    
    hasAnyBombs() {
        return this.getNumBombs() !== 0;
    }
    
    /**
     * Return number of bombs on the board
     * @returns {Number} number of bombs
     */    
    getNumBombs() {
        let sum = 0;

        this.grid.forEach(column => {
            column.forEach(square => {
                if (square.bomb) {
                    sum++;
                }
            });
        });

        return sum;
    }

    /**
     * Returns array of objects representing position and contents of neighbour cells
     * @param {Number} x - x coordinate of cell
     * @param {Number} y - y coordinate of cell
     * @returns {Array} An Array that contains objects of the form {x, y, square}
     * @throws {RangeError} if x or y coordinate out of grid bounds
     */
    getNeighbours(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError('Out of bounds of grid');
        }

        let neighbours = [];

        [-1, 0, 1].forEach(xOffset => {
            [-1, 0, 1].forEach(yOffset => {
                let xPos = x + xOffset, yPos = y + yOffset;

                /* If not at (x, y) i.e. on the square whose neighbours we are finding,
                   AND if we are within the screen boundaries, then check for the neighbour. */
                if (0 < xPos && xPos < this.width &&
                    0 < yPos && yPos < this.height &&
                    (xOffset !== 0 || yOffset !== 0)) {

                    let square = this.getSquare(xPos, yPos);
                    if (square !== null) {
                        neighbours.push({ x: xPos, y: yPos, square });
                    }
                }
            });
        });

        return neighbours;
    }

    /**
     * Returns neighbours from getNeighbours(x, y) that are bombs
     * @param {Number} x - x coordinate of cell
     * @param {Number} y - y coordinate of cell
     * @throws {RangeError} if x or y coordinate out of grid bounds
     */
    getBombNeighbours(x, y) {
        return this.getNeighbours(x, y).filter(neighbour => {
            return neighbour.square.bomb;
        });
    }

    /**
     * Return number of bomb neighbours of cell at x, y
     * @param {Number} x - x coordinate of cell
     * @param {Number} y - y coordinate of cell
     * @throws {RangeError} if x or y coordinate out of grid bounds
     */
    countBombNeighbours(x, y) {
        return this.getBombNeighbours(x, y).length;
    }
    
    /**
     * Set this.bombCounts to 2D array where each cell is the number of bomb neighbours to that cell.
     * @returns {Array} the 2D array with the bomb counts
     */
    computeBombNeighbourCounts() {
        let counts = [];

        for (let x = 0; x < this.width; ++x) {
            var subArray = [];

            for (let y = 0; y < this.height; ++y) {
                subArray[y] = this.countBombNeighbours(x, y);
            }

            counts[x] = subArray;
        }
        
        this.bombCounts = counts;

        return counts;
    }
    
    /**
     * Get bomb neighbour count of the cell at x, y from this.bombcounts, computing it if it doesn't exist
     * @param {Number} x - x coordinate of cell
     * @param {Number} y - y coordinate of cell
     * @returns {Number} the number of neighbours of (x, y) that are bombs
     */
    getBombNeighbourCount(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError('Out of bounds of grid');
        }
        
        if (this.bombCounts == null) {
            this.computeBombNeighbourCounts();
        }
        
        return this.bombCounts[x][y];
    }
    
    /**
     * Return true if all squares on board are visible
     */
    isBoardClear() {
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                var square = this.grid[x][y];
                
                if (square !== null && square.hasOwnProperty('visible') && square.visible !== true) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Add nBombs random bombs to the board, returning the new modified board, also updates bomb counts
     * @param {nBombs} How many bombs to randomly add
     * @return {Grid} New modified grid
     */
    addRandomBombs(nBombs) {
        for (var n = 0; n < nBombs; ++n) {
            let randomX = Math.round(Math.random() * (this.width - 1)), 
                randomY = Math.round(Math.random() * (this.height - 1));
            
            var square = this.getSquare(randomX, randomY);
            
            if (square.bomb) {
                n -= 1; // try again, by moving counter back one
            } else {
                square.bomb = true;
            }
        }
        
        // Compute new bomb counts
        this.computeBombNeighbourCounts();
        
        return this;
    }
    
    /**
     * Fill all squares to be visible starting at (x, y) using a floodfill algorithm, stopping at bombs
     */
    fillVisibleSquares(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        
        // Stop immediately if next square visible or is bomb
        if (this.getSquare(x, y).visible || this.getSquare(x, y).bomb) {
            return;
        }
        
        // If it has any bomb neighbours, set it to visible, then stop
        if (this.getBombNeighbourCount(x, y) > 0) {
            this.getSquare(x, y).visible = true;
            return;
        }
        this.getSquare(x, y).visible = true;
        
        // Recurse
        this.fillVisibleSquares(x + 1, y);
        this.fillVisibleSquares(x - 1, y);
        this.fillVisibleSquares(x, y + 1);
        this.fillVisibleSquares(x, y - 1);
    }
    
    /**
     * Return `width` by `height` grid with `nBombs` squares set as bombs
     * 
     * @returns {Grid} randomly generated grid
     */
    static randomGrid(width, height, nBombs) {
        let grid = new Grid(width, height);
        
        return grid.addRandomBombs(nBombs);
    }
}

module.exports = Grid;