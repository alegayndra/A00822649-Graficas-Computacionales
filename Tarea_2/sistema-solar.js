let renderer = null, scene = null, camera = null, controls = null;

let groups = [];

let duration = 5000; // ms
let currentTime = Date.now();

let moonMap = 'images/earth/moonmap1k.jpg';
let moonBump = 'images/earth/moon_bump.jpg';

function animate() {
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;

    groups.forEach(group => {
        group.animate(fract);
    });
}

function run() {
    requestAnimationFrame(function() { run(); });
    controls.update();
    renderer.render( scene, camera );
    animate();
}

/*
    Crea un planeta nuevo
    Entrada:
    - pos:          Distancia desde el centro del sol donde el planeta estará
    - radius:       Radio del planeta
    - planetMap:    Textura del planeta
    - planetBump    Textura del planeta para los bumps
    - cantMoons:    Cantidad de lunas que tiene cada planeta
    - moonRadius:   Radio de las lunas en sí
    - moonDistance: Distancia desde el centro del planeta donde las lunas estarán
    - translation:  Velocidad a la que el planeta se trasladara en su orbita
    - extra:        Objeto extra utlizado para cualquier cosa única de los planetas (ejemplo: el anillo de asteroides de Saturno)
    Salida: objeto de tipo Planet, que guarda toda la información de cada planeta
*/
function createPlanet(pos, radius, planetMap, planetBump, cantMoons, moonRadius, moonDistance, translation, extra) {

    // Se crea el planeta en sí
    let textureMap = new THREE.TextureLoader().load(planetMap) || null;
    let bumpMap = new THREE.TextureLoader().load(planetBump) || null;    
    let material = new THREE.MeshPhongMaterial({ map: textureMap, bumpMap: bumpMap, bumpScale: 0.4 });
    let geometry = new THREE.SphereGeometry(radius, 20, 20);
    let planet = new THREE.Mesh(geometry, material);

    // Se posiciona el planeta en una posición random de su orbita
    let val = (Math.random() * Math.PI * 2);
    planet.position.x = Math.cos(val) * pos;
    planet.position.z = Math.sin(val) * pos;
    
    // Se crean el material y geometría de las lunas
    textureMap = new THREE.TextureLoader().load(moonMap);
    bumpMap = new THREE.TextureLoader().load(moonBump) || null;
    material = new THREE.MeshPhongMaterial({ map: textureMap, bumpMap: bumpMap, bumpScale: 0.4 });
    geometry = new THREE.SphereGeometry(moonRadius, 20, 20);
    
    // Arreglo que guardará las lunas del planeta
    let moons = [];

    // Se crean las lunas del planeta y se posicionan aleatoriamente alrededor del planeta
    for (let i = 0; i < cantMoons; i++) {
        let moon = new THREE.Mesh(geometry, material);
        let val = Math.PI * 2 / cantMoons * i;
        moon.position.x = Math.cos(val) * moonDistance;
        moon.position.z = Math.sin(val) * moonDistance;
        let n = radius;
        moon.position.y = Math.random() * n - (n / 2);
        moons.push(moon);
    }

    // Se crea un circulo para mostrar la orbita del planeta
    material = new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff } ); 
    geometry = new THREE.CircleGeometry( pos, 64 );
    geometry.vertices.shift();
    let circle = new THREE.LineLoop( geometry, material );
    circle.rotation.x = -Math.PI / 2;

    return new Planet(planet, moons, Math.PI * 1.5, circle, translation, extra);
}

/*
    Se crean todos los planetas
*/
function createPlanets() {
    // Sol -------------------------------------------------------------------------------
    let text = new THREE.TextureLoader().load("images/sun/sun_texture.jpg");
    let material = new THREE.MeshBasicMaterial({ map: text });
    let geometry = new THREE.SphereGeometry(2.5, 20, 20);
    Sol = new THREE.Mesh(geometry, material);
    let group = new Planet(Sol, [], Math.PI, null, 0, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    let pos = 5;

    // Mercurio -------------------------------------------------------------------------------
    group = createPlanet(pos, 1, 'images/mercury/mercurymap.jpg', 'images/mercury/mercurybump.jpg', 0, 0, 0, Math.PI * 2.5, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 3.5;

    // Venus -------------------------------------------------------------------------------
    group = createPlanet(pos, 1, 'images/venus/venusmap.jpg', 'images/venus/venusbump.jpg', 0, 0, 0, Math.PI * 2, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 3.5;

    // Tierra -------------------------------------------------------------------------------

    group = createPlanet(pos, 1.2, 'images/earth/earthmap1k.jpg', 'images/earth/earthbump1k.jpg', 1, 0.6, 2, Math.PI * 1.7, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 3.5;

    // Marte -------------------------------------------------------------------------------
    group = createPlanet(pos, 1, 'images/mars/mars_1k_color.jpg', 'images/mars/marsbump1k.jpg', 2, 0.6, 1.5, Math.PI * 1.4, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 5;

    // Asteroides -------------------------------------------------------------------------------
    let textureMap = new THREE.TextureLoader().load(moonMap);
    let bumpMap = new THREE.TextureLoader().load(moonBump) || null;
    
    material = new THREE.MeshPhongMaterial({ map: textureMap, bumpMap: bumpMap, bumpScale: 0.006 });
    geometry = new THREE.SphereGeometry(0.2, 20, 20);
    
    let moons = [];

    let cantMoons = 120;
    let moonDistance = pos;

    for (let i = 0; i < cantMoons; i++) {
        let moon = new THREE.Mesh(geometry, material);
        let val = Math.PI * 2 / cantMoons * i;
        moon.position.x = Math.cos(val) * moonDistance;
        moon.position.z = Math.sin(val) * moonDistance;
        let n = 5;
        moon.position.y = Math.random() * n - (n / 2);
        moons.push(moon);
    }

    material = new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff } ); 
    geometry = new THREE.CircleGeometry( pos, 64 );
    geometry.vertices.shift();

    let circle = new THREE.LineLoop( geometry, material );
    circle.rotation.x = -Math.PI / 2;

    group = new Planet(new THREE.Object3D, moons, Math.PI, circle, 0, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 10;

    // Jupiter -------------------------------------------------------------------------------
    group = createPlanet(pos, 3, 'images/mars/mars_1k_color.jpg', 'images/mars/marsbump1k.jpg', 63, 0.2, 4.5, Math.PI * 1.2, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 10;

    // Saturno -------------------------------------------------------------------------------
    let geo = new THREE.RingGeometry( 4, 6, 32 );
    let mat = new THREE.MeshBasicMaterial( { color: 0x1ec6ff, side: THREE.DoubleSide } );
    let anillo = new THREE.Mesh( geo, mat );
    anillo.rotation.x = Math.PI / 4;

    group = createPlanet(pos, 3, 'images/saturn/saturnmap.jpg', '', 62, 0.2, 4.5, Math.PI * 1.2, anillo);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 8;

    // Urano -------------------------------------------------------------------------------
    mat = new THREE.LineBasicMaterial( { color: 0x0000ff } ); 
    geo = new THREE.CircleGeometry( 2, 64 );
    geo.vertices.shift();
    circle = new THREE.LineLoop( geo, mat );
    circle.rotation.x = (Math.PI / 2);

    group = createPlanet(pos, 1.2, 'images/uranus/uranusmap.jpg', '', 27, 0.1, 2, Math.PI, circle);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 5;

    // Neptuno -------------------------------------------------------------------------------
    group = createPlanet(pos, 1, 'images/neptune/neptunemap.jpg', '', 13, 0.2, 2, Math.PI * 0.8, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

    pos += 5;

    // Pluton -------------------------------------------------------------------------------
    group = createPlanet(pos, 0.7, 'images/pluto/plutomap1k.jpg', 'images/pluto/plutobump1k.jpg', 0, 0, 0, Math.PI * 0.6, null);
    groups.push(group);
    scene.add(groups[groups.length - 1].center);

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
    let light = new THREE.PointLight(0xffffff, 2.5, 70);
    
    // Position the light out from the scene, pointing at the origin
    scene.add(light);

    createPlanets();
}