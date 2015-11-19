/* app.js file creates instances of entities and provides the game rules 
 */
window.onload = function() {

    var gridWidth = 10;
    var gridHeight = 10;

    // var BOARDWIDTH = 100;
    var COLS = 100;
    var ROWS =  70;
    var DELAY = 100;

    var engine = new Engine(gridWidth, gridHeight, COLS, ROWS);
    engine.load();

    var cells = [];

    for (var x = 0; x < COLS; x++) {
        cells[x] = [];
        for (var y = 0; y < ROWS; y++) {
            cells[x][y] = new Cell(x, y, Math.random() < 0.5);
        }
    }

    // add neighbours to each cell
    var cell;
    for (var x = 0; x < COLS; x++) {
        for (var y = 0; y < ROWS; y++) {
            cell = cells[x][y];
            addNeigbours(cell, x, y);
        }
    }

    function addNeigbours(cell, x, y) {
        for (var dx = -1; dx < 2; dx++) {
            for (var dy = -1; dy < 2; dy++) {
                if (dx === 0 && dy === 0) {
                    continue;
                }
                cell.addNeighbour(getCell(wrap(x + dx, COLS), wrap(y + dy, ROWS)));
            }
        }
    }

    function getCell(x, y) {
        if (x < 0 || y < 0 || x >= COLS || y >= ROWS) {
            throw "(x,y) is out of bounds: " + x + ", " + y;
        }
        var cell = cells[x][y];
        if (!(cell instanceof Cell)) {
            throw "cell at given (x,y) is not a cell: " + x + ", " + y;
        }
        return cell;
    }

    function wrap(x, max) {
        if (x >= 0) {
            return x % max;
        } else {
            return max + x;
        }
    }

    var newStates = []
    for (var x = 0; x < COLS; x++) {
        newStates[x] = new Array(ROWS);
    }

    var cellManager = new CellManager(cells, gridWidth, gridHeight);
    engine.addEntityToScreen(cellManager);


    setInterval(createNewGeneration, DELAY);

    var count;
    var cell;

    function createNewGeneration() {
        for (var x = 0; x < COLS; x++) {
            for (var y = 0; y < ROWS; y++) {
                cell = cells[x][y];
                count = cell.getActiveNeighbours();
                // newStates[x][y] = (cell.alive && (count === 2 || count === 3)) || (!cell.alive && count === 3);
                if (cell.alive) {
                    newStates[x][y] = (count === 2 || count === 3);
                } else {
                    newStates[x][y] = (count === 3);
                }
            }
        }
        for (var i = 0; i < COLS; i++) {
            for (var j = 0; j < ROWS; j++) {
                cells[i][j].alive = newStates[i][j];
                cells[i][j].color = newStates[i][j] ? 255 : 0;
                

            }
        }
    }

    // engine.addEntityToScreen(new StartScreen());
    document.addEventListener("click", function(event) {
     var mousePos = engine.getMousePos(event);
    console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
    var x = Math.floor(mousePos.x / 10);
    var y = Math.floor(mousePos.y / 10);
    console.log('x: ' + x + ' y: ' + y);
     cells[x][y].alive = true;
     cells[x][y].color = 255;
    });

    // engine.addEntityToScreen(new PatternPanel());



}