/* ═══════════════════════════════════════════════════════════
   GIOFFREDO — CORE · interactive generative field (Three.js)
   Renders inside #coreStage in the hero section.
   ═══════════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const stage = document.getElementById('coreStage');
if (!stage) throw new Error('#coreStage not found');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Scene ── */
const scene = new THREE.Scene();
scene.background = null; // transparent → CSS art behind

const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
camera.position.set(0, 1.2, 13);

let renderer = null;
try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (err) {
    stage.classList.add('no-webgl');
    const msg = document.getElementById('coreMessage');
    if (msg) msg.hidden = false;
    throw err;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.domElement.setAttribute('aria-hidden', 'true');
stage.appendChild(renderer.domElement);

/* ── Controls ── */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.autoRotate = !reducedMotion;
controls.autoRotateSpeed = 0.55;
controls.minDistance = 5.5;
controls.maxDistance = 26;
controls.target.set(0, 0, 0);

/* ── Lights ── */
const key = new THREE.PointLight(0xffd9dc, 1.6, 0, 0);
key.position.set(6, 8, 10);
scene.add(key);
const rim = new THREE.DirectionalLight(0xe3202b, 0.7);
rim.position.set(-8, -2, -6);
scene.add(rim);
const warm = new THREE.DirectionalLight(0xffb454, 0.22);
warm.position.set(4, -6, 4);
scene.add(warm);

/* ── Helpers ── */
function makeGlow(color, size, opacity) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const ctx = cv.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, color);
    g.addColorStop(0.4, color.replace('1)', '0.28)'));
    g.addColorStop(1, color.replace('1)', '0)'));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const mat = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(cv),
        transparent: true,
        opacity: opacity == null ? 1 : opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const spr = new THREE.Sprite(mat);
    spr.scale.set(size, size, 1);
    return spr;
}

/* ── The core ── */
const coreGroup = new THREE.Group();
scene.add(coreGroup);

// solid inner heart
const heart = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0xffc9cd, roughness: 0.32, metalness: 0.7, emissive: 0x7f1016, emissiveIntensity: 0.55 })
);
coreGroup.add(heart);

// layered additive glows
coreGroup.add(makeGlow('rgba(255,120,130,1)', 3.4, 0.9));
coreGroup.add(makeGlow('rgba(227,32,43,1)', 6.5, 0.5));
coreGroup.add(makeGlow('rgba(120,10,18,1)', 11, 0.3));

/* ── Neural particle field (fibonacci shell) ── */
function buildField(count, radius, color, size, jitter) {
    const pos = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const rr = radius + (Math.random() - 0.5) * jitter;
        pos[i * 3]     = Math.cos(theta) * r * rr;
        pos[i * 3 + 1] = y * rr;
        pos[i * 3 + 2] = Math.sin(theta) * r * rr;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({
        color, size, transparent: true, opacity: 0.9,
        depthWrite: false, blending: THREE.AdditiveBlending
    });
    return new THREE.Points(g, m);
}

const fieldOuter = buildField(reducedMotion ? 700 : 1900, 4.6, 0xff5a66, 0.035, 0.5);
const fieldInner = buildField(reducedMotion ? 250 : 700, 3.4, 0xffb3b8, 0.02, 0.15);
coreGroup.add(fieldOuter);
coreGroup.add(fieldInner);

/* ── Orbital tech rings ── */
function buildRing(radius, tilt, color, opacity) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const pts = curve.getPoints(140).map(p => new THREE.Vector3(p.x, 0, p.y));
    const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    line.rotation.set(tilt[0], tilt[1], tilt[2]);
    return line;
}
const ringA = buildRing(4.15, [Math.PI / 2.15, 0.2, 0], 0xe3202b, 0.55);
const ringB = buildRing(5.1, [Math.PI / 2.5, -0.4, 0.3], 0x8c1420, 0.32);
const ringC = buildRing(6.0, [Math.PI / 1.9, 0.5, -0.2], 0xe3202b, 0.13);
coreGroup.add(ringA, ringB, ringC);

// tumbling wireframe shell for parallax depth
const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(6.4, 1),
    new THREE.MeshBasicMaterial({ color: 0xe3202b, wireframe: true, transparent: true, opacity: 0.05 })
);
coreGroup.add(shell);

/* ── Distant starfield ── */
function makeStars(count) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 20 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xd9c2c5, size: 0.09, transparent: true, opacity: 0.7 }));
}
scene.add(makeStars(reducedMotion ? 350 : 900));

/* ── Interaction hints ── */
stage.addEventListener('pointerdown', () => stage.classList.add('dragged'), { passive: true });
stage.addEventListener('wheel', () => stage.classList.add('dragged'), { passive: true });

const resetBtn = document.getElementById('coreReset');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        camera.position.set(0, 1.2, 13);
        controls.target.set(0, 0, 0);
        controls.update();
        stage.classList.add('dragged');
    });
}

/* ── Sizing ── */
function setSize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}
setSize();
const ro = new ResizeObserver(() => setSize());
ro.observe(stage);

/* ── Visibility pause ── */
let visible = false;
let rafId = null;
const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
        visible = en.isIntersecting;
        if (visible) startLoop(); else stopLoop();
    });
}, { threshold: 0.03 });
io.observe(stage);

function stopLoop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
}
function startLoop() {
    if (!rafId && visible) rafId = requestAnimationFrame(tick);
}

/* ── Loop ── */
const clock = new THREE.Clock();

function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsedTime();

    if (!reducedMotion) {
        // breathing heart
        heart.scale.setScalar(1 + Math.sin(t * 1.4) * 0.06);
        // field drift
        fieldOuter.rotation.y += dt * 0.045;
        fieldOuter.rotation.x += dt * 0.012;
        fieldInner.rotation.y -= dt * 0.03;
        // rings counter-rotate
        ringA.rotation.z += dt * 0.05;
        ringB.rotation.z -= dt * 0.038;
        ringC.rotation.z += dt * 0.026;
        shell.rotation.y += dt * 0.02;
        shell.rotation.x += dt * 0.008;
    }

    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
}

/* ── Ready (mark only after a successful first frame) ── */
try {
    renderer.render(scene, camera);
    stage.classList.add('ready');
    const fb = document.getElementById('coreFallback');
    if (fb) setTimeout(() => fb.remove(), 800);
    startLoop();
} catch (err) {
    stage.classList.add('no-webgl');
    const msg = document.getElementById('coreMessage');
    if (msg) msg.hidden = false;
}
