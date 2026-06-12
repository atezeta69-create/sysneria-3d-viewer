// ═══ SCENE — escena, cámara, renderer, controles, luces, suelo ═══
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ═══════════════════════════════════════════════
//  ESCENA BASE
// ═══════════════════════════════════════════════

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
camera.position.set(0, 1.50, 2.8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.enableDamping = false;
controls.minDistance = 0.5;
controls.maxDistance = 6;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2.1;
controls.update();
controls.saveState();

// ── LUCES ──
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dl = new THREE.DirectionalLight(0xffffff, 4);
dl.position.set(3, 6, 4);
dl.castShadow = true;
dl.shadow.mapSize.width = 1024;
dl.shadow.mapSize.height = 1024;
dl.shadow.bias = -0.0005;
dl.shadow.normalBias = 0.005;  // reducido para no perder detalle con grosor 0.0003
scene.add(dl);
const fl = new THREE.DirectionalLight(0x8888ff, 0.6);
fl.position.set(-2, 3, -3);
scene.add(fl);
const rim = new THREE.DirectionalLight(0xffdd99, 0.3);
rim.position.set(-1, 1, 4);
scene.add(rim);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9, metalness: 0 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.01;
floor.receiveShadow = true;
scene.add(floor);

// Raycasting compartido (interacción + cursor)
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener('resize', () => {
  const a = window.innerWidth / window.innerHeight;
  camera.aspect = a;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

export { scene, camera, renderer, controls, raycaster, pointer };
