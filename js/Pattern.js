var transpose = function(a) {
    var result = [];
    var row = [];
    for (var j = 0; j < a[0].length; j++) {
        for (var i = 0; i < a.length; i++) {
            row.push(a[i][j])
        }
        result.push(row);
        row = [];
    }
    return result;
}

var convertStringPatternToCells = function(str) {
    var rows = [];
    var cells = [];
    for (var i in str) {
        c = str[i];
        if (c === "*") {
            cells.push(new Cell(true /* alive */));
        } else if (c === ".") {
            cells.push(new Cell(false /* dead */))
        } else if (c === "\n") {
            rows.push(cells);
            cells = [];
        }
    }
    return transpose(rows);
}

var Pattern = function(x, y, str, scaleFactor) {
    this.id = "pattern";
    this.scaleFactor = scaleFactor;

    this.getWidth = function() {
        return this.cells.length * this.scaleFactor;
    }

    this.getHeight = function() {
        return this.cells[0].length * this.scaleFactor;
    }

    this.cells = convertStringPatternToCells(str);

    Entity.call(
        this,
        x,
        y,
        this.getWidth(),
        this.getHeight());
    this.dragged = false;
    this.sprite = sprite;
    this.strPattern = str;
    this.isDraggable = true;

    this.select = function() {
    };

    this.deSelect = function() {
    };
    
    this.onDragStart = function(x, y, dragStateData) {
        dragStateData.draggedEntityData = this.strPattern;
    };

    this.render = function(engine) {
        var borderWidth = 0.5;
        engine.drawRect(
            this.x - borderWidth,
            this.y - borderWidth,
            this.getWidth() + borderWidth * 2,
            this.getHeight() + borderWidth * 2,
            "orange");
        engine.drawNewPixelsScaled(this.cells, this.x, this.y, this.scaleFactor, this.scaleFactor);
    };
};