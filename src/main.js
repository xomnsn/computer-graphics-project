function init() {

    function drawXY(container) {
        var XY = new createjs.Shape();
        XY.graphics
            .beginStroke("blue")
            .moveTo(0, 0)
            .lineTo(40, 0)
            .beginStroke("red")
            .moveTo(0, 0)
            .lineTo(0, 40);
        container.addChild(XY);
    }

    function newBase(r) {
        var container = new createjs.Container;
        drawXY(container);
        var shape = new createjs.Shape();
        shape.graphics
            .beginStroke('#FF00FF')
            .arc( 0, 0, r, 0, Math.PI*2, false);
        container.addChild(shape)
        stage.addChild(container);
        return container;
    }

    function newRotator(rotatorR, baseR, pen) {
        var container = new createjs.Container;
        container.x = rotatorR - baseR;
        drawXY(container);
        var shape = new createjs.Shape();
        var dot = new createjs.Shape();
        shape.graphics
            .beginStroke('#FF00FF')
            .arc( 0, 0, rotatorR, 0, Math.PI*2, false)
            .moveTo(-rotatorR, 0)
            .lineTo(rotatorR, 0);
        dot.graphics
            .beginFill('black')
            .arc(pen, 0, 3, 0, Math.PI*2, false);
        container.addChild(shape);
        container.addChild(dot);
        return container;
    }

    function newDot(pen, localFrom, localTo) {
        var point = localFrom.localToLocal(pen, 0, localTo);
        var shape = new createjs.Shape();
        shape.graphics
            .beginFill('#FF00FF')
            .arc(point.x, point.y, 3, 0, Math.PI*2, false);
        return shape;
    }



    //------------------------------PARAMS----------------------------------
    var baseR = 250;
    var rotatorR = 74;
    var pen = 50;
    var angle = 15;
    var angleBase = rotatorR * angle / baseR;

    //----------------------------EVENT LISTENERS---------------------------
    $( "#pause" ).on( "click", togglePause);


    //---------------------CREATE CANVAS AND STAGE--------------------------
    var canvas = document.getElementById("game");
    var canvasContainer = document.getElementById("canvas-container");
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    var stage = new createjs.Stage(canvas);
    stage.x = canvas.width / 2;
    stage.y = canvas.height / 2;



    //*****************************MAIN*************************************

    //---------------------------INITIAL DRAW--------------------------------
    drawXY(stage);
    var dotContainer = new createjs.Container;
    var cacheContainer = new createjs.Container;
    cacheContainer.cache(-baseR, -baseR, 2 * baseR, 2 * baseR);
    var baseContainer = newBase(baseR);
    var rotatorContainer = newRotator(rotatorR, baseR, pen);
    baseContainer.addChild(rotatorContainer);
    stage.addChild(dotContainer);
    stage.addChild(cacheContainer);
    stage.update();


    //------------------------------TICKER----------------------------------
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.on("tick", tick);
    createjs.Ticker.setPaused(true);

    var i = 1;
    function tick() {
        //animation cycle
        if (!createjs.Ticker.getPaused()) {
            if (i > 100) {
                console.log(dotContainer.getNumChildren());
                i = 1;
                var numOfCycles = 0;
                for(var j = 0; j < 100; j++) {
                    numOfCycles += 1;
                    var thisChild = dotContainer.getChildAt(i);
                    cacheContainer.addChild(thisChild);
                }
                console.log("num of cycles " + numOfCycles);
                dotContainer.removeAllChildren();
                cacheContainer.updateCache();
            }
            baseContainer.rotation -= angleBase;
            rotatorContainer.rotation += angle + angleBase;
            var dot = newDot(pen, rotatorContainer, dotContainer);
            dotContainer.addChild(dot);
            i += 1;
        }

        stage.update();
    }

    function togglePause() {
        var paused = !createjs.Ticker.getPaused();
        createjs.Ticker.setPaused(paused);
        $(this).text(paused ? "Play" : "Pause");
    }

}
//
//
//
//
// var stage, pauseCircle, goCircle, output;
//
// function init() {
//     stage = new createjs.Stage("demoCanvas");
//
//     pauseCircle = new createjs.Shape();
//     pauseCircle.graphics.beginFill("red").drawCircle(0, 0, 40);
//     pauseCircle.y = 50;
//     stage.addChild(pauseCircle);
//
//     goCircle = new createjs.Shape();
//     goCircle.graphics.beginFill("green").drawCircle(0, 0, 40);
//     goCircle.y = 150;
//     stage.addChild(goCircle);
//
//     // and register our main listener
//     createjs.Ticker.addEventListener("tick", tick);
//
//     // UI code:
//     output = stage.addChild(new createjs.Text("", "14px monospace", "#000"));
//     output.lineHeight = 15;
//     output.textBaseline = "top";
//     output.x = 10;
//     output.y = stage.canvas.height-output.lineHeight*3-10;
// }
//
// function tick(event) {
//     goCircle.x += 10;
//     if (goCircle.x > stage.canvas.width) { goCircle.x = 0; }
//
//     if (!createjs.Ticker.getPaused()) {
//         pauseCircle.x += 10;
//         if (pauseCircle.x > stage.canvas.width) { pauseCircle.x = 0; }
//     }
//
//     output.text = "getPaused()    = "+createjs.Ticker.getPaused()+"\n"+
//         "getTime(true)  = "+createjs.Ticker.getTime(true)+"\n"+
//         "getTime(false) = "+createjs.Ticker.getTime(false);
//
//     stage.update(event); // important!!
// }
//
// function togglePause() {
//     var paused = !createjs.Ticker.getPaused();
//     createjs.Ticker.setPaused(paused);
//     document.getElementById("pauseBtn").value = paused ? "unpause" : "pause";
// }
