var Flare = function () {
  this.flares = []
  this.sunPos = {x: 0, y: 0}
}

Flare.prototype = {
  create: function () {

    this.flares[0] = {}
    this.flares[0].obj = new GameObject(QUAD_OBJ, "Assets/Textures/flares/flare1.png")
    this.flares[0].obj.initBuffers()
    this.flares[0].distance = 0
    this.flares[0].size = 5
    this.flares[0].scale = 1
    this.flares[0].alpha = 1
    this.flares[0].obj.rotation.x = 90

    this.flares[1] = {}
    this.flares[1].obj = new GameObject(QUAD_OBJ, "Assets/Textures/flares/flare2.png")
    this.flares[1].obj.initBuffers()
    this.flares[1].distance = 0.4
    this.flares[1].size = 5
    this.flares[1].scale = 0.5
    this.flares[1].alpha = 1
    this.flares[1].obj.rotation.x = 90

    this.flares[2] = {}
    this.flares[2].obj = new GameObject(QUAD_OBJ, "Assets/Textures/flares/flare3.png")
    this.flares[2].obj.initBuffers()
    this.flares[2].distance = 0.6
    this.flares[2].size = 5
    this.flares[2].scale = 2
    this.flares[2].alpha = 1
    this.flares[2].obj.rotation.x = 90

    this.flares[3] = {}
    this.flares[3].obj = new GameObject(QUAD_OBJ, "Assets/Textures/flares/flare4.png")
    this.flares[3].obj.initBuffers()
    this.flares[3].distance = 0.8
    this.flares[3].size = 5
    this.flares[3].scale = 5
    this.flares[3].alpha = 1
    this.flares[3].obj.rotation.x = 90

    this.flares[4] = {}
    this.flares[4].obj = new GameObject(QUAD_OBJ, "Assets/Textures/flares/flare5.png")
    this.flares[4].obj.initBuffers()
    this.flares[4].distance = 1
    this.flares[4].size = 5
    this.flares[4].scale = 1.5
    this.flares[4].alpha = 1
    this.flares[4].obj.rotation.x = 90

    this.scale = 1
    this.maxsize = 20

  },

  draw: function () {
    var lx = this.sunPos.x
    var ly = this.sunPos.y
    var cx = 1
    var cy = 1
    var maxflaredist = 0
    var lcx = (lx - cx)
    var lcy = (ly - cy)
    var flaredist = Math.sqrt(lcy*lcy + lcx*lcx)
    var distancescale = 5/flaredist

    var dx = cx + (cx - lx)
    var dy = cy + (cy - ly)

    //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.disable(gl.DEPTH_TEST)
    gl.uniform1i(shaderProgram.useLightingUniform, false)

    for (var i = 0; i < this.flares.length; i++) {
      var element = this.flares[i]

      var px = (1 - element.distance)*lx + element.distance*dx
      var py = (1 - element.distance)*ly + element.distance*dy
      var width = element.size * distancescale * this.scale
      if (width > this.maxsize) width = this.maxsize
      var alpha = element.alpha * distancescale
      if (element.distance === 0) {
        if (!fog) gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        width = 10
        alpha = 1.0
      }
      var height = width
      if (stereoActive) height = width/2
      gl.uniform1f(shaderProgram.alphaUniform, alpha)

      element.obj.setScale(width, 1, height)
      element.obj.setPosition(px, 10, py)
      element.obj.draw()
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    }
    gl.uniform1f(shaderProgram.alphaUniform, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.uniform1i(shaderProgram.useLightingUniform, lighting)


  },

  setPosition: function (x, y, z) {
    this.gameObject.setPosition(x, y, z)
  }
}