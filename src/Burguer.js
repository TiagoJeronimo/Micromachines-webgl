var Burguer = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
}

Burguer.prototype = {
  create: function () {
    this.gameObject = new GameObject(BURGUER_OBJ, "Assets/Textures/Hambuger.png")
    this.initBuffers()
    this.setPosition(-7, 0.1, 7)
    this.gameObject.scale = {x: 5, y:5, z:5}
  },

  draw: function () {
    var bb = 1
    this.checkBox[0] = this.gameObject.position.x - bb
    this.checkBox[1] = this.gameObject.position.x + bb
    this.checkBox[2] = this.gameObject.position.z - bb * 0.8
    this.checkBox[3] = this.gameObject.position.z + bb * 0.8

    this.gameObject.draw()
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  },

  initBuffers: function () {
    this.gameObject.initBuffers()
  }
}
