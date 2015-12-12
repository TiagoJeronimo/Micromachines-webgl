var IceCream = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
}

IceCream.prototype = {
  create: function () {
    this.gameObject = new GameObject(ICECREAM_OBJ, "Assets/Textures/icecream.png")
    this.initBuffers()
    this.setPosition(-3, 0.1, 3)
  },

  draw: function () {
    var bb = 0.6
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
