var Table = function () {
  this.position = {x: 0, y: 0, z: 0}
  this.scale = {x: 1, y: 1, z: 1}
  this.rotation = {x: 0, y: 0, z: 0}
  this.gameObject = null
}

Table.prototype = {
  create: function () {
    this.gameObject = new GameObject(CUBE_OBJ, "table.gif")
    this.initBuffers()
    this.scale = {x: 9.0, y: 0.0000001, z: 9.0}
  },
  draw: function () {
    mvPushMatrix()

    mat4.rotateX(mvMatrix, degToRad(this.rotation.x))
    mat4.rotateY(mvMatrix, degToRad(this.rotation.y))
    mat4.rotateZ(mvMatrix, degToRad(this.rotation.z))
    mat4.translate(mvMatrix, [this.position.x, this.position.y, this.position.z])
    mat4.scale(mvMatrix, [this.scale.x, this.scale.y, this.scale.z])

 		this.gameObject.cubeBindBuffers()

    mvPopMatrix()
  },
  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}
