var Donut = function () {
  this.position = {x: 0, y: 0, z: 0}
  this.scale = {x: 1, y: 1, z: 1}
  this.rotation = {x: 0, y: 0, z: 0}
  this.gameObject = null
}

Donut.prototype = {
  create: function () {

    this.gameObject = new GameObject(DONUT_OBJ, "Assets/Textures/Donuts.png")
    this.initBuffers()

  },

  draw: function () {
    this.gameObject.position = this.position 
    this.gameObject.draw()
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  }, 

  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}
