/**
 * CIRCUIT-VECTOR.JS
 * Strictly Disjoint Quad-Zone Zero-Crossing Concentric PCB Routing Engine
 * Complete isolation between corner corridors: zero overlap at bottom-right, bottom-left, and all corners.
 */

(function () {
  'use strict';

  class MinimalistVectorIC {
    constructor() {
      this.container = document.getElementById('vector-ic-container');
      if (!this.container) return;

      this.canvas = document.getElementById('ic-vector-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.pulses = [];
      this.mouse = { x: -1000, y: -1000, active: false };
      this.animFrameId = null;

      this.init();
    }

    init() {
      this.setupCanvas();
      this.bindEvents();
      this.startAnimationLoop();
      this.spawnPeriodicPulses();
    }

    setupCanvas() {
      if (!this.canvas) return;
      const rect = this.container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.width = rect.width || 480;
      this.height = rect.height || 480;

      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      if (this.ctx) {
        this.ctx.scale(dpr, dpr);
      }
    }

    spawnPulse(tracePath) {
      if (!tracePath || tracePath.length < 2) return;
      this.pulses.push({
        path: tracePath,
        segmentIndex: 0,
        segmentProgress: 0,
        speed: 0.03 + Math.random() * 0.02,
        color: Math.random() > 0.4 ? '#e5a93c' : (Math.random() > 0.5 ? '#10b981' : '#38bdf8')
      });
    }

    spawnPeriodicPulses() {
      setInterval(() => {
        if (this.tracePaths && this.tracePaths.length > 0) {
          const randPath = this.tracePaths[Math.floor(Math.random() * this.tracePaths.length)];
          this.spawnPulse(randPath);
        }
      }, 420);
    }

    bindEvents() {
      window.addEventListener('resize', () => this.setupCanvas());

      this.container.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.active = true;
      });

      this.container.addEventListener('mouseleave', () => {
        this.mouse.active = false;
      });

      this.container.addEventListener('click', () => {
        if (this.tracePaths) {
          this.tracePaths.forEach(tp => this.spawnPulse(tp));
        }
      });
    }

    startAnimationLoop() {
      const render = (time) => {
        this.drawScene(time);
        this.animFrameId = requestAnimationFrame(render);
      };
      this.animFrameId = requestAnimationFrame(render);
    }

    drawScene(time) {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const size = this.width;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2 - 8;
      const chipSize = size * 0.35;
      const halfChip = chipSize / 2;
      const pinLength = size * 0.09;
      const pinsPerSide = 8;
      const spacing = chipSize / (pinsPerSide + 1);

      const distToMouse = Math.hypot(this.mouse.x - cx, this.mouse.y - cy);
      const isHovered = this.mouse.active && distToMouse < size * 0.45;

      // =====================================================================
      // 1. DISJOINT QUAD-ZONE ROUTING (Zero Overlap in All Corners)
      // =====================================================================
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const tracePaths = [];
      const circularPads = [];

      // Helper to get pin pad tip coordinate
      const getPadTip = (side, pinIndex) => {
        const offset = (pinIndex + 1) * spacing - halfChip;
        if (side === 0) return { x: cx + offset, y: cy - halfChip - pinLength - 3 }; // Top
        if (side === 1) return { x: cx + halfChip + pinLength + 3, y: cy + offset }; // Right
        if (side === 2) return { x: cx + offset, y: cy + halfChip + pinLength + 3 }; // Bottom
        return { x: cx - halfChip - pinLength - 3, y: cy + offset }; // Left
      };

      const colorPalette = ['#e5a93c', '#10b981', '#38bdf8', '#e5a93c', '#10b981', '#38bdf8', '#e5a93c'];

      // ---------------------------------------------------------------------
      // A. RIGHT PINS (0 to 7): Strictly Isolated in [x >= 392, y <= cy + halfChip + 10]
      // ---------------------------------------------------------------------
      // R0: Escapes Up-Right
      const r0 = getPadTip(1, 0);
      const pathR0 = [r0, { x: r0.x + 18, y: r0.y }, { x: r0.x + 36, y: r0.y - 18 }, { x: r0.x + 60, y: r0.y - 18 }];
      tracePaths.push(pathR0);
      circularPads.push({ x: r0.x + 60, y: r0.y - 18, color: '#e5a93c', radius: 3.6 });

      // R7 to R1: Strictly nested vertical downward lanes, terminating safely above bottom zone
      for (let p = 7; p >= 1; p--) {
        const pt = getPadTip(1, p);
        const order = 7 - p; // 0 for p=7 (innermost), 6 for p=1 (outermost)
        const dX = 12 + order * 9;
        const d45 = 10 + order * 2;
        const targetX = pt.x + dX + d45;
        const targetY = pt.y + d45;
        // Limit finalY so it terminates well above the bottom zone (y <= cy + halfChip + 10)
        const maxAllowedY = cy + halfChip + 12;
        const desiredLen = 18 + (6 - order) * 7;
        const finalY = Math.min(targetY + desiredLen, maxAllowedY);

        const path = [
          pt,
          { x: pt.x + dX, y: pt.y },
          { x: targetX, y: targetY },
          { x: targetX, y: finalY }
        ];

        tracePaths.push(path);
        circularPads.push({
          x: targetX,
          y: finalY,
          color: colorPalette[order % colorPalette.length],
          radius: 3.4
        });
      }

      // ---------------------------------------------------------------------
      // B. BOTTOM PINS (0 to 7): Strictly Isolated in [x <= cx + halfChip + 10, y >= cy + halfChip + 25]
      // ---------------------------------------------------------------------
      // B0: Escapes Down-Left with safe compact clearance
      const b0 = getPadTip(2, 0);
      const pathB0 = [b0, { x: b0.x, y: b0.y + 16 }, { x: b0.x - 16, y: b0.y + 32 }, { x: b0.x - 32, y: b0.y + 32 }];
      tracePaths.push(pathB0);
      circularPads.push({ x: b0.x - 32, y: b0.y + 32, color: '#e5a93c', radius: 3.5 });

      // B7 to B1: Strictly nested horizontal rightward lanes, terminating safely before right zone
      for (let p = 7; p >= 1; p--) {
        const pt = getPadTip(2, p);
        const order = 7 - p; // 0 for p=7 (innermost), 6 for p=1 (outermost)
        const dY = 12 + order * 9;
        const d45 = 10 + order * 2;
        const targetX = pt.x + d45;
        const targetY = pt.y + dY + d45;
        // Limit finalX so it terminates well before the right zone (x <= cx + halfChip + 10)
        const maxAllowedX = cx + halfChip + 10;
        const desiredLen = 22 + (6 - order) * 7;
        const finalX = Math.min(targetX + desiredLen, maxAllowedX);

        const path = [
          pt,
          { x: pt.x, y: pt.y + dY },
          { x: targetX, y: targetY },
          { x: finalX, y: targetY }
        ];

        tracePaths.push(path);
        circularPads.push({
          x: finalX,
          y: targetY,
          color: colorPalette[(order + 1) % colorPalette.length],
          radius: 3.4
        });
      }

      // ---------------------------------------------------------------------
      // C. LEFT PINS (0 to 7): Strictly Isolated in [x <= cx - halfChip - 25, y <= cy + halfChip + 10]
      // ---------------------------------------------------------------------
      // L0: Escapes Up-Left
      const l0 = getPadTip(3, 0);
      const pathL0 = [l0, { x: l0.x - 18, y: l0.y }, { x: l0.x - 36, y: l0.y - 18 }, { x: l0.x - 60, y: l0.y - 18 }];
      tracePaths.push(pathL0);
      circularPads.push({ x: l0.x - 60, y: l0.y - 18, color: '#e5a93c', radius: 3.6 });

      // L7 to L1: Strictly nested vertical downward lanes, terminating safely above bottom zone
      for (let p = 7; p >= 1; p--) {
        const pt = getPadTip(3, p);
        const order = 7 - p;
        const dX = 12 + order * 9;
        const d45 = 10 + order * 2;
        const targetX = pt.x - dX - d45;
        const targetY = pt.y + d45;
        const maxAllowedY = cy + halfChip + 12;
        const desiredLen = 18 + (6 - order) * 7;
        const finalY = Math.min(targetY + desiredLen, maxAllowedY);

        const path = [
          pt,
          { x: pt.x - dX, y: pt.y },
          { x: targetX, y: targetY },
          { x: targetX, y: finalY }
        ];

        tracePaths.push(path);
        circularPads.push({
          x: targetX,
          y: finalY,
          color: colorPalette[(order + 2) % colorPalette.length],
          radius: 3.4
        });
      }

      // ---------------------------------------------------------------------
      // D. TOP PINS (0 to 7): Strictly Isolated in [y <= cy - halfChip - 20]
      // ---------------------------------------------------------------------
      // Right Half: T7 down to T4
      for (let p = 7; p >= 4; p--) {
        const pt = getPadTip(0, p);
        const order = 7 - p;
        const dY = 12 + order * 9;
        const d45 = 10 + order * 2;
        const targetX = pt.x + d45;
        const targetY = pt.y - dY - d45;
        const maxAllowedX = cx + halfChip + 10;
        const desiredLen = 20 + (3 - order) * 10;
        const finalX = Math.min(targetX + desiredLen, maxAllowedX);

        const path = [
          pt,
          { x: pt.x, y: pt.y - dY },
          { x: targetX, y: targetY },
          { x: finalX, y: targetY }
        ];

        tracePaths.push(path);
        circularPads.push({
          x: finalX,
          y: targetY,
          color: colorPalette[order % colorPalette.length],
          radius: 3.4
        });
      }

      // Left Half: T0 up to T3
      for (let p = 0; p <= 3; p++) {
        const pt = getPadTip(0, p);
        const order = p;
        const dY = 12 + order * 9;
        const d45 = 10 + order * 2;
        const targetX = pt.x - d45;
        const targetY = pt.y - dY - d45;
        const minAllowedX = cx - halfChip - 10;
        const desiredLen = 20 + (3 - order) * 10;
        const finalX = Math.max(targetX - desiredLen, minAllowedX);

        const path = [
          pt,
          { x: pt.x, y: pt.y - dY },
          { x: targetX, y: targetY },
          { x: finalX, y: targetY }
        ];

        tracePaths.push(path);
        circularPads.push({
          x: finalX,
          y: targetY,
          color: colorPalette[(order + 2) % colorPalette.length],
          radius: 3.4
        });
      }

      this.tracePaths = tracePaths;

      // Render All 100% Non-Overlapping Copper Traces
      tracePaths.forEach((tp, idx) => {
        ctx.lineWidth = 1.35;
        const traceColors = [
          'rgba(229, 169, 60, 0.48)',
          'rgba(16, 185, 129, 0.42)',
          'rgba(56, 189, 248, 0.38)'
        ];
        ctx.strokeStyle = traceColors[idx % traceColors.length];
        ctx.beginPath();
        ctx.moveTo(tp[0].x, tp[0].y);
        for (let i = 1; i < tp.length; i++) {
          ctx.lineTo(tp[i].x, tp[i].y);
        }
        ctx.stroke();
      });

      // Render All Circular ENIG Test Pads
      circularPads.forEach(pad => {
        ctx.fillStyle = pad.color || '#e5a93c';
        ctx.beginPath();
        ctx.arc(pad.x, pad.y, pad.radius, 0, Math.PI * 2);
        ctx.fill();

        if (pad.radius >= 3) {
          ctx.fillStyle = '#070a0f';
          ctx.beginPath();
          ctx.arc(pad.x, pad.y, pad.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.restore();

      // =====================================================================
      // 2. GOLD / COPPER LEADS & SMD SOLDER PADS (8 Pins per side)
      // =====================================================================
      ctx.save();
      for (let side = 0; side < 4; side++) {
        for (let p = 0; p < pinsPerSide; p++) {
          const offset = (p + 1) * spacing - halfChip;
          let lx, ly, lw, lh;

          if (side === 0) { // Top
            lx = cx + offset - 1.5;
            ly = cy - halfChip - pinLength;
            lw = 3;
            lh = pinLength;
          } else if (side === 1) { // Right
            lx = cx + halfChip;
            ly = cy + offset - 1.5;
            lw = pinLength;
            lh = 3;
          } else if (side === 2) { // Bottom
            lx = cx + offset - 1.5;
            ly = cy + halfChip;
            lw = 3;
            lh = pinLength;
          } else { // Left
            lx = cx - halfChip - pinLength;
            ly = cy + offset - 1.5;
            lw = pinLength;
            lh = 3;
          }

          // Gold / Copper Pin Body
          ctx.fillStyle = isHovered ? '#fce7b2' : '#e5a93c';
          ctx.fillRect(lx, ly, lw, lh);

          // Outer Gold ENIG SMD Solder Pad
          ctx.fillStyle = '#d4af37';
          if (side === 0) ctx.fillRect(lx - 1, ly - 3, 5, 3);
          else if (side === 1) ctx.fillRect(lx + lw, ly - 1, 3, 5);
          else if (side === 2) ctx.fillRect(lx - 1, ly + lh, 5, 3);
          else ctx.fillRect(lx - 3, ly - 1, 3, 5);
        }
      }
      ctx.restore();

      // =====================================================================
      // 3. CENTRAL SILICON PACKAGE (CLEAN MATTE BLACK SURFACE - NO TEXT/PATTERNS)
      // =====================================================================
      ctx.save();
      
      ctx.shadowColor = isHovered ? 'rgba(229, 169, 60, 0.35)' : 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = isHovered ? 24 : 18;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 8;

      const pkgGrad = ctx.createLinearGradient(cx - halfChip, cy - halfChip, cx + halfChip, cy + halfChip);
      pkgGrad.addColorStop(0, '#161d27');
      pkgGrad.addColorStop(0.4, '#0d1219');
      pkgGrad.addColorStop(1, '#080b0f');
      ctx.fillStyle = pkgGrad;

      const r = 8;
      ctx.beginPath();
      ctx.roundRect(cx - halfChip, cy - halfChip, chipSize, chipSize, r);
      ctx.fill();

      // Gold Chamfer Border
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = isHovered ? 'rgba(246, 192, 101, 0.85)' : 'rgba(229, 169, 60, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pin 1 Index Indicator (Subtle bevel dot)
      ctx.fillStyle = '#080b0f';
      ctx.strokeStyle = '#e5a93c';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx - halfChip + 13, cy - halfChip + 13, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // =====================================================================
      // 4. ACTIVE CURRENT PULSES FLOWING ALONG TRACES TO CIRCULAR PADS
      // =====================================================================
      ctx.save();
      for (let i = this.pulses.length - 1; i >= 0; i--) {
        const p = this.pulses[i];
        const seg = p.path;
        
        p.segmentProgress += p.speed;

        const p1 = seg[p.segmentIndex];
        const p2 = seg[p.segmentIndex + 1];

        if (p1 && p2) {
          const curX = p1.x + (p2.x - p1.x) * p.segmentProgress;
          const curY = p1.y + (p2.y - p1.y) * p.segmentProgress;

          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.segmentProgress >= 1) {
          p.segmentProgress = 0;
          p.segmentIndex++;
          if (p.segmentIndex >= seg.length - 1) {
            this.pulses.splice(i, 1);
          }
        }
      }
      ctx.restore();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MinimalistVectorIC());
  } else {
    new MinimalistVectorIC();
  }
})();
