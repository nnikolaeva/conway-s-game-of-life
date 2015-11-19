 /* Engine class provides the game loop functionality (update entities and render),
  * draws the initial game board on the screen, and then calls the update and
  * render methods on your player and enemy objects (defined in your app.js).
  *
  * A game engine works by drawing the entire game screen over and over, kind of
  * like a flipbook you may have created as a kid. When your player moves across
  * the screen, it may look like just that image/character is moving or being
  * drawn but that is not the case. What's really happening is the entire "scene"
  * is being drawn over and over, presenting the illusion of animation.
  * Engine class translates game coordinates to pixels.
  */
 var Engine = function(gridW, gridH, cols, rols) {
     var gridWidth = gridW;
     var gridHeight = gridH;
     var canvasWidth = gridW * cols;
     var canvasHeight = gridH * rols;
     var lastTime;
     var canvas = document.getElementById("canvas");
     canvas.width = canvasWidth;
     canvas.height = canvasHeight;
     var ctx = canvas.getContext("2d");
     this.on = true;

     this.screen = {
        entities: [],
        subscribtions: [],
        userInputSubscribtions: [],
        timeSubscribtions: []
     };
     this.backupScreen = {
        entities: [],
        subscribtions: [],
        userInputSubscribtions: [],
        timeSubscribtions: []
     };

     //new
     this.getMousePos = function(evt) {
    var rect = canvas.getBoundingClientRect();
    var c = (evt.clientX - rect.left) / 40
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

     this.addEntityToScreen = function(entity) {
         this.screen.entities.push(entity);
     };
     this.addSubscribtion = function(subscribtion) {
         this.screen.subscribtions.push(subscribtion);
     };
     this.addUserInputSubscribtion = function(userInputSubscribtion) {
         this.screen.userInputSubscribtions.push(userInputSubscribtion);
     };
     this.addTimeSubscribtion = function(timeSubscribtion) {
         this.screen.timeSubscribtions.push(timeSubscribtion);
     };

     this.emptyScreen = function() {
         this.screen.entities.length = 0;
         this.screen.subscribtions.length = 0;
         this.screen.userInputSubscribtions.length = 0;
         this.screen.timeSubscribtions.length = 0;
     };

     this.emptyBackupScreen = function() {
         this.backupScreen.entities.length = 0;
         this.backupScreen.subscribtions.length = 0;
         this.backupScreen.userInputSubscribtions.length = 0;
         this.backupScreen.timeSubscribtions.length = 0;
     }

     this.copyCurrentGameState = function() {
         copyScreen(this.screen, this.backupScreen);

     };
     // copy all elements from array1 to array2
     function copyArray(array1, array2) {
        for (var i in array1) {
            array2.push(array1[i]);
        }
     }
     // copy all elements from scr1 to scr2
     function copyScreen(scr1, scr2) {
        for (var key in scr1) {
            copyArray(scr1[key], scr2[key]);
        }
     }
     this.pasteCurrentGameState = function() {
         copyScreen(this.backupScreen, this.screen);
         this.emptyBackupScreen();
     };

     this.handleUserInput = function(keyCode, numRows, numCols) {
         var sub;
         var length = this.screen.userInputSubscribtions.length;
         for (var i = 0; i < length; i++) {
             sub = this.screen.userInputSubscribtions[i];
             for (var j in this.screen.entities) {
                 if (this.screen.entities[j] === sub.entity && keyCode === sub.keyCode) {
                     sub.callback(this.screen.entities[j]);
                 }
             }
         }
     };

     this.checkTimer = function() {
         var sub;
         for (var i in this.screen.timeSubscribtions) {
             sub = this.screen.timeSubscribtions[i];
             if (sub.entity.seconds < sub.number) {
                 sub.callback();
             }
         }
     };

     this.clearGameBoard = function() {
         ctx.clearRect(0, 0, canvasWidth, canvasHeight);
     };

     this.load = function() {
         Resources.load([
             'images/stone-block_small_1.png',
             'images/water-block_small_1.png',
             'images/grass-block_small_1.png',
             'images/enemy-bug_small_1.png',
             'images/char-boy_small_1.png',
             'images/log_small_1.png',
             'images/lock.png',
             'images/heart_small_1.png',
             'images/gem-blue_small_1.png',
             'images/gem-blue_new.png',
             'images/gem-green_new.png',
             'images/gem-orange_new.png',
             'images/key_small_1.png',
             'images/new.png',
             'images/newlog.png',
             'images/heart_small_new.png'
         ]);
         lastTime = Date.now();
         Resources.onReady(this.start.bind(this));
     };

     this.start = function() {
         var now = Date.now();
         var dt = (now - lastTime) / 1000.0;
         if (this.on) {
             this.update(dt);
         }
         this.render();
         this.checkCollision();
         this.checkTimer(dt);
         lastTime = now;
         requestAnimationFrame(this.start.bind(this));
     };

     this.update = function(dt) {
        var length = this.screen.entities.length;
         for (var i = 0; i < length; i++) {
             this.screen.entities[i].update(dt);
         }
     };

     this.render = function() {
        var length = this.screen.entities.length;
         for (var i = 0; i < length; i++) {
             this.screen.entities[i].render(this);
         }
     };

     this.drawImage = function(sprite, x, y) {
         ctx.drawImage(Resources.get(sprite.image), x * gridWidth + sprite.dx, y * gridHeight + sprite.dy);
     };
     this.drawRect = function(x, y, w, h, color) {
         ctx.fillStyle = color;
         ctx.fillRect(x * gridWidth, y * gridHeight, w * gridWidth, h * gridHeight);
     };
     this.drawFullScreenRect = function(color) {
         ctx.fillStyle = color;
         ctx.fillRect(0, 0, canvasWidth, canvasHeight);
     };
     this.drawText = function(x, y, text, color, font) {
         ctx.fillStyle = color;
         ctx.font = font;
         ctx.fillText(text, x * gridWidth, y * gridHeight);
     };
     this.drawLine = function(x, y, x1, y1, width, color) {
         ctx.beginPath();
         ctx.moveTo(x * gridWidth, y * gridHeight);
         ctx.lineTo(x1 * gridWidth, y1 * gridHeight);
         ctx.lineWidth = width;
         ctx.strokeStyle = color;
         ctx.stroke();
     };
     this.drawCircle = function(x, y, radius, color) {
         ctx.beginPath();
         ctx.arc(x * gridWidth, y * gridHeight, radius, 0, 2 * Math.PI);
         ctx.fillStyle = color;
         ctx.fill();

     };
     
     var imageData = ctx.getImageData(0, 0, cols * gridWidth, rols * gridHeight);
     var data = imageData.data;
     // this.drawPixel = function(index, color) {
     //    data[index] = color;
     //    data[index + 1] = color;
     //    data[index + 2] = color;
     //    data[index + 3] = color;
     //    ctx.putImageData(imageData, 0, 0);
     // };

     this.drawPixels = function(cells, x) {
        var cell;
        var offset = 0;
        var px;
        var py;
        var width = cells.length;
        var height = cells[0].length;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                cell = cells[x][y];
                for (var x1 = 0; x1 < gridWidth; x1++) {     
                    for (var y1 = 0; y1 < gridHeight; y1++) {
                        px = x * gridWidth + x1;
                        py = y * gridHeight + y1;
                        offset = (px + py * cols * gridWidth) * 4;
                        data[offset] = cell.color;
                        data[offset + 1] = cell.color;
                        data[offset + 2] = cell.color;
                        data[offset + 3] = cell.color;
                    }               
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
     };

     this.checkCollision = function() {
         var s;
         var e;
         var t;
         var c;
         var cX;
         var cwidth;
         var eX;
         var ewidth;
         for (var item in this.screen.subscribtions) {
             s = this.screen.subscribtions[item];
             e = s.entity;
             t = s.types;
             var candidates = [];
             var element;
             for (var i in t) {
                 for (var k = 0; k < this.screen.entities.length; k++) {
                     element = this.screen.entities[k];
                     if (element instanceof t[i]) {
                         candidates.push(element);
                     }
                     // if (typeof this.screen[k].components !== "undefined") {
                     for (l in element.components) {
                         if (element.components[l] instanceof t[i]) {
                             candidates.push(element.components[l]);
                         }
                     }
                     // }
                 }
             }
             eX = e.x + e.sprite.bbox.x;
             ewidth = e.sprite.bbox.w;
             for (var k in candidates) {
                 c = candidates[k];
                 cX = c.x + c.sprite.bbox.x;
                 cwidth = c.sprite.bbox.w;
                 if (((c.y === e.y) && (cX + cwidth >= eX && cX + cwidth <= eX + ewidth)) || ((c.y === e.y) && (eX + ewidth >= cX && eX + ewidth <= cX + cwidth))) {
                     s.callback(c);
                 }
             }
         }
     };
 };

 var Subscribtion = function(entity, types, callback) {
     this.entity = entity;
     this.types = types;
     this.callback = callback;
 };

 var UserInputSubscribtion = function(keyCode, entity, callback) {
     this.keyCode = keyCode;
     this.entity = entity;
     this.callback = callback;
 };

 var TimeSubscribtion = function(entity, number, callback) {
     this.entity = entity;
     this.number = number;
     this.callback = callback;
 };