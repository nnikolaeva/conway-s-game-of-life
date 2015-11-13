var Cell = function(x, y, active) {
    this.x = x;
    this.y = y;
    this.alive = active;
    this.width = 1;
    this.height = 1;
    this.color = active ? 255 : 0;
    this.inactiveColor = "black";
    this.aliveColor = "white"
    this.neighbours = [];

    this.addNeighbour = function(cell) {
        this.neighbours.push(cell);
    };
    this.getActiveNeighbours = function() {
        var count = 0;
        for (var i = 0; i < this.neighbours.length; i++) {
            if (this.neighbours[i].alive) {
                count++;
            }
        }
        return count;
    };

    this.update = function(dt) {};
    this.render = function(engine) {
        // this.color = this.alive ? 255 : 0;
        // engine.drawPixel(this.pixelIndex, this.color);
        // this.color = this.alive ? this.aliveColor : this.inactiveColor;
        // engine.drawRect(this.x, this.y, this.width, this.height, this.color);

    };

};

var CellManager = function(cells) {
    this.cells = cells;
    this.setCells = function(cellsArray) {
        this.cells = cellsArray;
    };
    this.update = function(dt) {};
    this.render = function(engine) {
        engine.drawPixels(this.cells);
    };
};