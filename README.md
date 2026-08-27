# Sriram Repaka | Electronics & Embedded Systems Engineer

A minimalist, high-performance portfolio website built with modern HTML5, CSS3, and Vanilla JavaScript. Features a custom vector circuit animation, dynamic project rendering via JSON data structures, and responsive design tailored for engineers and researchers.

🌐 **Live Website:** [https://Sriramrepaka.github.io/portfolio/](https://Sriramrepaka.github.io/portfolio/)

---

## Key Features

* **Single Source of Truth (`main.js`):** Project details, metrics, and highlights are structured in a central `PROJECTS_DATA` object, dynamically rendering both the main grid and deep-dive modals.
* **Vector PCB & IC Animations:** Custom HTML5 canvas-driven vector schematics and side rail PCB layouts.
* **Responsive & Mobile-Optimized:** Fully flexible design supporting mobile navigation drawers and smooth CSS grid scaling.
* **Zero-Build Deployment:** Pure static files optimized for ultra-fast load times and seamless deployment via GitHub Pages.

---

## Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Grid/Flexbox design system), Vanilla JavaScript (ES6+)
* **Icons & Typography:** Inline SVGs, Space Grotesk, Inter, and Fira Code
* **Hosting & CI/CD:** GitHub Pages

---

## Project Structure

```text
portfolio/
├── index.html           # Main markup & structure entry point
├── styles.css           # Design system, variables, and responsive layout styles
├── main.js              # Project data structures, modals, and controllers
├── circuit-vector.js    # Canvas-based vector schematic animations
└── assets/              # Project screenshots, GIFs, and media files

