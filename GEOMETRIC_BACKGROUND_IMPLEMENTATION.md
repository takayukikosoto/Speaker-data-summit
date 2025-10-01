# 幾何学的メッシュ背景の実装ガイド

このドキュメントでは、Hero セクションに幾何学的メッシュ背景を実装する方法を説明します。

## 実装内容

- **メッシュ構造**: 点（ノード）を線で結び、三角形のメッシュを形成
- **伸縮する円**: ゆっくり拡大・縮小する半透明の円
- **アニメーション**: すべての要素がゆっくり動く
- **グラデーション背景**: ティールグリーン系のグラデーション

## ステップ1: GeometricBackground.js を作成

`src/components/GeometricBackground.js` を作成し、以下のコードをコピーします：

```javascript
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.div\`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(135deg, #0a7463 0%, #0d9488 50%, #14b8a6 100%);
\`;

const Canvas = styled.canvas\`
  width: 100%;
  height: 100%;
  display: block;
\`;

const GeometricBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const circlesRef = useRef([]);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Initialize nodes (points)
    const initNodes = () => {
      const nodes = [];
      const nodeCount = 25;

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 2,
        });
      }

      particlesRef.current = nodes;
    };

    // Initialize pulsing circles
    const initCircles = () => {
      const circles = [];
      const circleCount = 5;
      const minDistanceBetweenCircles = 300;
      const maxAttempts = 50;

      for (let i = 0; i < circleCount; i++) {
        const baseRadius = Math.random() * 80 + 40;
        let x, y;
        let attempts = 0;
        let validPosition = false;

        while (!validPosition && attempts < maxAttempts) {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
          validPosition = true;

          for (const existingCircle of circles) {
            const dx = x - existingCircle.x;
            const dy = y - existingCircle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistanceBetweenCircles) {
              validPosition = false;
              break;
            }
          }

          attempts++;
        }

        if (validPosition) {
          circles.push({
            x: x,
            y: y,
            baseRadius: baseRadius,
            currentRadius: baseRadius,
            maxRadius: baseRadius * 1.3,
            minRadius: baseRadius * 0.7,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseDirection: 1,
            opacity: Math.random() * 0.08 + 0.03,
          });
        }
      }

      circlesRef.current = circles;
    };

    // Calculate distance between two points
    const getDistance = (p1, p2) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Draw mesh structure
    const drawMesh = () => {
      const nodes = particlesRef.current;
      const maxDistance = 170;
      const minConnectionsPerNode = 2;
      const maxConnectionsPerNode = 3;
      const connections = [];
      const nodeConnections = new Map();

      nodes.forEach((_, i) => nodeConnections.set(i, 0));

      for (let i = 0; i < nodes.length; i++) {
        const nearbyNodes = [];
        
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const distance = getDistance(nodes[i], nodes[j]);
          nearbyNodes.push({ index: j, distance });
        }

        nearbyNodes.sort((a, b) => a.distance - b.distance);
        
        let connected = 0;
        for (const nearby of nearbyNodes) {
          if (connected >= minConnectionsPerNode) break;
          
          const j = nearby.index;
          
          const alreadyConnected = connections.some(
            conn => (conn.from === i && conn.to === j) || 
                   (conn.from === j && conn.to === i)
          );
          
          if (!alreadyConnected && nodeConnections.get(j) < maxConnectionsPerNode) {
            connections.push({
              from: i,
              to: j,
              distance: nearby.distance,
            });
            nodeConnections.set(i, nodeConnections.get(i) + 1);
            nodeConnections.set(j, nodeConnections.get(j) + 1);
            connected++;
          }
        }
      }

      connections.forEach(conn => {
        const opacity = (1 - conn.distance / maxDistance) * 0.15;
        ctx.beginPath();
        ctx.moveTo(nodes[conn.from].x, nodes[conn.from].y);
        ctx.lineTo(nodes[conn.to].x, nodes[conn.to].y);
        ctx.strokeStyle = \`rgba(255, 255, 255, \${opacity})\`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      drawSimplePolygons(nodes, connections);
    };

    // Draw simple triangles
    const drawSimplePolygons = (nodes, connections) => {
      const adjacencyList = {};
      nodes.forEach((_, i) => adjacencyList[i] = []);
      
      connections.forEach(conn => {
        adjacencyList[conn.from].push(conn.to);
        adjacencyList[conn.to].push(conn.from);
      });

      const drawnPolygons = new Set();

      for (let i = 0; i < nodes.length; i++) {
        const neighbors = adjacencyList[i];
        let triangleCount = 0;
        
        for (let j = 0; j < neighbors.length && triangleCount < 2; j++) {
          const n1 = neighbors[j];
          
          for (let k = j + 1; k < neighbors.length && triangleCount < 2; k++) {
            const n2 = neighbors[k];
            
            if (adjacencyList[n1].includes(n2)) {
              const triangle = [i, n1, n2].sort((a, b) => a - b);
              const key = triangle.join('-');
              
              if (!drawnPolygons.has(key)) {
                drawnPolygons.add(key);
                triangleCount++;
                
                ctx.beginPath();
                ctx.moveTo(nodes[triangle[0]].x, nodes[triangle[0]].y);
                ctx.lineTo(nodes[triangle[1]].x, nodes[triangle[1]].y);
                ctx.lineTo(nodes[triangle[2]].x, nodes[triangle[2]].y);
                ctx.closePath();
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                ctx.fill();
                
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw pulsing circles
      circlesRef.current.forEach((circle) => {
        circle.currentRadius += circle.pulseSpeed * circle.pulseDirection;
        
        if (circle.currentRadius >= circle.maxRadius) {
          circle.pulseDirection = -1;
        } else if (circle.currentRadius <= circle.minRadius) {
          circle.pulseDirection = 1;
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.currentRadius, 0, Math.PI * 2);
        
        ctx.fillStyle = \`rgba(255, 255, 255, \${circle.opacity * 0.3})\`;
        ctx.fill();
        
        ctx.strokeStyle = \`rgba(255, 255, 255, \${circle.opacity})\`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Update nodes
      particlesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }
      });

      drawMesh();

      // Draw nodes
      particlesRef.current.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initNodes();
      initCircles();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
};

export default GeometricBackground;
```

## ステップ2: Home.js（またはHeroセクションのあるページ）を修正

### 2-1. インポートを追加

```javascript
import GeometricBackground from '../components/GeometricBackground';
```

### 2-2. HeroSection スタイルから background-color を削除

**変更前:**
```javascript
const HeroSection = styled.section\`
  // ... 他のスタイル
  background-color: #0a7463;
  z-index: 0;
\`;
```

**変更後:**
```javascript
const HeroSection = styled.section\`
  // ... 他のスタイル
  z-index: 0;
  // background-colorを削除（グラデーションはGeometricBackground内で設定）
\`;
```

### 2-3. HeroSection内でGeometricBackgroundコンポーネントを使用

**変更前:**
```jsx
<HeroSection>
  <HeroContent>
    {/* コンテンツ */}
  </HeroContent>
</HeroSection>
```

**変更後:**
```jsx
<HeroSection>
  <GeometricBackground />
  <HeroContent>
    {/* コンテンツ */}
  </HeroContent>
</HeroSection>
```

### 2-4. HeroContent の z-index を確認

HeroContentが背景の上に表示されるように、z-indexが設定されていることを確認：

```javascript
const HeroContent = styled.div\`
  // ... 他のスタイル
  position: relative;
  z-index: 2;  // 背景より前面に
\`;
```

## カスタマイズオプション

### グラデーションカラーの変更

`CanvasContainer` のグラデーションを変更：

```javascript
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 50%, #YOUR_COLOR3 100%);
```

### ノード（点）の数を変更

```javascript
const nodeCount = 25; // お好みの数に変更
```

### 円の数を変更

```javascript
const circleCount = 5; // お好みの数に変更
```

### メッシュの密度を変更

```javascript
const maxDistance = 170; // 大きくすると密に、小さくすると疎になる
const minConnectionsPerNode = 2; // 各点の最小接続数
const maxConnectionsPerNode = 3; // 各点の最大接続数
```

### アニメーション速度を変更

```javascript
// ノードの速度
vx: (Math.random() - 0.5) * 0.3,  // 0.3を変更（大きくすると速く）
vy: (Math.random() - 0.5) * 0.3,

// 円の伸縮速度
pulseSpeed: Math.random() * 0.02 + 0.01,  // 値を変更
```

## 注意事項

- `styled-components` がインストールされている必要があります
- HeroSection は `position: relative` である必要があります
- HeroSection は `overflow: hidden` を設定することを推奨します

## トラブルシューティング

### 背景が表示されない
- HeroSectionの高さが設定されているか確認
- z-indexの設定が正しいか確認

### コンテンツが背景の下に隠れる
- HeroContentの `z-index: 2` が設定されているか確認

### アニメーションが重い
- `nodeCount` を減らす
- `circleCount` を減らす

以上で実装完了です！
