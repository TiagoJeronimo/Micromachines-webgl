var Butter = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
}

Butter.prototype = {
  create: function () {

    this.gameObject = new GameObject(CUBE_OBJ, "Assets/Textures/butter.png")
    this.gameObject.scale = {x: 1, y: 0.7, z: 0.7}
    this.gameObject.position.y = 1
    this.gameObject.initBuffers()

  },

  draw: function () {
    var bb = 1
    this.checkBox[0] = this.gameObject.position.x - bb
    this.checkBox[1] = this.gameObject.position.x + bb
    this.checkBox[2] = this.gameObject.position.z - bb*0.7
    this.checkBox[3] = this.gameObject.position.z + bb*0.7

    this.gameObject.draw()
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  }
}
