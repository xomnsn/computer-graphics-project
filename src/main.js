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
    var angle = 10;
    var angleBase = rotatorR * angle / baseR;


    //---------------------CREATE CANVAS AND STAGE--------------------------
    var canvas = document.getElementById("game");
    var c = canvas.getContext("2d");
    var stage = new createjs.Stage(canvas)
    stage.x = canvas.width / 2;
    stage.y = canvas.height / 2;



    //*****************************MAIN*************************************

    //---------------------------INITIAL DRAW--------------------------------
    drawXY(stage);
    var dotContainer = new createjs.Container;
    dotContainer.cache(-baseR, -baseR, 2 * baseR, 2 * baseR)
    var baseContainer = newBase(baseR);
    var rotatorContainer = newRotator(rotatorR, baseR, pen);
    baseContainer.addChild(rotatorContainer);
    stage.addChild(dotContainer);
    stage.update();

    //------------------------------TICKER----------------------------------
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.on("tick", tick);

    var i = 0;
    function tick() {
        //animation cycle
        i += 1;
        if (i > 10) {
            i = 0;
            dotContainer.updateCache();
        }
        baseContainer.rotation -= angleBase;
        rotatorContainer.rotation += angle + angleBase;
        var dot = newDot(pen, rotatorContainer, dotContainer);
        dotContainer.addChild(dot);
        stage.update();
    }
}