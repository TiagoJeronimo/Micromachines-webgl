var Road = function () {
  this.goUp = null // Game Object Up
  this.goBottom = null
  this.goLeft = null
  this.goRight = null
}

Road.prototype = {
  create: function () {
    this.goUp = new GameObject(CUBE_OBJ, "Assets/Textures/road.png")
    this.goUp.setPosition(0, 0.02, 5)
    this.goUp.rotation.y = 90
    this.goUp.setScale(4, 0.01, 1)

    this.goBottom = new GameObject(CUBE_OBJ, "Assets/Textures/road.png")
    this.goBottom.setPosition(0, 0.02, -5)
    this.goBottom.rotation.y = 90
    this.goBottom.setScale(4, 0.01, 1)

    this.goLeft = new GameObject(CUBE_OBJ, "Assets/Textures/road.png")
    this.goLeft.setPosition(-5, 0.02, 0)
    this.goLeft.setScale(1, 0.01, 6)

    this.goRight = new GameObject(CUBE_OBJ, "Assets/Textures/road.png")
    this.goRight.setPosition(5, 0.02, 0)
    this.goRight.setScale(1, 0.01, 6)

    this.goUp.initBuffers()
    this.goBottom.initBuffers()
    this.goLeft.initBuffers()
    this.goRight.initBuffers()
  },
  draw: function () {
    this.goUp.draw()
    this.goBottom.draw()
    this.goLeft.draw()
    this.goRight.draw()

  }
}
