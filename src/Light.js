var Light = function (index) {
  this.enabled = true
  this.local = true
  this.position = [0, 1, 0, 0]
  this.index = index

  //spotlights 
  this.spot = false
  this.cutoff = 0.5
  this.exponent = 0.5
  this.direction = [0, 1, 0, 0]
}

Light.prototype = {
  create: function () {

  },

  update: function () {

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
      spotDir_uniformId[this.index] = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].coneDirection");
      spotCutOff_uniformId[this.index] = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].spotCutOff");
      spotExp_uniformId[this.index] = gl.getUniformLocation(shaderProgram, "Lights[" + this.index + "].spotExponent");

      var auxDir = []
      multMatrixPoint(view, this.direction, auxDir);

      gl.uniform1f(spotCutOff_uniformId[this.index], this.cutoff);
      gl.uniform1f(spotExp_uniformId[this.index], this.exponent);
      gl.uniform3fv(spotDir_uniformId[this.index], auxDir);
    }
  }
}