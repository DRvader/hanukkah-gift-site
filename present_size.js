var renderer = null;

var scenes = [];
var clock = new THREE.Clock();

// // var width = 800;
// var height = 500;

function init() {
    // var canvas = document.body.appendChild(document.createElement('c'));
    var canvas = document.getElementById('c');
    renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});

    render();
}

function initPresent(element, present_colour, gift_image) {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var container = document.getElementById(element)
    var canvas = document.createElement('canvas')
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);

    var scene = new THREE.Scene();
    scene.userData.animate = false;
    scene.userData.view = container;

    function onMouseDown(e) {
        scene.userData.animate = true;
    }

    container.addEventListener('mousedown', onMouseDown, false);
    // scene.background = new THREE.Color(0xffffff);
    // scene.background = new THREE.Color(0x0);

    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // container.appendChild(renderer.domElement);

    var ambientLight = new THREE.AmbientLight(present_colour);
    scene.add(ambientLight);

    var map = new THREE.TextureLoader().load(gift_image);
    var material = new THREE.SpriteMaterial({map: map, color: 0xffffff});
    sprite = new THREE.Sprite(material);
    sprite.scale.set(10,10,1);
    sprite.position.y = 5;
    scene.add(sprite);

    scene.userData.sprite = sprite;

    camera.position.x = 25;
    camera.position.y = 10;
    camera.position.z = 10;

    camera.lookAt(0, 0, 0);

    scene.userData.camera = camera

    loadScene(scene);

    scenes.push(scene)
}

function loadScene(scene) {
    // Instantiate a loader
    var loader = new THREE.GLTFLoader();

    // Load a glTF resource
    loader.load('present/scene.gltf',
        function (gltf) {
            var model = gltf.scene;
            scene.add(model);

            mixer = new THREE.AnimationMixer(model);

            action = mixer.clipAction(gltf.animations[0])
            action.play()
            action.clamp = true;
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;

            scene.userData.mixer = mixer;
        });
}

function render() {
    requestAnimationFrame(render);

    scenes.forEach( function ( scene ) {
        var rect = scene.userData.view.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
            rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
            return; // it's off screen

        }
        // set the viewport
        var width = rect.right - rect.left;
        var height = rect.bottom - rect.top;
        var left = rect.left;
        var top = rect.top;

        renderer.setViewport( left, top, width, height );
        renderer.setScissor( left, top, width, height );

        if(scene.userData.animate) {
            var delta = clock.getDelta();
            if (scene.userData.mixer != null) {
                scene.userData.mixer.update(delta);
                if(scene.userData.sprite.position.y < 11) {
                    scene.userData.sprite.position.y += 4 * delta;
                }
            };
        }

        renderer.render(scene, scene.userData.camera);
    });
}

init();