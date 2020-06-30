
function sliderEvent() {
    document.getElementById("slider").oninput = function(event) {
        document.getElementById("sliderValue").innerHTML = "Value: " + event.target.value;
        dibujarTodos(event.target.value);
    };
}

// class Triangulo {
//     constructor(x, y, length) {
//         this.posX = x;
//         this.posY = y;
//         this.sideLenght = length;
//     }

//     dibujarTriangulo(ctx, x, y, side) {
//         ctx.beginPath();
//         ctx.moveTo(x, y);

//         ctx.lineTo(x + side / 2, y - side);
//         ctx.lineTo(x + side, y);
//         ctx.lineTo(x, y);
        
//         ctx.fill();
//         ctx.stroke();
//     }
// }

function dibujarTriangulo(ctx, x, y, side) {
    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.lineTo(x + side / 2, y - side);
    ctx.lineTo(x + side, y);
    ctx.lineTo(x, y);
    
    ctx.fill();
    ctx.stroke();
}

function dividir(ctx, iteracion, x, y, tamaño) {

    if (iteracion > 0) {
        dividir(ctx, iteracion - 1, x, y, tamaño / 2);
        dividir(ctx, iteracion - 1, x + tamaño / 2, y, tamaño / 2);
        dividir(ctx, iteracion - 1, x + tamaño / 4, y - tamaño / 2, tamaño / 2);
    } else {
        dibujarTriangulo(ctx, x, y, tamaño);
    }
}

function dibujarTodos(cantDivisiones) {
    let canvas = document.getElementById('htmlCanvas')
    let canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    let size = 520;
    let x = 100;
    let y = 550;

    dividir(canvasCtx, cantDivisiones, x, y, size);
}

function main() {
    sliderEvent();
    dibujarTodos(0);
}