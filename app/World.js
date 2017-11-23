const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

export default class World {
    constructor(options) {
        Object.assign(this, options);
        this.aliveCells = new Set();
        this.nextToAliveCells = new Set();
        this.generateRandom();
    }

    getCellFromCoordinates (x, y) {
        return `${x}:${y}`;
    };

    getCellCoordinates(cell) {
        return {
            x: parseInt(cell.substr(0, cell.indexOf(':'))),
            y: parseInt(cell.substr(cell.indexOf(':') + 1))
        };
    };

    getNeighbours(cell) {
        const { x, y } = this.getCellCoordinates(cell);
        return [
            {
                x: x - 1,
                y: y - 1,
                cell: this.getCellFromCoordinates(x - 1, y - 1)
            },
            {
                x: x - 1,
                y: y,
                cell: this.getCellFromCoordinates(x - 1, y)
            },
            {
                x: x - 1,
                y: y + 1,
                cell: this.getCellFromCoordinates(x - 1, y + 1)
            },
            {
                x: x,
                y: y - 1,
                cell: this.getCellFromCoordinates(x, y - 1)
            },
            {
                x: x,
                y: y + 1,
                cell: this.getCellFromCoordinates(x, y + 1)
            },
            {
                x: x + 1,
                y: y - 1,
                cell: this.getCellFromCoordinates(x + 1, y - 1)
            },
            {
                x: x + 1,
                y: y,
                cell: this.getCellFromCoordinates(x + 1, y)
            },
            {
                x: x + 1,
                y: y + 1,
                cell: this.getCellFromCoordinates(x + 1, y + 1)
            }
        ];
    };

    addNeighbours(cell) {
        const neighbours = this.getNeighbours(cell);

        neighbours.forEach(({ cell }) => {
            if (!this.aliveCells.has(cell)) {
                this.nextToAliveCells.add(cell);
            } else {
                this.nextToAliveCells.delete(cell);
            }
        });
    };

    addAliveCell(cell) {
        this.aliveCells.add(cell);
        this.addNeighbours(cell);
    };

    generatePattern(pattern) {
        const patternLines = pattern.split('\n');
        const parsedPattern = patternLines.map((line) => {
            return line.replace(/[^.*]/g, '').split('');
        });

        this.aliveCells.clear();

        for (let y = 0; y < parsedPattern.length; y++ ) {
            for (let x = 0; x < parsedPattern[y].length; x++) {
                if (parsedPattern[y][x] === '*') {
                    this.addAliveCell(this.getCellFromCoordinates(x, y));
                }
            }
        }

        this.initialGeneration = new Set(this.aliveCells);
        return this.aliveCells;
    }

    generateRandom() {

        for(let x = 0; x < CANVAS_WIDTH; x++) {
            for(let y = 0; y < CANVAS_HEIGHT; y++) {
                const randomValue = Math.random();

                if (randomValue > 0.7) {
                    this.addAliveCell(this.getCellFromCoordinates(x, y));
                }
            }
        }

        this.initialGeneration = new Set(this.aliveCells);
    }

    getAliveNeighboursCount(cell) {
        const neighbours = this.getNeighbours(cell);

        return neighbours.reduce((count, { cell }) => {
            if (this.aliveCells.has(cell)) {
                count += 1;
            }

            return count;
        }, 0);
    }

    nextGeneration() {

        const killCellsList = new Set();
        const bareCellsList = new Set();

        this.aliveCells.forEach((cell) => {
            const aliveNeighboursCount = this.getAliveNeighboursCount(cell);

            switch (aliveNeighboursCount) {
                case 2: {
                    break;
                }
                case 3: {
                    break;
                }
                default: {
                    killCellsList.add(cell);
                    break;
                }
            }
        });

        this.nextToAliveCells.forEach((cell) => {
            const aliveNeighboursCount = this.getAliveNeighboursCount(cell);

            switch (aliveNeighboursCount) {
                case 3: {
                    bareCellsList.add(cell);
                    break;
                }
                default: {
                    break;
                }
            }
        });

        killCellsList.forEach((cell) => {
            this.aliveCells.delete(cell);
        });

        bareCellsList.forEach((cell) => {
            this.addAliveCell(cell);
        });

        return {
            killCellsList,
            bareCellsList
        }
    }

    reset() {
        this.nextToAliveCells.clear();
        this.aliveCells.clear();
        this.initialGeneration.forEach(this.addAliveCell.bind(this));
        return this.aliveCells;
    }

    toggleCell(x, y) {
        const cell = this.getCellFromCoordinates(x, y);

        if (this.aliveCells.has(cell)) {
            this.aliveCells.delete(cell);
            return {
                killCellsList: new Set([cell])
            };
        } else {
            this.addAliveCell(cell);
            return {
                bareCellsList: new Set([cell])
            };
        }
    }

}