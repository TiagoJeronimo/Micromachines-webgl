var Particles = function () {
  this.maxN = 20
  this.particula = []
  this.position = {x: 0, y: 0, z: 0}
}

Particles.prototype = {
  create: function () {
    var v, theta, phi
    var i

    gl.disable(gl.DEPTH_TEST);
    for (i = 0; i < this.maxN; i++)
    {
      v = 0.4*Math.random() + 0.2
      phi = Math.random()*3.14
      theta = 2.0*Math.random()*3.14

      this.particula[i] = {}

      this.particula[i].gameObject = new GameObject(QUAD_OBJ, "Assets/Textures/particle.png")
      this.particula[i].gameObject.initBuffers()
      this.particula[i].gameObject.setScale(-0.2, 0.2, -0.2)

      this.particula[i].x = this.position.x
      this.particula[i].y = this.position.y
      this.particula[i].z = this.position.z
      this.particula[i].vx = v * Math.cos(theta) * Math.sin(phi)
      this.particula[i].vy = v * Math.cos(phi)
      this.particula[i].vz = v * Math.sin(theta) * Math.sin(phi)
      this.particula[i].ax = 0.05 /* simular um pouco de vento */
      this.particula[i].ay = -0.1 /* simular a aceleração da gravidade */
      this.particula[i].az = 0.0

      /* tom amarelado que vai ser multiplicado pela textura que varia entre branco e preto */
      this.particula[i].r = 0.882
      this.particula[i].g = 0.552
      this.particula[i].b = 0.211

      this.particula[i].life = 1.0   /* vida inicial */
      this.particula[i].fade = 0.005     /* step de decréscimo da vida para cada iteração */
    }
    gl.enable(gl.DEPTH_TEST);
  },

  setPosition: function (x, y, z) {
    this.position = {x: x, y: y, z: z}
  },

  draw: function () {
    if (this.particula[0]) {
      for (i = 0; i < this.maxN; i++) {
        this.particula[i].gameObject.draw()

        if (activeCamera == 2) {
            this.particula[i].gameObject.rotation.y = car.angle
        } else {
            this.particula[i].gameObject.rotation.y = 0
        }
        
      }
    }

  },

  update: function () {
    if (this.particula[0]) {
      var i;
      var h;

      /* Método de Euler de integração de eq. diferenciais ordinárias
      h representa o step de tempo; dv/dt = a; dx/dt = v; e conhecem-se os valores iniciais de x e v */

      h = 0.125;
      for (i = 0; i < this.maxN; i++) {
        var x = this.particula[i].x += (h*this.particula[i].vx)
        var y = this.particula[i].y += (h*this.particula[i].vy)
        var z = this.particula[i].z += (h*this.particula[i].vz)
        this.particula[i].vx += (h*this.particula[i].ax)
        this.particula[i].vy += (h*this.particula[i].ay)
        this.particula[i].vz += (h*this.particula[i].az)
        this.particula[i].life -= this.particula[i].fade

        this.particula[i].gameObject.setPosition(x, y, z)
      }
    }
  }
}