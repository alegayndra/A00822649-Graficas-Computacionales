
let canvas = document.querySelector('#paintCanvas');
let context = canvas.getContext('2d');
let color = 'green';

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
}

function update () {
    requestAnimationFrame(() => update());
}

function main() {
    eventListeners();


}