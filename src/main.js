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
var cup = null
var broccoli = []
var donuts = []
var waffles = []
var burguer = null
var iceCream = null
var cake = null
var road = null
var orange = []
var lastTime = 0
var tableSize = 9
var auxtimer = 0
var lastKey = null
var activeCamera = 0

var lamps = []
var directional = null, spot1 = null, spot2 = null


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

    function handleKeyDown(event) {
        var key = String.fromCharCode(event.keyCode)
        if (key === lastKey) return
        switch(key) {
            case '1':
                activeCamera = 0;
                break;
            case '2':
                activeCamera = 1;
                break;

            case '3': 
                activeCamera = 2;
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
        }
        lastKey = key

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
            if (checkCollisions(car, orange[i])) {
                car.kill()
                /* remainingLives--;
                if (remainingLives <= 0) {
                    pause()
                } */
            }
        }
        if (checkCollisions(car, butter1) || checkCollisions(car, butter2)) {
            particles.setPosition(car.position.x, 1, car.position.z)
            particles.create()
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
        if (checkCollisions(car, cake) || checkCollisions(car, burguer) || checkCollisions(car, iceCream)) {
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
            var pos = [car.position.x - car.direction[0]/2, 1.5, car.position.z - car.direction[2]/2]
            var dir = [car.position.x + car.direction[0], 1, car.position.z + car.direction[2]]

            mat4.lookAt(view, pos, dir, [0, 1, 0])
            mat4.perspective(projection, 45, gl.viewportWidth / gl.viewportHeight, 1, 100.0)
            mat4.scale(projection, projection, [3, 3, 3])
        }
    }

    function drawBroccoli() {
        for (var i = 0; i < broccoli.length; i++) {
            if (activeCamera == 2) {
                broccoli[i].gameObject.rotation.y = car.angle
            }

            broccoli[i].draw()
        }
    }

    function drawScene() {
        drawLights()

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        updateCamera()

        car.draw()
        butter1.draw()
        butter2.draw()
        road.draw()

        for(var i = 0; i < 3; i++) {
            orange[i].draw()
        }

        gl.enable(gl.BLEND)
        drawBroccoli()

        cup.draw()
        //gl.disable(gl.BLEND)

        burguer.draw()
        iceCream.draw()
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
        //gl.disable(gl.BLEND)

        gl.stencilFunc(gl.EQUAL, 1, 0xFF);
        gl.depthMask(true)

        gl.uniform1i(shaderProgram.darken_uniformId, true)
        butterInv1.draw()
        butterInv2.draw()
        gl.uniform1i(shaderProgram.darken_uniformId, false)


        gl.disable(gl.STENCIL_TEST);

    }

    function create() {
        table = new Table ()
        table.create()

        car = new Car()
        car.create()
        car.setPosition(0, 0.45, 7)

        butter1 = new Butter()
        butter1.create()
        butter1.setPosition(7, 0.0, 7)
        butter2 = new Butter()
        butter2.create()
        butter2.setPosition(-7, 0.0, -7)

        cup = new Cup()
        cup.create()
        cup.position = {x:-2.5, y:0.0, z:0.0}

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

        iceCream = new IceCream()
        iceCream.create()

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
        puddle1.setPosition(-7, 0.0, -7)

        puddle2 = new Puddle ()
        puddle2.create()
        puddle2.setPosition(7, 0.0, 7)

        //Create lights
        directional = new Light(0)
        directional.local = false
        directional.position = [0, 1, 0, 0]

        lapms = []
        lamps[0] = new Light(1)
        lamps[0].position = [2.5, 1.5, 2.5, 1.0]
        lamps[1] = new Light(2)
        lamps[1].position = [2.5, 1.5, -2.5, 1.0]
        lamps[2] = new Light(3)
        lamps[2].position = [0, 1.5, 2.5, 1.0]
        lamps[3] = new Light(4)
        lamps[3].position = [0, 1.5, -2.5, 1.0]
        lamps[4] = new Light(5)
        lamps[4].position = [-2.5, 1.5, 2.5, 1.0]
        lamps[5] = new Light(6)
        lamps[5].position = [-2.5, 1.5, -2.5, 1.0]

        //Create lights
        spot1 = new Light(7)
        spot1.spot = true
        spot2 = new Light(7)
        spot2.spot = true


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

        gl.clearColor(0.5, 0.5, 0.5 , 1.0)
        gl.enable(gl.DEPTH_TEST)
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
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
