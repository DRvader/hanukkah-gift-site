var clock = new THREE.Clock();

function initPresent(element, present_colour, gift_image) {
    var scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;

    scene.userData.animate = false;

    var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

    renderer.setSize(width, height);

    var container = document.getElementById(element)

    function onMouseDown(e) {
        scene.userData.animate = true;
    }

    container.addEventListener('mousedown', onMouseDown, false);
    scene.userData.view = container;

    // scene.background = new THREE.Color(0xffffff);
    // scene.background = new THREE.Color(0x0);

    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    container.appendChild(renderer.domElement);

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

    renderWrapper(renderer, scene)();
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

function renderWrapper(renderer, scene) {
    return function render() {
        requestAnimationFrame(render);
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
    }
}
