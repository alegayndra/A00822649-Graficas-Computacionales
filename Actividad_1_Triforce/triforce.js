
/*
    Crea el eventListener del slider
*/
function sliderEvent() {
    document.getElementById("slider").oninput = function(event) {
        document.getElementById("sliderValue").innerHTML = "Value: " + event.target.value;
        dibujarTodos(event.target.value);
    };
}

/*
    Dibuja un triangulo equilatero dada una 'x', 'y' y un tamaño de los lados
    Entrada:
        - ctx:  Contexto del canvas
        - x:    Posicion en el eje x inicial
        - y:    Posicion en el eje y inicial
        - side: Tamaño de los lados del triangulo
*/
function dibujarTriangulo(ctx, x, y, side) {
    ctx.beginPath();
    ctx.moveTo(x, y); // se mueve a la posición inicial, que será el vertice izquierdo

    ctx.lineTo(x + side / 2, y - side); // vertice de arriba
    ctx.lineTo(x + side, y);            // vertice de la derecha
    ctx.lineTo(x, y);                   // vertice izquierdo, cierra el triangulo
    
    ctx.fill();
    ctx.stroke();
}

/*
    Funcion recursiva para dibujar todos los triangulos
    Entrada:
        - ctx:          Contexto del canvas
        - iteracion:    Número de divisiones que aun faltan por hacer
        - x:            Posicion en el eje x inicial
        - y:            Posicion en el eje y inicial
        - tamaño:       Tamaño de los lados del triangulo
*/
function dividir(ctx, iteracion, x, y, tamaño) {

    // checa si quedan divisiones por hacer
    // si quedan, divide el triangulo actual en tres
    // si no, dibuja el triangulo
    if (iteracion > 0) {
        dividir(ctx, iteracion - 1, x, y, tamaño / 2);                              // triangulo izquierdo
        dividir(ctx, iteracion - 1, x + tamaño / 2, y, tamaño / 2);                 // triangulo derecho
        dividir(ctx, iteracion - 1, x + tamaño / 4, y - tamaño / 2, tamaño / 2);    // triangulo superior
    } else {
        dibujarTriangulo(ctx, x, y, tamaño);
    }
}

/*
    Inicializa los valores necesarios y empieza la recursividad
    Entrada
        - cantDivisiones: Cantidad de pasos recursivos
*/
function dibujarTodos(cantDivisiones) {
    let canvas = document.getElementById('htmlCanvas')
    let canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // limpia el canvas

    // valores iniciales
    let size = 520;
    let x = 100;
    let y = 550;

    dividir(canvasCtx, cantDivisiones, x, y, size);
}

/*
    Función inicial que crea el event listener del slider y dibuja el triangulo inicial
*/
function main() {
    sliderEvent();
    dibujarTodos(0);
}