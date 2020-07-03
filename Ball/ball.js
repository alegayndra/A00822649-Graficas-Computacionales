let ctx = null, canvas = null; // variables del canvas

let gameState = 'paused'; // estado en el que el juego se encuentra
let start = true; // bandera para saber si el juego está iniciando

// objeto que contiene variables relacionadas al puntuaje
const score = {
    left: 0, // puntaje del jugador de la izquierda
    right: 0, // puntaje del jugador de la derecha
    scored: false, // bandera para saber si algún jugador acaba de anotar
    text: '' // texto que se mostrará cuando un jugador anote
}

// event listener para la barra espaciadora
document.addEventListener('keydown', (event) => {
    // checa que se presione la barra espaciadora y si el juego está pausado
    // si se cumplen ambas condiciones, pone el estado del juego para reiniciarse
    if (event.key == ' ' && gameState == 'paused') {
        event.preventDefault();
        gameState = 'restart';
        score.scored = false;
        start = false;
    }
});

// clase para las barras
class Player {
    /*
        Constructor
        Entrada
            - color:    color del que se pintara la barra
            - x:        posiciion en el eje x
            - y:        posiciion en el eje y
            - width:    ancho de la barra
            - height:   alto de la barra
            - speed:    velocidad de la barra
            - upkey:    tecla con la que se moverá para arriba
            - downkey:  tecla con la que se moverá para abajo
    */
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

        // event listener para mover la barra cuando se presionen las teclas
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

        // event listener para dejar de mover la barra cuando se liberen las teclas
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
    /*
        Se dibuja a la barra
    */
    draw() { 
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /*
        Actualiza la posicion de la barra
        Entrada:
            - yLimit: limite en el eje y hasta el cual la barra se puede mover
    */
    update(yLimit) {
        // checa que la barra no se esté saliendo de la pantalla
        if ((this.y + this.height < yLimit && this.direction > 0) || (this.y > 0 && this.direction < 0)) {
            this.y += this.velocityY * this.direction;
        }
    }
}

// clase para la pelota
class Sphere {
    /*
        Constructor
        Entrada
            - color:  color del que se pintara la barra
            - x:      posiciion en el eje x
            - y:      posiciion en el eje y
            - radius: radio del circulo
            - speed:  velocidad de la pelota
    */
    constructor(color, x, y, radius, speed) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = radius;
        let dir = ((Math.random() * 2 > 1) ? 1 : -1);
        this.velocityX = speed * dir;
        this.velocityY = speed;
    }

    /*
        Se dibuja a la pelota
    */
    draw() { 
        ctx.fillStyle = this.color;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    /*
        Actualiza la posicion de la barra
        Entrada:
            - xLimit:      limite en el eje x hasta el cual la pelota se puede mover
            - yLimit:      limite en el eje y hasta el cual la pelota se puede mover
            - playerLeft:  jugador que se encuentra del lado izquierdo
            - playerRight: jugador que se encuentra del lado derecho
    */
    update(xLimit, yLimit, playerLeft, playerRight) {

        // checa que la pelota coque con alguno de los dos jugadores
        let boolPlayerLeft = (this.x - this.radius <= playerLeft.x + playerLeft.width && this.y >= playerLeft.y && this.y <= playerLeft.y + playerLeft.height);
        let boolPlayerRight = (this.x + this.radius >= playerRight.x && this.y >= playerRight.y && this.y <= playerRight.y + playerRight.height);

        // checa que la pelota coque con alguno de las paredes
        let leftWall = (this.x - this.radius <= 0);
        let rightWall = (this.x + this.radius >= xLimit);

        // checa que la pelota coque con el piso o el techo
        let ceiling = (this.y - this.radius <= 0);
        let floor = (this.y + this.radius >= yLimit);
        
        // checa si las velocidades son positivas o negativas
        let velocityXPositive = (this.velocityX > 0);
        let velocityXNegative = (this.velocityX < 0);
        let velocityYPositive = (this.velocityY > 0);
        let velocityYNegative = (this.velocityY < 0);
    
        // checa si está pegando con alguno de los jugadores para botar
        if ((boolPlayerLeft && velocityXNegative) || (boolPlayerRight && velocityXPositive)) {
            this.velocityX *= -1;
        // checa si está pegando con la pared izquierda, lo cual significa que el jugador de la derecha anotó
        } else if (leftWall && velocityXNegative) {
            // aumenta el puntaje del jugador y reinicia la posición de la pelota y los jugadores
            score.right++;
            score.text = 'Player 2 scored!';
            score.scored = true;
            gameState = 'paused';
            restart(this, [playerLeft, playerRight]);
        // checa si está pegando con la pared derecha, lo cual significa que el jugador de la izquierda anotó
        } else if ( rightWall && velocityXPositive) {
            // aumenta el puntaje del jugador y reinicia la posición de la pelota y los jugadores
            score.left++;
            score.text = 'Player 1 scored!';
            score.scored = true;
            gameState = 'paused';
            restart(this, [playerLeft, playerRight]);
        }

        // checa si está pegando con el techo o piso
        if ((ceiling && velocityYNegative) || (floor && velocityYPositive)) {
            this.velocityY *= -1;
        }

        // actualiza la posicion 'x' y 'y' de la pelota
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

}

/*
    Actualiza el juego
    Entrada:
        - ball:     objeto de la pelota
        - players:  arreglo de los objetos de los jugadores
*/
function update(ball, players) {
    requestAnimationFrame(() => update(ball, players));

    // checa si el juego se debe reiniciar
    if (gameState == 'restart') {
        restart(ball, players);
    }

    // vuelve a pintar el fondo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // actualiza a ambos jugadores
    players.forEach(player => {
        // checa si el juego no está pausado
        if (gameState == 'playing') {
            // checa si se debe actualizar al jugador
            if (player.updatePlayer) {
                player.update(canvas.height);
            }
    
            // checa si ya no se debe actualizar al jugador para el siguiente tick
            if (!(player.upkey.pressed || player.downkey.pressed)) {
                player.updatePlayer = false;
            }
        }
        player.draw();
    });

    // checa si se está jugado, para actualizar a la pelota
    if (gameState == 'playing') {
        ball.update(canvas.width, canvas.height, players[0], players[1]);
    }

    ball.draw();

    // checa si el juego acaba de iniciar, para mostrar el titulo del juego
    if (start) {
        ctx.textAlign = "center";
        ctx.font = "60px Arial";
        ctx.fillText('Pong', canvas.width/2, canvas.height * .35 );
        ctx.font = "30px Arial";
        ctx.fillText('Presiona espacio para empezar', canvas.width/2, canvas.height * .65 );
    }

    // actualiza el fillStyle
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    // checa si tiene que mostrar que jugador acaba de anotar
    if (gameState == 'paused' && score.scored) {
        ctx.textAlign = "center";
        ctx.fillText(score.text, canvas.width/2, canvas.height * .35 );
    }

    // muestra los puntajes
    ctx.textAlign = "right";
    ctx.fillText(score.left, canvas.width/2 - 10, 50);
    ctx.textAlign = "left";
    ctx.fillText(score.right, canvas.width/2 + 10, 50);
}

/*
    Reinicia las posiciones de la pelota y los jugadores
    Entrada:
        - ball:     objeto de la pelota
        - players:  arreglo de los objetos de los jugadores
*/
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

/*
    Inicializa el juego
*/
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