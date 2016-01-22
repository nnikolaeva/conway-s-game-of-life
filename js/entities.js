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

var Entity = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.update = function(dt) {};
    this.render = function(engine) {};
    this.getChildEntity = function(x, y) {
        return null;
    };
};

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

var Pattern = function(x, y, w, h) {
    this.id = "pattern";
    Control.call(this, x, y, w, h);
    this.color = "white";
    this.dragged = false;
    this.strPattern = "..*\n*.*\n.**";
    this.isDraggable = true;
    this.render = function(engine) {
        engine.drawRect(this.x, this.y, this.w, this.h, this.color);
        engine.drawText(this.x, this.y + 5, "glider", "grey", "30px verdana");
    };

    this.onDragIn = function(x, y, dragStateData) {
        dragStateData.draggedEntityData = this.strPattern;
    };
};

var Control = function(x, y, w, h) {
    Entity.call(this, x, y, w, h);
    this.selectedColor = "#FFC";
    this.notSelectedColor = "white";
    this.selected = false;
    this.select = function() {
        this.selected = true;
        this.color = this.selectedColor;
    };
    this.deSelect = function() {
        this.selected = false;
        this.color = this.notSelectedColor;
    };

}
var Button = function(x, y, w, h, text, startButtonCallback) {
    Control.call(this, x, y, w, h);
    this.color = "white";
    this.text = text;
    this.onClick = startButtonCallback;
    this.render = function(engine) {
        engine.drawRect(this.x, this.y, this.w, this.h, this.color);
        engine.drawText(this.x, this.y + 5, this.text, "grey", "30px verdana");
    };
};

var PatternPanel = function(w, h, startButtonCallback, stopButtonCallback, clearButtonCallback, randButtonCallback) {
    this.id = "pp";
    Entity.call(this, 0, 0, w, h);
    this.color = "#CCC";
    this.components = [];
    this.buttonX = this.x + 1;
    this.buttonY = this.y + 1;
    this.buttonWidth = 18;
    this.buttonHeight = 6;
    this.startButton = new Button(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, "start", startButtonCallback);
    this.components.push(this.startButton);

    this.stopButton = new Button(this.buttonX, this.buttonY + this.buttonHeight + 1, this.buttonWidth, this.buttonHeight, "pause", stopButtonCallback);
    this.components.push(this.stopButton);

    this.clearButton = new Button(this.buttonX, this.buttonY + 2 * (this.buttonHeight + 1), this.buttonWidth, this.buttonHeight, "clear", clearButtonCallback);
    this.components.push(this.clearButton);

    this.randButton = new Button(this.buttonX, this.buttonY + 3 * (this.buttonHeight + 1), this.buttonWidth, this.buttonHeight, "rand", randButtonCallback);
    this.components.push(this.randButton);

    this.selected = null;

    this.addPattern = function(pattern) {
        pattern.x = this.buttonX;
        pattern.y = this.buttonY + 4 * (this.buttonHeight + 1);
        pattern.w = this.buttonWidth;
        pattern.h = this.buttonHeight;
        this.components.push(pattern);
    };

    this.getSelectedComponent = function(x, y) {
        var c;
        for (var i in this.components) {
            c = this.components[i];
            if (x >= c.x && x < c.x + c.w && y >= c.y && y < c.y + c.h) {
                return c;
            }
        }
        return null;

    }

    this.getChildEntity = this.getSelectedComponent;

    this.onMouseMove = function(x, y) {
        var c = this.getSelectedComponent(x - this.x, y - this.y);
            if (c !== this.selected) {
                if (c !== null) {
                    c.select();
                }
                if (this.selected !== null) {
                    this.selected.deSelect();
                }
                this.selected = c;
            }
    }

    this.onMouseClick = function() {
        if (this.selected instanceof Button) {
            this.selected.onClick();
        }
    };
    this.onMouseDown = function() {
        if (this.selected instanceof Pattern) {
            this.selected.dragged = true;
        }
    };

    this.isExistedComponent = function(component) {
        var c;
        for (var i in this.components) {
            c = this.components[i];
            if (c === component) {
                return true;
            }
        }
        return false;
    };


    this.onDragStart = function(x, y, dragStateData) {
    };

    this.render = function(engine) {
        engine.drawRect(this.x, this.y, this.w, this.h, this.color);
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].render(engine);
        }
    };

    this.onDragOver = function(x, y, dragStateData) {
    };

};

