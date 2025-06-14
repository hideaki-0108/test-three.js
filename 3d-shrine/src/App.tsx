import './App.css';
import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

    // lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // object
    let models: THREE.Group | null = null;
    const glbLoader = new GLTFLoader();

    // 複数のGLBファイルを試す
    const modelPaths = ['./models/torii.glb'];

    const loadModel = (pathIndex = 0) => {
      if (pathIndex >= modelPaths.length) {
        console.error('All GLB models failed to load');
        return;
      }

      const currentPath = modelPaths[pathIndex];

      glbLoader.load(
        currentPath,
        gltf => {
          models = gltf.scene;
          // モデルのサイズを調整
          models.scale.set(2, 2, 2);
          models.rotation.y = Math.PI / 2;
          scene.add(models);
        },
        progress => {
          console.log(
            `Loading progress for ${currentPath}:`,
            ((progress.loaded / progress.total) * 100).toFixed(2) + '%'
          );
        },
        error => {
          console.error(`Error loading ${currentPath}:`, error);
          // 次のモデルを試す
          loadModel(pathIndex + 1);
        }
      );
    };

    // モデル読み込み開始
    loadModel();

    // animation
    const tick = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('wheel', e => {
      if (models) {
        camera.position.z += e.deltaY * -0.005;
      }
    });
  }, []);

  return (
    <>
      <canvas id="canvas" style={{ width: '100vw', height: '100vh' }}></canvas>
    </>
  );
}

export default App;
