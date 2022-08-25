import * as THREE from 'https://unpkg.com/three@0.133.1/build/three.module.js';
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls";

const canvasContainer = document.getElementById('canvascontainer');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,
        canvas: document.getElementById('canvas')
    }
);


renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(10, 50, 50),
    new THREE.ShaderMaterial({
       vertexShader: document.getElementById('vertexshader').textContent,
       fragmentShader: document.getElementById('fragmentshader').textContent,
       uniforms: {
           globeTexture: {
               value: new THREE.TextureLoader().load('./earth.jpg'),
           }
       }
    })
);

scene.add(sphere);

const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(10, 50, 50),
    new THREE.ShaderMaterial({
       vertexShader: document.getElementById('atmospherevertexshader').textContent,
       fragmentShader: document.getElementById('atmospherefragmentshader').textContent,
       blending: THREE.AdditiveBlending,
       side: THREE.BackSide,
    })
);

atmosphere.scale.set(1.1, 1.1, 1.1);

scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
});
const starVerices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (2 * Math.random() - 1) * 3000;
    starVerices.push(x , y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVerices, 3));
const stars = new THREE.Points(
    starGeometry,
    starMaterial,
);
scene.add(stars);

camera.position.z = 30;
new OrbitControls(camera, renderer.domElement)

const mouse = {
    x: undefined,
    y: undefined,
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sphere.rotation.y += 0.002;
}

animate();

addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.x = (event.clientY / innerHeight) * 2 + 1;
});