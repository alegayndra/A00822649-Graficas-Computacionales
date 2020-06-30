function sliderEvent() {
    document.getElementById("slider").oninput = function(event) {
        document.getElementById("sliderValue").innerHTML = "Value: " + event.target.value;
    };
}


function main() {
    sliderEvent();
}

main();