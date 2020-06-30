
function sliderEvent() {
    document.getElementById("slider").oninput = function(event) {
        document.getElementById("sliderValue").innerHTML = "Value: " + event.target.value;
        drawAll(event.target.value);
    };
}

function drawTriangle(ctx, x, y, side) {
    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.lineTo(x + side / 2, y - side);
    ctx.lineTo(x + side, y);
    ctx.lineTo(x, y);
    
    ctx.fill();
    ctx.stroke();
}

function drawAll(cantDivisiones) {
    let canvas = document.getElementById('htmlCanvas')
    let canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    let size = 520;


    
    for (let i = 0; i < cantDivisiones; i++) {
        drawTriangle(canvasCtx, 100, 550 - i * 30, 520);
    }
}


function main() {
    sliderEvent();
    drawAll(0);
}