var balls = [{
    count: 10,
    color: 'red',
    radius: 15
}]
var options = {
    width: 700,
    height: 300,
    mode: 'default',
    particleStyle: 'default',
    drawSparkles: false,
    overlay: false,
    drawBorder: true,
    particles: balls
};

var particlesField = new FloatingOrbsPlugin('particles-holder', options);
var objectOutDiv = document.getElementById("pretty-options");

particlesField.init();
objectOutDiv.innerHTML = JSON.stringify(options, undefined, 4);

document.addEventListener("change", function(evt) {
    var target = evt.target;

    switch(target.name){
        case 'movemode':
            options.mode = target.value;
            break;
        case 'displaymode':
            options.particleStyle = target.value;
            break;
        case 'drawsparkles':
            options.drawSparkles = target.checked;
            break;
        case 'drawoverlay':
            options.overlay = target.checked;
            break;
        case 'drawborder':
                options.drawBorder = target.checked;
                break;
        default:
            break;
    }

    particlesField.destroy();
    particlesField = new FloatingOrbsPlugin('particles-holder', options);
    particlesField.init();
    objectOutDiv.innerHTML = JSON.stringify(options, undefined, 4);
});
