var Waffle = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
  this.collisionsOn = true
  this.onCollisionMove = false
}

Waffle.prototype = {
  create: function () {
    this.gameObject = new GameObject(WAFFLE_OBJ, "Assets/Textures/Waffle.png")
    this.initBuffers()
    this.gameObject.scale = {x:1.5, y:-1.5, z:1.5}
  },

  draw: function () {
    var bb = 0.25
    this.checkBox[0] = this.gameObject.position.x - bb
    this.checkBox[1] = this.gameObject.position.x + bb
    this.checkBox[2] = this.gameObject.position.z - bb * 4
    this.checkBox[3] = this.gameObject.position.z + bb * 4

    this.gameObject.draw()
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  },

  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}
