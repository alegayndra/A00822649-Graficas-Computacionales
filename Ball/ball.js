let ctx = null, canvas = null;

class Sphere {
    constructor(color, x, y, radius) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = radius
        this.velocityX = 4;
        this.velocityY = 4;
    }

    draw() { 
        ctx.fillStyle = this.color;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        if ((this.x + this.radius >= canvas.width && this.velocityX > 0) || (this.x - this.radius <= 0 && this.velocityX < 0)) {
            this.velocityX *= -1;
        }
        if ((this.y + this.radius >= canvas.height && this.velocityY > 0) || (this.y - this.radius <= 0 && this.velocityY < 0)) {
            this.velocityY *= -1;
        }
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

}

function update(ball) {
    requestAnimationFrame(() => update(ball));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.draw();
    ball.update();
}

function main () {
    canvas = document.querySelector('#ballCanvas');
    ctx = canvas.getContext('2d');

    let ball = new Sphere('white', canvas.width / 2, canvas.height / 2, 20);
    update(ball);
}