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

let texturePaths = [
    '../images/ash_uvgrid01.jpg',
    '../images/water_texture.jpg',
    '../images/water_texture_2.jpg',
    '../images/moon_1024.jpg',
];

let textures = [];

let meshes = [];
let satelites = [];

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

// function createSatellite() {
//     let text = textures[Math.round(Math.random() * (textures.length - 1))];
//     let material = new THREE.MeshPhongMaterial({ map: text });

//     // Create the cube geometry
//     let val = Math.round(Math.random() * (satelites.length - 1));
//     if (val >= satelites.length) val--; 
//     console.log(val);
//     let geometry = satelites[val];;

//     // And put the geometry and material together into a mesh
//     let cube = new THREE.Mesh(geometry, material);

//     let angle = (Math.random() * Math.PI * 2);
//     let r = 4

//     cube.position.set(Math.sin(angle) * r, 0, Math.cos(angle) * r);
//     lastObject.add(cube);    
    
// }

// function createObject() {
//     let text = textures[Math.round(Math.random() * (textures.length - 1))];
//     let material = new THREE.MeshPhongMaterial({ map: text });

//     // Create the cube geometry
//     let val = Math.round(Math.random() * (meshes.length));
//     if (val >= meshes.length) val--; 
//     console.log(val);
//     let geometry = meshes[val];;

//     // And put the geometry and material together into a mesh
//     let cube = new THREE.Mesh(geometry, material);
    
//     console.log('create');

//     if (initialGroup.children.length == 0) {
//         console.log('initial');
//         centerObject = cube;
//         initialGroup.add(cube);
//         // addMouseHandler(canvas, centerObject);

//     } else {
//         let angle = (Math.random() * Math.PI * 2);
//         let r = 7;
//         let y = Math.round(Math.random() * 4) - 2;
//         cube.position.set(Math.sin(angle) * r, y, Math.cos(angle) * r);
//         centerObject.add(cube);
//     }

//     lastObject = cube; 
// }

// function loadTextures() {
//     for (let i = 0; i < texturePaths.length; i++) {
//         let texture = new THREE.TextureLoader().load(texturePaths[i]);
//         textures.push(texture);
//     }
// }

// function loadMeshes() {
//     meshes.push(new THREE.CubeGeometry(2, 2, 2));
//     meshes.push(new THREE.CylinderGeometry(0, 1, 2, 20, 10));
//     meshes.push(new THREE.SphereGeometry(1, 20, 20));
//     meshes.push(new THREE.DodecahedronGeometry(1, 0));
//     meshes.push(new THREE.TorusGeometry( 1, 0.4, 16, 100 ));

//     satelites.push(new THREE.CubeGeometry(0.7, 0.7, 0.7));
//     satelites.push(new THREE.CylinderGeometry(0, .333, .444, 20, 5));
//     satelites.push(new THREE.SphereGeometry(0.5, 20, 20));
//     satelites.push(new THREE.DodecahedronGeometry(0.5, 0));
//     satelites.push(new THREE.TorusGeometry( 0.5, 0.1, 16, 100 ));

// }

function createPlanets() {
    let text = null;
    let material = null;
    let geometry = null;
    // Sol -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/sun/sun_texture.jpg");
    material = new THREE.MeshBasicMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1.5, 20, 20);
    Sol = new THREE.Mesh(geometry, material);
    scene.add(Sol);

    // Mercurio -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/mercury/mercurymap.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Mercurio = new THREE.Mesh(geometry, material);
    Mercurio.position.z = 10
    Sol.add(Mercurio);

    // Venus -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/venus/venusmap.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Venus = new THREE.Mesh(geometry, material);
    Venus.position.x = 10
    Sol.add(Venus);

    // Tierra -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/earth/earthmap1k.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Tierra = new THREE.Mesh(geometry, material);
    Tierra.position.x = -10

    text = new THREE.TextureLoader().load("images/earth/moonmap1k.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(0.5, 20, 20);
    Luna = new THREE.Mesh(geometry, material);
    Luna.position.x = 2;
    Tierra.add(Luna);
    Sol.add(Tierra);

    // Marte -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/mars/mars_1k_color.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Marte = new THREE.Mesh(geometry, material);
    Marte.position.z = -10
    Sol.add(Marte);

    // Asteroides -------------------------------------------------------------------------------
    // text = new THREE.TextureLoader().load("images/mercury/mercurymap.jpg");
    // material = new THREE.MeshPhongMaterial({ map: text });
    // geometry = new THREE.SphereGeometry(1, 20, 20);
    // Asteroides = new THREE.Mesh(geometry, material);
    // Asteroides.position.z = 10
    // Sol.add(Asteroides);

    // Jupiter -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/jupiter/jupitermap.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Jupiter = new THREE.Mesh(geometry, material);
    Jupiter.position.z = -5
    Sol.add(Jupiter);

    // Saturno -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/saturn/saturnmap.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Saturno = new THREE.Mesh(geometry, material);
    Saturno.position.z = 5
    Sol.add(Saturno);

    // Urano -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/uranus/uranusmap.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Urano = new THREE.Mesh(geometry, material);
    Urano.position.x = 5
    Sol.add(Urano);

    // Neptuno -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/neptune/neptunemap.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Neptuno = new THREE.Mesh(geometry, material);
    Neptuno.position.x = -5
    Sol.add(Neptuno);

    // Pluton -------------------------------------------------------------------------------
    text = new THREE.TextureLoader().load("images/pluto/plutomap1k.jpg");
    material = new THREE.MeshPhongMaterial({ map: text });
    geometry = new THREE.SphereGeometry(1, 20, 20);
    Mercurio = new THREE.Mesh(geometry, material);
    Mercurio.position.x = 15
    Sol.add(Mercurio);

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
    let light = new THREE.PointLight(0xffffff, 1.5, 40)
    
    // Position the light out from the scene, pointing at the origin
    scene.add(light);
    
    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    // let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    // scene.add(ambientLight);

    createPlanets();
}