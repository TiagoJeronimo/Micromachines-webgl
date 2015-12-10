var Butter = function () {
  this.gameObject = null
}

Butter.prototype = {
  create: function () {

    this.gameObject = new GameObject(CUBE_OBJ, "Assets/Textures/glass.gif")
    this.gameObject.scale = {x: 0.7, y: 0.7, z: 0.7}
    this.gameObject.position.y = 1
    this.gameObject.initBuffers()

  },

  draw: function () {
    this.gameObject.draw()
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  }
}
