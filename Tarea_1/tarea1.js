let mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 5000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShaderSource =    
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
let fragmentShaderSource = 
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
    try 
    {
        gl = canvas.getContext("experimental-webgl");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;        
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

function createPyramid(gl, translation, rotationAxis) {
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [

        // Face
         0.0,  1.0,  0.0,
         0.0, -1.0,  1.0, 
        -1.0, -1.0,  0.1, 

        // Face
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.1, 
        -0.5, -1.0, -1.0, 

        // Face
         0.0,  1.0,  0.0,
         1.0, -1.0,  0.1,
         0.5, -1.0, -1.0,
        
        // Face
         0.0,  1.0,  0.0,
        -0.5, -1.0, -1.0,
         0.5, -1.0, -1.0,

        // Face
         0.0,  1.0,  0.0,
         0.0, -1.0,  1.0, // 1
         1.0, -1.0,  0.1,

        // Pentagon face
         0.0, -1.0,  1.0, // 1
        -1.0, -1.0,  0.1, // 2
         1.0, -1.0,  0.1, // 3
        -0.5, -1.0, -1.0, // 4
         0.5, -1.0, -1.0  // 5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [1.0, 0.0, 1.0, 1.0], // Front face
        [0.0, 1.0, 1.0, 1.0], // Front face
        [0.5, 0.8, 0.0, 1.0], // Front face
        [1.0, 0.5, 0.7, 1.0], // Front face

        [1.0, 0.5, 0.0, 1.0], // Front face
        [1.0, 0.5, 0.0, 1.0], // Front face
        [1.0, 0.5, 0.0, 1.0], // Front face

    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0, 1, 2,    // Front top face
        3, 4, 5,    // Back top face
        6, 7, 8,    // Right top face
        9, 10, 11,  // Left top face
        12, 13, 14, // Front bottom face

        15, 16, 18, // Back bottom face
        15, 17, 19, // Right bottom face
        15, 18, 19  // Left bottom face
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let pyramid = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:20, colorSize:4, nColors: 8, nIndices:24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        for (let i = 0; i < rotationAxis.length; i++) {
            mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis[i]);
        }
    };
    
    return pyramid;
}

function createOctahedron(gl, translation, rotationAxis) {
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
       // Front top face
        0.0,  1.0,  0.0, 
       -0.5,  0.0,  0.5,
        0.5,  0.0,  0.5,

       // Back top face
        0.0,  1.0,   0.0,
       -0.5,  0.0, -0.5,
        0.5,  0.0, -0.5,

        // Right top face
        0.0,  1.0,  0.0,
        0.5,  0.0, -0.5,
        0.5,  0.0,  0.5,
        
        // Left top face
         0.0,  1.0,  0.0,
        -0.5,  0.0, -0.5,
        -0.5,  0.0,  0.5,

        // Front bottom face
        0.0, -1.0,  0.0, 
       -0.5,  0.0,  0.5,
        0.5,  0.0,  0.5,

       // Back bottom face
        0.0, -1.0,  0.0,
       -0.5,  0.0, -0.5,
        0.5,  0.0, -0.5,

        // Right bottom face
        0.0, -1.0,  0.0,
        0.5,  0.0, -0.5,
        0.5,  0.0,  0.5,
        
        // Left bottom face
         0.0, -1.0,  0.0,
        -0.5,  0.0, -0.5,
        -0.5,  0.0,  0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [1.0, 1.0, 0.0, 1.0], // Front face
        [1.0, 0.0, 1.0, 1.0], // Front face
        [0.0, 1.0, 1.0, 1.0], // Front face
        [0.5, 0.8, 0.0, 1.0], // Front face

        [1.0, 0.5, 0.0, 1.0], // Front face
        [1.0, 0.3, 0.4, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [1.0, 1.0, 0.0, 1.0], // Front face
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0, 1, 2,    // Front top face
        3, 4, 5,    // Back top face
        6, 7, 8,    // Right top face
        9, 10, 11,  // Left top face
        12, 13, 14, // Front bottom face
        15, 16, 17, // Back bottom face
        18, 19, 20, // Right bottom face
        21, 22, 23  // Left bottom face
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let octahedron = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now(),
            speed: 0.01, direction: 1};

    mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, translation);

    octahedron.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        for (let i = 0; i < rotationAxis.length; i++) {
            mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis[i]);
        }
        
        let limit = 1.8;

        this.modelViewMatrix[13] += this.speed * this.direction;
        if ((this.modelViewMatrix[13] >= limit && this.direction > 0) || (this.modelViewMatrix[13] <= -1 * limit && this.direction < 0)) {
            this.direction *= -1;
        }
    };
    
    return octahedron;
}

function createDodecahedron(gl, translation, rotationAxis) {
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [

        // Front

        // Front face
         1.0,  1.0,  1.0,       // 0
         0.0,  0.618,  1.618,   // 1
         1.618,  0.0,  0.618,   // 2
         0.0, -0.618,  1.618,   // 3
         1.0, -1.0,  1.0,       // 4

        // Top front left face
        -0.618,  1.618,  0.0,   // 5
        -1.0,  1.0,  1.0,       // 6
         0.618,  1.618,  0.0,   // 7
         0.0,  0.618,  1.618,   // 1
         1.0,  1.0,  1.0,       // 0

        // Top front right face
         1.0,  1.0, -1.0,       // 8
         0.618,  1.618,  0.0,   // 7
         1.618,  0.0, -0.618,   // 9
         1.0,  1.0,  1.0,       // 0
         1.618,  0.0,  0.618,   // 2

        // Bottom front left face
        -1.0,  1.0,  1.0,       // 6
        -1.618,  0.0,  0.618,   // 14
         0.0,  0.618,  1.618,   // 1
        -1.0, -1.0,  1.0,       // 13
         0.0, -0.618,  1.618,   // 3

        // Bottom front right face
         1.618,  0.0,  0.618,   // 2
         1.0, -1.0,  1.0,       // 4
         1.618,  0.0, -0.618,   // 9
         0.618, -1.618, 0.0,    // 11
         1.0, -1.0, -1.0,       // 10

        // Bottom front face
         0.0, -0.618,  1.618,   // 3 
        -1.0, -1.0,  1.0,       // 13
         1.0, -1.0,  1.0,       // 4
        -0.618, -1.618, 0.0,    // 12
         0.618, -1.618, 0.0,    // 11

        // Back ----------------------

        // Back face
        -1.0,  1.0, -1.0,       // 15 
        -1.618,  0.0, -0.618,   // 16
         0.0,  0.618, -1.618,   // 17
        -1.0, -1.0, -1.0,       // 18
         0.0, -0.618, -1.618,   // 19

        // Top back left face
        -1.0,  1.0,  1.0,       // 6
        -1.618,  0.0,  0.618,   // 14
        -0.618,  1.618,  0.0,   // 5
        -1.618,  0.0, -0.618,   // 16
        -1.0,  1.0, -1.0,       // 15
        
        // Top back face 
         0.618,  1.618,  0.0,   // 7
        -0.618,  1.618,  0.0,   // 5
         1.0,  1.0, -1.0,       // 8
        -1.0,  1.0, -1.0,       // 15
         0.0,  0.618, -1.618,   // 17
        
        // Top back right face
         1.618,  0.0, -0.618,   // 9
         1.0,  1.0, -1.0,       // 8
         1.0, -1.0, -1.0,       // 10
         0.0,  0.618, -1.618,   // 17
         0.0, -0.618, -1.618,   // 19
         
         // Bottom back left face
         -1.618,  0.0, -0.618,   // 16
         -1.618,  0.0,  0.618,   // 14
         -1.0, -1.0, -1.0,       // 18
         -1.0, -1.0,  1.0,       // 13
         -0.618, -1.618, 0.0,    // 12


         // Bottom back right face
         0.0, -0.618, -1.618,   // 19
        -1.0, -1.0, -1.0,       // 18
         1.0, -1.0, -1.0,       // 10
        -0.618, -1.618, 0.0,    // 12
         0.618, -1.618, 0.0,    // 11
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face

        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face

        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face


        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face

        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face

        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face


        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face

        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face

        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face


        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face

        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face

        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
        [0.4, 1.0, 0.7, 1.0], // Front face
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        // Front --------

        // Front face
        0, 1, 3,        0, 3, 4,        0, 4, 2,

        // Top front left face
        5, 6, 8,        5, 8, 9,        5, 9, 7,
        
        // Top front right face
        10, 11, 13,     10, 13, 14,     10, 14, 12,

        // Bottom front left face
        15, 16, 18,     15, 18, 19,     15, 19, 17,

        // Bottom front right face
        20, 21, 23,     20, 23, 24,     20, 24, 22,
        
        // Bottom front face
        25, 26, 28,     25, 28, 29,     25, 29, 27,

        // Back --------
        
        // Back face
        30, 31, 33,     30, 33, 34,     30, 34, 32,

        // Top back left face
        35, 36, 38,     35, 38, 39,     35, 39, 37,

        // Top back right face
        40, 41, 43,     40, 43, 44,     40, 44, 42,
        
        // Bottom back left face
        45, 46, 48,     45, 48, 49,     45, 49, 47,

        // Bottom back right face
        50, 51, 53,     50, 53, 54,     50, 54, 52,

        // Bottom back face
        55, 56, 58,     55, 58, 59,     55, 59, 57,
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let nverts = verts.length / 3;
    let numColors = vertexColors.length / 4;
    let indexes = cubeIndices.length;
    console.log(nverts * 3);
    console.log(nverts);
    // console.log(numColors);
    // console.log(faceColors.length);

    let dodecahedron = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts: 220, colorSize:4, nColors: numColors, nIndices: indexes,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(dodecahedron.modelViewMatrix, dodecahedron.modelViewMatrix, translation);

    dodecahedron.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        for (let i = 0; i < rotationAxis.length; i++) {
            mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis[i]);
        }
    };
    
    return dodecahedron;
}

function createShader(gl, str, type)
{
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(i = 0; i< objs.length; i++)
    {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });

    draw(gl, objs);

    for(i = 0; i<objs.length; i++)
        objs[i].update();
}
