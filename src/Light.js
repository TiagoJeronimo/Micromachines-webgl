var Light = function (index) {
  this.enabled = true
  this.local = true
  this.position = [0, 1, 0, 0]
  this.index = index

  //spotlights 
  this.spot = false
  this.cutoff = 2
  this.exponent = 0.2
  this.direction = [0, 1, 0, 0]
}

Light.prototype = {
  update: function () {
    this.direction = [car.direction[0], -1, car.direction[2], 0]
    this.position = [car.position.x, 1, car.position.z, 1]
  },

  draw: function () {
    var uLocal = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].isLocal")
    var uEnabled = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].isEnabled")
    var uSpot = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].isSpot")
    var uPos = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].l_pos")

    var aux = []
    multMatrixPoint(view, this.position, aux);

    gl.uniform1i(uLocal, this.local)
    gl.uniform1i(uEnabled, this.enabled)
    gl.uniform1i(uSpot, this.spot)
    gl.uniform4fv(uPos, aux)

    if (this.spot) {
      var dir = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].coneDirection");
      var cutoff = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].spotCutOff");
      var exp = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].spotExponent");

      var auxDir = []
      multMatrixPoint(view, this.direction, auxDir);
      gl.uniform1f(cutoff, this.cutoff);
      gl.uniform1f(exp, this.exponent);
      gl.uniform3fv(dir, [auxDir[0], auxDir[1], auxDir[2]]);
    }
  }
}