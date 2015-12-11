var Cake = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
}

Cake.prototype = {
  create: function () {
    this.gameObject = new GameObject(CAKE_OBJ, "Assets/Textures/Cake.png")
    this.initBuffers()
    this.setPosition(7, 0.1, -7)
    this.gameObject.rotation = {x: 0, y:30, z:0}
  },

  draw: function () {
    var bb = 1
    this.checkBox[0] = this.gameObject.position.x - bb * 0.8
    this.checkBox[1] = this.gameObject.position.x + bb * 0.8
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
