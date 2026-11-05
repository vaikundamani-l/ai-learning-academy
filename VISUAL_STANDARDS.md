# Visual Teaching & Simulation Standards

> **Visual Philosophy:** Visual explanations are mandatory teaching instruments, not decorative ornaments. Every diagram, animation, and simulation exists to reveal an otherwise invisible internal mechanism—such as instruction pipeline stages, memory bus transactions, gradient updates, or network packet encapsulations.

---

## 1. Visual Design Language & Color Palette

The Academy uses an engineering-first, dark-mode prioritized aesthetic with high contrast, crisp typography, and semantic color coding:

### 1.1 Semantic Hardware & System Color Hierarchy

| Semantic Domain | Color Name | Hex Code | Tailwind Token | Pedagogical Meaning |
|---|---|---|---|---|
| **Data & Busses** | Cyber Sky | `#38bdf8` | `sky-400` | Data pathways, registers holding values, tensor data. |
| **Control Signals** | Amber Core | `#f59e0b` | `amber-500` | Clock pulses, instruction opcodes, branch triggers, state enable lines. |
| **ALU & Processing** | Emerald Engine | `#10b981` | `emerald-500` | Mathematical execution, activations, successful checks. |
| **Memory & Storage** | Electric Indigo | `#818cf8` | `indigo-400` | RAM, L1/L2/L3 caches, KV-cache, database tables. |
| **Hazards & Attacks** | Crimson Red | `#f43f5e` | `rose-500` | Pipeline stalls, cache misses, buffer overflows, adversarial attacks. |
| **Neutral Substrates** | Slate Void | `#090d16` | `slate-950` | Primary app canvas background. |
| **Card Surfaces** | Slate Surface | `#0f172a` | `slate-900` | Module containers, diagram boards, interactive panels. |
| **Borders & Dividers** | Border Subdued | `#334155` | `slate-700` | High-definition component dividers. |

---

## 2. Reusable Visual Engine Components

All visual elements must conform to standardized component interfaces:

### 2.1 Interactive Architecture Diagrams (SVG Based)
- **Vector Scalability:** Must use responsive SVG `viewBox` coordinates without fixed pixel boundaries.
- **Inspectability:** Every functional block (e.g., Program Counter, Cache Controller, Attention Head) must support hover and click states revealing:
  - Component full name and acronym
  - Current bit-width or tensor dimension
  - Active input/output signals
  - Concise role in the current cycle
- **Data Flow Highlights:** Active wires/busses must animate using dashed stroke offsets or glowing highlights to illustrate data movement.

### 2.2 Time-Synchronized Animation Controller
Every animated process (such as the CPU 5-stage pipeline or autoregressive generation) must include a standardized control bar with:
- **Play / Pause Toggle:** Spacebar shortcut or clicking the control.
- **Step Forward ($+1$ cycle):** Advances the system exactly one discrete clock tick or operational phase.
- **Step Backward ($-1$ cycle):** Rewinds to the previous state to allow students to inspect intermediate transitions.
- **Reset:** Reverts the simulation to initial Cycle 0.
- **Speed Multiplier:** Selectable rates: `0.5x`, `1.0x`, `2.0x`.
- **Cycle Counter & Phase Indicator:** Clear readout (e.g. `Cycle 4: EXECUTE | PC = 0x0010 | IR = ADD R1, R2`).

### 2.3 Interactive Simulator Sandbox
Simulators must provide:
1. **Interactive Inputs:** Sliders, dropdowns, memory address inputs, or editable micro-code assembly.
2. **Real-Time State Readout:** Live visual updates to registers, memory arrays, cache tags, or loss gradients.
3. **Exploratory Guidance:** Contextual explanations stating *what* changed and *why* the output resulted from the student's modification.
4. **Preset Scenarios:** Pre-configured states demonstrating both typical behavior and edge cases (e.g., "Normal Pipeline Execution" vs. "Data Dependency Stalling" vs. "Branch Misprediction Flush").

---

## 3. Technology Selection Matrix

| Visual Need | Approved Technology | Usage Guidelines |
|---|---|---|
| **System Architecture Schematics** | Custom React SVG Components | Clean styling, zero bundle bloat, responsive tooltips. |
| **Flowcharts & State Machines** | Mermaid.js / Custom SVG | Use for high-level module flow, UML, and sequence diagrams. |
| **Hardware Timing & State Animations** | HTML5 Canvas / Custom React Hooks / GSAP | Use for high-frequency clock-accurate timing diagrams and pipeline grids. |
| **Mathematical Functions & Loss Surfaces** | Plotly.js / D3.js | Use for 2D/3D loss contours, ROC curves, and probability densities. |
| **High-Dimensional Embeddings & Spatial Topologies** | Three.js / React Three Fiber | Use strictly when 3D spatial rotation genuinely enhances understanding (e.g., 3D PCA projection, vector embeddings, memory cube architecture). Avoid decorative 3D. |

---

## 4. Accessibility & Performance Benchmarks

1. **Contrast Ratio:** Text, data lines, and component boundaries must maintain a minimum contrast ratio of `4.5:1` against their immediate background.
2. **60 FPS Animation Budget:** Animations must execute smoothly without blocking the main browser thread. Use `requestAnimationFrame` and CSS hardware-accelerated transforms (`translate3d`, `opacity`).
3. **Keyboard Navigability:** Interactive simulations must be controllable via standard keyboard shortcuts (e.g. Space to toggle play/pause, Left/Right arrows to step).
4. **Mobile & Tablet Responsiveness:** Large diagrams must support touch pan/zoom or clean horizontal scrolling with mini-map indicators.
