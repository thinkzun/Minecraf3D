import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { createTerrain } from './terrain.js';
import { Player } from './player.js';

// Scene & camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(10, 5, 25);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,20,10);
scene.add(light);

// Terrain
const blocks = createTerrain(scene);

// Player
const player = new Player(camera, blocks);

// Animation loop
const clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  player.update(delta);
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
