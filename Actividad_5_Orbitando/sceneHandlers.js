
// An integer value, in pixels, indicating the X coordinate at which the mouse pointer was located when the event occurred. 
let mouseDown = false, pageX = 0, pageY = 0;

function rotateScene(deltax, deltay, group)
{
    group.rotation.y += deltax / 100;
    group.rotation.x += deltay / 100;
    // console.log(group.rotation.y, group.rotation.x);
    $("#rotation").html("rotation: " + group.rotation.x.toFixed(1) + "," + group.rotation.y.toFixed(1) + ",0");
}

function scaleScene(scale, group)
{
    group.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
}

function onMouseMove(evt, group)
{
    if (!mouseDown)
        return;
    
    // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    evt.preventDefault();
    
    let deltax = evt.pageX - pageX;
    let deltay = evt.pageY - pageY;

    pageX = evt.pageX;
    pageY = evt.pageY;
    rotateScene(deltax, deltay, group);
}

function onMouseDown(evt)
{
    evt.preventDefault();
    
    mouseDown = true;
    pageX = evt.pageX;
    pageY = evt.pageY;
}

function onMouseUp(evt)
{
    evt.preventDefault();
    
    mouseDown = false;
}

function addMouseHandler(canvas, group)
{
    canvas.addEventListener( 'mousemove', e => onMouseMove(e, group), false);
    canvas.addEventListener( 'mousedown', e => onMouseDown(e), false );
    document.addEventListener( 'mouseup',  e => onMouseUp(e), false );

    $("#slider").on("slide", (e, u) => scaleScene(u.value, group));
}