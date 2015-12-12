var Donut = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
}

Donut.prototype = {
  create: function () {
    this.gameObject = new GameObject(DONUT_OBJ, "Assets/Textures/Donuts.png")
    this.initBuffers()
    this.gameObject.scale = {x:1.8, y:1.8, z:1.8}
  },

  draw: function () {
    var bb = 0.55
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
