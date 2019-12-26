function init() {

    //----------------------FUNCTIONS DRAW--------------------------
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
        // drawXY(container);
        var shape = new createjs.Shape();
        shape.graphics
            .beginStroke('#aaa')
            .arc( 0, 0, r, 0, Math.PI*2, false);
        container.addChild(shape)
        stage.addChild(container);
        return container;
    }

    function newRotator(rotatorR, baseR, pen) {
        var container = new createjs.Container;
        container.x = rotatorR - baseR;
        // drawXY(container);
        var shape = new createjs.Shape();
        var dot = new createjs.Shape();
        shape.graphics
            .beginStroke('#aaa')
            .arc( 0, 0, rotatorR, 0, Math.PI*2, false)
            .moveTo(-rotatorR, 0)
            .lineTo(rotatorR, 0);
        dot.graphics
            .beginFill('#aaa')
            .arc(pen, 0, 3, 0, Math.PI*2, false);
        container.addChild(shape);
        container.addChild(dot);
        return container;
    }

    function newDot(pen, localFrom, localTo, color, radius) {
        var point = localFrom.localToLocal(pen, 0, localTo);
        var shape = new createjs.Shape();
        shape.graphics
            .beginFill(color)
            .arc(point.x, point.y, radius, 0, Math.PI*2, false);
        return shape;
    }


    //----------------------FUNCTIONS PARAMS CONTROLS--------------------------

    function checkIntInput(input) {
        var isNum = /^\d*\.?\d+$/.test(input);
        return isNum;
    }

    function setBaseR() {
        var input = $(this).val();
        var isNum = checkIntInput(input);
        if (!isNum)
            alert("Invalid input");
        else
            newBaseR = parseFloat(input);
    }

    function setRotatorR() {
        var input = $(this).val();
        var isNum = checkIntInput(input);
        if (!isNum)
            alert("Invalid input");
        else
            newRotatorR = parseFloat(input);
    }

    function setPen() {
        var input = $(this).val();
        var isNum = checkIntInput(input);
        if (!isNum)
            alert("Invalid input");
        else
            newPen = parseFloat(input);
    }

    function drawNewStage() {
        if (!isNaN(newBaseR) || !isNaN(newRotatorR) || !isNaN(newPen)) {
            var stageChildren = stage.children;
            stageChildren.forEach(myFunction);
            function myFunction(thisChild) {
                if (thisChild === baseContainer)
                    stage.removeChild(thisChild);
            }
            stage.update();
            baseContainer = newBase(newBaseR);
            rotatorContainer = newRotator(newRotatorR, newBaseR, newPen);
            baseContainer.addChild(rotatorContainer);
            stage.addChild(baseContainer);
            stage.update();
            defaultDrawing = false;
        }
        else {
            alert("Something is missing");
        }
    }

    function changePenColor() {
        color = $(this).val();
    }

    function changeDotRadius() {
        var input = $(this).val();
        var isNum = checkIntInput(input);
        if (!isNum)
            alert("Invalid input");
        else
            dotRadius = parseFloat(input);
    }

    function changeDotSparsity() {
        angle = parseFloat($(this).val());
        if (defaultDrawing) {
            angleBase = rotatorR * angle / baseR;
        }
        else {
            angleBase = newRotatorR * angle / newBaseR;
        }
    }

    function changeRotatorsDirection() {
        rotatorDirectionCounterclockwise = !rotatorDirectionCounterclockwise;
        $(this).text(rotatorDirectionCounterclockwise ? "Counterclockwise" : "Clockwise");
    }

    function toggleGuidesVisibility() {
        baseContainer.visible = !baseContainer.visible;
        $(this).text(baseContainer.visible ? "Hide guides" : "Show guides");
    }

    //------------------------------PARAMS----------------------------------
    //default
    var baseR = 250;
    var rotatorR = 74;
    var pen = 50;

    //set new params
    var newBaseR, newRotatorR, newPen;
    var defaultDrawing = true;

    //changeable
    var angle = 1.5;
    var angleBase = rotatorR * angle / baseR;
    var color ="#ffaa91";
    var dotRadius = 2.5;
    var rotatorDirectionCounterclockwise = false;

    //----------------------------EVENT LISTENERS---------------------------
    $("#base-r").on("change", setBaseR);
    $("#rotator-r").on("change", setRotatorR);
    $("#pen").on("change", setPen);
    $('#draw' ).on( "click", drawNewStage);
    $("#pen-color").on("change", changePenColor);
    $("#dot-radius").on("change", changeDotRadius);
    $("#dot-sparsity").on("change", changeDotSparsity);
    $("#direction" ).on( "click", changeRotatorsDirection);
    $("#hideGuides").on("click", toggleGuidesVisibility);
    $("#pause" ).on( "click", togglePause);



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
    // drawXY(stage);
    var dotContainer = new createjs.Container;
    var cacheContainer = new createjs.Container;
    var baseContainer = newBase(baseR);
    var rotatorContainer = newRotator(rotatorR, baseR, pen);
    cacheContainer.cache(-canvas.width / 2, -canvas.width / 2, canvas.width, canvas.width);
    baseContainer.addChild(rotatorContainer);
    stage.addChild(baseContainer);
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
            if (i >= 300) {
                for(var j = 0; j < i; j++) {
                    var thisChild = dotContainer.getChildAt(0);
                    cacheContainer.addChild(thisChild);
                }
                dotContainer.removeAllChildren();
                cacheContainer.updateCache();
                i = 1;
            }
            if (rotatorDirectionCounterclockwise)
                baseContainer.rotation -= angleBase;
            else
                baseContainer.rotation += angleBase;

            rotatorContainer.rotation += angle + angleBase;
            if (defaultDrawing) {
                var dot = newDot(pen, rotatorContainer, dotContainer, color, dotRadius);
            }
            else {
                var dot = newDot(newPen, rotatorContainer, dotContainer, color, dotRadius);
            }
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