import * as THREE from 'three';
import {PerspectiveCamera, Scene, SRGBColorSpace, TextureLoader, WebGLRenderer} from 'three';
import {OrbitControls} from "three/addons";

const container = document.getElementById('app');

const renderer = new WebGLRenderer({antialias: true});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);


const scene = new Scene();


const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0.1);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.rotateSpeed = -0.3;


// Load your panorama image here (relative to /public folder in Vite)
const texture = new TextureLoader().load('/DSC_3609.JPG', () => {
  console.log('Panorama loaded');
});

texture.colorSpace = SRGBColorSpace;

const geometry = new THREE.CylinderGeometry(50, 50, 30, 64, 1, true);
geometry.scale(-1, 1, 1); // invert normals to view from inside

const material = new THREE.MeshBasicMaterial({map: texture});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});