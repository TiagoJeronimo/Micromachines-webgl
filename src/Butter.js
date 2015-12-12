var Butter = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
}

Butter.prototype = {
  create: function () {

    this.gameObject = new GameObject(BUTTER_OBJ, "Assets/Textures/Milk.png")
    this.gameObject.position.y = 0
    this.gameObject.initBuffers()

  },

  draw: function () {
    var bb = 1.2
    this.checkBox[0] = this.gameObject.position.x - bb
    this.checkBox[1] = this.gameObject.position.x + bb
    this.checkBox[2] = this.gameObject.position.z - bb * 0.8
    this.checkBox[3] = this.gameObject.position.z + bb * 0.8

    this.gameObject.draw()
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  }
}
