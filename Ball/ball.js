let ctx = null, canvas = null;
let updatePlayer1 = false, updatePlayer2 = false;
let direction1 = 0, direction2 = 0;

let gameState = 'paused';
let start = true;

const score = {
    left: 0,
    right: 0,
    scored: false,
    text: ''
}

let num = 0;

document.addEventListener('keydown', (event) => {
    if (event.key == ' ' && gameState == 'paused') {
        event.preventDefault();
        gameState = 'restart';
        score.scored = false;
        start = false;
    }
});

class Player {
    constructor(color, x, y, width, height, speed, upkey, downkey) {
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

        this.velocityY = speed;

        this.direction = 0;
        this.updatePlayer = false;

        document.addEventListener('keydown', (event) => {

            switch(event.key) {
                case this.upkey.value:
                    event.preventDefault();
                    this.direction = -1;
                    this.updatePlayer = true;
                    this.upkey.pressed = true;
                    break;
                case this.downkey.value:
                    event.preventDefault();
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
    constructor(color, x, y, radius, speed) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = radius;
        let dir = ((Math.random() * 2 > 1) ? 1 : -1);
        this.velocityX = speed * dir;
        this.velocityY = speed;
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
            score.text = 'Player 2 scored!';
            score.scored = true;
            gameState = 'paused';
            restart(this, [playerLeft, playerRight]);
        } else if ( rightWall && velocityXPositive) {
            score.left++;
            score.text = 'Player 1 scored!';
            score.scored = true;
            gameState = 'paused';
            restart(this, [playerLeft, playerRight]);
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

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    if (gameState == 'paused' && score.scored) {
        ctx.textAlign = "center";
        ctx.fillText(score.text, canvas.width/2, canvas.height * .35 );
    }

    if (start) {
        ctx.textAlign = "center";
        ctx.font = "60px Arial";
        ctx.fillText('Pong', canvas.width/2, canvas.height * .35 );
        ctx.font = "30px Arial";
        ctx.fillText('Presiona espacio para empezar', canvas.width/2, canvas.height * .65 );
    }

    ctx.textAlign = "right";
    ctx.fillText(score.left, canvas.width/2 - 10, 50);

    // ctx.font = "30px Comic Sans MS";
    ctx.textAlign = "left";
    ctx.fillText(score.right, canvas.width/2 + 10, 50);
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

    let ball = new Sphere('white', canvas.width / 2, canvas.height / 2, 20, 10);

    let marginBarras = 20;
    let porcentajeAlto = .38;
    let widthBarra = 30;
    let speed = 4;

    let heightBarra = canvas.height * porcentajeAlto;
    let yBarra = canvas.height * ((1 - porcentajeAlto) / 2);
    let xBarra = marginBarras;

    let player1 = new Player('white', xBarra, yBarra, widthBarra, heightBarra, speed, 'w', 's');

    xBarra = canvas.width - marginBarras - widthBarra;
    let player2 = new Player('white', xBarra, yBarra, widthBarra, heightBarra, speed, 'ArrowUp', 'ArrowDown');

    update(ball, [player1, player2]);
}