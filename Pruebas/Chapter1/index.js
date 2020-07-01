function updateCanvas() {
    let width = window.innerWidth;
    let height = 100;

    let myCanvas = document.querySelector('#myCanvas');
    myCanvas.width = width;
    myCanvas.height = height;

    let context = myCanvas.getContext('2d');

    context.fillStyle = '#FCEAB8';
    context.fillRect(0, 0, width, height);

    let circleSize = 10;
    let gaps = circleSize * 2;
    let widthCount = parseInt(width / gaps);
    let heightCount = parseInt(height / gaps);
    let aColors = ['#43A9D1', '#EFA63B', '#EF7625', '#5E4130'];

    for (let i = 0; i < widthCount; i++) {
        for (let j = 0; j < heightCount; j++) {
            context.fillStyle = aColors[parseInt(Math.random() * aColors.length)];
            context.beginPath();
            context.arc(circleSize + gaps * i, circleSize + gaps * j, circleSize, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }
    }
}

function init() {
    setInterval(updateCanvas, 1000)
    updateCanvas();
}