import "./style.css";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as THREE from "three";

import galaxy from "./assets/galaxy.jpg";
// import moon from "./assets/moon.jpg";
// import normal from "./assets/normal.jpg";
// import cube from "./assets/cube.png";

//Scene = container that holds all objects, cameras, and lights
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(90);
camera.position.setY(50);
camera.position.setZ(20);

renderer.render(scene, camera);

//? Torus

// const geometry = new THREE.TorusKnotGeometry(70, 3, 100, 16, 2, 5);
const torusT = new THREE.TextureLoader().load("blackhole.jpeg");

//MeshStandardMaterial needs light to bounce on it
//MeshBasicMaterial doesn't need light but needs wireframe
// const material = new THREE.MeshStandardMaterial({
//   color: 0xff6347,
//   //   wireframe: true,
// });
// const torus = new THREE.Mesh(geometry, material);

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(70, 3, 200, 16, 3, 5),
  new THREE.MeshBasicMaterial({ map: torusT })
);

scene.add(torus);

//? Cube

const cubeT = new THREE.TextureLoader().load("cube.png");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({
    map: cubeT,
    normalMap: normalTexture,
  })
);

scene.add(cube);

//? Lights

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(5, 14, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);

scene.add(pointLight, ambientLight);

//? Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 10, 10);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

//? Textures
const spaceTexture = new THREE.TextureLoader().load(galaxy);
scene.background = spaceTexture;

//? Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
// const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.x = -30;
moon.position.z = 30;
moon.position.y = 40;
moon.position.setX(-10);

cube.position.z = 7;
cube.position.y = 30;
cube.position.x = 20;

//? Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  //   moon.rotation.z += 0.05;

  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

//? Helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

// Recursive function ("game-loop" like)
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.001;
  torus.rotatey = document.body.getBoundingClientRect().top;

  controls.update();

  renderer.render(scene, camera);
}

animate();
