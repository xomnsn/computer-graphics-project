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
        var point = localFrom.localToGlobal(pen, 0);
        var shape = new createjs.Shape();
        shape.graphics
            .beginFill('#FF00FF')
            .arc(point.x + (-baseR + rotatorR) * 3, point.y - baseR - rotatorR, 3, 0, Math.PI*2, false);
        return shape;
    }



    //------------------------------PARAMS----------------------------------
    var baseR = 250;
    var rotatorR = 100;
    var pen = 70;
    var angle = 1;
    var alpha = 0.2;


    //---------------------CREATE CANVAS AND STAGE--------------------------
    var canvas = document.getElementById("game");
    var c = canvas.getContext("2d");
    var stage = new createjs.Stage(canvas)
    stage.x = canvas.width / 2;
    stage.y = canvas.height / 2;



    //*****************************MAIN*************************************

    //---------------------------INITIAL DRAW--------------------------------
    drawXY(stage);
    var baseContainer = newBase(baseR);
    var rotatorContainer = newRotator(rotatorR, baseR, pen);
    baseContainer.addChild(rotatorContainer);
    stage.update();

    //------------------------------TICKER----------------------------------
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.on("tick", tick);

    function tick() {
        //animation cycle
        baseContainer.rotation -= angle;
        // rotatorContainer.rotation += (1 + alpha) * angle;
        // var dot = newDot(pen, rotatorContainer, baseContainer);
        // stage.addChild(dot);
        // stage.update();
    }
}