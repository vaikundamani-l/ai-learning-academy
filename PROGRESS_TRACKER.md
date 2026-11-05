# Academy Development & Curriculum Progress Tracker

> **Last Updated:** 5 November 2026 — Phase 1 Website Foundation Complete (Theme & Responsive Verified)  
> **Overall Status:** Foundation Phase 1 Completed (persistent theme, navigation, responsive layout across mobile and desktop verified). Next: Phase 2 Learning Engine.  
> **Curriculum Scope:** 8 Parts | 31 Stages (0 to 30) | 4 Capstones | 25+ Scratch Implementations

---

## 1. High-Level Milestone Tracker

| Phase | Description | Target Deliverables | Status |
|---|---|---|---|
| **Phase 0** | **Project Audit & Master Planning** | `PROJECT_PLAN.md`, `CURRICULUM_MASTER.md`, `AGENT_RULES.md`, `CONTENT_STANDARDS.md`, `VISUAL_STANDARDS.md`, `PROGRESS_TRACKER.md` | **COMPLETED** |
| **Phase 1** | **Website Foundation** | React 19 + Vite + TS + Tailwind app shell, navigation, 15 core views, persistent light/dark/system theme, responsive verification | **COMPLETED** |
| **Phase 2** | **Learning Engine** | KaTeX math rendering, syntax-highlighted code blocks with copy, scroll-aware TOC, callouts, notes/bookmarks engine | *Pending* |
| **Phase 3** | **Visual & Simulation Engine** | Standardized SVG diagram frame, step-by-step animation controller, simulation harness | *Pending* |
| **Phase 4** | **CPU Pilot Benchmark Lesson** | 28 topics, 8 interactive visuals/simulators, C/Python/ASM examples, Linux investigations, assessments | *Pending* |
| **Phase 5** | **Curriculum Content Generation** | Stages 0 through 30 lessons rolled out one topic at a time following dependencies | *Pending* |
| **Phase 6** | **Practical Labs & Projects** | 25+ scratch implementations, hands-on lab environments, guided repositories | *Pending* |
| **Phase 7** | **Assessment & Mastery System** | Comprehensive diagnostic exams, automated code evaluation, transfer tasks | *Pending* |
| **Phase 8** | **Final Quality Review & Hardening** | Full platform audit, latency/accessibility benchmarks, cross-browser sign-off | *Pending* |

---

## 2. 31-Stage Curriculum Master Matrix

> **Note on Curriculum State:** All 31 stages are fully cataloged from the source PDF. In accordance with agent rules, no unverified lessons, planned simulators, or mock code runtimes are marked as complete. All stages remain in planned/preview status until their corresponding phase implementations pass testing.

| Stage | Part & Title | Scratch Build | Project | Simulators Planned | Status |
|---|---|---|---|---|---|
| **0** | **Part I:** Computer & Dev Fundamentals | File organizer, metadata inspector, directory script | Reproducible dev workspace & Git repo | CPU instruction cycle, bitwise visualizer, memory pyramid | *Preview Available* |
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
