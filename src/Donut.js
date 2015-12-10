var Donut = function () {
  this.position = {x: 0, y: 0, z: 0}
  this.scale = {x: 1, y: 1, z: 1}
  this.rotation = {x: 0, y: 0, z: 0}
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
}

Donut.prototype = {
  create: function () {
    this.gameObject = new GameObject(DONUT_OBJ, "Assets/Textures/Donuts.png")
    this.initBuffers()
  },

  draw: function () {
    var bb = 0.5
    this.checkBox[0] = this.gameObject.position.x - bb
    this.checkBox[1] = this.gameObject.position.x + bb
    this.checkBox[2] = this.gameObject.position.z - bb
    this.checkBox[3] = this.gameObject.position.z + bb

    this.gameObject.draw()
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  },

  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}
