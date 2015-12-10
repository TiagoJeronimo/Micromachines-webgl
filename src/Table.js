var Table = function () {
  this.position = {x: 0, y: 0, z: 0}
  this.scale = {x: 1, y: 1, z: 1}
  this.rotation = {x: 0, y: 0, z: 0}
  this.gameObject = null
}

Table.prototype = {
  create: function () {
    this.gameObject = new GameObject(CUBE_OBJ, 'Assets/Textures/table.png')
    this.initBuffers()
  },
  draw: function () {
    this.gameObject.scale = {x: 9.0, y: 0.0000001, z: 9.0}
    this.gameObject.draw()
  },
  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}
