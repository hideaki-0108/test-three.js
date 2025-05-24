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
    const modelPaths = [
      './models/kitty_001.glb',
      './models/Animals_FREE.glb'
    ];
    
    const loadModel = (pathIndex = 0) => {
      if (pathIndex >= modelPaths.length) {
        console.error('All GLB models failed to load');
        return;
      }
      
      const currentPath = modelPaths[pathIndex];
      console.log(`Attempting to load: ${currentPath}`);
      
      glbLoader.load(
        currentPath, 
        (gltf) => {
          models = gltf.scene;
          // モデルのサイズを調整
          models.scale.set(5, 5, 5);
          scene.add(models);
          console.log(`GLB model loaded successfully: ${currentPath}`);
        },
        (progress) => {
          console.log(`Loading progress for ${currentPath}:`, (progress.loaded / progress.total * 100).toFixed(2) + '%');
        },
        (error) => {
          console.error(`Error loading ${currentPath}:`, error);
          // 次のモデルを試す
          loadModel(pathIndex + 1);
        }
      );
    };
    
    // モデル読み込み開始
    loadModel();
    
    // フォールバック用のキューブ（GLBが読み込めない場合）
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(2, 0, 0); // GLBモデルと重ならないように配置
    scene.add(cube);

    // animation
    const tick = () => {
      if (models) {
        models.rotation.y += 0.01;
      }
      // キューブも回転させる
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
