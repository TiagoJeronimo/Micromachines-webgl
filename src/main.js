var gl
var canvas
var lighting = false
var car = null
var table = null
var butter1 = null
var butter2 = null
var cup = null
var broccoli = []
var road = null

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
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
        shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
    }

    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
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
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    var xRot = 0;
    var xSpeed = 3;

    var yRot = 0;
    var ySpeed = -3;

    var currentlyPressedKeys = {};

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;

        if (String.fromCharCode(event.keyCode) == "L") { // L - Lights off/on
            lighting = !lighting;
            gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        }
    }

    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

    function handleKeys() {
        if (currentlyPressedKeys[33]) {
            // Page Up
            z -= 0.05;
        }
        if (currentlyPressedKeys[34]) {
            // Page Down
            z += 0.05;
        }
        if (currentlyPressedKeys[37]) {
            // Left cursor key
            ySpeed -= 1;
        }
        if (currentlyPressedKeys[39]) {
            // Right cursor key
            ySpeed += 1;
        }
        if (currentlyPressedKeys[38]) {
            // Up cursor key
            xSpeed -= 1;
        }
        if (currentlyPressedKeys[40]) {
            // Down cursor key
            xSpeed += 1;
        }
    }

    function initBuffers() {
        car.initBuffers()
        butter1.initBuffers()
        butter2.initBuffers()
        cup.initBuffers()
        for (var i = 0; i<broccoli.length; i++) {
            broccoli[i].initBuffers()
        }
    }

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, [0.0, 0.0, -15.0]);
        mat4.rotateX(mvMatrix, degToRad(45))

        // Draw Objects
        table.draw()

        car.draw()
        butter1.draw()
        butter2.draw()
        cup.draw()
        for (var i = 0; i<broccoli.length; i++) {
            broccoli[i].draw()
        }
        road.draw()

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

        car = new GameObject(CUBE_OBJ, "glass.gif")
        car.position = {x:0.0, y:0.45, z:2.8}
        car.scale = {x:0.2, y:0.2, z:0.2}
        butter1 = new GameObject(CUBE_OBJ, "glass.gif")
        butter1.position = {x:3.6, y:0.5, z:3.0}
        butter1.scale = {x:0.7, y:0.7, z:0.7}
        butter2 = new GameObject(CUBE_OBJ, "glass.gif")
        butter2.position = {x:-3.4, y:0.5, z:-4.0}
        butter2.scale = {x:0.7, y:0.7, z:0.7}
        cup = new GameObject(CUBE_OBJ, "glass.gif")
        cup.position = {x:-1.5, y:1.0, z:0.0}
        broccoli[0] = new GameObject(CUBE_OBJ, "glass.gif")
        broccoli[0].position = {x:1.5, y:0.5, z:1.5}
        broccoli[1] = new GameObject(CUBE_OBJ, "glass.gif")
        broccoli[1].position = {x:1.5, y:0.5, z:-1.5}
        broccoli[2] = new GameObject(CUBE_OBJ, "glass.gif")
        broccoli[2].position = {x:-1.5, y:0.5, z:-1.5}
        broccoli[3] = new GameObject(CUBE_OBJ, "glass.gif")
        broccoli[3].position = {x:-1.5, y:0.5, z:1.5}

        road = new Road ()
        road.create()
    }

    var lastTime = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            xRot += (xSpeed * elapsed) / 1000.0;
            yRot += (ySpeed * elapsed) / 1000.0;
        }
        lastTime = timeNow;
    }

    function tick() {
        resize()
        requestAnimFrame(tick)
        handleKeys()
        drawScene()
        animate()
    }

    function webGLStart() {
        canvas = document.getElementById("AVT-WebGL")
        initGL(canvas)
        create()
        initShaders()
        initBuffers()

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        //gl.enable(gl.BLEND);

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        tick();
    }
