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