let canvas = null;
let context = null;
let color = null;

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
}

function update () {
    requestAnimationFrame(() => update());

    if (dibujando) {
        context.fillStyle = color;
        context.fillRect(pos.x, pos.y, 10, 10);
    }
}

function main() {
    dibujando = false;
    canvas = document.querySelector('#paintCanvas');
    context = canvas.getContext('2d');
    color = document.querySelector('.colorBtn').style.backgroundColor;
    eventListeners();
    update();
}