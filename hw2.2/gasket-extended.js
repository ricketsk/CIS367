"use strict";

var gl;
var points;

var x = 0.0;
var y = 0.0;
var xLoc, yLoc;
var xDir = 1.0;
var yDir = 1.0;

var NumPoints = 15000;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
   }

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2(1, 1),
        vec2(0, -1),
        vec2(-1, 1)
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    // And, add our initial point into our array of points

    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        //p = scale(getRandomArbitrary(.3,.7), p );
        p = scale( 0.5, p );
        points.push( p );
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 0.0 );
    //gl.clearColor( 255, 0, 255, 255);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    xLoc = gl.getUniformLocation(program, "x");
    yLoc = gl.getUniformLocation(program, "y");

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    setTimeout(function () {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        x += 0.05 * xDir;
        y += 0.1 * yDir;

        if (y > 0.9) { // top hit -- reverse y but keep x
            y = 0.9;
            yDir *= -1.0;
        }
        if (x > 0.9) { // right hit -- reverse x but keep y
            x = 0.9;
            xDir *= -1.0;
        }
        if (y < -0.9) { // bottom hit -- reverse y but keep x
            y = -0.9;
            yDir *= -1.0;
        }
        if (x < -0.9) { // left hit -- reverse x but keep y
            x = -0.9;
            xDir *= -1.0;
        }
        gl.uniform1f(xLoc, x);
        gl.uniform1f(yLoc, y);

        window.requestAnimFrame(render);
    }, 100); // every 100ms
}
