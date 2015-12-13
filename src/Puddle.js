var Puddle = function () {
  this.gameObject = null
}

Puddle.prototype = {
  create: function () {
    this.gameObject = new GameObject(QUAD_OBJ, 'Assets/Textures/puddle.png')
    this.initBuffers()
    this.gameObject.setScale(2, -1, 2)
    this.gameObject.rotation.x = 90
  },

  draw: function () {
    this.gameObject.draw()
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  },

  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}