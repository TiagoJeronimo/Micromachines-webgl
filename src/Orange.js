var Orange = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
  this.positionX = 0
  this.velocity = 0
  this.rotationZ = 0
}

Orange.prototype = {
  init: function () {
    this.positionX = 0
    var positionZ = Math.floor(Math.random() * 6)
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1
    this.gameObject.setPosition(this.positionX, 1.0, positionZ * plusOrMinus)
    this.velocity = this.randomVelocity()
    // setDelayDraw(false);
  },

  create: function () {
    this.gameObject = new GameObject(CUBE_OBJ, 'Assets/Textures/glass.gif')
    this.gameObject.scale = {x: 0.7, y: 0.7, z: 0.7}
    this.gameObject.position.y = 1
    this.gameObject.initBuffers()
  },

  draw: function () {
    this.gameObject.draw()
  },

  update: function (dt) {
    var bb = 0.5
    this.checkBox[0] = this.gameObject.position.x - bb
    this.checkBox[1] = this.gameObject.position.x + bb
    this.checkBox[2] = this.gameObject.position.z - bb
    this.checkBox[3] = this.gameObject.position.z + bb

    this.positionX = this.positionX + this.velocity * dt
    this.rotationZ = this.rotationZ + (this.velocity * 100) * dt // *100 to rotate slower
    this.gameObject.position.x = this.positionX
    this.gameObject.rotation.z = -this.rotationZ
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  },

  randomVelocity: function () {
    var auxV = Math.random() * 0.005
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1
    if (auxV < 0.0001) {
      this.randomVelocity()
    }
    else return auxV * plusOrMinus
  }
}
