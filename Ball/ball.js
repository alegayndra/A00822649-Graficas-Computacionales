let ctx = null, canvas = null;
let updatePlayer1 = false, updatePlayer2 = false;
let direction1 = 0, direction2 = 0;

let gameState = 'paused';

const score = {
    left: 0,
    right: 0
}

document.addEventListener('keydown', (event) => {
    if (event.key == ' ' && gameState == 'paused') {
        gameState = 'restart';
    }
});

class Player {
    constructor(color, x, y, width, height, upkey, downkey) {
        this.color = color;
        
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.upkey = {
            value: upkey,
            pressed: false
        }
        this.downkey = {
            value: downkey,
            pressed: false
        }

        let val = 4;
        this.velocityY = val;

        this.direction = 0;
        this.updatePlayer = false;

        document.addEventListener('keydown', (event) => {

            switch(event.key) {
                case this.upkey.value:
                    this.direction = -1;
                    this.updatePlayer = true;
                    this.upkey.pressed = true;
                    break;
                case this.downkey.value:
                    this.direction = 1;
                    this.updatePlayer = true;
                    this.downkey.pressed = true;
                    break;
            }        
        });

        document.addEventListener('keyup', (event) => {
    
            switch(event.key) {
                case this.upkey.value:
                    this.upkey.pressed = false;
                    break;
                case this.downkey.value:
                    this.downkey.pressed = false;
                    break;
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
        let dir = ((Math.random() * 2 > 1) ? 1 : -1);
        this.velocityX = val * dir;
        this.velocityY = val;
    }

    draw() { 
        ctx.fillStyle = this.color;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    update(xLimit, yLimit, playerLeft, playerRight) {

        let boolPlayerLeft = (this.x - this.radius <= playerLeft.x + playerLeft.width && this.y >= playerLeft.y && this.y <= playerLeft.y + playerLeft.height);
        let boolPlayerRight = (this.x + this.radius >= playerRight.x && this.y >= playerRight.y && this.y <= playerRight.y + playerRight.height);

        let leftWall = (this.x - this.radius <= 0);
        let rightWall = (this.x + this.radius >= xLimit);

        let ceiling = (this.y - this.radius <= 0);
        let floor = (this.y + this.radius >= yLimit);
        
        let velocityXPositive = (this.velocityX > 0);
        let velocityXNegative = (this.velocityX < 0);
        let velocityYPositive = (this.velocityY > 0);
        let velocityYNegative = (this.velocityY < 0);
    
        if ((boolPlayerLeft && velocityXNegative) || (boolPlayerRight && velocityXPositive)) {
            this.velocityX *= -1;
        } else if (leftWall && velocityXNegative) {
            score.right++;
            gameState = 'paused';
            restart(this, [playerLeft, playerRight]);
            // console.log(score);
        } else if ( rightWall && velocityXPositive) {
            score.left++;
            gameState = 'paused';
            restart(this, [playerLeft, playerRight]);
            // console.log(score);
        }

        if ((ceiling && velocityYNegative) || (floor && velocityYPositive)) {
            this.velocityY *= -1;
        }

        // console.log('x an', this);
        this.x += this.velocityX;
        // console.log('x des', this);
        this.y += this.velocityY;
    }

}

function update(ball, players) {
    requestAnimationFrame(() => update(ball, players));

    if (gameState == 'restart') {
        restart(ball, players);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    players.forEach(player => {
        if (gameState == 'playing') {
            if (player.updatePlayer) {
                player.update(canvas.height, player.direction);
            }
    
            if (!(player.upkey.pressed || player.downkey.pressed)) {
                player.updatePlayer = false;
            }
        }
        player.draw();
    });

    if (gameState == 'playing') {
        ball.update(canvas.width, canvas.height, players[0], players[1]);
    }

    ball.draw();
}

function restart(ball, players) {

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = ball.velocityX * -1;

    players.forEach(player => {
        player.y = canvas.height * .30;
        player.direction = 0;
        player.upkey.pressed = false;
        player.downkey.pressed = false;
    });
    
    gameState = ((gameState == 'restart') ? 'playing' : 'paused');
}

function main () {
    canvas = document.querySelector('#ballCanvas');
    ctx = canvas.getContext('2d');

    let ball = new Sphere('white', canvas.width / 2, canvas.height / 2, 20);

    let player1 = new Player('white', 20, canvas.height * .30, 30, canvas.height * .40, 'w', 's');
    let player2 = new Player('white', canvas.width - 50, canvas.height * .30, 30, canvas.height * .40, 'ArrowUp', 'ArrowDown');
    update(ball, [player1, player2]);
}