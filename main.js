/**
 * MAIN.JS
 * Sriram Repaka - Minimalist Portfolio Controller
 * Structured with Sriram's CV Data (Projects, Skills, Education, Experience)
 */

(function () {
  'use strict';

  // Sriram Repaka's Real Projects from CV
  const PROJECTS_DATA = {
    "desktop-assistant": {
      title: "Smart Desktop Assistant & Custom Hardware Enclosure",
      subtitle: "ESP32 Embedded Companion & Fusion 360 3D CAD Enclosure",
      category: "embedded",
      image: "assets/Desktop_gadget.jpeg",
      tags: ["ESP32", "Fusion 360", "3D Printing", "Wi-Fi Sync", "C/C++"],
      description: "Designed an ESP32-driven desktop companion featuring task logging, Pomodoro timer, and Wi-Fi synchronization. Modeled a custom ergonomic enclosure with precise speaker/battery mounts in Fusion 360 and 3D-printed the final chassis.",
      metrics: [
        { label: "Microcontroller", val: "ESP32 Dual-Core" },
        { label: "CAD Tool", val: "Fusion 360" },
        { label: "Fabrication", val: "3D Printed Enclosure" },
        { label: "Connectivity", val: "Wi-Fi & BLE" }
      ],
      highlights: [
        "Architected real-time task manager and Pomodoro productivity state machine on ESP32",
        "Modeled multi-part snap-fit chassis with acoustic chamber for speaker in Fusion 360",
        "Implemented seamless cloud synchronization and NTP time synchronization over Wi-Fi",
        "Optimized power architecture for battery-backed portable operation"
      ],
      bom: [
        { des: "U1", desc: "Dual-Core WiFi/BLE SoC", mpn: "ESP32-WROOM-32D", package: "Module SMD" },
        { des: "DISP1", desc: "0.96\" Monochrome OLED 128x64", mpn: "SSD1306", package: "I2C 4-Pin" },
        { des: "U2", desc: "Single-Cell Li-ion Charger", mpn: "TP4056", package: "SOP-8" },
        { des: "SW1", desc: "Rotary Encoder with Push Button", mpn: "EC11", package: "Through-Hole" }
      ]
    },

    "analog-ic": {
      title: "Analog IC Filter Design: 4th-Order Linkwitz-Riley",
      subtitle: "130nm SG13G2 Silicon Process Sizing & PVT Simulation",
      category: "ic",
      image: "assets/icdesign.jpg",
      tags: ["130nm SG13G2", "Xschem", "ngspice", "5T-OTA", "PVT Analysis"],
      description: "Sized and simulated a 2-stage 5T-Operational Transconductance Amplifier (OTA) utilizing the open-source IHP 130nm SG13G2 BiCMOS process in Xschem and ngspice. Performed comprehensive Process, Voltage, Temperature (PVT) parameter and stability analysis.",
      metrics: [
        { label: "Process Node", val: "130nm SG13G2" },
        { label: "Topology", val: "2-Stage 5T-OTA" },
        { label: "Filter Order", val: "4th-Order L-R" },
        { label: "Simulation", val: "ngspice & Xschem" }
      ],
      highlights: [
        "Sized differential pair, current mirror active load, and compensation network in 130nm process",
        "Conducted multi-corner PVT (Process, Voltage, Temperature) Monte Carlo stability analysis",
        "Achieved desired phase margin (> 60°) and high unity-gain bandwidth product",
        "Constructed 4th-Order Linkwitz-Riley active audio crossover filter topology"
      ],
      bom: [
        { des: "M1, M2", desc: "Differential Pair NMOS", mpn: "sg13_lv_nmos", package: "130nm Silicon" },
        { des: "M3, M4", desc: "Active Load Current Mirror PMOS", mpn: "sg13_lv_pmos", package: "130nm Silicon" },
        { des: "Cc", desc: "Miller Compensation Capacitor", mpn: "mim_cap", package: "Metal-Insulator-Metal" },
        { des: "R_bias", desc: "Tail Bias Current Network", mpn: "rhigh", package: "Poly Resistor" }
      ]
    },

    "jetbot": {
      title: "AI-Powered Autonomous JetBot",
      subtitle: "Jetson Nano, LiDAR & Real-Time Deep Learning Vision",
      category: "robotics",
      image: "assets/jetbot.jpeg",
      tags: ["Jetson Nano", "LiDAR", "PyTorch", "ROS/ROS2", "SegNet/DetectNet"],
      description: "Built an autonomous lane-following robot with obstacle avoidance using NVIDIA Jetson Nano, 2D/3D LiDAR, and 9-axis IMU. Deployed real-time SegNet semantic segmentation and DetectNet object detection models for dynamic boundary tracking.",
      metrics: [
        { label: "Edge Compute", val: "NVIDIA Jetson Nano" },
        { label: "Sensor Array", val: "LiDAR + CSI Camera + IMU" },
        { label: "AI Framework", val: "PyTorch / TensorRT" },
        { label: "Robotics Stack", val: "ROS / ROS2" }
      ],
      highlights: [
        "Trained and optimized SegNet segmentation networks for real-time lane tracking at 30+ FPS",
        "Fused 2D LiDAR range data with IMU odometry for fast obstacle avoidance in dynamic environments",
        "Implemented low-level motor PID speed controllers interfacing Jetson GPIO to H-bridge drivers",
        "Integrated ROS2 message pipelines between perception, planning, and actuation nodes"
      ],
      bom: [
        { des: "SBC", desc: "NVIDIA Jetson Nano Developer Kit", mpn: "JETSON-NANO-B01", package: "Embedded Board" },
        { des: "LIDAR", desc: "360-Degree 2D Laser Scanner", mpn: "RPLIDAR-A1M8", package: "UART Interface" },
        { des: "CAM1", desc: "8MP Sony IMX219 CSI Camera", mpn: "IMX219-CAM", package: "MIPI-CSI Ribbon" },
        { des: "DRV1", desc: "Dual H-Bridge Motor Driver", mpn: "L298N", package: "Module" }
      ]
    },

    "brio-maze": {
      title: "Autonomous BRIO Maze Automation",
      subtitle: "Computer Vision Pose Estimation & Closed-Loop Dynamixel Control",
      category: "robotics",
      image: "assets/Brio.gif",
      tags: ["OpenCV", "ArUco Markers", "Dynamixel Servos", "Python", "Closed-Loop"],
      description: "Automated a physical tilting wooden labyrinth maze game using real-time ArUco marker pose estimation in OpenCV. Developed a closed-loop Python control algorithm driving precision Dynamixel smart servos to navigate the metal ball through complex pathways.",
      metrics: [
        { label: "Tracking Vision", val: "OpenCV ArUco" },
        { label: "Actuation", val: "Dynamixel Smart Servos" },
        { label: "Control Loop", val: "Closed-Loop PID" },
        { label: "Control Lang", val: "Python" }
      ],
      highlights: [
        "Implemented real-time ArUco corner tracking for perspective transformation and ball localization",
        "Designed 2-axis gimbal servo linkage mechanism for smooth tilting control",
        "Developed closed-loop proportional-derivative (PD) controller preventing ball falling into holes",
        "Programmed automated calibration and path-planning waypoint generation"
      ],
      bom: [
        { des: "M1, M2", desc: "Smart Robotic Actuator Servos", mpn: "Dynamixel XL430-W250", package: "Serial Bus" },
        { des: "CAM", desc: "High-Frame-Rate HD USB Webcam", mpn: "C920-HD", package: "USB 2.0" },
        { des: "MCU/IF", desc: "USB to RS-485/TTL Interface", mpn: "U2D2", package: "Controller" },
        { des: "MECH", desc: "Custom 3D-Printed Gimbal Arms", mpn: "CAD-MAZE-GIMBAL", package: "PETG Chassis" }
      ]
    },

    "lidar-navigation": {
      title: "Assistive LiDAR Navigation Aid",
      subtitle: "3D Time-of-Flight Depth Mapping & Pneumatic Stabilization",
      category: "embedded",
      image: "assets/project-iot-gateway.jpg",
      tags: ["3D LiDAR ToF", "Pneumatic Damper", "Embedded C", "Depth Mapping"],
      description: "Engineered an assistive walking cane for the visually impaired integrating 3D LiDAR Time-of-Flight depth mapping. Designed a custom pneumatic shock absorber mechanism to stabilize camera and sensor footage on rough terrain (B.Tech Thesis Project).",
      metrics: [
        { label: "Depth Sensor", val: "3D LiDAR ToF" },
        { label: "Stabilization", val: "Pneumatic Damper" },
        { label: "Firmware", val: "Embedded C / RTOS" },
        { label: "Feedback", val: "Haptic & Audio Alerts" }
      ],
      highlights: [
        "Integrated 3D LiDAR depth point-cloud processing for obstacle detection at various heights",
        "Engineered pneumatic mechanical suspension damping high-frequency walking vibrations",
        "Developed low-latency haptic vibration feedback with directional guidance",
        "Evaluated outdoor performance across uneven surfaces and lighting conditions"
      ],
      bom: [
        { des: "U1", desc: "32-Bit Microcontroller", mpn: "STM32F401RE", package: "LQFP-64" },
        { des: "S1", desc: "3D Time-of-Flight LiDAR Sensor", mpn: "VL53L5CX", package: "Optical Module" },
        { des: "MOT1", desc: "Precision ERM Haptic Motor", mpn: "DRV2605L", package: "VSSOP-10" },
        { des: "MECH", desc: "Custom Pneumatic Piston Cylinder", mpn: "PN-DAMPER-100", package: "Aluminum" }
      ]
    }
  };

  class PortfolioController {
    constructor() {
      this.initNavbar();
      this.initProjectFilters();
      this.initProjectModals();
      this.initScrollObservers();
    }

    initNavbar() {
      const menuBtn = document.getElementById('mobile-menu-toggle');
      const drawer = document.getElementById('mobile-nav-drawer');

      if (menuBtn && drawer) {
        menuBtn.addEventListener('click', () => {
          drawer.classList.toggle('open');
        });

        drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
          link.addEventListener('click', () => {
            drawer.classList.remove('open');
          });
        });
      }

      // Smooth scroll offset adjustment
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#' || !targetId) return;
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            const headerHeight = 70;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
              top: targetPos,
              behavior: 'smooth'
            });
          }
        });
      });

      // Sticky header elevation on scroll
      const header = document.getElementById('site-header');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
      });
    }

    initProjectFilters() {
      const filterBtns = document.querySelectorAll('.filter-pill-btn');
      const projectCards = document.querySelectorAll('.project-card');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const category = btn.dataset.filter;

          projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
              card.style.display = 'flex';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 40);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(15px)';
              setTimeout(() => {
                card.style.display = 'none';
              }, 200);
            }
          });
        });
      });
    }

    initProjectModals() {
      const modal = document.getElementById('project-detail-modal');
      const closeBtn = document.getElementById('modal-close-btn');
      const inspectBtns = document.querySelectorAll('[data-inspect-project]');

      if (!modal) return;

      const openModal = (projKey) => {
        const data = PROJECTS_DATA[projKey];
        if (!data) return;

        document.getElementById('modal-project-title').textContent = data.title;
        document.getElementById('modal-project-subtitle').textContent = data.subtitle;
        document.getElementById('modal-project-desc').textContent = data.description;
        
        const imgEl = document.getElementById('modal-project-img');
        if (imgEl) {
          imgEl.src = data.image;
          imgEl.alt = data.title;
        }

        // Render Metrics
        const metricsContainer = document.getElementById('modal-metrics-grid');
        if (metricsContainer) {
          metricsContainer.innerHTML = data.metrics.map(m => `
            <div class="modal-metric-box">
              <span class="metric-num">${m.val}</span>
              <span class="metric-name">${m.label}</span>
            </div>
          `).join('');
        }

        // Render Highlights
        const highlightsList = document.getElementById('modal-highlights-list');
        if (highlightsList) {
          highlightsList.innerHTML = data.highlights.map(h => `
            <li><i data-lucide="check-circle-2"></i> <span>${h}</span></li>
          `).join('');
        }

        // Render BOM Table
        const bomTableBody = document.getElementById('modal-bom-tbody');
        if (bomTableBody) {
          bomTableBody.innerHTML = data.bom.map(b => `
            <tr>
              <td class="bom-des">${b.des}</td>
              <td class="bom-desc">${b.desc}</td>
              <td class="bom-mpn"><code>${b.mpn}</code></td>
              <td class="bom-pkg">${b.package}</td>
            </tr>
          `).join('');
        }

        // Tags
        const tagsContainer = document.getElementById('modal-tags-list');
        if (tagsContainer) {
          tagsContainer.innerHTML = data.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');
        }

        if (window.lucide) {
          window.lucide.createIcons();
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };

      inspectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const key = btn.getAttribute('data-inspect-project');
          openModal(key);
        });
      });

      closeBtn?.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModal();
        }
      });
    }

    initScrollObservers() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new PortfolioController();
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
})();
