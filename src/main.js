var gl
var canvas
var lighting = false
var car = null
var table = null
var butter1 = null
var butter2 = null
var cup = null
var broccoli = []
var donuts = []
var road = null
var lastTime = 0
var tableSize = 9

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    function resize() {
        try {
           gl = canvas.getContext("experimental-webgl");
           gl.viewportWidth = window.innerWidth
           gl.viewportHeight = window.innerHeight
           canvas.width = window.innerWidth
           canvas.height = window.innerHeight
        } catch (e) {}
        if (!gl) {
           alert("Could not initialise WebGL, sorry :-(");
        }
    }

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    }

    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.adjoint(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

        var normalMatrix = mat3.create();
        mat4.invert(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix,normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    var xRot = 0;
    var xSpeed = 3;

    var yRot = 0;
    var ySpeed = -3;

    function handleKeyDown(event) {
        var key = String.fromCharCode(event.keyCode)
        console.log(key)
        switch(key) {
            case 'Q': //UP
                car.forward()
                break
            case 'A': //DOWN
                car.back()
                break
            case 'O': //LEFT
                car.left()
                break
            case 'P': //RIGHT
                car.right()
                break

            case 'L':
                console.log('oi')
                lighting = !lighting
                gl.uniform1i(shaderProgram.useLightingUniform, lighting)
                break
        }

    }

    function handleKeyUp(event) {
        var key = String.fromCharCode(event.keyCode)
        switch(key) {
            case 'Q': //UP
                car.stopForward()
                break
            case 'A': //DOWN
                car.stopBack()
                break
            case 'O': //LEFT
                car.stopLeft()
                break
            case 'P': //RIGHT
                car.stopRight()
                break
        }
    }

    function setTimes () {
        var currentTime = Date.now();
        if (lastTime != 0) {
        var dt = currentTime - lastTime;
            update(dt)
        }

        lastTime = currentTime;
    }

    function update (dt) {
        car.update(dt)
        if (checkCollisions(car, butter1) || checkCollisions(car, butter2)) {
            car.acceleration = 0
            car.speed = 0
            car.targetSpeed = 0
        }
        for (var i = 0; i < donuts.length; i++) {
            if (checkCollisions(car, donuts[i])) {
                car.acceleration = 0
                car.speed = 0
                car.targetSpeed = 0
            }
        }

        //Car fall from table
        if (car.gameObject.position.x >= tableSize || car.gameObject.position.x <= -tableSize || 
        car.gameObject.position.z >= tableSize || car.gameObject.position.z <= -tableSize) {
            car.kill()
            /* remainingLives--
            if (remainingLives <= 0) {
                pause()
            } */
        }
    }

    function drawScene() {
        drawLights()

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0)
        //mat4.frustum(pMatrix, 10, 10, 10, 10, 1, 100)
        //mat4.lookAt(pMatrix, 0,0,1, 0,0,-10, 0,1,0)

        //mat4.identity(mvMatrix)
        mat4.translate(pMatrix, pMatrix, [0.0, 0.0, -20.0])
        mat4.rotateX(pMatrix,pMatrix, degToRad(45))

        // Draw Objects
        table.draw()
        car.draw()
        butter1.draw()
        butter2.draw()
        road.draw()

        cup.draw()
        for (var i = 0; i<broccoli.length; i++) {
            broccoli[i].draw()
        }

        for (var j = 0; j < donuts.length; j++) {
            donuts[j].draw()
        }

        //Light
        if(lighting) {
            gl.uniform3f(shaderProgram.ambientColorUniform,0.9, 0.9, 0.9); //AMBIENT LIGHT RGB

            var lightingDirection = [-0.25,-0.25,-1.0];

            var adjustedLD = vec3.create();
            vec3.normalize(lightingDirection, adjustedLD);
            vec3.scale(adjustedLD, -1);
            gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

            gl.uniform3f(shaderProgram.directionalColorUniform,0.8,0.8,0.8);
        }
    }

    function create() {
        table = new Table ()
        table.create()

        car = new Car()
        car.create()
        car.setPosition(0, 0.45, 7)
        car.angle = 90

        butter1 = new Butter()
        butter1.create()
        butter1.setPosition(7, 0.5, 7)
        butter2 = new Butter()
        butter2.create()
        butter2.setPosition(-7, 0.5, -7)

        cup = new Cup()
        cup.create()
        cup.position = {x:-1.5, y:1.0, z:0.0}


        for(var i=0; i<4; i++) {
            broccoli[i] = new Broccoli()
            broccoli[i].create()
        }
        broccoli[0].position = {x:1.5, y:1, z:1.5}
        broccoli[1].position = {x:1.5, y:1, z:-1.5}
        broccoli[2].position = {x:-1.5, y:1, z:-1.5}
        broccoli[3].position = {x:-1.5, y:1, z:1.5}

        road = new Road ()
        road.create()

 
        //DONUTS
        for(var i = 0, e = 0; i < 28; e++, i += 4) {
            donuts[i] = new Donut()
            donuts[i].create()
            donuts[i].setPosition(-3 + e, 0.1, -8.5)

            donuts[i+1] = new Donut()
            donuts[i+1].create()
            donuts[i+1].setPosition(-3 + e, 0.1, -5)

            donuts[i+2] = new Donut()
            donuts[i+2].create()
            donuts[i+2].setPosition(-3 + e, 0.1, 8.5)

            donuts[i+3] = new Donut()
            donuts[i+3].create()
            donuts[i+3].setPosition(-3 + e, 0.1, 5)
        }
        console.log('i: '+ i+' e: '+e)

        for(var i = 28, e = 0; i < 56; e++, i += 4) {
            donuts[i] = new Donut()
            donuts[i].create()
            donuts[i].setPosition(-8.5, 0.1, -3 + e)

            donuts[i+1] = new Donut()
            donuts[i+1].create()
            donuts[i+1].setPosition(-5, 0.1, -3 + e)

            donuts[i+2] = new Donut()
            donuts[i+2].create()
            donuts[i+2].setPosition(8.5, 0.1, -3 + e)

            donuts[i+3] = new Donut()
            donuts[i+3].create()
            donuts[i+3].setPosition(5, 0.1, -3 + e)
        }

    }

    function tick() {
        resize()
        requestAnimFrame(tick)
        setTimes()
        drawScene()
    }

    function webGLStart() {
        canvas = document.getElementById("AVT-WebGL")
        initGL(canvas)
        create()
        initShaders()

        gl.clearColor(0.5, 0.5, 0.5 , 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        tick();
    }


    var lPos_uniformId = []
    var local_uniformId = []
    var enabled_uniformId = []
    var spot_uniformId = []
    var spotDir_uniformId = []
    var spotCutOff_uniformId = []
    var spotExp_uniformId = []

    function drawLights () {
        //eu a tentar meter as luzes
        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "mat.ambient"),  [0.94, 0.94, 0.94, 1.00])
        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "mat.diffuse"),  [0.94, 0.94, 0.94, 1.00])
        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "mat.specular"), [0.94, 0.94, 0.94, 1.00])
        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "mat.emissive"), [0.00, 0.00, 0.00, 1.00])
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "mat.shininess"), 100.0)
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "mat.texCount"), 0)

        lPos_uniformId[0] = gl.getUniformLocation(shaderProgram, "Lights[0].l_pos")
        local_uniformId[0] = gl.getUniformLocation(shaderProgram, "Lights[0].isLocal")
        enabled_uniformId[0] = gl.getUniformLocation(shaderProgram, "Lights[0].isEnabled")
        spot_uniformId[0] = gl.getUniformLocation(shaderProgram, "Lights[0].isSpot")

        aux = []
        multMatrixPoint(mvMatrix, [0, 0, 3, 1], aux);

        gl.uniform1i(local_uniformId[0], false)
        gl.uniform1i(enabled_uniformId[0], true)
        gl.uniform1i(spot_uniformId[0], false)
        gl.uniform4fv(lPos_uniformId[0], aux)
    }
