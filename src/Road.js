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
    this.goUp = new GameObject(CUBE_OBJ, "glass.gif")
    this.goBottom = new GameObject(CUBE_OBJ, "glass.gif")
    this.goLeft = new GameObject(CUBE_OBJ, "glass.gif")
    this.goRight = new GameObject(CUBE_OBJ, "glass.gif")
    this.initBuffers()
  },
  draw: function () {
    mvPushMatrix()

    //mat4.translate(mvMatrix, [-2.5, 0.50, -2.5])
    //mat4.rotateY(mvMatrix, degToRad(90))
    //mat4.scale(mvMatrix, [1.0, 0.01, 5.0])

    // UP
    mvPushMatrix()
    mat4.translate(mvMatrix, [-2.5, 0.50, -2.5])
    mat4.rotateY(mvMatrix, degToRad(90))
    mat4.scale(mvMatrix, [1.0, 0.01, 5.0])
    this.goUp.cubeBindBuffers()
    mvPopMatrix()

    // Bottom
    mvPushMatrix()
    mat4.translate(mvMatrix, [-2.5, 0.50, 3.6])
    mat4.rotateY(mvMatrix, degToRad(90))
    mat4.scale(mvMatrix, [1.0, 0.01, 5.0])
    this.goBottom.cubeBindBuffers()
    mvPopMatrix()

    // Left
    mvPushMatrix()
    mat4.translate(mvMatrix, [-3.5, 0.5, -3.5])
    mat4.scale(mvMatrix, [1.0, 0.01, 7.1])
    this.goLeft.cubeBindBuffers()
    mvPopMatrix()

    // Right
    mvPushMatrix()
    mat4.translate(mvMatrix, [2.5, 0.5, -3.5])
    mat4.scale(mvMatrix, [1.0, 0.01, 7.1])
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
