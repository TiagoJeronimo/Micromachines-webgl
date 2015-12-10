var Car = function () {
  this.acceleration = {x: 0, y: 0, z: 0}
  this.speed = {x: 0, y: 0, z: 0}
  this.position = {x: 0, y: 0, z: 0}
  this.angle = 0
  this.gameObject = null
}

Car.prototype = {
  create: function () {
    this.gameObject = new GameObject(CAR_OBJ, "Assets/Textures/FREE-CAR-Texture.png")
    this.gameObject.initBuffers()
    this.gameObject.setScale(0.5, 0.5, 0.5)
  },

  draw: function () {
    this.gameObject.draw()
  },

  update: function (dt) {
    this.gameObject.rotation.y = this.angle
  },

  setPosition: function (x, z) {
    this.gameObject.setPosition(x, 0.1, z)
  }
}