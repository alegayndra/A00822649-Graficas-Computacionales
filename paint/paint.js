let canvas = null;
let context = null;
let color = null;
let tam = 10;
let grosor = 0;

let dibujando = false;
let pos = {
    x: 0,
    y: 0
}

function eventListeners() {
    let colorBtns = document.querySelectorAll('.colorBtn');

    for (let i = 0; i < colorBtns.length; i++) {
        // console.log(colorBtns[i]);

        colorBtns[i].addEventListener('click', (event) => {
            event.preventDefault();

            for (let j = 0; j < colorBtns.length; j++) {
                colorBtns[j].style.border = '0px black solid'
            }

            event.target.style.border = '3px black solid';
            color = event.target.style.backgroundColor;
        });
    }

    canvas.addEventListener('mousedown', (event => {
        dibujando = true;
    }));

    document.addEventListener('mouseup', (event) => {
        dibujando = false;
    });

    canvas.addEventListener('mousemove', (event) => {
        pos.x = event.offsetX;
        pos.y = event.offsetY;
    });

    document.querySelector("#slider").oninput = function(event) {
        grosor = event.target.value;
        document.getElementById("sliderValue").innerHTML = "Value: " + event.target.value;
    };

    document.querySelector('#clearCanvas').addEventListener('click', (event) => {
        event.preventDefault();

        context.clearRect(0, 0, canvas.width, canvas.height);
    });
}

function update () {
    requestAnimationFrame(() => update());

    if (dibujando) {
        context.fillStyle = color;
        let size = tam * (parseInt(grosor) + 1);
        context.fillRect(pos.x - (size / 2), pos.y - (size / 2), size, size);
    }
}

function main() {
    dibujando = false;
    canvas = document.querySelector('#paintCanvas');
    context = canvas.getContext('2d');
    color = document.querySelector('.colorBtn').style.backgroundColor;
    context.imageSmoothingEnabled = true;
    eventListeners();
    update();
}