var Car = function () {
  this.position = {x: 0, y: 0, z: 0}
  this.scale = {x: 1, y: 1, z: 1}
  this.rotation = {x: 0, y: 0, z: 0}
  this.gameObject = null
}

Car.prototype = {
  create: function () {
    this.gameObject = new GameObject(CAR_OBJ, "Assets/Textures/FREE-CAR-Texture.png")
    this.initBuffers()
  },
  draw: function () {
    mvPushMatrix()

    mat4.rotateX(mvMatrix,mvMatrix, degToRad(this.rotation.x))
    mat4.rotateY(mvMatrix,mvMatrix, degToRad(this.rotation.y))
    mat4.rotateZ(mvMatrix,mvMatrix, degToRad(this.rotation.z))
    mat4.translate(mvMatrix,mvMatrix,[this.position.x, this.position.y, this.position.z])
    mat4.scale(mvMatrix,mvMatrix, [0.2, 0.2, 0.2])

    /*mvPushMatrix()
    por aqui as varias pessas do carro
    */

 		this.gameObject.cubeBindBuffers()

    mvPopMatrix()
  },
  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}