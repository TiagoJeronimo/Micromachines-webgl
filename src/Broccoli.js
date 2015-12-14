var Broccoli = function () {
  this.gameObject = null
}

Broccoli.prototype = {
  create: function () {
    this.gameObject = new GameObject(QUAD_OBJ, "Assets/Textures/broccoli.png")
    this.gameObject.scale.x = -1
    this.gameObject.scale.z = -1
    this.initBuffers()
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