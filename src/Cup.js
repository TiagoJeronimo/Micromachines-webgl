var Cup = function () {
  this.position = {x: 0, y: 0, z: 0}
  this.scale = {x: 1, y: 1, z: 1}
  this.rotation = {x: 0, y: 0, z: 0}
  this.gameObject = null
}

Cup.prototype = {
  create: function () {
    this.gameObject = new GameObject(CUBE_OBJ, "glass.gif")
    this.initBuffers()
  },
  draw: function () {
    this.gameObject.position = this.position 
    this.gameObject.draw()
  },
  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}