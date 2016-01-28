var PatternPanel = function(w, h, startButtonCallback, stopButtonCallback, clearButtonCallback, randButtonCallback) {
    this.id = "pp";
    Entity.call(this, 0, 0, w, h);
    this.color = "#CCC";
    this.components = [];
    this.buttonX = this.x + 3;
    this.buttonY = this.y + 1;
    this.buttonWidth = 15;
    this.buttonHeight = 15;
    this.startButton = new Button(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, sprite('images/play.png',-3, 3, defaultBoundingBox()), startButtonCallback, sprite('images/play_large.png', -8, -2, defaultBoundingBox()));
    this.components.push(this.startButton);

    this.stopButton = new Button(this.buttonX, this.buttonY + 1 * (this.buttonHeight), this.buttonWidth, this.buttonHeight, sprite('images/pause.png', -3, 3, defaultBoundingBox()), stopButtonCallback, sprite('images/pause_large.png', -6, 0, defaultBoundingBox()));
    this.components.push(this.stopButton);

    this.clearButton = new Button(this.buttonX, this.buttonY + 2 * (this.buttonHeight), this.buttonWidth, this.buttonHeight, sprite('images/stop.png', 0, 0, defaultBoundingBox()), clearButtonCallback, sprite('images/stop_large.png', -2, -2, defaultBoundingBox()));
    this.components.push(this.clearButton);

    this.randButton = new Button(this.buttonX, this.buttonY + 3 * (this.buttonHeight), this.buttonWidth, this.buttonHeight, sprite('images/dice.png', 0, 0, defaultBoundingBox()), randButtonCallback, sprite('images/dice_large.png', -3, -3, defaultBoundingBox()));
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
        engine.drawText(this.buttonX, this.buttonY + 4 * (this.buttonHeight) + 5, "Drag", "black", "12px verdana");
        engine.drawText(this.buttonX, this.buttonY + 4 * (this.buttonHeight) + 10, "& drop", "black", "12px verdana");
        engine.drawText(this.buttonX, this.buttonY + 4 * (this.buttonHeight) + 15, "patterns", "black", "12px verdana");
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].render(engine);
        }
    };

    this.onDragOver = function(x, y, dragStateData) {
    };

};