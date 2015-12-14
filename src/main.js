var gl
var canvas
var lighting = false
var car = null
var table = null
var butter1 = null
var butter2 = null
var butterInv1 = null
var butterInv2 = null
var puddle1 = null
var puddle2 = null
var particles = null
var cup1 = null
var cup2 = null
var broccoli = []
var donuts = []
var waffles = []
var burguer = null
var iceCream1 = null
var iceCream2 = null
var cake = null
var road = null
var orange = []
var lastTime = 0
var tableSize = 9
var auxtimer = 0
var lastKey = null
var activeCamera = 2

var lamps = []
var directional = null, spot1 = null, spot2 = null

var stereoEye = 0
var stereoAngle = 0
var stereoActive = false

var autoMove = true
var totalTime = 0

var gyroAlpha = 0


    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl", {stencil:true, alpha: false});
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
           gl = canvas.getContext("experimental-webgl", {stencil:true});
           if (!autoMove) {
               gl.viewportWidth = window.innerWidth
               gl.viewportHeight = window.innerHeight
               canvas.width = window.innerWidth
               canvas.height = window.innerHeight
           }
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

        shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");
        shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "viewMatrix");
        shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");

        shaderProgram.darken_uniformId = gl.getUniformLocation(shaderProgram, "darken");
    }

    var model = mat4.create();
    var view = mat4.create();
    var projection = mat4.create();
    var viewModelMatrix = mat4.create();

    var mvMatrixStack = [];

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.adjoint(model, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        model = mvMatrixStack.pop();
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, model);
        gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, view);
        gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projection);

        mat4.multiply(viewModelMatrix, view, model)
        var normalMatrix = mat3.create()
        var view3 = mat3.create()
        mat3.fromMat4(view3, viewModelMatrix)
        mat3.invert(normalMatrix, view3);
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

    function keyDownSwitch (key) {
        switch(key) {
            case '1':
                activeCamera = 0;
                stereoActive = false;
                break;
            case '2':
                activeCamera = 1;
                stereoActive = false;
                break;

            case '3': 
                activeCamera = 2;
                stereoActive = false;
                break;

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
                lighting = !lighting
                gl.uniform1i(shaderProgram.useLightingUniform, lighting)
                break

            case 'N':
                directional.enabled = !directional.enabled
                break

            case 'C':
                for (var i = 0; i < lamps.length; i++) {
                    lamps[i].enabled = !lamps[i].enabled
                }
                break

            case 'H':
                spot1.enabled = !spot1.enabled
                spot2.enabled = !spot2.enabled
                break

            case '4':
                activeCamera = 2;
                stereoActive = true;
                break;
        }
    }

    function handleKeyDown(event) {
        var key = String.fromCharCode(event.keyCode)
        if (key === lastKey) return
        inputTimes.push({time: totalTime, key: key})
        keyDownSwitch(key)
        lastKey = key
    }

    function keyUpSwitch(key) {
        inputUpTimes.push({time: totalTime, key: key})
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

    function handleKeyUp(event) {
        var key = String.fromCharCode(event.keyCode)
        keyUpSwitch(key)
        lastKey = null
    }

    function setTimes () {
        var currentTime = Date.now()
        if (lastTime != 0) {
        var dt = currentTime - lastTime
            update(dt)
        }

        lastTime = currentTime;
    }

    function update (dt) {
        spot1.update()
        spot2.update()
        car.update(dt)
        for(var i = 0; i < 3; i++) {
            orange[i].update(dt)

            if (orange[i].gameObject.position.x >= tableSize || orange[i].gameObject.position.x <= -tableSize) {
                orange[i].delay = true
                if (Date.now() > auxtimer + 5000) {
                    auxtimer = Date.now()
                    orange[i].init()
                }
            }
            if (checkCollisions(car, orange[i]) && !autoMove) {
                car.kill()
                /* remainingLives--;
                if (remainingLives <= 0) {
                    pause()
                } */
            }
        }
        if (checkCollisions(car, butter1) || checkCollisions(car, butter2)) {
            particles.setPosition(car.position.x + car.direction[0]/4, 1, car.position.z + car.direction[2]/4)
            particles.create()
            car.acceleration = 0
            car.speed = 0
            car.targetSpeed = 0
            butterInv1.setPosition(butter1.gameObject.position.x, 0.0, butter1.gameObject.position.z)
            butterInv2.setPosition(butter2.gameObject.position.x, 0.0, butter2.gameObject.position.z)
        }
        for (var i = 0; i < donuts.length; i++) {
            if (checkCollisions(car, donuts[i])) {
                car.acceleration = 0
                car.speed = 0
                car.targetSpeed = 0
            }
        }
        if (checkCollisions(car, cake) || checkCollisions(car, burguer) || checkCollisions(car, iceCream1) || checkCollisions(car, iceCream2)) {
            car.acceleration = 0
            car.speed = 0
            car.targetSpeed = 0
        }

        for (var i = 0; i < waffles.length; i++) {
            if (checkCollisions(car, waffles[i])) {
                car.acceleration = 0
                car.speed = 0
                car.targetSpeed = 0
            }
        }

        //Car fall from table
        if (car.gameObject.position.x >= tableSize || car.gameObject.position.x <= -tableSize || 
        car.gameObject.position.z >= tableSize || car.gameObject.position.z <= -tableSize) {
            car.kill()
            document.getElementById("lifes").textContent--
            if (document.getElementById("lifes").textContent <= 0) {
                document.getElementById("lifes").textContent = 'you DIEEEEEEEEEEEEEEEEE!!!'
            }
        }

        particles.update()

        totalTime++
        if (autoMove) {
            if (inputTimes.length > 0 && inputTimes[0].time <= totalTime) {
                keyDownSwitch(inputTimes[0].key)
                inputTimes.splice(0, 1)

            }
            if (inputUpTimes.length > 0 && inputUpTimes[0].time <= totalTime) {
                keyUpSwitch(inputUpTimes[0].key)
                inputUpTimes.splice(0, 1)
            }  
        }

        updateSensors()
    }

    function updateCamera() {
        if (activeCamera == 0) {
            //Orthogonal Projection

            var w = gl.viewportWidth
            var h = gl.viewportHeight
            if (w > h) {
                var ratio = w / h
                mat4.ortho(projection, -10*ratio, 10*ratio, -10, 10, -20, 20) 
            } else {
                var ratio = h / w
                mat4.ortho(projection, -10, 10, -10*ratio, 10*ratio, -20, 20) 
            }
            
            mat4.lookAt(view, [0, 10, 0], [0, 0, 0], [0, 0, -1])
        }
        else if (activeCamera == 1) {
            //Fixed Perspective

            // Eye(0,10,14) Center(0,0,0) Up(0,1,0)
            mat4.lookAt(view, [0, 10, 14], [0, 0, 0], [0, 1, 0])
            mat4.perspective(projection, 45, gl.viewportWidth / gl.viewportHeight, 1, 100.0)
        }
        else if (activeCamera == 2) {
            //Dynamic Perspective
            var pos = [car.position.x - car.direction[0]/1.5, 1, car.position.z - car.direction[2]/1.5]
            var dir = [car.position.x + car.direction[0], 1, car.position.z + car.direction[2]]

            var vw = gl.viewportWidth
            if (stereoActive) vw = gl.viewportWidth/2

            mat4.lookAt(view, pos, dir, [0, 1, 0])
            mat4.perspective(projection, 45, vw / gl.viewportHeight, 1, 100.0)
            mat4.scale(projection, projection, [3, 3, 3])
            mat4.rotateY(projection, projection, degToRad(stereoAngle))
            mat4.rotateY(projection, projection, degToRad(-gyroAlpha))
            mat4.translate(projection, projection, [stereoEye, 0, 0])

        }
    }

    function drawBroccoli() {
        for (var i = 0; i < broccoli.length; i++) {
            if (activeCamera == 2) {
                broccoli[i].gameObject.rotation.y = car.angle + gyroAlpha
            }

            broccoli[i].draw()
        }
    }

    function drawViewports () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        if (stereoActive) {
            stereoEye = 0.05
            stereoAngle = 1
            gl.viewport(0, 0, gl.viewportWidth/2, gl.viewportHeight)
            drawScene()
            stereoEye = -0.05
            stereoAngle = -1
            gl.viewport(gl.viewportWidth/2, 0, gl.viewportWidth/2, gl.viewportHeight)
            drawScene()
        } else {
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
            drawScene()
        }

    }

    function drawScene() {
        drawLights()

        updateCamera()

        car.draw()
        butter1.draw()
        butter2.draw()
        road.draw()

        for(var i = 0; i < 3; i++) {
            orange[i].draw()
        }

        burguer.draw()
        iceCream1.draw()
        iceCream2.draw()
        cake.draw()

        for (var i = 0; i < waffles.length; i++) {
            waffles[i].draw()
        }

        for (var j = 0; j < donuts.length; j++) {
            donuts[j].draw()
        }

        particles.draw()

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

        gl.clearStencil(0);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.depthMask(false)
        table.draw()
        gl.enable(gl.STENCIL_TEST);

        gl.enable(gl.BLEND)
        puddle1.draw()
        puddle2.draw()
        gl.disable(gl.BLEND)

        gl.stencilFunc(gl.EQUAL, 1, 0xFF);
        gl.depthMask(true)

        gl.uniform1i(shaderProgram.darken_uniformId, true)
        butterInv1.draw()
        butterInv2.draw()
        gl.uniform1i(shaderProgram.darken_uniformId, false)

        gl.disable(gl.STENCIL_TEST);

        gl.enable(gl.BLEND)
        drawBroccoli()

        gl.depthMask(false)
        cup1.draw()
        cup2.draw()
        gl.depthMask(true)

        gl.disable(gl.BLEND)

    }

    function create() {
        table = new Table ()
        table.create()

        car = new Car()
        car.create()
        car.setPosition(0, 0.05, 7)

        butter1 = new Butter()
        butter1.create()
        butter1.setPosition(7, 0.0, 7)
        butter2 = new Butter()
        butter2.create()
        butter2.setPosition(-7, 0.0, -7)

        cup1 = new Cup()
        cup1.create()
        cup1.position = {x:-3, y:0.0, z:-3.0}
        cup2 = new Cup()
        cup2.create()
        cup2.position = {x:3, y:0.0, z:3.0}

        particles = new Particles()

        for(var i=0; i<4; i++) {
            broccoli[i] = new Broccoli()
            broccoli[i].create()
        }
        broccoli[0].setPosition(1.5, 1, 1.5)
        broccoli[1].setPosition(1.5, 1, -1.5)
        broccoli[2].setPosition(-1.5, 1, -1.5)
        broccoli[3].setPosition(-1.5, 1, 1.5)

        //Waffle
        for (var i = 0; i < 6; i++) {
            waffles[i] = new Waffle()
            waffles[i].create()
        }

        // Left
        waffles[0].setPosition(7.75, 1.0,  0.0)
        waffles[0].gameObject.rotation = {x: 0, y:0, z:100}

        waffles[1].setPosition(5.65, 1.0, 0.0)
        waffles[1].gameObject.rotation = {x: 0, y:0, z:-100}

        waffles[2].setPosition(6.7, 1.8, 0.0)
        waffles[2].collisionsOn = false
        waffles[2].gameObject.rotation = {x: 0, y:0, z:3}

        // Top
        waffles[3].setPosition(-7.95, 1.0,  0.0)
        waffles[3].gameObject.rotation = {x: 0, y:0, z:-100}

        waffles[4].setPosition(-5.85, 1.0, 0.0)
        waffles[4].gameObject.rotation = {x: 0, y:0, z:100}

        waffles[5].setPosition(-6.9, 1.8, 0.0)
        waffles[5].collisionsOn = false
        waffles[5].gameObject.rotation = {x: 0, y:0, z:3}

        road = new Road ()
        road.create()

        burguer = new Burguer()
        burguer.create()

        iceCream1 = new IceCream()
        iceCream1.create()
        iceCream1.setPosition(-3, 0.1, 3)
        iceCream2 = new IceCream()
        iceCream2.create()
        iceCream2.setPosition(3, 0.1, -3)

        cake = new Cake()
        cake.create()

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

        for(var i = 0; i < 3; i++) {
            orange[i] = new Orange()
            orange[i].create()
            orange[i].init()
        }

        butterInv1 = new Butter()
        butterInv1.create()
        butterInv1.setPosition(7, 0.0, 7)
        butterInv1.gameObject.scale.y = -1

        butterInv2 = new Butter()
        butterInv2.create()
        butterInv2.setPosition(-7, 0.0, -7)
        butterInv2.gameObject.scale.y = -1

        puddle1 = new Puddle ()
        puddle1.create()
        puddle1.setPosition(7, 0.0, 7)

        puddle2 = new Puddle ()
        puddle2.create()
        puddle2.setPosition(-7, 0.0, -7)

        //Create lights
        directional = new Light(0)
        directional.local = false
        directional.position = [0, 1, 0, 0]

        lapms = []
        lamps[0] = new Light(1)
        lamps[0].position = [3.5, 1.5, 4.5, 1.0]
        lamps[1] = new Light(2)
        lamps[1].position = [3.5, 1.5, -4.5, 1.0]
        lamps[2] = new Light(3)
        lamps[2].position = [0, 1.5, 4.5, 1.0]
        lamps[3] = new Light(4)
        lamps[3].position = [0, 1.5, -4.5, 1.0]
        lamps[4] = new Light(5)
        lamps[4].position = [-3.5, 1.5, 4.5, 1.0]
        lamps[5] = new Light(6)
        lamps[5].position = [-3.5, 1.5, -4.5, 1.0]

        //Create lights
        spot1 = new Light(7)
        spot1.spot = true
        spot1.position = [car.position.x, car.position.y, car.position.z, 1.0]
        spot1.direction = [car.position.x + car.direction[0], -1, car.position.z + car.direction[2], 1.0]
        spot2 = new Light(8)
        spot2.spot = true
        spot2.position = [car.position.x, car.position.y, car.position.z, 1.0]
        spot2.direction = [car.position.x + car.direction[0], -1, car.position.z + car.direction[2], 1.0]


    }

    function tick() {
        resize()
        requestAnimFrame(tick)
        setTimes()
        drawViewports()
    }

    function webGLStart() {
        canvas = document.getElementById("AVT-WebGL")
        initGL(canvas)
        create()
        initShaders()

        gl.clearColor(0.5, 0.5, 0.5 , 1.0)
        gl.enable(gl.DEPTH_TEST)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)


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
        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "mat.ambient"),  [0.4, 0.4, 0.4, 1.00])
        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "mat.diffuse"),  [0.7, 0.7, 0.7, 1.00])
        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "mat.specular"), [0.3, 0.3, 0.3, 1])
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "mat.shininess"), 100.0)

        directional.draw()
        spot1.draw()
        spot2.draw()
        for (var i = 0; i < lamps.length; i++) lamps[i].draw()
    }

function updateSensors() {
    gyro.startTracking(function(o) {
        gyroAlpha = o.alpha
        document.getElementById("score").textContent = 'alpha: ' + Math.round(o.alpha) + ', beta: ' + Math.round(o.beta) + ', gamma: ' + Math.round(o.gamma)
        // o.x, o.y, o.z for accelerometer
        // o.alpha, o.beta, o.gamma for gyro
    });
}
