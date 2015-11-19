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

// var Rectangle = function(x, y, w, h, color) {
//     this.x = x;
//     this.y = y;
//     this.w = w;
//     this.h = h;
//     this.color = color;
//     this.update = function(dt) {};
//     this.render = function(engine) {
//         engine.drawRect(this.x, this.y, this.w, this.h, this.color);
//     };

// }
// var StartScreen = function() {
//     this.rectangles = [];
//     for (var i = 0; i < 100; i++) {
//         for (var j = 0; j < 70; j++) {
//             this.rectangles.push(new Rectangle(i, j, 1, 1, "white"));
//         }
//     }
//     this.rectangles[50].color = "black";
//     this.update = function(dt) {};
//     this.render = function(engine) {
//         for (var i in this.rectangles) {
//             this.rectangles[i].render(engine);
//         }
//     };


// };

var Pattern = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 3;
    this.height = 3;
    this.components  = [];
    this.dragged = false;
    this.strPattern = "000111000";



    this.update = function(dt) {};
    this.render = function(engine) {
        var index = 0;
        var color;
        for (var i = 0; i < this.width; i++) {
            for (var j  = 0; j < this.height; j++) {
                color = parseInt(this.strPattern[index]) ?  "yellow" : "#f0f0f5";
                engine.drawRect(this.x + i, this.y + j, 1, 1, color);
                index++;
            }
        }
    };
};

var PatternPanel = function() {
    this.patterns = [new Pattern(20, 0)];
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
    this.update = function(dt) {};
    this.render = function(engine) {
        engine.drawRect(90, 0, 10, 10, "red");
        // for (var i = 0; i < this.patterns.length; i++) {
        //     this.patterns[i].render(engine);
        // }
    };

};

