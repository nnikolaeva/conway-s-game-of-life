/* app.js file creates instances of entities and provides the game rules 
 */
window.onload = function() {

    var gridWidth = 3;
    var gridHeight = 3;

    var COLS = 400;
    var ROWS = 260;
    var DELAY = 100;

    var PATTERN_PANEL_WIDTH = 22;

    var engine = new Engine(gridWidth, gridHeight, COLS, ROWS);

    function loadResources(engine) {
         Resources.load([
             'images/play.png',
             'images/play_large.png',
             'images/pause.png',
             'images/pause_large.png',
             'images/stop.png',
             'images/stop_large.png',
             'images/dice.png',
             'images/dice_large.png'
         ]);
         engine.lastTime = Date.now();
         Resources.onReady(engine.start.bind(engine));
    }

    loadResources(engine);

    document.addEventListener("click", function(event) {
        engine.handleMouseEvent("click", event);
    });
    document.addEventListener("mousemove", function(event) {
        engine.handleMouseEvent("mousemove", event);
    });
    document.addEventListener("mousedown", function(event) {
        engine.handleMouseEvent("mousedown", event);
    });
    document.addEventListener("mouseup", function(event) {
        engine.handleMouseEvent("mouseup", event);
    });

    var cells = [];
    var cellsLength = COLS - PATTERN_PANEL_WIDTH;

    for (var x = 0; x < cellsLength; x++) {
        cells[x] = [];
        for (var y = 0; y < ROWS; y++) {
            cells[x][y] = new Cell(Math.random() < 0.5);
        }
    }

    // add neighbours to each cell
    var cell;
    for (var x = 0; x < cellsLength; x++) {
        for (var y = 0; y < ROWS; y++) {
            cell = cells[x][y];
            addNeigbours(cell, x, y);
        }
    }

    function addNeigbours(cell, x, y) {
        for (var dx = -1; dx < 2; dx++) {
            for (var dy = -1; dy < 2; dy++) {
                if (dx === 0 && dy === 0) {
                    continue;
                }
                cell.addNeighbour(getCell(wrap(x + dx, cellsLength), wrap(y + dy, ROWS)));
            }
        }
    }

    function getCell(x, y) {
        if (x < 0 || y < 0 || x >= cellsLength || y >= ROWS) {
            throw "(x,y) is out of bounds: " + x + ", " + y;
        }
        var cell = cells[x][y];
        if (!(cell instanceof Cell)) {
            throw "cell at given (x,y) is not a cell: " + x + ", " + y;
        }
        return cell;
    }

    function wrap(x, max) {
        if (x >= 0) {
            return x % max;
        } else {
            return max + x;
        }
    }

    var newStates = []
    for (var x = 0; x < cellsLength; x++) {
        newStates[x] = new Array(ROWS);
    }

    var count;
    var cell;
    function createNewGeneration() {
        for (var x = 0; x < cellsLength; x++) {
            for (var y = 0; y < ROWS; y++) {
                cell = cells[x][y];
                count = cell.getActiveNeighbours();
                if (cell.alive) {
                    newStates[x][y] = (count === 2 || count === 3);
                } else {
                    newStates[x][y] = (count === 3);
                }
            }
        }
        for (var i = 0; i < cellsLength; i++) {
            for (var j = 0; j < ROWS; j++) {
                cells[i][j].alive = newStates[i][j];
                cells[i][j].color = newStates[i][j] ? 255 : 0;
            }
        }
    }
    var intervalId;
    function start() {
        intervalId = setInterval(createNewGeneration, DELAY);   
    }

    function stop() {
        clearInterval(intervalId);
    }

    function clear() {
        stop();
        for (var x = 0; x < cellsLength; x++) {
            for (var y = 0; y < ROWS; y++) {
                cells[x][y].alive = false;
                cells[x][y].color = 0;

            }
        }
    }

    function rand() {
        for (var x = 0; x < cellsLength; x++) {
            for (var y = 0; y < ROWS; y++) {
                cells[x][y].alive = Math.random() < 0.5;
                cells[x][y].color = cells[x][y].alive ? 255 : 0;

            }
        }

    }

    // add cells to the screen
    var cellManager = new CellManager(cells, PATTERN_PANEL_WIDTH, COLS - PATTERN_PANEL_WIDTH, ROWS);
    engine.addEntityToScreen(cellManager);
    engine.addMouseEventSubscribtion(new MouseEventSubscribtion("mousemove", cellManager, cellManager.onMouseMove.bind(cellManager)));

    // add panel with patterns and buttons to the screen
    var patternPanel = new PatternPanel(PATTERN_PANEL_WIDTH, ROWS, start, stop, clear, rand);
    engine.addEntityToScreen(patternPanel);
    engine.addMouseEventSubscribtion(new MouseEventSubscribtion("mousemove", patternPanel, patternPanel.onMouseMove.bind(patternPanel)));
    engine.addMouseEventSubscribtion(new MouseEventSubscribtion("click", patternPanel, patternPanel.onMouseClick.bind(patternPanel)));
    engine.addMouseEventSubscribtion(new MouseEventSubscribtion("mousedown", patternPanel, patternPanel.onMouseDown.bind(patternPanel)));

    engine.addMouseEventSubscribtion(new MouseEventSubscribtion("dragover", patternPanel, patternPanel.onDragOver.bind(patternPanel)));
    engine.addMouseEventSubscribtion(new MouseEventSubscribtion("dragover", cellManager, cellManager.onDragOver.bind(cellManager)));
    engine.addMouseEventSubscribtion(new MouseEventSubscribtion("dragend", cellManager, cellManager.onDragEnd.bind(cellManager)));
    engine.addMouseEventSubscribtion(new MouseEventSubscribtion("dragstart", patternPanel, patternPanel.onDragStart.bind(patternPanel)));
    
    function maindiaglines(x, y) {
        return (x + y) % 15 == 0;
    }

    function verticallines(x, y) {
        return y % 5 == 0;
    }
    
    function secondarydiaglines(x, y) {
        return (-x + y) % 1 == 0;
    }

    function circles(x, y) {
        var r = 60; // radius
        var s = 10; // line width
        var t = 20; // gap between lines
        var dx = 60; 
        var dy = 60;
        var x1 = x - dx;
        var y1 = y - dy;
        var d = (x1 * x1 + y1 * y1);
        while (r > 0) {
            if (d < r*r && d > (r - s) * (r - s)) {
                return true;
            } else {
                r = r - t;
            }
        }
        return false ;
    }

    function generatePattern(maxX, maxY, condition, scaleFactor) {
        var maxX = maxX;
        var maxY = maxY;
        var s = "";
        for (var y = 0; y < maxY; y++) {
            for (var x = 0; x < maxX; x++) {
                if (condition(x, y)) {
                    s += "*";
                } else {
                    s += ".";
                }
            }
            s += "\n";
        }
        return {scaleFactor: scaleFactor, str: s};
    }

    function generateSquarePattern() {
        return generatePattern(100, 100, function() {return true;}, 0.18);
    }

    function generateDiagonalPattern() {
        return generatePattern(120, 120, maindiaglines, 0.15);
    }

    function generateCirclePattern() {
        return generatePattern(120, 120, circles, 0.15);
    }

    function generateHorizontalLinePattern() {
        return generatePattern(120, 120, verticallines, 0.15);
    }

    var patterns = [
        {scaleFactor: 0.8, str: ".......\n....*..\n.....*.\n.*...*.\n..****.\n.......\n"},
        {scaleFactor: 1, str: ".....\n...*.\n.*.*.\n..**.\n.....\n"},
        {scaleFactor: 1, str: "......\n..*...\n.***..\n.*.**.\n......\n"},

        {scaleFactor: 1, str: ".....\n.***.\n.*.*.\n.*.*.\n.....\n"},
        {scaleFactor: 1, str: "............\n...*....*...\n.**.****.**.\n...*....*...\n............\n"},

        {scaleFactor: 0.68, str: "...............\n...***...***...\n...............\n.*....*.*....*.\n.*....*.*....*.\n.*....*.*....*.\n...***...***...\n...............\n...***...***...\n...............\n"},
        {scaleFactor: 0.68, str: "..........\n...****...\n...*..*...\n.***..***.\n.*......*.\n.*......*.\n.***..***.\n...*..*...\n...****...\n..........\n"},

        {scaleFactor: 0.42, str: ".............\n......*......\n.....***.....\n...***.***...\n...*.....*...\n..**.....**..\n.**.......**.\n..**.....**..\n...*.....*...\n...***.***...\n.....***.....\n......*......\n.............\n"},
        {scaleFactor: 0.55, str: "..........\n....**....\n...*..*...\n..*....*..\n.*......*.\n.*......*.\n..*....*..\n...*..*...\n....**....\n..........\n"},
        {scaleFactor: 0.55, str: "..........\n....*.....\n....*.*...\n..*.......\n.......**.\n.**.......\n.......*..\n...*.*....\n.....*....\n..........\n"},

        {scaleFactor: 0.5, str: "...........\n.....*.....\n.....*.....\n.....*.....\n...........\n.***...***.\n...........\n.....*.....\n.....*.....\n.....*.....\n...........\n"},
        {scaleFactor: 0.37, str: "...............\n...***...***...\n...............\n.*....*.*....*.\n.*....*.*....*.\n.*....*.*....*.\n...***...***...\n...............\n...***...***...\n.*....*.*....*.\n.*....*.*....*.\n.*....*.*....*.\n...............\n...***...***...\n...............\n"},
        {scaleFactor: 0.4, str: "..............\n...........**.\n............*.\n..........*...\n........*.*...\n..............\n......*.*.....\n..............\n....*.*.......\n..............\n...**.........\n.*............\n.**...........\n..............\n"},

        {scaleFactor: 0.38, str: ".............\n..**.........\n.*..*.....**.\n.***...***...\n.*..*.****...\n..***...*....\n..*..***.....\n....*....**..\n....*****.*..\n.............\n....*****.*..\n....*....**..\n..*..***.....\n..***...*....\n.*..*.****...\n.***...***...\n.*..*.....**.\n..**.........\n.............\n"},
        {scaleFactor: 0.36, str: ".............\n....*....*...\n..**.****.**.\n....*....*...\n.............\n.............\n.............\n.............\n.............\n......***....\n.....***.....\n.............\n.............\n.............\n.............\n.............\n...*....*....\n.**.****.**..\n...*....*....\n.............\n"},
        {scaleFactor: 0.48, str: "...............\n.....*.*.......\n.....**.*......\n........***....\n.....**....*...\n.**.*..**..*...\n..*.*....*.**..\n.*...*...*...*.\n..**.*....*.*..\n...*..**..*.**.\n...*....**.....\n....***........\n......*.**.....\n.......*.*.....\n...............\n"},

        {scaleFactor: 0.46, str: "..................\n............**....\n....**.....*.*....\n....*.*....*......\n......*...**.*....\n....*.**.....***..\n..***.....*.*...*.\n.*...*.*.....***..\n..***.....**.*....\n....*.**...*......\n......*....*.*....\n....*.*.....**....\n....**............\n..................\n"},
        {scaleFactor: 0.45, str: "....................\n.....**......**.....\n....*.*......*.*....\n....*..........*....\n.**.*..........*.**.\n.**.*.*..**..*.*.**.\n....*.*.*..*.*.*....\n....*.*.*..*.*.*....\n.**.*.*..**..*.*.**.\n.**.*..........*.**.\n....*..........*....\n....*.*......*.*....\n.....**......**.....\n....................\n"},

        {scaleFactor: 0.47, str: "......................................\n..........................*...........\n.......................****....*......\n..............*.......****.....*......\n.............*.*......*..*.........**.\n............*...**....****.........**.\n.**.........*...**.....****...........\n.**.........*...**........*...........\n.............*.*......................\n..............*.......................\n......................................\n"},
        {scaleFactor: 0.54, str: ".................................\n...........*.....................\n...........*...............**....\n.......**.*.***..........**...*..\n.*.**.**.**..*.*...**.****.......\n.*...**..*.**..***..*.**..**...*.\n.*.**....***.*.***......**..*....\n.........**.*...............*..*.\n.*.**....***.*.***......**..*....\n.*...**..*.**..***..*.**..**...*.\n.*.**.**.**..*.*...**.****.......\n.......**.*.***..........**...*..\n...........*...............**....\n...........*.....................\n.................................\n"},
        {scaleFactor: 0.44, str: ".........................................\n.**........**...**...**...**...**...**...\n...**.**.....**...**...**...**...**...**.\n...**...**...**...**...**...**...**...**.\n.**.....**.**...**...**...**...**...**...\n......**.................................\n.........................................\n"},
        {scaleFactor: 0.58, str: "...............................\n..................*............\n.**...............**........**.\n.**................**.......**.\n..................**...........\n...............................\n...............................\n...............................\n..................**...........\n...................**..........\n..................**...........\n..................*............\n...............................\n"},
        {scaleFactor: 0.56, str: "................................\n............*..*................\n...........*....................\n...........*...*................\n...**......****.................\n..****..........................\n.**.**..........................\n..**.....**.***.................\n........*.....**.......*....***.\n.......**.......*......*....*.*.\n........*.....**.......*....***.\n..**.....**.***.................\n.**.**..........................\n..****..........................\n...**......****.................\n...........*...*................\n...........*....................\n............*..*................\n................................\n"},
        {scaleFactor: 0.33, str: "......................................................\n.**................................................**.\n..*................................................*..\n..*.*.....................**.....................*.*..\n...**........*............**............**.......**...\n............**..........................*.*...........\n...........**.............................*...........\n............**..**......................***...........\n......................................................\n......................................................\n......................................................\n............**..**......................***...........\n...........**.............................*...........\n............**..........................*.*...........\n...**........*............**............**.......**...\n..*.*.....................**.....................*.*..\n..*................................................*..\n.**................................................**.\n......................................................\n"},
        {scaleFactor: 0.27, str: "..................................................................\n....*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*....\n....**********************************************************....\n..................................................................\n..**************************************************************..\n.*.................................*.......*..........*.........*.\n.****.**.*..*****..***************....*****....*******...********.\n.....*...**.....**.......*.......*........*............*..........\n.******..*..*****..*****....******....*****....*******...********.\n.*......................*.........*........*..........*.........*.\n..**************************************************************..\n..................................................................\n....**********************************************************....\n....*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*..*....\n..................................................................\n"},
        generateSquarePattern(),
        generateDiagonalPattern(),
        generateCirclePattern(),
        generateHorizontalLinePattern(),
    ]

    // place patterns
    var f = function() {
        var y = 80;
        var xStart = 1;
        var x = xStart;
        var heightPatternInRow = null;
        var horizontalGapBetweenPatterns = 0.5;
        var verticalGapBetweenPatterns = 1;
        var horizontalBoundary = patternPanel.w;
        var patternString;
        var patternScaleFactor;
        var pattern;
        for (var i in patterns) {
            patternString = patterns[i].str;
            patternScaleFactor = patterns[i].scaleFactor;
            pattern = new Pattern(x, y, patternString, patternScaleFactor);
            patternPanel.addPattern(pattern);
            engine.addMouseEventSubscribtion(new MouseEventSubscribtion("dragstart", pattern, pattern.onDragStart.bind(pattern)));
            if (x + pattern.getWidth() > horizontalBoundary) {
                x = xStart;
                y = y + heightPatternInRow.getHeight() + verticalGapBetweenPatterns;
                pattern.x = x;
                pattern.y = y;
                heightPatternInRow = null;

            }
            x = x + pattern.getWidth() + horizontalGapBetweenPatterns;
            if (heightPatternInRow == null || heightPatternInRow.getHeight() < pattern.getHeight()) {
                heightPatternInRow = pattern;
            }
        }
    }();




}