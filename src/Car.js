var Car = function () {
  this.acceleration = 0
  this.speed = 0
  this.angle = 270
  this.direction = [-1, 0, 0]
  this.gameObject = null
  this.stopping = false
  this.maxSpeed = 0.035
  this.turning = 0
  this.checkBox = [0, 0, 0, 0]
  this.position = {}
  this.rotation = 0.1

  this.targetSpeed = 0
}

Car.prototype = {
  create: function () {
    this.gameObject = new GameObject(CAR_OBJ, "Assets/Textures/FREE-CAR-Texture.png")
    this.gameObject.initBuffers()
    this.gameObject.setScale(0.5, 0.5, 0.5)
  },

  draw: function () {
    this.gameObject.draw()
  },

  update: function (dt) {
    var oldSpeed = this.speed

    if (this.speed > this.targetSpeed) this.acceleration = -0.00005
    else if (this.speed < this.targetSpeed) this.acceleration = 0.00005
    else this.acceleration = 0

    this.speed += this.acceleration * dt
    this.speed = Math.round(this.speed * 10000) / 10000

    /*var stop = (oldSpeed / Math.abs(oldSpeed)) != (this.speed / Math.abs(this.speed))

    if (this.stopping && stop) {
      this.acceleration = 0;
    }*/
    
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed
    else if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed

    this.gameObject.position.x = this.gameObject.position.x + this.direction[0] * this.speed
    this.gameObject.position.z = this.gameObject.position.z + this.direction[2] * this.speed
    this.position = this.gameObject.position

    //angle stuff
    this.gameObject.rotation.y = this.angle
    this.angle += this.turning * this.rotation * dt
    if (this.angle > 360) this.angle = 0
    else if (this.angle < 0) this.angle = 360
    var da = this.angle * 3.14 / 180
    var dx = 3 * Math.sin(da)
    var dz = 3 * Math.cos(da)
    vec3.set(this.direction, dx, 0, dz)

    var dir = 1
    if (this.speed < 0) {
      dir = -1
    }
    dx /= 15 * dir
    dz /= 15 * dir

    var bb = 0.1 // bounding box half-width and half-height
    this.checkBox[0] = this.gameObject.position.x + dx - bb
    this.checkBox[1] = this.gameObject.position.x + dx + bb
    this.checkBox[2] = this.gameObject.position.z + dz - bb
    this.checkBox[3] = this.gameObject.position.z + dz + bb
  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  },

  forward: function () {
    this.targetSpeed = this.maxSpeed
    this.stoppiong = false
  },

  back: function () {
    this.targetSpeed = -this.maxSpeed
    this.stopping = false
  },

  stopForward: function () {
    this.targetSpeed = 0
    this.stopping = true
  },

  stopBack: function () {
    this.targetSpeed = 0
    this.stopping = true
  },

  left: function () {
    this.turning = 1
  },

  right: function () {
    this.turning = -1
  },

  stopLeft: function () {
    if (this.turning === 1) this.turning = 0
  },

  stopRight: function () {
    if (this.turning === -1) this.turning = 0
  },

  kill: function () {
    document.getElementById("score").textContent++
    this.gameObject.setPosition(0.0, 0.45, 7)
    this.acceleration = 0
    this.speed = 0
    this.targetSpeed = 0
    this.angle = 270
  }
}