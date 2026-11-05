# Academy Development & Curriculum Progress Tracker

> **Last Updated:** 5 November 2026 — Phases 1, 2, 3, and 4 Verified & Complete  
> **Overall Status:** Foundation (Phase 1), Learning Engine (Phase 2), Visual & Simulation Engine (Phase 3), and Flagship CPU Benchmark Pilot (Phase 4) all fully completed and tested. Ready for Phase 5 Curriculum Content Rollout.  
> **Curriculum Scope:** 8 Parts | 31 Stages (0 to 30) | 4 Capstones | 25+ Scratch Implementations

---

## 1. High-Level Milestone Tracker

| Phase | Description | Target Deliverables | Status |
|---|---|---|---|
| **Phase 0** | **Project Audit & Master Planning** | `PROJECT_PLAN.md`, `CURRICULUM_MASTER.md`, `AGENT_RULES.md`, `CONTENT_STANDARDS.md`, `VISUAL_STANDARDS.md`, `PROGRESS_TRACKER.md` | **COMPLETED** |
| **Phase 1** | **Website Foundation** | React 19 + Vite + TS + Tailwind app shell, navigation, 15 core views, persistent light/dark/system theme, responsive verification | **COMPLETED** |
| **Phase 2** | **Learning Engine** | KaTeX math rendering, syntax-highlighted code blocks with copy, scroll-aware TOC, callouts, notes/bookmarks engine | **COMPLETED** |
| **Phase 3** | **Visual & Simulation Engine** | Standardized SVG diagram frame, step-by-step animation controller, simulation harness | **COMPLETED** |
| **Phase 4** | **CPU Pilot Benchmark Lesson** | 28 topics, 8 interactive visuals/simulators, C/Python/ASM examples, Linux investigations, 10-question assessment, 3 exercises | **COMPLETED** |
| **Phase 5** | **Curriculum Content Generation** | Stages 0 through 30 lessons rolled out one topic at a time following dependencies | *In Progress* |
| **Phase 6** | **Practical Labs & Projects** | 25+ scratch implementations, hands-on lab environments, guided repositories | *Pending* |
| **Phase 7** | **Assessment & Mastery System** | Comprehensive diagnostic exams, automated code evaluation, transfer tasks | *Pending* |
| **Phase 8** | **Final Quality Review & Hardening** | Full platform audit, latency/accessibility benchmarks, cross-browser sign-off | *Pending* |

---

## 2. 31-Stage Curriculum Master Matrix

> **Note on Curriculum State:** All 31 stages are fully cataloged from the source PDF. In accordance with agent rules, no unverified lessons, planned simulators, or mock code runtimes are marked as complete. All stages remain in planned/preview status until their corresponding phase implementations pass testing.

| Stage | Part & Title | Scratch Build | Project | Simulators Planned | Status |
|---|---|---|---|---|---|
| **0** | **Part I:** Computer & Dev Fundamentals | File organizer, metadata inspector, directory script | Reproducible dev workspace & Git repo | CPU instruction cycle, bitwise visualizer, memory pyramid | **Pilot Complete** (28 Topics & 8 Visualizers) |
| **1** | **Part I:** Python & Computational Thinking | CSV parser, task manager, log parser, HTTP client | Tested data-processing CLI app | Memory reference model, async event loop | *Planned* |
| **2** | **Part I:** Data Structures, Algorithms & C | Hash table, binary heap, graph traversal, inverted index, LRU cache | Searchable collection with measured algorithms | Big-O visualizer, hash collisions, Dijkstra pathfinder, LRU queue | *Planned* |
| **3** | **Part I:** OS, Networking & Databases | Client/server, HTTP server, KV-store, queue with retries, DB API | Web service with persistence, auth, logs, backup | Process scheduler, TCP handshake, B-Tree index, container isolation | *Planned* |
| **4** | **Part II:** Mathematics for AI | Matrix ops, gradient descent, grad check, linear regression, SVD/PCA, bootstrap | Code-linked mathematical notebooks | 2D/3D linear transformations, 3D loss surface descent, PCA projection | *Planned* |
| **5** | **Part II:** Data Engineering & Analytics | Data validator, ingestion pipeline, quality report, recovery pipeline | Clean, versioned analytical dataset | Pipeline DAG flow, train/test leakage detector | *Planned* |
| **6** | **Part III:** Classical Machine Learning | Lin/Log regression, K-Means, KNN, decision tree, CV routine | Real prediction problem with simple baseline & error report | Decision boundary explorer, ROC threshold slider, K-means convergence | *Planned* |
| **7** | **Part III:** Broader AI: Search & Reasoning | A* pathfinder, constraint solver, rule engine, Bayes net inference | Scheduling/planning problem comparing deterministic vs. LLM | A* grid search, CSP N-Queens visualizer, Causal DAG explorer | *Planned* |
| **8** | **Part III:** Deep Learning Foundations | NumPy MLP, manual backprop, scalar autodiff, SGD/Adam, PyTorch model | Trained neural network vs. classical baseline | Neural forward/backprop visualizer, scalar autograd graph, optimizer race | *Planned* |
| **9** | **Part III:** Computer Vision | 2D convolution, small CNN with custom loop, IoU eval, image retrieval | OCR pipeline or image classifier tested out-of-distribution | 2D convolution kernel filter explorer, IoU/NMS demo, ResNet skip flow | *Planned* |
| **10** | **Part III:** NLP & Information Retrieval | N-gram LM, TF-IDF, BM25 retrieval, word-embedding, sequence model | Searchable document collection & text classifier | BM25 saturation curve, Word2Vec vector algebra, unfolded RNN cell | *Planned* |
| **11** | **Part III:** Transformers | Scaled dot-product, multi-head attention, transformer block, decoder LM | Tested transformer & next-token experiment | Scaled dot-product attention heatmap, causal masking matrix, head visualizer | *Planned* |
| **12** | **Part IV:** LM Data, Training & Inference | BPE tokenizer, small GPT, training loop, autoregressive loop, KV cache | Small model trained on documented corpus | BPE merge visualizer, sampling explorer (temp/top-p), KV cache memory trace | *Planned* |
| **13** | **Part IV:** LLM Application Engineering | Model-client wrapper, structured extraction, eval runner, web UI | Document extraction / classification app | JSON schema validator, rate limiter & backoff simulation | *Planned* |
| **14** | **Part IV:** Fine-Tuning & Alignment | LoRA adapter layer, SFT pipeline for small model, toy DPO loss | Fine-tuned model for narrow task vs. prompt baseline | LoRA rank decomposition explorer, DPO loss curve visualizer | *Planned* |
| **15** | **Part IV:** Embeddings, Search & RAG | Exact cosine search, chunking pipeline, minimal RAG, eval metrics | Document assistant with citations & evidence handling | Chunking strategy explorer, HNSW graph traversal, end-to-end RAG lifecycle | *Planned* |
| **16** | **Part IV:** Agents, Workflows & Memory | Bounded tool loop, state machine, memory CRUD, execution traces | Assistant that searches docs, queries DB & drafts outputs | ReAct state machine loop, tool permission sandbox, memory tiers | *Planned* |
| **17** | **Part IV:** Generative Vision, Speech & Multimodal | Small VAE, toy diffusion loop, audio spectrogram pipeline, multimodal app | Voice document assistant & image analysis tool | VAE latent manifold, step-by-step denoising diffusion, spectrogram generator | *Planned* |
| **18** | **Part IV:** Reinforcement Learning & Control | Grid world, value iteration, Q-learning, DQN, policy-gradient agent | RL comparison in simulated environments | Gridworld MDP value iteration simulator, Q-table heatmap, PPO clipped graph | *Planned* |
| **19** | **Part V:** Software Architecture & MLOps | Model-serving API, eval job, release manifest, monitoring & rollback | Deployed AI product with release process & operational dashboard | Canary deployment flow, latency percentiles simulator, drift dashboard | *Planned* |
| **20** | **Part V:** AI Performance & Distributed Systems | Benchmark harness, toy quantizer, batched inference, distributed demo | Profiling and optimization of a real bottleneck | GPU memory breakdown, continuous batching timeline, speculative decoding | *Planned* |
| **21** | **Part VI:** Security Foundations & Cryptography | Threat model, file integrity checker, toy cipher weakness demo, signed workflow | Secure identity, secrets, transport & access controls for a service | AES-ECB vs GCM leakage demo, Diffie-Hellman key exchange, PKI chain | *Planned* |
| **22** | **Part VI:** Web, API & Application Security | Vulnerable local app, security regression tests, rate limiter, upload validator | Find, document, fix and retest vulnerabilities in lab app | SQL injection vs. parameterized query, XSS flow, OAuth PKCE handshake | *Planned* |
| **23** | **Part VI:** Network, OS & Cloud Security | Isolated network lab, config audit script, cloud IAM exercise, container checks | Deployed service with restricted connectivity & verified blast radius | Packet capture dissection, IAM blast radius explorer, container attack surface | *Planned* |
| **24** | **Part VI:** Detection, Incident Response & Forensics | Log normalization, detection rules, incident timeline, alert dashboard | Harmless lab incident simulation, detection, triage & report | MITRE ATT&CK heatmap, timeline reconstruction visualizer, SIEM triage | *Planned* |
| **25** | **Part VI:** Security Testing & Specialist Branches | Scoped assessment plan, verification records, prioritized findings, retests | Authorized security assessment with reproducible findings | Executable ELF/PE disassembler visualizer, specialist branch roadmap | *Planned* |
| **26** | **Part VII:** Adversarial ML & Model Privacy | Toy adversarial example (FGSM), dataset poisoning, robustness harness, DP | Model evaluation under defined attacker capabilities | Adversarial perturbation explorer, DP privacy budget ($\epsilon$) curve | *Planned* |
| **27** | **Part VII:** LLM, RAG & Agent Security | Adversarial corpus, tool auth layer, tenant retrieval checks, audit trails | Assess and harden your own document assistant | Indirect prompt injection flow, tool sandbox barrier, OWASP LLM Top 10 | *Planned* |
| **28** | **Part VII:** AI-Assisted Cybersecurity | Classification baseline, temporal eval, security retriever, alert summarizer | Security analyst assistant with evidence citations | SOC alert ingestion & ML triage, phishing feature weights, human-in-the-loop | *Planned* |
| **29** | **Part VIII:** Research Methods & Evaluation | Experiment runner, versioned evaluations, automated tables, reproduction pkg | Reproduce one published result + investigate variation | Ablation study visualizer, statistical significance calculator, judge bias | *Planned* |
| **30** | **Part VIII:** Integrated Capstones | Capstone A, Capstone B, Capstone C, Capstone D | 4 Comprehensive End-to-End Capstones | Integrated system dashboards, multi-agent telemetry, security audit map | *Planned* |

---

## 3. Phase 1 Completion Audit — 5 November 2026

- **Completed:** Persistent theme engine supporting `light`, `dark`, and `system` preferences with `localStorage` synchronization, anti-flash inline hydration in `<head>`, and system color-scheme listener.
- **Controls Implemented:** Quick theme toggle in [`Navbar.tsx`](file:///home/shadow-khan/ai-master-course/src/components/layout/Navbar.tsx) and dedicated Appearance configuration cards in [`Settings.tsx`](file:///home/shadow-khan/ai-master-course/src/pages/Settings.tsx).
- **Validation:** 
  - `npm test`: 8/8 automated regression tests passing (valid backup round-trips, malformed data rejection, CPU step/rewind/halt logic, theme validator, resolution, storage fallback, and DOM class application).
  - `npm run build`: Zero TypeScript or Vite bundler warnings/errors (built in 493ms).
  - Headless Chrome responsive audit: 8 routes tested across Mobile (390×844) and Desktop (1440×900) in both Dark and Light themes with zero horizontal scroll overflow.
- **Next Task:** **DEVELOPMENT PHASE 2 — LEARNING ENGINE**:
  - Build reusable KaTeX mathematical formula rendering blocks.
  - Implement syntax-highlighted code blocks with copy action.
  - Deploy scroll-aware Table of Contents with reading progress tracker.
  - Implement reusable callout components (Note, Caution, Deep Dive, Hardware View).

---

## 4. Phase 2, 3 & 4 Completion Audit — 5 November 2026

- **Phase 2 (Learning Engine):**
  - KaTeX rendering engine (`MathBlock.tsx`) for display and inline mathematical equations.
  - PrismJS syntax highlighting (`CodeBlock.tsx`) supporting C, Python, x86/ARM Assembly, Bash, TS, with copy action and line highlighting.
  - Reusable semantic callouts (`Callout.tsx`) for notes, hardware insights, deep-dives, and cybersecurity warnings.
  - Scroll-aware dynamic Table of Contents (`ScrollAwareTOC.tsx`) utilizing `IntersectionObserver`.
  - In-lesson persistent notes vault and bookmarking drawer (`LessonNotesDrawer.tsx`).
  - Embedded interactive diagnostic self-checks (`SelfCheck.tsx`) with immediate rationale feedback.
- **Phase 3 (Visual & Simulation Engine Architecture):**
  - Reusable standardized interactive SVG frame (`SvgDiagramFrame.tsx`) with zoom/pan, fullscreen, and click-to-inspect component metadata drawer.
  - Standardized step-by-step animation controller (`AnimationController.tsx`) featuring Play/Pause (spacebar), discrete Step Forward/Backward, Reset, Speed Multipliers (`0.5x`, `1.0x`, `2.0x`), and cycle scrubber.
  - Standardized simulation harness (`SimulationHarness.tsx`) with live register file inspection, physical memory dump, and execution event stream.
- **Phase 4 (Stage 0 CPU Architecture Pilot Benchmark Master Lesson):**
  - Flagship lesson in [`LessonViewer.tsx`](file:///home/shadow-khan/ai-master-course/src/pages/LessonViewer.tsx) covering all 28 topics thoroughly from first principles.
  - 8 Interactive Visualizers and Simulators:
    1. [`CpuArchitectureDiagram.tsx`](file:///home/shadow-khan/ai-master-course/src/components/visual/cpu/CpuArchitectureDiagram.tsx) (CU, ALU, Registers, Buses, Clock, Cache hierarchy).
    2. [`InstructionCycleVisualizer.tsx`](file:///home/shadow-khan/ai-master-course/src/components/visual/cpu/InstructionCycleVisualizer.tsx) (5-stage IF, ID, EX, MEM, WB execution).
    3. [`RegisterBankVisualizer.tsx`](file:///home/shadow-khan/ai-master-course/src/components/visual/cpu/RegisterBankVisualizer.tsx) (64-bit GPRs, partial register addressing RAX/EAX/AX/AL, and condition flags).
    4. [`AluSimulator.tsx`](file:///home/shadow-khan/ai-master-course/src/components/visual/cpu/AluSimulator.tsx) (8-bit parallel adders, Boolean gates, carry propagation, flag generation).
    5. [`CacheHitMissSimulator.tsx`](file:///home/shadow-khan/ai-master-course/src/components/visual/cpu/CacheHitMissSimulator.tsx) (2-way set-associative cache, Tag/Set/Offset breakdown, LRU eviction, locality patterns).
    6. [`PipelineHazardVisualizer.tsx`](file:///home/shadow-khan/ai-master-course/src/components/visual/cpu/PipelineHazardVisualizer.tsx) (RAW data hazards, bubble stalls, hardware forwarding bypass, branch misprediction flushes).
    7. [`EducationalCpuSimulator.tsx`](file:///home/shadow-khan/ai-master-course/src/components/visual/cpu/EducationalCpuSimulator.tsx) (Serial 5-phase microcode execution, live registers, memory dump, event stream).
    8. [`ProcCpuInfoExplorer.tsx`](file:///home/shadow-khan/ai-master-course/src/components/visual/cpu/ProcCpuInfoExplorer.tsx) (Linux virtual filesystem `/proc/cpuinfo` parsing, feature flags filter, `lscpu`/`perf` commands).
  - KaTeX Mathematical Derivations: Iron Law of CPU Time, CPI with cache penalties, AMAT, Amdahl's Law, Pipeline Speedup.
  - Code Implementations: C row-major vs column-major cache traversal benchmark, Python CPU emulator from scratch, x86-64 vs ARM64 assembly comparison.
  - Assessment: 10 rigorous diagnostic multiple-choice questions with full pedagogical explanations.
  - Hands-On Practice: 3 progressive engineering challenges with solution hints.
- **Verification & Validation:**
  - `npm test`: 10/10 automated tests passing.
  - `npm run build`: Zero errors (built in ~600ms).
  - Headless Chrome responsive audit: 8 routes verified across Mobile (390×844) and Desktop (1440×900) in both Dark and Light themes with zero horizontal scroll overflow.
- **Next Phase:** **DEVELOPMENT PHASE 5 — CURRICULUM CONTENT ROLLOUT** (advancing through the remaining Stage 0 modules: Memory Pyramid & Binary Data Representation, Operating System Interface & Shell, Reproducible Workspace & Git).

