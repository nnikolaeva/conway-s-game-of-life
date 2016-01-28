var Cell = function(alive) {
    this.alive = alive;
    this.deadColor = 0;
    this.aliveColor = 255;
    this.color = alive ? this.aliveColor : this.deadColor;
    this.neighbours = [];

    this.toggle = function() {
        this.alive = (!this.alive);
        this.color = this.alive ? this.aliveColor : this.deadColor;
    };

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
};