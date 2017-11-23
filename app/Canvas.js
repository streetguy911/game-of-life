const DEFAULT_CELL_SIZE = 4;

export default class Canvas {
    constructor(options) {
        const defauts = {
            canvasSelector: "#canvas",
            aliveCellFillColor: '#000',
            cellSize: DEFAULT_CELL_SIZE,
            nextGenerationTimeout: 100,
        };

        Object.assign(this, defauts, options);

        this.getCellCoordinates = this.world.getCellCoordinates;
        this.canvas = document.querySelector(this.canvasSelector);
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = this.aliveCellFillColor;
        this.moveX = 0;
        this.moveY = 0;

        this.canvas.addEventListener('click', (event) => {
            const { layerX, layerY } = event;

            const x = parseInt(layerX/this.cellSize);
            const y = parseInt(layerY/this.cellSize);
            this.world.toggleCell(x, y);
            this.redraw(this.world.aliveCells);
        });
    }

    draw(bareCellsList, killCellsList) {
        if (bareCellsList && bareCellsList.size > 0) {
            bareCellsList.forEach((cell) => {
                const { x, y } = this.getCellCoordinates(cell);
                this.context.fillRect(
                    this.cellSize * x + this.moveX,
                    this.cellSize * y + + this.moveY,
                    this.cellSize,
                    this.cellSize
                );
            });
        }

        if (killCellsList && killCellsList.size > 0) {
            killCellsList.forEach((cell) => {
                const { x, y } = this.getCellCoordinates(cell);
                this.context.clearRect(
                    this.cellSize * x + this.moveX,
                    this.cellSize * y + this.moveY,
                    this.cellSize,
                    this.cellSize
                );
            });
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redraw(cells) {
        this.clear();
        this.draw(cells);
    }

    setSellSize(cellSize) {
        this.cellSize = cellSize;
        this.redraw(this.world.aliveCells);
    }

    resetCellSize() {
        this.cellSize = DEFAULT_CELL_SIZE;
        this.redraw(this.world.aliveCells);
    }

    move(direction, size) {
        switch(direction) {
            case 'up': {
                this.moveY = this.moveY + size;
                break;
            }
            case 'down': {
                this.moveY = this.moveY - size;
                break;
            }
            case 'left': {
                this.moveX = this.moveX + size;
                break;
            }
            case 'right': {
                this.moveX = this.moveX - size;
                break;
            }
            default: {
                break;
            }
        }

        this.redraw(this.world.aliveCells);
    }
}
