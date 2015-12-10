var Road = function () {
  this.position = {x: 0, y: 0, z: 0}
  this.scale = {x: 1, y: 1, z: 1}
  this.rotation = {x: 0, y: 0, z: 0}
  this.goUp = null // Game Object Up
  this.goBottom = null
  this.goLeft = null
  this.goRight = null
}

Road.prototype = {
  create: function () {
    this.goUp = new GameObject(CUBE_OBJ, "Assets/Textures/road.png")
    this.goBottom = new GameObject(CUBE_OBJ, "Assets/Textures/road.png")
    this.goLeft = new GameObject(CUBE_OBJ, "Assets/Textures/road.png")
    this.goRight = new GameObject(CUBE_OBJ, "Assets/Textures/road.png")
    this.initBuffers()
  },
  draw: function () {
    mvPushMatrix()

    //mat4.translate(mvMatrix, [-2.5, 0.50, -2.5])
    //mat4.rotateY(mvMatrix, degToRad(90))
    //mat4.scale(mvMatrix, [1.0, 0.01, 5.0])

    // UP
    mvPushMatrix()
    mat4.translate(mvMatrix, mvMatrix, [0, 0.50, -5])
    mat4.rotateY(mvMatrix,mvMatrix, degToRad(90))
    mat4.scale(mvMatrix,mvMatrix, [1.0, 0.01, 4.0])
    this.goUp.cubeBindBuffers()
    mvPopMatrix()

    // Bottom
    mvPushMatrix()
    mat4.translate(mvMatrix, mvMatrix,[0, 0.50, 5])
    mat4.rotateY(mvMatrix,mvMatrix, degToRad(90))
    mat4.scale(mvMatrix, mvMatrix,[1.0, 0.01, 4.0])
    this.goBottom.cubeBindBuffers()
    mvPopMatrix()

    // Left
    mvPushMatrix()
    mat4.translate(mvMatrix,mvMatrix, [-5, 0.50, 0])
    mat4.scale(mvMatrix, mvMatrix,[1.0, 0.01, 6])
    this.goLeft.cubeBindBuffers()
    mvPopMatrix()

    // Right
    mvPushMatrix()
    mat4.translate(mvMatrix, mvMatrix,[5, 0.50, 0])
    mat4.scale(mvMatrix,mvMatrix, [1.0, 0.01, 6])
    this.goRight.cubeBindBuffers()
    mvPopMatrix()

    mvPopMatrix()
  },
  initBuffers: function () {
      this.goUp.initBuffers()
      this.goBottom.initBuffers()
      this.goLeft.initBuffers()
      this.goRight.initBuffers()
  }
}
