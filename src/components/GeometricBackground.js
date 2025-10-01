import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(135deg, #0a7463 0%, #0d9488 50%, #14b8a6 100%);
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

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
      const nodeCount = 25; // メッシュ構造用のノード数を減らす

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
      const circleCount = 5; // ランダムな円の数
      const minDistanceBetweenCircles = 300; // 円同士の最小距離
      const maxAttempts = 50; // 配置試行回数の上限

      for (let i = 0; i < circleCount; i++) {
        const baseRadius = Math.random() * 80 + 40; // 基本半径 40-120px
        let x, y;
        let attempts = 0;
        let validPosition = false;

        // 重ならない位置を探す
        while (!validPosition && attempts < maxAttempts) {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
          validPosition = true;

          // 既存の円との距離をチェック
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

        // 有効な位置が見つかった場合のみ追加
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
      const maxDistance = 170; // 点同士を結ぶ最大距離を少し短く
      const minConnectionsPerNode = 2; // 各ノードの最小接続数
      const maxConnectionsPerNode = 3; // 各ノードの最大接続数を減らす
      const connections = [];
      const nodeConnections = new Map(); // 各ノードの接続数を追跡

      // 初期化
      nodes.forEach((_, i) => nodeConnections.set(i, 0));

      // Phase 1: 各ノードを最も近い点と確実に接続
      for (let i = 0; i < nodes.length; i++) {
        const nearbyNodes = [];
        
        // すべてのノードとの距離を計算
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const distance = getDistance(nodes[i], nodes[j]);
          nearbyNodes.push({ index: j, distance });
        }

        // 距離でソート
        nearbyNodes.sort((a, b) => a.distance - b.distance);
        
        // 最も近いminConnectionsPerNode個のノードと接続
        let connected = 0;
        for (const nearby of nearbyNodes) {
          if (connected >= minConnectionsPerNode) break;
          
          const j = nearby.index;
          
          // 既に接続されているかチェック
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

      // 接続線を描画
      connections.forEach(conn => {
        const opacity = (1 - conn.distance / maxDistance) * 0.15;
        ctx.beginPath();
        ctx.moveTo(nodes[conn.from].x, nodes[conn.from].y);
        ctx.lineTo(nodes[conn.to].x, nodes[conn.to].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // シンプルな三角形のみを描画
      drawSimplePolygons(nodes, connections);
    };

    // シンプルな三角形のみを描画
    const drawSimplePolygons = (nodes, connections) => {
      // 各ノードの接続リストを作成
      const adjacencyList = {};
      nodes.forEach((_, i) => adjacencyList[i] = []);
      
      connections.forEach(conn => {
        adjacencyList[conn.from].push(conn.to);
        adjacencyList[conn.to].push(conn.from);
      });

      const drawnPolygons = new Set();

      // 三角形のみを探す（シンプルな構造）
      for (let i = 0; i < nodes.length; i++) {
        const neighbors = adjacencyList[i];
        
        // 最大2つの三角形まで
        let triangleCount = 0;
        
        for (let j = 0; j < neighbors.length && triangleCount < 2; j++) {
          const n1 = neighbors[j];
          
          for (let k = j + 1; k < neighbors.length && triangleCount < 2; k++) {
            const n2 = neighbors[k];
            
            // n1とn2が接続されているか確認
            if (adjacencyList[n1].includes(n2)) {
              // 三角形を形成
              const triangle = [i, n1, n2].sort((a, b) => a - b);
              const key = triangle.join('-');
              
              if (!drawnPolygons.has(key)) {
                drawnPolygons.add(key);
                triangleCount++;
                
                // 三角形を描画（塗りつぶし）
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

      // Update and draw pulsing circles (behind mesh)
      circlesRef.current.forEach((circle) => {
        // Update radius (pulsing effect)
        circle.currentRadius += circle.pulseSpeed * circle.pulseDirection;
        
        // Reverse direction when reaching limits
        if (circle.currentRadius >= circle.maxRadius) {
          circle.pulseDirection = -1;
        } else if (circle.currentRadius <= circle.minRadius) {
          circle.pulseDirection = 1;
        }

        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.currentRadius, 0, Math.PI * 2);
        
        // Fill with semi-transparent white
        ctx.fillStyle = `rgba(255, 255, 255, ${circle.opacity * 0.3})`;
        ctx.fill();
        
        // Draw outline
        ctx.strokeStyle = `rgba(255, 255, 255, ${circle.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Update node positions
      particlesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }
      });

      // Draw mesh structure
      drawMesh();

      // Draw nodes (points)
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
