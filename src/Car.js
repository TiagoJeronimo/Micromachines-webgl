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
  },

  draw: function () {
    this.gameObject.draw()
  },

  update: function (dt) {

  }
}