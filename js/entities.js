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

    this.toggle = function() {
        this.alive = (!this.alive);
        this.color = this.alive ? 255 : 0;
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

    this.update = function(dt) {};
    this.render = function(engine) {
        // this.color = this.alive ? 255 : 0;
        // engine.drawPixel(this.pixelIndex, this.color);
        // this.color = this.alive ? this.aliveColor : this.inactiveColor;
        // engine.drawRect(this.x, this.y, this.width, this.height, this.color);

    };

};

var CellManager = function(cells) {
    this.x = 0;
    this.y = 0;
    this.w = 100;
    this.h = 70;
    this.cells = cells;
    this.selectedCell;
    this.setCells = function(cellsArray) {
        this.cells = cellsArray;
    };
    this.onMouseMove = function(x, y) {
        if (typeof(this.selectedCell) !== "undefined") {
            this.selectedCell.color = this.selectedCell.alive ? 255 : 0;
        }
        cells[x][y].color = 200;
        this.selectedCell = cells[x][y];
    }
    this.onMouseClick = function(x, y) {
        cells[x][y].toggle();
    }
    this.update = function(dt) {};
    this.render = function(engine) {
        engine.drawPixels(this.cells);
    };
};

var Pattern = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 3;
    this.height = 3;
    this.color = "blue";
    this.components  = [];
    this.dragged = false;
    this.strPattern = "000111000";



    this.update = function(dt) {};
    this.render = function(engine) {
        engine.drawRect(100, 0, 5, 5, "blue");
        // var index = 0;
        // var color;
        // for (var i = 0; i < this.width; i++) {
        //     for (var j  = 0; j < this.height; j++) {
        //         color = parseInt(this.strPattern[index]) ?  "yellow" : "#f0f0f5";
        //         engine.drawRect(this.x + i, this.y + j, 1, 1, color);
        //         index++;
        //     }
        // }
    };
};
var Button = function(x, y, width, height, color, startButtonCallback) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.color = color;
    this.selectedColor = "yellow";
    this.notSelectedColor = "white";
    this.selected = false;
    this.select = function() {
        console.log("selected");
        this.selected = true;
        this.color = this.selectedColor;
    };
    this.deSelect = function() {
        this.selected = false;
        this.color = this.notSelectedColor;
    };
    this.onClick = startButtonCallback;
    this.update = function(dt) {};
    this.render = function(engine) {
        engine.drawRect(this.x, this.y, this.w, this.h, this.color);
        engine.drawText(this.x + 1, this.y + 4, "start", "grey", "30px verdana");
    };
};

var PatternPanel = function(startButtonCallback) {
    this.x = 100;
    this.y = 0;
    this.w = 10;
    this.h = 70;
    this.patterns = [new Pattern(100, 0)];
    this.getPatternCopy = function(x, y) {
        var p;
        for (var i = 0; i < this.patterns.length; i++) {
            p = this.patterns[i];
            if (x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height) {
                var copyPatern = new Pattern(p.x, p.y);
                this.patterns.push(copyPatern);
                return copyPatern;
            }
        }
    };
    this.getDraggedPattern = function() {
        var p;
        for (var i = 0; i < this.patterns.length; i++) {
            p = this.patterns[i];
            if (p.dragged === true) {
                return p;
            }
        }
    };
    this.deletePattern = function() {
        this.patterns.pop();    
        
    };
   
    this.button = new Button(100, 60, 10, 5, "white", startButtonCallback);
    this.onMouseMove = function(x, y) {
        if (x >= this.button.x && x <= this.button.x + this.button.w && y >= this.button.y && y <= this.button.y + this.button.h) {
            this.button.select();
        } else {
            this.button.deSelect();
        }
    }
    this.onMouseClick = function(x, y) {
        if (x >= this.button.x && x <= this.button.x + this.button.w && y >= this.button.y && y <= this.button.y + this.button.h) {
            this.button.onClick();
        } 
    }
    this.onMouseDown = function(x, y) {
        var p;
        for (var i in this.patterns) {
            p = this.patterns[i];
            if (x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height) {
                p.dragged = true;
            }
        }
    }
    this.update = function(dt) {};
    this.render = function(engine) {
        engine.drawRect(100, 0, 10, 70, "grey");
        this.button.render(engine);

        
        for (var i = 0; i < this.patterns.length; i++) {
            this.patterns[i].render(engine);
        }
    };

};

