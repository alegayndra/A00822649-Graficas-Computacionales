let ctx = null, canvas = null;
let updatePlayer1 = false, updatePlayer2 = false;
let direction1 = 0, direction2 = 0;
const pressed = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
}

const score = {
    left: 0,
    right: 0
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

        this.direction = 0;
        this.updatePlayer = false;

        document.addEventListener('keydown', (event) => {

            switch(event.key) {
                case this.upkey:
                    console.log('aiuda');
                    this.direction = -1;
                    this.updatePlayer = true;
                    pressed[this.upkey] = true;
                    break;
                case this.downkey:
                    this.direction = 1;
                    this.updatePlayer = true;
                    pressed[this.downkey] = true;
                    break;
            }        
        });

        document.addEventListener('keyup', (event) => {
    
            if (event.key == this.upkey || event.key == this.downkey) {
                pressed[event.key] = false;
            }
        
        }); 
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

function update(ball, players) {
    requestAnimationFrame(() => update(ball, players));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    players.forEach(player => {
        if (player.updatePlayer) {
            player.update(canvas.height, player.direction);
        }

        if (!(pressed[player.upkey] || pressed[player.downkey])) {
            player.updatePlayer = false;
        }

        player.draw();
    });

    ball.update(canvas.width, canvas.height, players[0], players[1]);
    ball.draw();
}

function main () {
    canvas = document.querySelector('#ballCanvas');
    ctx = canvas.getContext('2d');

    let ball = new Sphere('white', canvas.width / 2, canvas.height / 2, 20);

    let player1 = new Player('white', 20, canvas.height * .30, 30, canvas.height * .40, 'w', 's');
    let player2 = new Player('white', canvas.width - 50, canvas.height * .30, 30, canvas.height * .40, 'ArrowUp', 'ArrowDown');

    update(ball, [player1, player2]);
}