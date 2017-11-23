import Vue from 'vue';
import World from './World';
import Canvas from './Canvas';

export default class App {
    constructor(options) {
        const defauts = {
            canvasSelector: "#canvas",
            aliveCellFillColor: '#000',
            nextGenerationTimeout: 100
        };

        Object.assign(this, defauts, options);

        this.world = new World();
        this.canvas = new Canvas({ world: this.world });
        this.settings = new Vue({
            el: '#settings',
            data: {
                speed: this.nextGenerationTimeout
            },
            methods: {
                start: this.start.bind(this),
                pause: this.pause.bind(this),
                stop: this.stop.bind(this),
                zoomOut: this.zoomOut.bind(this),
                zoomIn: this.zoomIn.bind(this),
                zoomReset: this.zoomReset.bind(this),
                moveUp: this.moveCanvasUp.bind(this),
                moveLeft: this.moveCanvasLeft.bind(this),
                moveRight: this.moveCanvasRight.bind(this),
                moveDown: this.moveCanvasDown.bind(this),
                applyPattern: this.applyPattern.bind(this),
                setNextGenerationTimeout: this.setNextGenerationTimeout.bind(this),
            }
        });

        this.canvas.draw(this.world.aliveCells);


        this.timer = null;
    }

    generateRandom() {
        this.world.generateRandom();
        this.canvas.draw(this.world.activeCells);
    }

    start() {
        this.timer = setInterval(
            () => {
            const { bareCellsList, killCellsList } = this.world.nextGeneration();
                this.canvas.draw(bareCellsList, killCellsList);
            },
            this.nextGenerationTimeout
        );
    }

    pause() {
        clearInterval(this.timer);
    }

    stop() {
        this.pause();
        this.canvas.clear();
        this.canvas.draw(this.world.reset());
    }

    setNextGenerationTimeout(event) {
        this.pause();
        this.nextGenerationTimeout = event.target.value;
        this.start();
    }

    zoomOut() {
        this.canvas.setSellSize(this.canvas.cellSize / 2);
    }

    zoomIn() {
        this.canvas.setSellSize(this.canvas.cellSize * 2);
    }

    zoomReset() {
        this.canvas.resetCellSize();
    }

    moveCanvasUp() {
        this.canvas.move('up', 100);
    }

    moveCanvasDown() {
        this.canvas.move('down', 100);
    }

    moveCanvasLeft() {
        this.canvas.move('left', 100);
    }

    moveCanvasRight() {
        this.canvas.move('right', 100);
    }

    applyPattern() {
        const pattern = document.getElementById('pattern').value;
        this.canvas.redraw(this.world.generatePattern(pattern));
    }
}