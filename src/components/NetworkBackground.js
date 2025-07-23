import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

const NetworkBackground = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particleSystemRef = useRef(null);
  const connectionsRef = useRef([]);
  
  useEffect(() => {
    // WebGLの利用可能性はレンダラー作成時にチェックする
    
    // シーン、カメラ、レンダラーの設定
    const scene = new THREE.Scene();
    // 正確な色コードを使用
    scene.background = new THREE.Color('#0a7463');
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // WebGLレンダラーの作成
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: 'default',
        precision: 'highp',
        logarithmicDepthBuffer: false,
        failIfMajorPerformanceCaveat: false
      });
      
      // レンダラーの設定
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 正確な色コードを使用
      renderer.setClearColor('#0a7463', 1.0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.autoClear = true;
      
      // DOMに追加
      mountRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error('WebGLレンダラーの作成に失敗しました:', error);
      const message = document.createElement('div');
      message.style.cssText = 'color: white; padding: 20px; text-align: center;';
      message.innerHTML = 'ブラウザがWebGLをサポートしていないか、有効になっていません。<br>別のブラウザをお試しください。';
      mountRef.current.appendChild(message);
      return; // エラーが発生した場合は処理を中断
    }
    
    // ポストプロセッシングの設定
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // FXAAアンチエイリアシングを追加
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(
      1 / (window.innerWidth * renderer.getPixelRatio()),
      1 / (window.innerHeight * renderer.getPixelRatio())
    );
    composer.addPass(fxaaPass);
    
    // マウント要素に追加
    mountRef.current.appendChild(renderer.domElement);
    
    // カメラの位置設定
    camera.position.z = 30;
    
    // パーティクルの数
    const particleCount = 1000;
    const hubCount = 30; // ハブとなる大きなノードの数
    
    // ジオメトリとマテリアルの作成
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // ブループリント風のグリッドを作成する関数
    const createBlueprintGrid = () => {
      // メイングリッドの佝組みを作成
      const gridPoints = [];
      const gridSize = 80;
      const cellSize = 10;
      
      // グリッド上にランダムな点を生成
      for (let x = -gridSize/2; x < gridSize/2; x += cellSize) {
        for (let z = -gridSize/2; z < gridSize/2; z += cellSize) {
          // グリッド上の点にランダムなノイズを加える
          const jitterX = (Math.random() - 0.5) * cellSize * 0.8;
          const jitterZ = (Math.random() - 0.5) * cellSize * 0.8;
          
          // Y軸は少しランダムに変化させる
          const y = (Math.random() - 0.5) * 40;
          
          gridPoints.push({
            x: x + jitterX,
            y: y,
            z: z + jitterZ
          });
        }
      }
      
      // ハブノードを追加
      const hubPoints = [];
      for (let i = 0; i < hubCount; i++) {
        const hubX = (Math.random() - 0.5) * gridSize * 0.8;
        const hubY = (Math.random() - 0.5) * 40;
        const hubZ = (Math.random() - 0.5) * gridSize * 0.8;
        
        hubPoints.push({
          x: hubX,
          y: hubY,
          z: hubZ,
          isHub: true
        });
      }
      
      return [...gridPoints, ...hubPoints];
    };
    
    // ブループリント風のグリッドを生成
    const blueprintPoints = createBlueprintGrid();
    
    // 必要な点の数を確認
    const pointCount = Math.min(particleCount, blueprintPoints.length);
    
    // パーティクルの位置と色を設定
    for (let i = 0; i < pointCount; i++) {
      const index = i * 3;
      const point = blueprintPoints[i];
      
      // 位置
      positions[index] = point.x;
      positions[index + 1] = point.y;
      positions[index + 2] = point.z;
      
      // ハブか通常のノードかで色とサイズを変える
      if (point.isHub) {
        // ハブはより明るく、より大きく
        // 背景色との対比を強めるために明るい色に設定
        colors[index] = 0.15; // R 
        colors[index + 1] = 0.85; // G - 明るい緑
        colors[index + 2] = 0.65; // B
        sizes[i] = 3.0; // 大きめのハブ
      } else {
        // 通常のノード
        // 背景色との対比を強めるために明るい色に設定
        colors[index] = 0.1 + Math.random() * 0.1; // R
        colors[index + 1] = 0.7 + Math.random() * 0.15; // G - 明るい緑
        colors[index + 2] = 0.5 + Math.random() * 0.15; // B
        sizes[i] = 0.8 + Math.random() * 0.3; // 少し大きめのノード
      }
    }
    
    // 残りのパーティクルをランダムに配置
    for (let i = pointCount; i < particleCount; i++) {
      const index = i * 3;
      
      // 位置
      positions[index] = (Math.random() - 0.5) * 100;
      positions[index + 1] = (Math.random() - 0.5) * 100;
      positions[index + 2] = (Math.random() - 0.5) * 100;
      
      // 色
      colors[index] = 0.05 + Math.random() * 0.1;
      colors[index + 1] = 0.5 + Math.random() * 0.3;
      colors[index + 2] = 0.2 + Math.random() * 0.2;
      
      // サイズ
      sizes[i] = 0.3 + Math.random() * 0.2;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // 円形のテクスチャを作成する関数
    function createCircleTexture() {
      // テクスチャサイズを大きくして高品質に
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, size, size);
      
      // 中心点と半径
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 1;
      
      // 柔らかい円を描画
      const gradient = context.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      // より自然なグラデーション
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      context.fill();
      
      // テクスチャ作成と設定
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.premultiplyAlpha = true; // アルファ値を事前乗算
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      return texture;
    }
    
    // カスタムシェーダーマテリアルの作成
    const nodeTexture = createCircleTexture();
    
    // カスタムシェーダーマテリアル
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: nodeTexture },
        time: { value: 0.0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (300.0 / -mvPosition.z);
          vAlpha = 0.6; // 透明度を高くする
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec4 texColor = texture2D(map, gl_PointCoord);
          if (texColor.a < 0.1) discard;
          gl_FragColor = vec4(vColor, texColor.a * vAlpha * 0.3); // さらに透明度を高くする
        }
      `,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    // パーティクルシステム
    const particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);
    
    // 接続線の作成
    const connections = [];
    const maxDistance = 20; // 接続する最大距離
    const minDistance = 5; // 最小距離
    const maxConnections = 3; // 通常ノードの最大接続数
    const maxHubConnections = 15; // ハブノードの最大接続数
    
    // 線のマテリアル
    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#10b095', // 背景色よりも明るい緑
      transparent: true,
      opacity: 0.4 // 透明度を適切に調整
    });
    
    // ブループリント風の接続を作成
    const connectionCounts = new Array(particleCount).fill(0); // 各ノードの接続数を追跡
    const isHub = new Array(particleCount).fill(false);
    
    // ハブノードを記録
    for (let i = 0; i < pointCount; i++) {
      if (i < blueprintPoints.length && blueprintPoints[i].isHub) {
        isHub[i] = true;
      }
    }
    
    // まずハブ同士を接続
    for (let i = 0; i < particleCount; i++) {
      if (!isHub[i]) continue;
      
      const p1 = {
        x: positions[i * 3],
        y: positions[i * 3 + 1],
        z: positions[i * 3 + 2]
      };
      
      for (let j = i + 1; j < particleCount; j++) {
        if (!isHub[j]) continue;
        if (connectionCounts[i] >= maxHubConnections) break;
        
        const p2 = {
          x: positions[j * 3],
          y: positions[j * 3 + 1],
          z: positions[j * 3 + 2]
        };
        
        const distance = Math.sqrt(
          Math.pow(p1.x - p2.x, 2) +
          Math.pow(p1.y - p2.y, 2) +
          Math.pow(p1.z - p2.z, 2)
        );
        
        if (distance < maxDistance * 2 && distance > minDistance) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(p1.x, p1.y, p1.z),
            new THREE.Vector3(p2.x, p2.y, p2.z)
          ]);
          
          // ハブ同士の接続はより太く
          const hubLineMaterial = new THREE.LineBasicMaterial({
            color: '#10b095', // 背景色よりも明るい緑
            transparent: true,
            opacity: 0.5, // 透明度を適切に調整
            linewidth: 2
          });
          
          const line = new THREE.Line(lineGeometry, hubLineMaterial);
          scene.add(line);
          connections.push(line);
          connectionsRef.current.push(line);
          
          connectionCounts[i]++;
          connectionCounts[j]++;
        }
      }
    }
    
    // 次にハブと通常ノードを接続
    for (let i = 0; i < particleCount; i++) {
      if (!isHub[i]) continue;
      
      const p1 = {
        x: positions[i * 3],
        y: positions[i * 3 + 1],
        z: positions[i * 3 + 2]
      };
      
      // 各ハブからの接続候補を収集
      const candidates = [];
      
      for (let j = 0; j < particleCount; j++) {
        if (isHub[j] || i === j) continue;
        
        const p2 = {
          x: positions[j * 3],
          y: positions[j * 3 + 1],
          z: positions[j * 3 + 2]
        };
        
        const distance = Math.sqrt(
          Math.pow(p1.x - p2.x, 2) +
          Math.pow(p1.y - p2.y, 2) +
          Math.pow(p1.z - p2.z, 2)
        );
        
        if (distance < maxDistance && distance > minDistance) {
          candidates.push({ index: j, distance: distance, point: p2 });
        }
      }
      
      // 距離順にソート
      candidates.sort((a, b) => a.distance - b.distance);
      
      // 最大接続数まで接続を作成
      const connectionsToCreate = Math.min(candidates.length, maxHubConnections - connectionCounts[i]);
      
      for (let k = 0; k < connectionsToCreate; k++) {
        const candidate = candidates[k];
        const j = candidate.index;
        
        if (connectionCounts[j] >= maxConnections) continue;
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(p1.x, p1.y, p1.z),
          new THREE.Vector3(candidate.point.x, candidate.point.y, candidate.point.z)
        ]);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        connections.push(line);
        connectionsRef.current.push(line);
        
        connectionCounts[i]++;
        connectionCounts[j]++;
      }
    }
    
    // 最後に通常ノード同士を接続
    for (let i = 0; i < particleCount; i++) {
      if (isHub[i] || connectionCounts[i] >= maxConnections) continue;
      
      const p1 = {
        x: positions[i * 3],
        y: positions[i * 3 + 1],
        z: positions[i * 3 + 2]
      };
      
      for (let j = i + 1; j < particleCount; j++) {
        if (isHub[j] || connectionCounts[j] >= maxConnections) continue;
        if (connectionCounts[i] >= maxConnections) break;
        
        const p2 = {
          x: positions[j * 3],
          y: positions[j * 3 + 1],
          z: positions[j * 3 + 2]
        };
        
        const distance = Math.sqrt(
          Math.pow(p1.x - p2.x, 2) +
          Math.pow(p1.y - p2.y, 2) +
          Math.pow(p1.z - p2.z, 2)
        );
        
        // 近いノード同士を接続するが、確率的に選択
        if (distance < maxDistance && distance > minDistance && Math.random() > 0.7) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(p1.x, p1.y, p1.z),
            new THREE.Vector3(p2.x, p2.y, p2.z)
          ]);
          
          // 通常ノード間の接続は細め
          const normalLineMaterial = new THREE.LineBasicMaterial({
            color: '#10b095', // 背景色よりも明るい緑
            transparent: true,
            opacity: 0.25 // 透明度を適切に調整
          });
          
          const line = new THREE.Line(lineGeometry, normalLineMaterial);
          scene.add(line);
          connections.push(line);
          connectionsRef.current.push(line);
          
          connectionCounts[i]++;
          connectionCounts[j]++;
        }
      }
    }
    
    // マウスの動きを追跡する関数
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // アニメーションループ
    const animate = () => {
      requestAnimationFrame(animate);
      // シンプルな自動回転
      particleSystem.rotation.y += 0.0015;
      particleSystem.rotation.x += 0.0008;
      // マウス位置に基づいて回転を調整
      if (mouseRef.current) {
        particleSystem.rotation.y += mouseRef.current.x * 0.01;
        particleSystem.rotation.x += mouseRef.current.y * 0.01;
      }
      composer.render();
    };

    
    animate();
    
    // リサイズハンドラ
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      
      // FXAAの解像度も更新
      if (fxaaPass) {
        fxaaPass.material.uniforms['resolution'].value.set(
          1 / (window.innerWidth * renderer.getPixelRatio()),
          1 / (window.innerHeight * renderer.getPixelRatio())
        );
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      
      // DOM要素の安全な削除
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // メモリリーク防止
      if (scene && particleSystem) {
        scene.remove(particleSystem);
      }
      
      if (particles) particles.dispose();
      if (particleMaterial) particleMaterial.dispose();
      
      if (connections && connections.length) {
        connections.forEach(line => {
          if (scene) scene.remove(line);
          if (line && line.geometry) line.geometry.dispose();
        });
      }
      
      if (lineMaterial) lineMaterial.dispose();
      
      // コンポーザーの破棄
      if (composer) composer.dispose();
      if (nodeTexture) nodeTexture.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default NetworkBackground;
