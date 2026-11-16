import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function HeroCanvas3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0xcbd5e1, 0x090a0d, 0.7);
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    keyLight.position.set(4, 5, 6);
    scene.add(hemiLight, keyLight);

    // Composite procedural hub-motor / rotor assembly (5 distinct parts)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(1.6, 0.1, 0);

    const outerStatorGeo = new THREE.TorusGeometry(2.45, 0.045, 16, 84);
    const outerStatorMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      metalness: 0.35,
      roughness: 0.45,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    const outerStator = new THREE.Mesh(outerStatorGeo, outerStatorMat);

    const midRimGeo = new THREE.TorusGeometry(1.75, 0.032, 16, 72);
    const midRimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.2,
      transparent: true,
      opacity: 0.18,
    });
    const midRim = new THREE.Mesh(midRimGeo, midRimMat);

    const innerHubGeo = new THREE.TorusGeometry(0.95, 0.05, 12, 48);
    const innerHubMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      metalness: 0.75,
      roughness: 0.3,
      transparent: true,
      opacity: 0.25,
    });
    const innerHub = new THREE.Mesh(innerHubGeo, innerHubMat);

    const spokeGeo = new THREE.CylinderGeometry(0.015, 0.015, 3.45, 8);
    const spokeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.35,
      transparent: true,
      opacity: 0.16,
    });
    const spokeA = new THREE.Mesh(spokeGeo, spokeMat);
    const spokeB = new THREE.Mesh(spokeGeo, spokeMat);
    spokeB.rotation.z = Math.PI / 2;

    rotorGroup.add(outerStator, midRim, innerHub, spokeA, spokeB);
    rotorGroup.rotation.x = 0.22;
    rotorGroup.rotation.y = -0.35;
    scene.add(rotorGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      outerStator.rotation.z += delta * 0.18;
      midRim.rotation.x += delta * 0.24;
      innerHub.rotation.z -= delta * 0.28;
      spokeA.rotation.z += delta * 0.12;
      spokeB.rotation.z += delta * 0.12;

      renderer.render(scene, camera);

      if (prefersReducedMotion) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);

      outerStatorGeo.dispose();
      outerStatorMat.dispose();
      midRimGeo.dispose();
      midRimMat.dispose();
      innerHubGeo.dispose();
      innerHubMat.dispose();
      spokeGeo.dispose();
      spokeMat.dispose();
      envTexture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-60"
      aria-hidden="true"
    />
  );
}
