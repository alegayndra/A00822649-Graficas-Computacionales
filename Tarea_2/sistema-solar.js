let renderer = null, scene = null, camera = null;
// cube = null,
// sphere = null,
// cone = null,
// sphereGroup = null;

let initialGroup = null, centerObject = null, lastObject = null;

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

function clearGroup(group) {
    for(let i = 0; i < group.children.length; i++) {
        group.children.pop();
    }
    lastObject = null;
}

function animate() {
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    // // Rotate the cube about its Y axis
    initialGroup.rotation.y += angle;
    initialGroup.children.forEach(child => animateChildren(child, angle / 2));
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function createSatellite() {
    let text = textures[Math.round(Math.random() * (textures.length - 1))];
    let material = new THREE.MeshPhongMaterial({ map: text });

    // Create the cube geometry
    let val = Math.round(Math.random() * (satelites.length - 1));
    if (val >= satelites.length) val--; 
    console.log(val);
    let geometry = satelites[val];;

    // And put the geometry and material together into a mesh
    let cube = new THREE.Mesh(geometry, material);

    let angle = (Math.random() * Math.PI * 2);
    let r = 4

    cube.position.set(Math.sin(angle) * r, 0, Math.cos(angle) * r);
    lastObject.add(cube);    
    
}

function createObject() {
    let text = textures[Math.round(Math.random() * (textures.length - 1))];
    let material = new THREE.MeshPhongMaterial({ map: text });

    // Create the cube geometry
    let val = Math.round(Math.random() * (meshes.length));
    if (val >= meshes.length) val--; 
    console.log(val);
    let geometry = meshes[val];;

    // And put the geometry and material together into a mesh
    let cube = new THREE.Mesh(geometry, material);
    
    console.log('create');

    if (initialGroup.children.length == 0) {
        console.log('initial');
        centerObject = cube;
        initialGroup.add(cube);
        // addMouseHandler(canvas, centerObject);

    } else {
        let angle = (Math.random() * Math.PI * 2);
        let r = 7;
        let y = Math.round(Math.random() * 4) - 2;
        cube.position.set(Math.sin(angle) * r, y, Math.cos(angle) * r);
        centerObject.add(cube);
    }

    lastObject = cube; 
}

function loadTextures() {
    for (let i = 0; i < texturePaths.length; i++) {
        let texture = new THREE.TextureLoader().load(texturePaths[i]);
        textures.push(texture);
    }
}

function loadMeshes() {
    meshes.push(new THREE.CubeGeometry(2, 2, 2));
    meshes.push(new THREE.CylinderGeometry(0, 1, 2, 20, 10));
    meshes.push(new THREE.SphereGeometry(1, 20, 20));
    meshes.push(new THREE.DodecahedronGeometry(1, 0));
    meshes.push(new THREE.TorusGeometry( 1, 0.4, 16, 100 ));

    satelites.push(new THREE.CubeGeometry(0.7, 0.7, 0.7));
    satelites.push(new THREE.CylinderGeometry(0, .333, .444, 20, 5));
    satelites.push(new THREE.SphereGeometry(0.5, 20, 20));
    satelites.push(new THREE.DodecahedronGeometry(0.5, 0));
    satelites.push(new THREE.TorusGeometry( 0.5, 0.1, 16, 100 ));

}

function createScene(canvas) {    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    // Add a directional light to show off the objects
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);
    // let light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);
    
    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);
    
    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);
    
    // Create a group to hold all the objects
    initialGroup = new THREE.Object3D;
    initialGroup.position.set(0, 0, -1.5);

    // Now add the group to our scene
    scene.add( initialGroup );
    
    loadTextures();
    loadMeshes();

    // add mouse handling so we can rotate the scene
    buttonHandlers();
    addMouseHandler(canvas, initialGroup);
    // addMouseHandler(canvas, centerObject);
}