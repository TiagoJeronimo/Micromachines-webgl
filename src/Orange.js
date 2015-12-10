var Orange = function () {
  this.gameObject = null
  this.checkBox = [0, 0, 0, 0]
  this.positionX = 0
  this.velocity = 0
  this.rotationZ = 0
  this.delay = false
  this.speedTimer = 0
  this.speedInc = 0
}

Orange.prototype = {
  init: function () {
    this.positionX = 0
    var positionZ = Math.floor(Math.random() * 6)
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1
    this.gameObject.setPosition(this.positionX, 1.0, positionZ * plusOrMinus)
    this.velocity = this.randomVelocity()
    this.delay = false
  },

  create: function () {
    this.gameObject = new GameObject(ORANGE_OBJ, 'Assets/Textures/orange.png')
    this.gameObject.scale = {x: 1.2, y: 1.2, z: 1.2}
    this.gameObject.position.y = 1
    this.gameObject.initBuffers()
  },

  draw: function () {
    if (!this.delay) this.gameObject.draw()
  },

  update: function (dt) {
    // aumentar a velocidade depois de um certo tempo
    if (Date.now() > this.speedTimer + 20000) {
      this.speedTimer = Date.now()
      this.speedInc += 0.5
    }

    var bb = 0.5
    this.checkBox[0] = this.gameObject.position.x - bb
    this.checkBox[1] = this.gameObject.position.x + bb
    this.checkBox[2] = this.gameObject.position.z - bb
    this.checkBox[3] = this.gameObject.position.z + bb

    this.positionX = this.positionX + this.velocity * dt * this.speedInc
    this.rotationZ = this.rotationZ + (this.velocity * 100) * dt * this.speedInc// *100 to rotate slower
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
