let renderer = null, scene = null, camera = null, controls = null;

let initialGroup = null, centerObject = null, lastObject = null;

/*
    Lista de planetas
    - Sol
    - Mercurio
    - Venus
    - Tierra
    - Marte
    - Anillo de asteroides
    - Jupiter
    - Saturno
    - Urano
    - Neptuno
    - Pluton
*/

let Sol = null;
let Mercurio = null;
let Venus = null;
let Tierra = null, Luna = null;
let Marte = null;
let Asteroides = null;
let Jupiter = null;
let Saturno = null;
let Urano = null;
let Neptuno = null;
let Pluton = null;

let duration = 5000; // ms
let currentTime = Date.now();

function animateChildren(object, angle) {
    object.rotation.y += angle;
    object.children.forEach(child => animateChildren(child, angle / 2));
    
}


function animate() {
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    // // Rotate the cube about its Y axis
    Sol.rotation.y += angle;
    Sol.children.forEach(child => animateChildren(child, angle / 2));
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    controls.update();

    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function posPlanet(planet, pos) {
    let val = (Math.random() * Math.PI * 2);
    planet.position.x = Math.cos(val) * pos;
    planet.position.z = Math.sin(val) * pos;
    let n = 5;
    planet.position.y = Math.random() * n - (n / 2);
}

function planet(map, bump, radius) {
    let text = new THREE.TextureLoader().load(map);
    let bumpMap = new THREE.TextureLoader().load(bump) || null;
    let material = new THREE.MeshPhongMaterial({ map: text, bumpMap: bumpMap, bumpScale: 0.06 });
    let geometry = new THREE.SphereGeometry(radius, 20, 20);
    return new THREE.Mesh(geometry, material);
}

function createPlanets() {
    // Sol -------------------------------------------------------------------------------
    let text = new THREE.TextureLoader().load("images/sun/sun_texture.jpg");
    let material = new THREE.MeshBasicMaterial({ map: text });
    let geometry = new THREE.SphereGeometry(1.5, 20, 20);
    Sol = new THREE.Mesh(geometry, material);
    scene.add(Sol);

    let pos = 5;

    // Mercurio -------------------------------------------------------------------------------
    Mercurio = planet("images/mercury/mercurymap.jpg", "images/mercury/mercurybump.jpg", 0.6);
    posPlanet(Mercurio, pos);
    Sol.add(Mercurio);

    pos += 5;

    // Venus -------------------------------------------------------------------------------
    Venus = planet("images/venus/venusmap.jpg", "images/venus/venusbump.jpg", 0.6);
    posPlanet(Venus, pos);
    Sol.add(Venus);

    pos += 5;

    // Tierra -------------------------------------------------------------------------------
    Tierra = planet("images/earth/earthmap1k.jpg", "images/earth/earthbump1k.jpg", 0.8);
    posPlanet(Tierra, pos);
    
    Luna = planet("images/earth/moonmap1k.jpg", "images/earth/moon_bump.jpg", 0.3);
    Luna.position.x = 1.5;
    Luna.position.y = 0.5;

    Tierra.add(Luna);
    Sol.add(Tierra);

    pos += 5;

    // Marte -------------------------------------------------------------------------------
    Marte = planet("images/mars/mars_1k_color.jpg", 'images/mars/marsbump1k.jpg', 0.6);
    let lun1 = planet("images/mars/deimosbump.jpg", 'images/mars/deimosbump.jpg', 0.3);
    let lun2 = planet("images/mars/phobosbump.jpg", 'images/mars/phobosbump.jpg', 0.3);
    posPlanet(Marte, pos);
    lun1.position.x = 1.5;
    lun1.position.y = 0.5;

    lun2.position.x = -1.5;
    lun2.position.y = -0.5;
    Marte.add(lun1);
    Marte.add(lun2);
    Sol.add(Marte);

    pos += 5;

    // Asteroides -------------------------------------------------------------------------------
    Asteroides = new THREE.Object3D();
    let num = 120;
    for (let i = 0; i < num; i++) {
        text = new THREE.TextureLoader().load("images/earth/moonmap1k.jpg");
        material = new THREE.MeshPhongMaterial({ map: text });
        geometry = new THREE.SphereGeometry(0.2, 20, 20);
        let obj = new THREE.Mesh(geometry, material);
        let val = Math.PI * 2 / num * i;
        obj.position.x = Math.cos(val) * pos;
        obj.position.z = Math.sin(val) * pos;
        let n = 5;
        obj.position.y = Math.random() * n - (n / 2);
        Asteroides.add(obj);
    }
    Sol.add(Asteroides);

    pos += 5;

    // Jupiter -------------------------------------------------------------------------------
    Jupiter = planet("images/jupiter/jupitermap.jpg", '', 2);
    posPlanet(Jupiter, pos);
    Sol.add(Jupiter);

    pos += 5;

    // Saturno -------------------------------------------------------------------------------
    Saturno = planet("images/saturn/saturnmap.jpg", '', 2);
    posPlanet(Saturno, pos);
    Sol.add(Saturno);

    pos += 5;

    // Urano -------------------------------------------------------------------------------
    Urano = planet("images/uranus/uranusmap.jpg", '', 0.8);
    Urano.position.x = pos;
    posPlanet(Mercurio, pos);
    Sol.add(Urano);

    pos += 5;

    // Neptuno -------------------------------------------------------------------------------
    Neptuno = planet("images/neptune/neptunemap.jpg", '', 0.7);
    posPlanet(Neptuno, pos);
    Sol.add(Neptuno);

    pos += 5;

    // Pluton -------------------------------------------------------------------------------
    Pluton = planet("images/pluto/plutomap1k.jpg", "images/pluto/plutobump1k.jpg", 0.3);
    posPlanet(Pluton, pos);
    Sol.add(Pluton);

}

function createScene(canvas) {    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true} );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.1, 0.1, 0.1 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    scene.add(camera);

    // Add a directional light to show off the objects
    let light = new THREE.PointLight(0xffffff, 1.5, 70);
    
    // Position the light out from the scene, pointing at the origin
    scene.add(light);

    createPlanets();
}