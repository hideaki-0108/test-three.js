import './App.css';
import * as THREE from 'three';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const canvas: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;

    // scene
    const scene: THREE.Scene = new THREE.Scene();

    // camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    scene.add(camera);
    
    // renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // object
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // animation
    const tick = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);

      requestAnimationFrame(tick);
    }
    tick();

  }, []);

  return (
    <>
      <canvas id="canvas"></canvas>
      <div className="mainContent">hello world</div>
    </>
  );
}

export default App;
