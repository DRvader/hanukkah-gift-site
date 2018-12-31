var scene = null;
var camera = null;
var renderer = null;
var mixer = null;
var clock = new THREE.Clock();

var animate = false;
var animationModel = new THREE.Vector3();
var sprite = null;

var container = document.getElementById('threejs')

container.addEventListener('mousedown', onMouseDown, false);

function init3D() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
    // scene.background = new THREE.Color(0x0);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    var map = new THREE.TextureLoader().load("hollywood_africans_image.png");
    var material = new THREE.SpriteMaterial({map: map, color: 0xffffff});
    sprite = new THREE.Sprite(material);
    sprite.scale.set(10,10,1);
    sprite.position.y = 5;
    scene.add(sprite);

    camera.position.x = 25;
    camera.position.y = 10;
    camera.position.z = 25;

    camera.lookAt(0, 0, 0)
}

function loadScene() {
    // Instantiate a loader
    var loader = new THREE.GLTFLoader();

    // Load a glTF resource
    loader.load('present/scene.gltf',
        function (gltf) {
            var model = gltf.scene;
            scene.add(model);

            animationModel.set(model.position.x,
                               model.position.y,
                               model.position.z)

            mixer = new THREE.AnimationMixer(model);

            action = mixer.clipAction(gltf.animations[0])
            action.play()
            action.clamp = true;
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;

            render();
        });
}

function render() {
    requestAnimationFrame(render);
    if(animate) {
        var delta = clock.getDelta();
        if (mixer != null) {
            mixer.update(delta);
            if(sprite.position.y < 11) {
                sprite.position.y += 4 * delta;
            }
        };
    }

    renderer.render(scene, camera);
}

function onMouseDown(e) {
    // var vectorMouse = new THREE.Vector3( //vector from camera to mouse
    //     -(window.innerWidth/2-e.clientX)*2/window.innerWidth,
    //     (window.innerHeight/2-e.clientY)*2/window.innerHeight,
    //     -1/Math.tan(22.5*Math.PI/180)); //22.5 is half of camera frustum angle 45 degree
    // vectorMouse.applyQuaternion(camera.quaternion);
    // vectorMouse.normalize();

    // var vectorObject = new THREE.Vector3(); //vector from camera to object
    // vectorObject.set(animationModel.x - camera.position.x,
    //                  animationModel.y - camera.position.y,
    //                  animationModel.z - camera.position.z);
    // vectorObject.normalize();
    // if(vectorMouse.angleTo(vectorObject)*180/Math.PI < 1) {
    animate = true;
    // }
}

init3D();
loadScene();