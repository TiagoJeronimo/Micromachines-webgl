function initPyramidBuffers () {
    pyramidVertexPositionBuffer = pyramidPositionBuffer () //positionBuffer
    pyramidVertexColorBuffer = pyramidColorBuffer () //colorBuffer
}

function drawPyramid () {
    mvPushMatrix()

    mat4.rotate(mvMatrix, degToRad(xRot), [0, 1, 0])

    pyramidBindBuffers ()

    mvPopMatrix();
}

function pyramidBindBuffers () {
	gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0)

    setMatrixUniforms()
    gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems)
}