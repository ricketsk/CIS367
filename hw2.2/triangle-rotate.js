var gl;
var points;

var theta = 0.0;
var thetaLoc;

window.onload = function init() {
    // Setup our canvas and WebGL
    var canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert('WebGL unavailable'); }

    // Triangle vertices
    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    // configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // load and initialize shaders
    var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    // load data into GPU
    var bufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    // set position and render
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    render();
};

function render() {
    setTimeout(function () {
        requestAnimFrame(render); // set animation

        gl.clear(gl.COLOR_BUFFER_BIT); // clear viewport
        theta += 0.1; // update pos
        gl.uniform1f(thetaLoc, theta); // update theta
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw triangle strip
    }, 100); // every 100ms
} 
