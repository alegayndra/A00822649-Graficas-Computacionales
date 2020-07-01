let ctx = null, canvas = null;
let updatePlayer1 = false, updatePlayer2 = false;
let direction1 = 0, direction2 = 0;
let pressed = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
}

class Player {
    constructor(color, x, y, width, height, upkey, downkey) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.upkey = upkey;
        this.downkey = downkey;
        let val = 4;
        this.velocityY = val;
    }

    draw() { 
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(yLimit, direction) {
        if ((this.y + this.height < yLimit && direction > 0) || (this.y > 0 && direction < 0)) {
            this.y += this.velocityY * direction;
        }
    }
}

document.addEventListener('keydown', (event) => {

    switch(event.key) {
        case 'w':
            direction1 = -1;
            updatePlayer1 = true;
            break;
        case 's':
            direction1 = 1;
            updatePlayer1 = true;
            break;
        case 'ArrowUp':
            direction2 = -1;
            updatePlayer2 = true;
            break;
        case 'ArrowDown':
            direction2 = 1;
            updatePlayer2 = true;
            break;
    }

    pressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    
    if (event.key == 'w' || event.key == 's' || event.key == 'ArrowUp' || event.key == 'ArrowDown') {
        pressed[event.key] = false;
    }

}); 

class Sphere {
    constructor(color, x, y, radius) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = radius
        let val = 8;
        this.velocityX = val;
        this.velocityY = val;
    }

    draw() { 
        ctx.fillStyle = this.color;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    update(xLimit, yLimit, player1, player2) {

        let boolPlayer1 = (this.x - this.radius <= player1.x + player1.width && this.y >= player1.y && this.y <= player1.y + player1.height);
        let boolPlayer2 = (this.x + this.radius >= player2.x && this.y >= player2.y && this.y <= player2.y + player2.height);

        let leftWall = (this.x - this.radius <= 0);
        let rightWall = (this.x + this.radius >= xLimit);

        let ceiling = (this.y - this.radius <= 0);
        let floor = (this.y + this.radius >= yLimit);
        
        let velocityXPositive = (this.velocityX > 0);
        let velocityXNegative = (this.velocityX < 0);
        let velocityYPositive = (this.velocityY > 0);
        let velocityYNegative = (this.velocityY < 0);

        if (((boolPlayer1 || leftWall) && velocityXNegative) || ((boolPlayer2 || rightWall) && velocityXPositive)) {
            this.velocityX *= -1;
        }

        if ((ceiling && velocityYNegative) || (floor && velocityYPositive)) {
            this.velocityY *= -1;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;
    }

}

function update(ball, player1, player2) {
    requestAnimationFrame(() => update(ball, player1, player2));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (updatePlayer1) {
        player1.update(canvas.height, direction1);
    }

    if (updatePlayer2) {
        player2.update(canvas.height, direction2);
    }

    if (!(pressed['w'] || pressed['s'])) {
        updatePlayer1 = false;
    } 

    if (!(pressed['ArrowUp'] || pressed['ArrowDown'])) {
        updatePlayer2 = false;
    }

    player1.draw();
    player2.draw();

    ball.update(canvas.width, canvas.height, player1, player2);
    ball.draw();
}

function main () {
    canvas = document.querySelector('#ballCanvas');
    ctx = canvas.getContext('2d');

    let ball = new Sphere('white', canvas.width / 2, canvas.height / 2, 20);
    let player1 = new Player('white', 20, canvas.height * .30, 30, canvas.height * .40);
    let player2 = new Player('white', canvas.width - 50, canvas.height * .30, 30, canvas.height * .40);
    

    update(ball, player1, player2);
}