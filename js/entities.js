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

function simpleSprite(image) {
    return sprite(image, 0, 0, defaultBoundingBox());
}

function sprite(image, dx, dy, boundingBox) {
    return {
        image: image,
        dx: dx,
        dy: dy,
        bbox: boundingBox
    };
}

function defaultBoundingBox() {
    return boundingBox(0, 0, 1, 1);
}

function boundingBox(x, y, w, h) {
    return {
        x: x,
        y: y,
        w: w,
        h: h
    };
}

var Pattern = function(x, y, w, h, image, str) {
    this.id = "pattern";
    Entity.call(this, x, y, w, h);
    this.dragged = false;
    this.sprite = sprite;
    this.strPattern = str;
    this.sprite = simpleSprite(image);
    this.isDraggable = true;

    this.select = function() {
    };

    this.deSelect = function() {
    };
    
    this.onDragIn = function(x, y, dragStateData) {
        dragStateData.draggedEntityData = this.strPattern;
        console.log(dragStateData);
    };

    this.render = function(engine) {
        engine.drawImage(this.sprite, this.x, this.y);
    };
};

var Button = function(x, y, w, h, sprite, startButtonCallback, spriteSelected) {
    Entity.call(this, x, y, w, h);
    this.deselectedSprite = sprite;
    this.selectedSprite = spriteSelected;
    this.currentSprite = sprite;
    this.onClick = startButtonCallback;

    this.select = function() {
        this.currentSprite = this.selectedSprite;
    };

    this.deSelect = function() {
        this.currentSprite = this.deselectedSprite;
    };

    this.render = function(engine) {
        engine.drawImage(this.currentSprite, this.x, this.y);
    };
};

var PatternPanel = function(w, h, startButtonCallback, stopButtonCallback, clearButtonCallback, randButtonCallback) {
    this.id = "pp";
    Entity.call(this, 0, 0, w, h);
    this.color = "#CCC";
    this.components = [];
    this.buttonX = this.x + 1;
    this.buttonY = this.y + 1;
    this.buttonWidth = 9;
    this.buttonHeight = 9;
    this.startButton = new Button(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, sprite('images/play.png',-7, 3, defaultBoundingBox()), startButtonCallback, sprite('images/play_large.png', -12, -2, defaultBoundingBox()));
    this.components.push(this.startButton);

    this.stopButton = new Button(this.buttonX + this.buttonWidth, this.buttonY, this.buttonWidth, this.buttonHeight, sprite('images/pause.png', -3, 3, defaultBoundingBox()), stopButtonCallback, sprite('images/pause_large.png', -6, 0, defaultBoundingBox()));
    this.components.push(this.stopButton);

    this.clearButton = new Button(this.buttonX, this.buttonY + 1 * (this.buttonHeight + 1), this.buttonWidth, this.buttonHeight, sprite('images/stop.png', 0, 0, defaultBoundingBox()), clearButtonCallback, sprite('images/stop_large.png', -2, -2, defaultBoundingBox()));
    this.components.push(this.clearButton);

    this.randButton = new Button(this.buttonX + this.buttonWidth, this.buttonY + 1 * (this.buttonHeight + 1), this.buttonWidth, this.buttonHeight, sprite('images/dice.png', 0, 0, defaultBoundingBox()), randButtonCallback, sprite('images/dice_large.png', -3, -3, defaultBoundingBox()));
    this.components.push(this.randButton);

    this.selected = null;

    this.addPattern = function(pattern) {
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
        engine.drawText(this.buttonX + 2, this.buttonY + this.buttonHeight* 2 + 5, "Drag & drop", "black", "12px verdana");
        engine.drawText(this.buttonX + 3, this.buttonY + this.buttonHeight* 2 + 8, "patterns:", "black", "12px verdana");
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].render(engine);
        }
    };

    this.onDragOver = function(x, y, dragStateData) {
    };

};

