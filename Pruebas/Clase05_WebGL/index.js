let gl = null;
let c_width = 0;
let c_height = 0;

window.onkeydown = checkKey;

function checkKey(ev) {
    switch(ev.keyCode) {
        case 49:
            gl.clearColor(0.3, 0.7, 0.2, 1.0);
            clear(gl);
            break;
        case 50:
            gl.clearColor(0.3, 0.2, 0.7, 1.0);
            clear(gl);
            break;
        case 51:
            let color = gl.getParameter(gl.COLOR_CLEAR_VALUE);
            console.log(color);
            console.log('clearColor = (' +
                    (Math.round(color[0] * 10) / 10) + ',' +
                    (Math.round(color[1] * 10) / 10) + ',' +
                    (Math.round(color[2] * 10) / 10) + ')');
            window.focus();
            break;
    }
}

function getGLContext() {
    let canvas = document.querySelector('#WebGLCanvas');
    if (canvas == null) {
        alert ('Canvas not found');
    } else {
        // c_width = canvas.width;
        // c_height = canvas.height;
        let names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    
        for (let i = 0; i < names.length; i++) {
            try {
                gl = canvas.getContext(names[i]);
            }
            catch(e) {}
    
            if (gl) {
                break;
            }
        }
    
        if (gl == null) {
            alert ('WebGL not available');
        } else {
            console.log(gl);
        }
    }
}

function clear(ctx) {
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    ctx.viewport(0, 0, c_width, c_height);
}