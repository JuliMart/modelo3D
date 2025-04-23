import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const videoElement = document.getElementById('video');
const videoCanvas = document.getElementById('videoCanvas');
const threeCanvas = document.getElementById('threeCanvas');
const videoCtx = videoCanvas.getContext('2d');

videoCanvas.width = window.innerWidth;
videoCanvas.height = window.innerHeight;
threeCanvas.width = window.innerWidth;
threeCanvas.height = window.innerHeight;

const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
pose.onResults(onResults);

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((stream) => {
  videoElement.srcObject = stream;
  videoElement.play();
  processVideoFrame();
});

async function processVideoFrame() {
  if (videoElement.readyState >= 2) {
    await pose.send({ image: videoElement });
  }
  requestAnimationFrame(processVideoFrame);
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
controls.minDistance = 1;   // distancia mínima de la cámara al modelo
controls.maxDistance = 10;  // distancia máxima
controls.enablePan = false; // desactiva arrastre lateral si querés solo rotar y hacer zoom

const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

const loader = new GLTFLoader();
let model, autoRotate = true;

loader.load('/effects/adi_sneaker.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(1.5, 1.5, 1.5);

  // ✅ Centramos el modelo automáticamente
  const box = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  box.getCenter(center);
  model.position.sub(center);

  scene.add(model);
  console.log('✅ Modelo cargado y centrado');
});


  scene.add(model);
  console.log('✅ Modelo cargado y centrado');



// 🔄 Animación + auto-rotación
function animate() {
  requestAnimationFrame(animate);

  if (model && autoRotate) {
    model.rotation.y -= 0.005;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ✋ Cancelar auto-rotación si el usuario interactúa
controls.addEventListener('start', () => {
  autoRotate = false;
});

function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);
}
document.getElementById('reset-rotation-btn').addEventListener('click', () => {
  autoRotate = true;
  console.log('🔄 Giro automático reactivado');
});
