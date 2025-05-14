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
scene.background = new THREE.Color(0xCCCCCC); // rosa pastel

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-90, 50, 150);

const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
controls.minDistance = 1;
controls.maxDistance = 12;
controls.enablePan = false;

// Luz hemisférica suave (ilumina desde arriba con rebote inferior)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

// Luz direccional frontal (más fuerte y enfocada)
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(50, 100, 50);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Luz de relleno (opcional)
const fillLight = new THREE.PointLight(0xffffff, 2);
fillLight.position.set(0, 50, 100);
scene.add(fillLight);


// Plano receptor de sombra
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.ShadowMaterial({ opacity: 0.3 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -4;
ground.receiveShadow = true;
scene.add(ground);
// Cargar modelos como carrusel
// Cargar modelos como carrusel
const modelPaths = [
  'https://modelito3d.web.app/nike_tc_7900_sail.glb',
  'https://modelito3d.web.app/adi_sneaker.glb'
];


const loader = new GLTFLoader();
let currentModelIndex = 0;
let currentModel = null;
let autoRotate = true;

function loadModel(path) {
  if (currentModel) {
    scene.remove(currentModel);
    currentModel.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    });
    currentModel = null;
  }

  loader.load(path, (gltf) => {
    currentModel = gltf.scene;
    currentModel.scale.set(0.5, 0.5, 0.5);

    const box = new THREE.Box3().setFromObject(currentModel);
    const center = new THREE.Vector3();
    box.getCenter(center);
    currentModel.position.sub(center);

    currentModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(currentModel);
    console.log(`✅ Modelo cargado: ${path}`);
  });
}

// Cambiar modelo con flechas
document.getElementById('prev-model').addEventListener('click', () => {
  currentModelIndex = (currentModelIndex - 1 + modelPaths.length) % modelPaths.length;
  loadModel(modelPaths[currentModelIndex]);
});

document.getElementById('next-model').addEventListener('click', () => {
  currentModelIndex = (currentModelIndex + 1) % modelPaths.length;
  loadModel(modelPaths[currentModelIndex]);
});

// Reset de rotación
document.getElementById('reset-rotation-btn').addEventListener('click', () => {
  autoRotate = true;
  console.log('🔄 Giro automático reactivado');
});

// Detener rotación si el usuario usa OrbitControls
controls.addEventListener('start', () => {
  autoRotate = false;
});

// Animación principal
function animate() {
  requestAnimationFrame(animate);

  if (currentModel && autoRotate) {
    currentModel.rotation.y -= 0.005;
  }

  controls.update();
  renderer.render(scene, camera);
}

// Procesamiento de pose
function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);
}

// Cargar el primer modelo y arrancar animación
loadModel(modelPaths[currentModelIndex]);
animate();
