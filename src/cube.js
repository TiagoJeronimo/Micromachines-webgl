function initCubeBuffers () {
	cubeVertexPositionBuffer = cubePositionBuffer () // positionBuffer
    cubeVertexNormalBuffer = cubeNormalBuffer () // normalsBuffer
    cubeVertexTextureCoordBuffer = cubeTextureCoordBuffer () //textureCoordBuffer
    cubeVertexIndexBuffer = cubeVertexIndexBuffer () //vertex indexBuffer
}	

function drawCube () {
    mvPushMatrix()

    mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0])
    mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0])
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0])

 	cubeBindBuffers ()

    mvPopMatrix()
}

function cubeBindBuffers () {
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer)
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, glassTexture)
    gl.uniform1i(shaderProgram.samplerUniform, 0)

    gl.disable(gl.DEPTH_TEST)
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer)
    setMatrixUniforms()
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)

    gl.enable(gl.DEPTH_TEST)
}