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