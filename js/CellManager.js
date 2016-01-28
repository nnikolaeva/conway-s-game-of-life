
var CellManager = function(cells, dx, w, h) {
    this.id = "cm"
    Entity.call(this, dx, 0, w, h);
    this.cells = cells;
    this.selectedCell;
    this.onMouseMove = function(x, y) {
        // if (typeof(this.selectedCell) !== "undefined") {
        //     this.selectedCell.color = this.selectedCell.alive ? 255 : 0;
        // }
        // cells[x][y].color = 200;
        // this.selectedCell = cells[x][y];
    }

    this.render = function(engine) {
        engine.drawPixels(this.cells, this.x, this.y);
    };
    this.draggedTrace = [];
    this.clearDraggedTrace = function() {
        for (var i in this.draggedTrace) {
            this.draggedTrace[i].color = this.draggedTrace[i].alive ? 255 : 0;
        }
        this.draggedTrace.length = 0;
    };

    this.onDragOver = function(x, y, dragStateData) {
        this.clearDraggedTrace();
        var str = dragStateData.draggedEntityData;
        var c;
        var px = 0;
        var py = 0;
        for (var i in str) {
            c = str[i];
            if (c === "*") {
                cells[x + px][y + py].color = 200;
                this.draggedTrace.push(cells[x + px][y + py]);
                px ++;
            } else if (c === ".") {
                px ++;
            } else if (c === "\n") {
                py ++;
                px = 0;
            }
        }
    };

    this.onDragEnd = function() {
        for (var i in this.draggedTrace) {
            this.draggedTrace[i].alive = true;
            this.draggedTrace[i].color = 255;
        }
        this.draggedTrace.length = 0;
    };
};