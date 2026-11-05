import { Stage } from '../types/curriculum';

export const CURRICULUM_STAGES: Stage[] = [
  {
    id: 0,
    part: 1,
    partTitle: 'Part I — Computing and Software Foundations',
    title: 'Computer and Development Fundamentals',
    shortDescription: 'From binary representation and memory hierarchies to CPU architecture, OS primitives, and developer tooling.',
    prerequisites: [],
    originalTopics: [
      'Binary, hexadecimal, text encoding, Unicode',
      'CPU, RAM, storage, GPUs, and the memory hierarchy',
      'Programs, processes, threads, files, and permissions',
      'Operating systems and virtual machines',
      'Terminal navigation, environment variables, package installation',
      'Git commits, branches, merges, and conflict resolution',
      'Basic internet architecture'
    ],
    expandedSubtopics: [
      'Logic gates (AND, OR, NOT, XOR, NAND) and boolean arithmetic',
      'Two\'s complement representation, integer overflow, floating-point IEEE-754 preview',
      'Deep CPU Architecture: ALU, Control Unit, Registers, Instruction Cycle (Fetch, Decode, Execute, Memory, Writeback)',
      'Clock cycles, RISC vs. CISC philosophies (x86-64 vs ARM64)',
      'Linux filesystem hierarchy (/etc, /dev, /proc, /sys), file descriptors, POSIX permissions (chmod, chown)',
      'Git internals: blobs, trees, commits, references, .git folder anatomy',
      'Networking basics: IP addresses, CIDR subnetting, ports, TCP 3-way handshake overview'
    ],
    buildFromScratch: [
      'A command-line file organizer',
      'A file metadata inspector',
      'A directory-processing script that produces a report'
    ],
    projectTitle: 'Reproducible Development Workspace & Git Project',
    projectDescription: 'A complete, reproducible development workspace with installation instructions, shell configuration, and a fully version-controlled project.',
    masteryCheck: 'Start from a clean environment, install dependencies, run the application, diagnose a failure, and restore a previous working version.',
    simulators: [
      {
        id: 'cpu-instruction-cycle',
        title: 'CPU Instruction Execution Simulator',
        description: 'Interactive 5-stage CPU pipeline with fetch, decode, execute, memory, and writeback cycle tracking.',
        category: 'hardware',
        iconName: 'Cpu',
        path: '/simulators/cpu-instruction-cycle',
        stageId: 0
      },
      {
        id: 'memory-hierarchy',
        title: 'Memory Hierarchy Latency Visualizer',
        description: 'Interactive latency comparison from CPU L1/L2/L3 registers to RAM, NVMe SSDs, and network hops.',
        category: 'hardware',
        iconName: 'Layers',
        path: '/simulators/memory-hierarchy',
        stageId: 0
      },
      {
        id: 'binary-hex-bitwise',
        title: 'Binary & Bitwise Operations Lab',
        description: 'Live bit-fiddling explorer with two\'s complement signed numbers, bitmasks, and logic gates.',
        category: 'hardware',
        iconName: 'Binary',
        path: '/simulators/binary-hex-bitwise',
        stageId: 0
      }
    ],
    estimatedHours: '40-60 hours',
    category: 'Computing'
  },
  {
    id: 1,
    part: 1,
    partTitle: 'Part I — Computing and Software Foundations',
    title: 'Python and Computational Thinking',
    shortDescription: 'Core Python data structures, memory references, OOP composition, asynchronous programming, and clean software engineering.',
    prerequisites: [0],
    originalTopics: [
      'Types, variables, control flow, functions',
      'Lists, dictionaries, sets, tuples, iterators',
      'Mutability, references, scope, exceptions',
      'Modules, packages, environments, dependencies',
      'Classes and composition',
      'Type hints, logging, testing, profiling, debugging',
      'Files, CSV, JSON, regular expressions, HTTP requests',
      'Async programming and concurrency fundamentals'
    ],
    expandedSubtopics: [
      'CPython execution model: Bytecode, AST, and GIL constraints',
      'Python object model: id(), reference counting, shallow vs deep copying',
      'Decorators, generators (yield), and context managers (__enter__, __exit__)',
      'Static typing with mypy and runtime data validation with Pydantic',
      'Concurrency models: Multi-threading vs Multi-processing vs asyncio event loop',
      'Testing with pytest: fixtures, parametrization, mock objects, and coverage analysis'
    ],
    buildFromScratch: [
      'A CSV parser for a deliberately limited format',
      'A command-line task manager',
      'A log parser and summary generator',
      'A simple socket-based HTTP client after networking basics'
    ],
    projectTitle: 'Tested Data-Processing CLI Application',
    projectDescription: 'A production-grade, tested data-processing application with robust error messages, input validation, and a command-line interface.',
    masteryCheck: 'Handle malformed files, missing values, failed requests, and unexpected inputs without silently producing incorrect results.',
    simulators: [
      {
        id: 'python-memory-model',
        title: 'Python Object & Reference Explorer',
        description: 'Visualizer illustrating heap allocations, pointers, variable scope, and mutability mutations.',
        category: 'systems',
        iconName: 'Terminal',
        path: '/simulators/python-memory-model',
        stageId: 1
      },
      {
        id: 'async-event-loop',
        title: 'Asyncio Event Loop Visualizer',
        description: 'Step through tasks, coroutines, futures, and the non-blocking execution cycle.',
        category: 'systems',
        iconName: 'Activity',
        path: '/simulators/async-event-loop',
        stageId: 1
      }
    ],
    estimatedHours: '60-80 hours',
    category: 'Computing'
  },
  {
    id: 2,
    part: 1,
    partTitle: 'Part I — Computing and Software Foundations',
    title: 'Data Structures, Algorithms, and Broader Programming',
    shortDescription: 'Algorithmic complexity, fundamental data structures, graph traversals, numerical precision, and foundational C programming.',
    prerequisites: [0, 1],
    originalTopics: [
      'Time and memory complexity, Big-O',
      'Arrays, linked lists, stacks, queues, hash tables',
      'Trees, heaps, graphs, tries',
      'Searching, sorting, recursion, divide-and-conquer',
      'Greedy algorithms, dynamic programming',
      'Breadth-first and depth-first search, shortest paths',
      'Floating-point representation and numerical errors',
      'Learn enough C for pointers, allocation, stack/heap, compilation, and memory errors',
      'Add basic HTML, CSS, and JavaScript for usable interfaces'
    ],
    expandedSubtopics: [
      'Amortized analysis, Master Theorem for divide-and-conquer recurrences',
      'Hash table collision strategies: Separate chaining vs Open addressing (linear/quadratic probing)',
      'Binary heaps and priority queue mechanics',
      'Graph algorithms: Dijkstra, Bellman-Ford, A*, Topological sort (Kahn\'s algorithm)',
      'Floating-point pitfalls: catastrophic cancellation, IEEE-754 denormals',
      'C memory model: malloc/free, pointer arithmetic, stack frames, segmentation faults'
    ],
    buildFromScratch: [
      'A hash table',
      'A binary heap',
      'A graph traversal toolkit',
      'A small inverted search index',
      'An LRU cache'
    ],
    projectTitle: 'Searchable Collection with Measured Algorithms',
    projectDescription: 'A small searchable collection with an interface, benchmarking harness, and empirically measured algorithmic choices.',
    masteryCheck: 'Choose appropriate structures, justify their complexity, and explain why a numerically or algorithmically naive implementation fails.',
    simulators: [
      {
        id: 'big-o-visualizer',
        title: 'Big-O Growth & Complexity Simulator',
        description: 'Interactive comparison of O(1), O(log n), O(n), O(n log n), O(n^2), and O(2^n) curves under scale.',
        category: 'math',
        iconName: 'TrendingUp',
        path: '/simulators/big-o-visualizer',
        stageId: 2
      },
      {
        id: 'graph-pathfinding',
        title: 'Interactive Graph Traversal & Dijkstra Lab',
        description: 'Step-by-step frontier expansion for BFS, DFS, and Dijkstra shortest path on custom grid topologies.',
        category: 'systems',
        iconName: 'GitCommit',
        path: '/simulators/graph-pathfinding',
        stageId: 2
      },
      {
        id: 'lru-cache-visualizer',
        title: 'LRU Cache Eviction Visualizer',
        description: 'Live doubly-linked list and hash map coordination during lookups, insertions, and evictions.',
        category: 'systems',
        iconName: 'Archive',
        path: '/simulators/lru-cache-visualizer',
        stageId: 2
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Computing'
  },
  {
    id: 3,
    part: 1,
    partTitle: 'Part I — Computing and Software Foundations',
    title: 'Operating Systems, Networking, and Databases',
    shortDescription: 'Concurrency, virtual memory, TCP/IP socket lifecycles, relational query planning, ACID transactions, and container isolation.',
    prerequisites: [0, 1, 2],
    originalTopics: [
      'Scheduling, synchronization, locks, races, deadlocks',
      'Virtual memory, file systems',
      'TCP/IP, UDP, DNS, HTTP, TLS, sockets',
      'Request lifecycles, proxies, timeouts, retries',
      'Relational modeling, SQL, joins, indexes, transactions',
      'Isolation, consistency, backups, recovery',
      'Caches, queues, object storage',
      'Containers and isolation boundaries'
    ],
    expandedSubtopics: [
      'Kernel scheduling: Context switching, CFS, priority inversion, futexes',
      'Virtual memory internals: Page tables, TLB misses, page faults, swapping',
      'TCP flow and congestion control: Sliding window, slow start, cubic/bbr',
      'TLS 1.3 handshake cryptographic protocol exchange',
      'Database internals: B-Tree index structure, write-ahead logging (WAL), MVCC, isolation levels',
      'Linux namespaces (PID, Mount, Net, IPC) and cgroups underlying containerization'
    ],
    buildFromScratch: [
      'A local client/server program',
      'A small HTTP server',
      'A persistent key-value store',
      'A queue with retries',
      'A database-backed API'
    ],
    projectTitle: 'Resilient Web Service with Persistence, Auth & Backup',
    projectDescription: 'A small production-style web service featuring database persistence, authentication, structured logs, automated tests, and backup restoration verification.',
    masteryCheck: 'Trace a request from client to database, diagnose a slow query, reproduce a race condition, and restore data from backup.',
    simulators: [
      {
        id: 'tcp-handshake-simulator',
        title: 'TCP 3-Way Handshake & Packet Loss Lab',
        description: 'Inspect SYN, SYN-ACK, ACK exchanges, sequence numbers, packet drops, and retransmission timers.',
        category: 'network',
        iconName: 'Wifi',
        path: '/simulators/tcp-handshake-simulator',
        stageId: 3
      },
      {
        id: 'btree-index-visualizer',
        title: 'Database B-Tree Index Search & Split Visualizer',
        description: 'See how database indexes maintain balance during insertions and how range scans traverse leaf pointers.',
        category: 'systems',
        iconName: 'Database',
        path: '/simulators/btree-index-visualizer',
        stageId: 3
      }
    ],
    estimatedHours: '90-130 hours',
    category: 'Systems'
  },
  {
    id: 4,
    part: 2,
    partTitle: 'Part II — Mathematics and Data',
    title: 'Mathematics for AI',
    shortDescription: 'Linear algebra, multivariable calculus, numerical optimization, probability distributions, statistical inference, and discrete math.',
    prerequisites: [1, 2],
    originalTopics: [
      'Linear algebra: vectors, matrices, products, norms, projections, rank, eigenvalues/eigenvectors, SVD, positive semidefinite matrices, PCA',
      'Calculus and optimization: derivatives, gradients, chain rule, Jacobians, Hessians, constraints, conditioning, convexity, numerical optimization',
      'Probability: conditional probability, Bayes, independence, distributions, expectation, variance, covariance, likelihood, entropy, KL divergence',
      'Statistics: sampling, estimation, uncertainty intervals, hypothesis tests, effect sizes, bootstrap, experiment design, confounding, multiple comparisons',
      'Discrete math: logic, sets, combinatorics, graphs, recurrences'
    ],
    expandedSubtopics: [
      'Geometric interpretation of linear transformations, rank-nullity, determinant as volume scaling',
      'Singular Value Decomposition (SVD) mechanics and low-rank approximation',
      'Gradient vectors, directional derivatives, contour plots, condition numbers, and saddle point geometry',
      'Information theory: Shannon entropy, cross-entropy, mutual information, Kullback-Leibler divergence',
      'Statistical testing: p-values vs confidence intervals, statistical power, bootstrap resampling'
    ],
    buildFromScratch: [
      'Small vector/matrix operations',
      'Gradient descent',
      'Numerical gradient checking',
      'Linear regression',
      'PCA using a numerical SVD routine',
      'Bootstrap uncertainty estimation'
    ],
    projectTitle: 'Code-Linked Mathematical Notebooks & Experiments',
    projectDescription: 'Executable computational notebooks with rigorous numerical demonstrations, interactive plots, and mathematical derivations.',
    masteryCheck: 'Derive linear-regression gradients, explain PCA geometrically, apply Bayes, and distinguish statistical significance from practical usefulness.',
    simulators: [
      {
        id: 'loss-surface-descent',
        title: '3D Loss Surface & Gradient Descent Sandbox',
        description: 'Tune learning rate and momentum on convex bowls, saddle points, and Rosenbrock valleys.',
        category: 'math',
        iconName: 'Maximize2',
        path: '/simulators/loss-surface-descent',
        stageId: 4
      },
      {
        id: 'linear-transform-eigen',
        title: '2D/3D Linear Transformation & Eigenvector Explorer',
        description: 'Visualize matrix multiplications distorting space, showing invariant eigenspaces.',
        category: 'math',
        iconName: 'Grid',
        path: '/simulators/linear-transform-eigen',
        stageId: 4
      }
    ],
    estimatedHours: '100-150 hours',
    category: 'Mathematics'
  },
  {
    id: 5,
    part: 2,
    partTitle: 'Part II — Mathematics and Data',
    title: 'Data Engineering and Analytical Practice',
    shortDescription: 'Data collection, provenance, schemas, validation, missing value imputation, leakage prevention, and reproducible pipelines.',
    prerequisites: [1, 3, 4],
    originalTopics: [
      'Collection and provenance',
      'Schemas, validation, deduplication, labeling',
      'Missing data, outliers, imbalance, sampling bias',
      'Exploratory analysis and visualization',
      'Batch/streaming pipelines',
      'Dataset versioning and reproducible transformations',
      'Licensing, consent, retention, deletion',
      'Entity resolution and train/test contamination'
    ],
    expandedSubtopics: [
      'Columnar data formats: Parquet, Feather, Arrow memory buffers',
      'Imputation methodologies: KNN imputation, iterative multivariate imputation, indicator flags',
      'Class imbalance strategies: SMOTE, ADASYN, focal weighting, balanced batch sampling',
      'Target leakage mechanisms and temporal split validation',
      'Dataset lineage, cryptographic hashing, and data versioning frameworks'
    ],
    buildFromScratch: [
      'A data validator',
      'A reproducible ingestion/cleaning pipeline',
      'A dataset quality report',
      'A transformation pipeline with failure recovery'
    ],
    projectTitle: 'Messy Dataset to Documented Analytical Asset',
    projectDescription: 'Turn a genuinely messy, corrupted raw dataset into a clean, documented, version-controlled analytical dataset.',
    masteryCheck: 'Explain major transformations, identify possible leakage, and regenerate the dataset from its source.',
    simulators: [
      {
        id: 'data-leakage-detector',
        title: 'Train/Validation Leakage & Contamination Simulator',
        description: 'Identify lookahead bias, duplicate record leakage, and scaling contamination across splits.',
        category: 'systems',
        iconName: 'AlertTriangle',
        path: '/simulators/data-leakage-detector',
        stageId: 5
      }
    ],
    estimatedHours: '50-80 hours',
    category: 'Mathematics'
  },
  {
    id: 6,
    part: 3,
    partTitle: 'Part III — Machine Learning and AI Foundations',
    title: 'Classical Machine Learning',
    shortDescription: 'Supervised and unsupervised algorithms, regularization, decision trees, boosting, SVMs, calibration, and rigorous error analysis.',
    prerequisites: [4, 5],
    originalTopics: [
      'Supervised, unsupervised, semi-supervised learning',
      'Linear/logistic regression; regularization, scaling',
      'Decision trees, random forests, boosting',
      'Nearest neighbors, naive Bayes, SVMs',
      'Clustering, dimensionality reduction, anomaly detection',
      'Calibration, thresholds',
      'Cross-validation, hyperparameter search',
      'Grouped/temporal evaluation',
      'Interpretability and error analysis'
    ],
    expandedSubtopics: [
      'L1 (Lasso) vs L2 (Ridge) geometry of regularization and sparsity constraints',
      'Tree splitting criteria: Gini impurity, Shannon entropy, variance reduction',
      'Boosting mathematics: AdaBoost exponential loss, Gradient Boosting pseudo-residuals',
      'Support Vector Machines: Margin maximization, Lagrange multipliers, kernel trick',
      'Evaluation metrics: ROC-AUC, PR-AUC, F-beta, Brier score calibration, confusion matrix diagnostics',
      'Explainability: SHAP (Shapley additive explanations), Partial Dependence Plots'
    ],
    buildFromScratch: [
      'Linear and logistic regression',
      'K-means clustering',
      'K-nearest neighbors',
      'A small decision tree',
      'A cross-validation routine'
    ],
    projectTitle: 'Prediction Pipeline with Baseline & Error Analysis',
    projectDescription: 'A real prediction problem with a simple heuristic baseline, reproducible preprocessing, justified metrics, and an error decomposition report.',
    masteryCheck: 'Explain why validation reflects deployment. Show failures and whether improvement is meaningful. A negative result is acceptable when the experiment is valid.',
    simulators: [
      {
        id: 'decision-boundary-lab',
        title: 'Decision Boundary Interactive Sandbox',
        description: 'Observe real-time decision surface partitioning between Logistic Regression, Decision Trees, SVM (RBF), and KNN.',
        category: 'neural',
        iconName: 'Target',
        path: '/simulators/decision-boundary-lab',
        stageId: 6
      },
      {
        id: 'roc-pr-curve-explorer',
        title: 'ROC & Precision-Recall Threshold Explorer',
        description: 'Slide classification thresholds to see real-time shifts in true positives, false alarms, and precision/recall trade-offs.',
        category: 'math',
        iconName: 'Sliders',
        path: '/simulators/roc-pr-curve-explorer',
        stageId: 6
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Machine Learning'
  },
  {
    id: 7,
    part: 3,
    partTitle: 'Part III — Machine Learning and AI Foundations',
    title: 'Broader AI: Search, Reasoning, and Uncertainty',
    shortDescription: 'State-space search, A*, constraint satisfaction, symbolic logic, knowledge graphs, Bayesian networks, and causal inference.',
    prerequisites: [2, 4],
    originalTopics: [
      'State-space and heuristic search; A*',
      'Constraint satisfaction',
      'Propositional/predicate logic',
      'Rule-based systems, knowledge representation',
      'Planning and scheduling',
      'Bayesian networks, probabilistic inference',
      'Decision theory',
      'Causal inference foundations including interventions, confounding, and causal graphs'
    ],
    expandedSubtopics: [
      'Heuristic admissibility and consistency conditions in A*',
      'CSP algorithms: Backtracking search, AC-3 arc consistency, MRV heuristic',
      'First-order logic, unification, resolution refutation proofs',
      'Bayesian network exact inference via variable elimination and factor graphs',
      'Judea Pearl\'s Causal Ladder: Association, Intervention (do-calculus), Counterfactuals; Backdoor criterion'
    ],
    buildFromScratch: [
      'An A* pathfinder',
      'A small constraint solver',
      'A rule-based inference engine',
      'Exact inference for a tiny Bayesian network'
    ],
    projectTitle: 'Deterministic vs. LLM-Assisted Planning Solution',
    projectDescription: 'Solve an intricate scheduling or planning problem and evaluate a deterministic search/constraint solution against an LLM-prompted approach.',
    masteryCheck: 'Explain which parts need search, rules, probability, or learned predictions, and why.',
    simulators: [
      {
        id: 'astar-heuristic-lab',
        title: 'A* Search & Heuristic Admissibility Sandbox',
        description: 'Compare Manhattan, Euclidean, and Chebyshev heuristics with obstacle grids and step-by-step priority queue states.',
        category: 'systems',
        iconName: 'Compass',
        path: '/simulators/astar-heuristic-lab',
        stageId: 7
      },
      {
        id: 'causal-dag-explorer',
        title: 'Causal Directed Acyclic Graph (DAG) Explorer',
        description: 'Simulate confounding, collider conditioning bias, and do-operator interventions.',
        category: 'math',
        iconName: 'Share2',
        path: '/simulators/causal-dag-explorer',
        stageId: 7
      }
    ],
    estimatedHours: '70-100 hours',
    category: 'Machine Learning'
  },
  {
    id: 8,
    part: 3,
    partTitle: 'Part III — Machine Learning and AI Foundations',
    title: 'Deep Learning Foundations',
    shortDescription: 'Tensors, computation graphs, automatic differentiation, manual backpropagation, activation dynamics, optimizers, and regularization.',
    prerequisites: [4, 6],
    originalTopics: [
      'Tensors, computation graphs, automatic differentiation',
      'Forward/backpropagation',
      'Activations, losses, initialization',
      'SGD, momentum, Adam',
      'Regularization, dropout, normalization',
      'Batching, schedules, checkpoints',
      'Gradient instability, precision',
      'Generalization and optimization behavior'
    ],
    expandedSubtopics: [
      'Dynamic vs static computation graphs; reverse-mode automatic differentiation',
      'Multivariable chain rule across vector and tensor dimensions',
      'Activation dynamics: Vanishing/exploding gradients with Sigmoid/Tanh vs ReLU/GELU',
      'Weight initialization theory: Xavier/Glorot and He/Kaiming derivations',
      'Optimizer algorithms: Momentum, RMSProp, Adam, AdamW weight decay correction',
      'Normalization layers: BatchNorm, LayerNorm, GroupNorm mechanisms'
    ],
    buildFromScratch: [
      'A NumPy multilayer perceptron',
      'Manual backpropagation',
      'A small scalar autodiff engine (Micrograd-style)',
      'SGD and Adam optimizers',
      'The same model in PyTorch'
    ],
    projectTitle: 'Neural Network vs. Classical Baseline Rigorous Study',
    projectDescription: 'Train a neural network, benchmark against a classical baseline, and rigorously document effective and ineffective architectural choices.',
    masteryCheck: 'Check gradients numerically, overfit a tiny batch, diagnose a broken training loop, and reproduce a saved run.',
    simulators: [
      {
        id: 'neural-forward-backward',
        title: 'Neural Network Forward & Backprop Visualizer',
        description: 'Watch activations flow forward and error gradients propagate backward across layers in real time.',
        category: 'neural',
        iconName: 'Cpu',
        path: '/simulators/neural-forward-backward',
        stageId: 8
      },
      {
        id: 'autodiff-graph-builder',
        title: 'Interactive Computational Graph & Autodiff Engine',
        description: 'Build math expressions interactively and step through topological sorting and backward gradient flow.',
        category: 'neural',
        iconName: 'Network',
        path: '/simulators/autodiff-graph-builder',
        stageId: 8
      }
    ],
    estimatedHours: '90-140 hours',
    category: 'Machine Learning'
  },
  {
    id: 9,
    part: 3,
    partTitle: 'Part III — Machine Learning and AI Foundations',
    title: 'Computer Vision',
    shortDescription: '2D convolutions, deep CNN architectures, residual connections, object detection, semantic segmentation, and Vision Transformers.',
    prerequisites: [8],
    originalTopics: [
      'Images as tensors; convolution, padding, stride, pooling',
      'CNNs, residual connections',
      'Transfer learning, augmentation',
      'Classification, detection, segmentation',
      'OCR, document layout',
      'Vision transformers',
      'Similarity, self-supervised representations',
      'Robustness to lighting, compression, distribution shifts'
    ],
    expandedSubtopics: [
      '2D Discrete Convolution mathematics: receptive field arithmetic, dilated convolutions',
      'Architectures: LeNet, VGG, ResNet skip connection identity mapping',
      'Object detection: Bounding box regression, IoU, Non-Maximum Suppression (NMS)',
      'Semantic segmentation: U-Net encoder-decoder with skip connections',
      'Vision Transformers (ViT): Patch projection, [CLS] token, self-attention across image tokens'
    ],
    buildFromScratch: [
      'Two-dimensional convolution',
      'A small CNN with your own training loop',
      'Intersection-over-union (IoU) evaluation',
      'Simple image retrieval'
    ],
    projectTitle: 'Robust OCR / Classifier Tested Out-of-Distribution',
    projectDescription: 'An OCR pipeline or image classifier systematically tested on real-world images exhibiting heavy distribution shifts (lighting, blur, tilt).',
    masteryCheck: 'Identify whether failures come from labels, preprocessing, representation, or distribution shift.',
    simulators: [
      {
        id: 'convolution-kernel-explorer',
        title: '2D Convolution & Filter Explorer',
        description: 'Adjust kernel matrices (Sobel, Gaussian blur, Laplacian edge detector) and observe live feature map outputs.',
        category: 'neural',
        iconName: 'Image',
        path: '/simulators/convolution-kernel-explorer',
        stageId: 9
      },
      {
        id: 'iou-nms-simulator',
        title: 'Object Detection IoU & NMS Sandbox',
        description: 'Interact with overlapping candidate bounding boxes and observe Non-Maximum Suppression pruning.',
        category: 'neural',
        iconName: 'Box',
        path: '/simulators/iou-nms-simulator',
        stageId: 9
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Machine Learning'
  },
  {
    id: 10,
    part: 3,
    partTitle: 'Part III — Machine Learning and AI Foundations',
    title: 'NLP and Information Retrieval',
    shortDescription: 'Tokenization, language modeling, TF-IDF, BM25 ranking, word embeddings, RNNs/LSTMs, and evaluation metrics.',
    prerequisites: [2, 6],
    originalTopics: [
      'Text normalization, tokenization',
      'N-grams, language modeling',
      'Bag-of-words, TF-IDF, BM25',
      'Word embeddings',
      'RNNs, LSTMs, sequence modeling',
      'Classification, tagging, translation, summarization',
      'Multilingual data/tokenization',
      'Precision, recall, ranking metrics, relevance judgments'
    ],
    expandedSubtopics: [
      'Lexical normalization: Stemming vs lemmatization, stop-words, regex tokenizers',
      'Probabilistic n-gram language models, perplexity, smoothing (Kneser-Ney)',
      'BM25 term saturation (k1) and document length normalization (b) formula mechanics',
      'Word2Vec (Skip-gram, CBOW), negative sampling, cosine distance in embedding space',
      'Recurrent structures: Vanishing gradients across timesteps, LSTM cell gates (Input, Forget, Output)',
      'IR metrics: Mean Reciprocal Rank (MRR), Mean Average Precision (MAP), NDCG@k'
    ],
    buildFromScratch: [
      'An n-gram language model',
      'TF-IDF and BM25 retrieval',
      'A small word-embedding model',
      'A simple sequence model'
    ],
    projectTitle: 'Searchable Document Corpus & Text Classifier',
    projectDescription: 'A searchable document repository evaluated with BM25 and embedding search, paired with a document classification model.',
    masteryCheck: 'Compare keyword retrieval with embeddings on labeled queries and explain different failure cases.',
    simulators: [
      {
        id: 'bm25-saturation-explorer',
        title: 'BM25 Scoring & Saturation Curve Lab',
        description: 'Inspect how term frequency saturation and document length penalties prevent keyword stuffing exploits.',
        category: 'systems',
        iconName: 'Search',
        path: '/simulators/bm25-saturation-explorer',
        stageId: 10
      },
      {
        id: 'lstm-cell-flow',
        title: 'LSTM Gate & Memory Cell Flow Visualizer',
        description: 'Step through time: observe the forget gate, input gate, cell state update, and output gate in action.',
        category: 'neural',
        iconName: 'Repeat',
        path: '/simulators/lstm-cell-flow',
        stageId: 10
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Machine Learning'
  },
  {
    id: 11,
    part: 3,
    partTitle: 'Part III — Machine Learning and AI Foundations',
    title: 'Transformers',
    shortDescription: 'Scaled dot-product attention, multi-head attention, positional encodings, encoder-decoder blocks, and causal self-attention.',
    prerequisites: [8, 10],
    originalTopics: [
      'Queries, keys, values, scaled dot-product attention',
      'Multi-head attention',
      'Positional representations',
      'Residual connections, normalization, feed-forward blocks',
      'Encoder, decoder, encoder-decoder architectures',
      'Causal/padding masks',
      'Objectives and computational complexity'
    ],
    expandedSubtopics: [
      'Mathematical derivation of Scaled Dot-Product Attention: Softmax((QK^T) / sqrt(d_k)) * V',
      'Multi-Head Attention linear projection mechanics and head splitting/merging',
      'Positional representations: Sinusoidal embeddings, learned embeddings, Rotary Positional Embeddings (RoPE)',
      'Pre-LN vs Post-LN architectural stability and gradient propagation',
      'Causal lower-triangular masking to enforce autoregressive generation constraints',
      'Quadratic O(N^2) memory and compute complexity in sequence length N'
    ],
    buildFromScratch: [
      'Scaled dot-product attention',
      'Multi-head attention',
      'A transformer block',
      'A small decoder-only language model'
    ],
    projectTitle: 'Tested Transformer Implementation & Next-Token Modeling',
    projectDescription: 'A rigorously verified transformer implementation with custom tensor operations, self-attention blocks, and next-token generation experiments.',
    masteryCheck: 'Verify shapes and masks, compare with a trusted implementation, and demonstrate that future tokens cannot leak into causal predictions.',
    simulators: [
      {
        id: 'attention-matrix-heatmap',
        title: 'Transformer Attention Matrix Heatmap Explorer',
        description: 'Interactive attention weight visualization showing query-key alignments across token sequences.',
        category: 'neural',
        iconName: 'Eye',
        path: '/simulators/attention-matrix-heatmap',
        stageId: 11
      },
      {
        id: 'causal-masking-lab',
        title: 'Causal Masking & Leakage Prevention Visualizer',
        description: 'Inspect the lower-triangular mask and verify that future token probabilities remain identically zero.',
        category: 'neural',
        iconName: 'Shield',
        path: '/simulators/causal-masking-lab',
        stageId: 11
      }
    ],
    estimatedHours: '90-130 hours',
    category: 'Machine Learning'
  },
  {
    id: 12,
    part: 4,
    partTitle: 'Part IV — Language Models and AI Applications',
    title: 'Language-Model Data, Training, and Inference',
    shortDescription: 'BPE tokenization, pretraining corpus filtering, cross-entropy training, sampling strategies, and KV-cache autoregressive inference.',
    prerequisites: [11],
    originalTopics: [
      'Byte-level text representation, tokenization',
      'BPE, vocabulary tradeoffs',
      'Corpus cleaning, deduplication, contamination',
      'Next-token prediction, cross-entropy',
      'Training budgets, checkpoints',
      'Temperature, top-k, top-p',
      'Context limits, KV cache',
      'Perplexity, task evaluation',
      'Memorization and dataset quality'
    ],
    expandedSubtopics: [
      'Byte-Pair Encoding (BPE) merge table construction and byte-fallback mechanics',
      'Pretraining data pipelines: MinHash LSH deduplication, language filtering, perplexity thresholding',
      'Logits to tokens: Temperature scaling, Top-K pruning, Top-P (Nucleus) sampling, repetition penalties',
      'KV-Cache optimization: Why caching keys and values eliminates redundant O(N^2) token recalculation',
      'Chinchilla optimal compute allocation laws'
    ],
    buildFromScratch: [
      'A BPE tokenizer',
      'A small GPT-style model',
      'A complete training loop',
      'An autoregressive generation loop',
      'A basic KV cache'
    ],
    projectTitle: 'Small Language Model Trained on Documented Corpus',
    projectDescription: 'Train a small generative language model on a curated, documented corpus; report generation fidelity, compute usage, and model limitations.',
    masteryCheck: 'Explain how text becomes training examples and logits become generated text. A small model teaches mechanisms; competitive foundation models require very different resources.',
    simulators: [
      {
        id: 'bpe-merge-visualizer',
        title: 'BPE Tokenizer Interactive Merge Lab',
        description: 'Input raw text, observe byte-pair frequencies, and step through vocabulary merge iterations.',
        category: 'neural',
        iconName: 'Code',
        path: '/simulators/bpe-merge-visualizer',
        stageId: 12
      },
      {
        id: 'kv-cache-timeline',
        title: 'KV-Cache Memory & Latency Timeline Simulator',
        description: 'Compare step-by-step memory allocation and compute time with and without KV-caching.',
        category: 'neural',
        iconName: 'Cpu',
        path: '/simulators/kv-cache-timeline',
        stageId: 12
      }
    ],
    estimatedHours: '90-140 hours',
    category: 'Language Models'
  },
  {
    id: 13,
    part: 4,
    partTitle: 'Part IV — Language Models and AI Applications',
    title: 'LLM Application Engineering',
    shortDescription: 'Local and cloud APIs, prompt engineering patterns, structured JSON schemas, evaluation harnesses, and resilient production clients.',
    prerequisites: [1, 3],
    originalTopics: [
      'Model APIs and local inference',
      'Prompt construction/examples',
      'Structured outputs, schema validation',
      'Context management',
      'Timeouts, retries, rate limits, fallbacks',
      'Evaluation datasets, regression checks',
      'Cost, latency',
      'Uncertainty and unsupported answers'
    ],
    expandedSubtopics: [
      'Inference architectures: OpenAI/Anthropic SDKs vs local engines (vLLM, Ollama, llama.cpp)',
      'Prompting strategies: Zero-shot, Few-shot with exemplars, Chain-of-Thought, System instructions',
      'Constrained decoding: JSON schema enforcement via CFGs (Outlines/Instructor)',
      'Production resilience: Exponential backoff with full jitter, circuit breakers, multi-provider fallbacks',
      'Evaluation pipelines: Golden question-answer evaluation benchmarks and regression runners'
    ],
    buildFromScratch: [
      'A minimal model-client wrapper',
      'A structured extraction pipeline',
      'An evaluation runner',
      'A small web interface'
    ],
    projectTitle: 'Document Extraction / Classification Web Application',
    projectDescription: 'A production-grade document extraction application featuring structured output validation, error handling, rate-limit retries, and an evaluation suite.',
    masteryCheck: 'Compare changes on fixed evaluation cases and explicitly handle malformed or unsupported outputs.',
    simulators: [
      {
        id: 'structured-json-validator',
        title: 'Structured Output & Schema Enforcement Lab',
        description: 'Simulate how grammar-based decoding and Pydantic validation guarantee well-formed JSON outputs.',
        category: 'systems',
        iconName: 'FileCheck',
        path: '/simulators/structured-json-validator',
        stageId: 13
      }
    ],
    estimatedHours: '60-90 hours',
    category: 'Language Models'
  },
  {
    id: 14,
    part: 4,
    partTitle: 'Part IV — Language Models and AI Applications',
    title: 'Fine-Tuning and Alignment',
    shortDescription: 'Supervised fine-tuning, LoRA parameter-efficient adaptation, QLoRA quantization, preference learning, DPO, and RLHF concepts.',
    prerequisites: [11, 12],
    originalTopics: [
      'Transfer learning, supervised fine-tuning',
      'Instruction datasets, chat formats',
      'LoRA, quantized fine-tuning',
      'Preference learning, reward models, DPO, RLHF concepts',
      'Overfitting, catastrophic forgetting',
      'Contamination, data quality',
      'Fine-tuning versus retrieval versus prompting'
    ],
    expandedSubtopics: [
      'Supervised Fine-Tuning (SFT) data preparation and chat formatting (ChatML tokens)',
      'Low-Rank Adaptation (LoRA) math: W = W0 + (alpha/r) * B * A',
      'QLoRA: 4-bit NormalFloat (NF4), double quantization, paged optimizers',
      'Preference alignment: Bradley-Terry models, RLHF with PPO vs Direct Preference Optimization (DPO)',
      'Catastrophic forgetting diagnostics and mitigation'
    ],
    buildFromScratch: [
      'A low-rank adapter (LoRA) layer',
      'Supervised fine-tuning for a small model',
      'A toy preference-optimization (DPO) loss'
    ],
    projectTitle: 'Fine-Tuned Model for Narrow Task vs. Prompt Baseline',
    projectDescription: 'Fine-tune a manageable open-source model on a narrow task and systematically benchmark against a prompt-engineered baseline.',
    masteryCheck: 'Demonstrate improvements, regressions, resources required, and circumstances where fine-tuning was unnecessary.',
    simulators: [
      {
        id: 'lora-matrix-visualizer',
        title: 'LoRA Rank Decomposition Visualizer',
        description: 'Inspect parameter counts and memory savings when factorizing a d x k weight update into low-rank A and B matrices.',
        category: 'neural',
        iconName: 'Minimize',
        path: '/simulators/lora-matrix-visualizer',
        stageId: 14
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Language Models'
  },
  {
    id: 15,
    part: 4,
    partTitle: 'Part IV — Language Models and AI Applications',
    title: 'Embeddings, Search, and RAG',
    shortDescription: 'Vector embeddings, chunking strategies, hybrid search (BM25 + Dense), approximate nearest neighbors (HNSW), and grounded RAG.',
    prerequisites: [10, 13],
    originalTopics: [
      'Dense/sparse/hybrid retrieval',
      'Similarity, normalization',
      'Chunking, structure',
      'Metadata filtering, access-aware retrieval',
      'Approximate nearest neighbors',
      'Reranking, query transformation',
      'Grounded generation, citations',
      'Retrieval/answer evaluation',
      'Graph retrieval and appropriate use cases'
    ],
    expandedSubtopics: [
      'Document chunking mechanics: Semantic splitting, hierarchy-aware markdown/HTML chunking, overlap windows',
      'Vector indexing: HNSW (Hierarchical Navigable Small World) graph layers, IVF-PQ quantization',
      'Hybrid retrieval and Reciprocal Rank Fusion (RRF) math',
      'Cross-encoder rerankers and contextual query transformations',
      'RAG evaluation frameworks: Faithfulness, Answer Relevance, Context Recall (RAGAS)'
    ],
    buildFromScratch: [
      'Exact cosine search',
      'Chunking and indexing pipeline',
      'Minimal RAG system',
      'Retrieval evaluation metrics',
      'Citation and evidence checks'
    ],
    projectTitle: 'Grounded Document Assistant with Citation Verification',
    projectDescription: 'A complete document assistant providing verifiable citations, handling absent evidence gracefully, and enforcing tenant permissions.',
    masteryCheck: 'Evaluate retrieval separately from generation and verify that users cannot retrieve unauthorized documents.',
    simulators: [
      {
        id: 'hnsw-graph-search',
        title: 'HNSW Graph Vector Search Visualizer',
        description: 'Explore hierarchical skip-list layers and greedy beam search across high-dimensional vector spaces.',
        category: 'neural',
        iconName: 'Compass',
        path: '/simulators/hnsw-graph-search',
        stageId: 15
      },
      {
        id: 'rag-pipeline-lifecycle',
        title: 'End-to-End RAG Lifecycle Simulator',
        description: 'Trace a query through rewrite, hybrid retrieval, rerank, context injection, generation, and citation checks.',
        category: 'systems',
        iconName: 'Layers',
        path: '/simulators/rag-pipeline-lifecycle',
        stageId: 15
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Language Models'
  },
  {
    id: 16,
    part: 4,
    partTitle: 'Part IV — Language Models and AI Applications',
    title: 'Agents, Workflows, and Memory',
    shortDescription: 'Deterministic workflows vs autonomous agents, tool invocation schemas, state machines, durable execution, and multi-tier memory.',
    prerequisites: [13, 15],
    originalTopics: [
      'Deterministic workflows versus model-directed decisions',
      'Tool schemas/execution',
      'State machines, planning',
      'Permissions, approvals',
      'Timeouts, retry limits, cancellation, idempotency',
      'Durable execution, recovery',
      'Session state, persistent memory',
      'Contradictions, expiry, deletion, user isolation',
      'Multi-agent coordination and additional failures'
    ],
    expandedSubtopics: [
      'Agent reasoning loops: ReAct (Reason + Act), Plan-and-Solve, Reflection patterns',
      'Function calling schemas and execution boundaries',
      'Human-in-the-loop permission gates, confirmation interrupts, and blast-radius minimization',
      'Memory tiers: Short-term scratchpad, conversational history, semantic episodic memory, persistent entity store',
      'Multi-agent architectures: Supervisor-worker, debate, and consensus mechanisms'
    ],
    buildFromScratch: [
      'A bounded tool-use loop',
      'A workflow state machine',
      'A memory read/update/delete store',
      'Execution traces logger',
      'Replay tests'
    ],
    projectTitle: 'Autonomous Research & Database Assistant',
    projectDescription: 'An assistant that safely searches documents, queries an isolated database, requests approval for mutations, and prepares draft reports.',
    masteryCheck: 'Handle tool failure, hostile tool content, and repeated requests. Justify every permission. Add multiple agents only for a measured need.',
    simulators: [
      {
        id: 'react-agent-loop',
        title: 'ReAct Agent Execution Loop Visualizer',
        description: 'Step through Thought -> Action -> Observation -> Reflection cycles with interactive tool mocking.',
        category: 'systems',
        iconName: 'Cpu',
        path: '/simulators/react-agent-loop',
        stageId: 16
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Language Models'
  },
  {
    id: 17,
    part: 4,
    partTitle: 'Part IV — Language Models and AI Applications',
    title: 'Generative Vision, Speech, and Multimodal Systems',
    shortDescription: 'Autoencoders, VAEs, diffusion denoising math, audio Fourier transforms/spectrograms, speech recognition, and Vision-Language models.',
    prerequisites: [8, 12],
    originalTopics: [
      'Autoencoders, VAEs',
      'GAN objectives/instability',
      'Diffusion, denoising, conditioning',
      'Audio sampling, Fourier transforms, spectrograms',
      'Recognition, synthesis, voice activity detection',
      'Vision-language models',
      'Image/audio/video/document integration',
      'Streaming and end-to-end latency'
    ],
    expandedSubtopics: [
      'Variational Autoencoders: Latent space regularization, KL-divergence penalty, reparameterization trick',
      'Denoising Diffusion Probabilistic Models (DDPM): Forward noise addition, reverse U-Net score prediction',
      'Audio processing: Nyquist frequency, Short-Time Fourier Transform (STFT), Mel-scale spectrogram generation',
      'Vision-Language Models (VLMs): Visual patch encoders (CLIP) projected into LLM token embeddings'
    ],
    buildFromScratch: [
      'A small autoencoder/VAE',
      'A toy diffusion training/sampling loop',
      'An audio feature pipeline (spectrogram generator)',
      'A multimodal application using pretrained components'
    ],
    projectTitle: 'Voice Document Assistant & Image Analysis Tool',
    projectDescription: 'A multimodal application integrating document OCR/image analysis with voice query input and synthetic speech audio responses.',
    masteryCheck: 'Evaluate each component independently and measure complete response latency and failure rates.',
    simulators: [
      {
        id: 'diffusion-denoising-lab',
        title: 'Step-by-Step Diffusion Denoising Simulator',
        description: 'Observe Gaussian noise gradually cleared into a sharp image over 50 discrete reverse diffusion timesteps.',
        category: 'neural',
        iconName: 'Sun',
        path: '/simulators/diffusion-denoising-lab',
        stageId: 17
      },
      {
        id: 'spectrogram-audio-lab',
        title: 'Audio Waveform to Mel-Spectrogram Converter',
        description: 'Visualizer illustrating time-domain waveforms transforming into frequency-domain spectrogram representations.',
        category: 'math',
        iconName: 'Activity',
        path: '/simulators/spectrogram-audio-lab',
        stageId: 17
      }
    ],
    estimatedHours: '90-130 hours',
    category: 'Language Models'
  },
  {
    id: 18,
    part: 4,
    partTitle: 'Part IV — Language Models and AI Applications',
    title: 'Reinforcement Learning and Control',
    shortDescription: 'MDPs, Bellman equations, dynamic programming, TD learning, Q-learning, DQN, policy gradients, and PPO algorithms.',
    prerequisites: [4, 6],
    originalTopics: [
      'MDPs; policies, values, rewards, Bellman equations',
      'Dynamic programming, Monte Carlo',
      'Temporal differences; Q-learning, DQN, policy gradients, actor-critic',
      'PPO, exploration; reward hacking, shift',
      'Offline/model-based RL',
      'Partial observability',
      'Control/robotics foundations where relevant'
    ],
    expandedSubtopics: [
      'Markov Decision Process (MDP) formalisms: States, Actions, Transitions, Discount factor gamma',
      'Bellman Expectation and Optimality equations derivation',
      'Temporal Difference learning: TD(0), SARSA (on-policy) vs Q-Learning (off-policy)',
      'Deep Q-Networks (DQN): Replay buffer sampling, target network synchronization',
      'Policy Gradient theorem, REINFORCE algorithm, baseline variance reduction',
      'Proximal Policy Optimization (PPO): Clipped surrogate objective mechanics'
    ],
    buildFromScratch: [
      'A grid world environment',
      'Value iteration',
      'Q-learning',
      'A small DQN',
      'A policy-gradient agent'
    ],
    projectTitle: 'Multi-Seed RL Algorithm Benchmark in Simulated Envs',
    projectDescription: 'Compare value-based vs policy-based reinforcement learning agents in a simulated environment using multiple random seeds and ablation metrics.',
    masteryCheck: 'Separate algorithm behavior from random variation and explain unintended reward behavior.',
    simulators: [
      {
        id: 'gridworld-mdp-lab',
        title: 'Gridworld MDP & Value Iteration Sandbox',
        description: 'Adjust reward states, transition slip probabilities, and watch state values converge visually.',
        category: 'math',
        iconName: 'Grid',
        path: '/simulators/gridworld-mdp-lab',
        stageId: 18
      },
      {
        id: 'ppo-clip-visualizer',
        title: 'PPO Clipped Objective Explorer',
        description: 'Interactive plot showing how the epsilon clipping ratio prevents destructively large policy updates.',
        category: 'math',
        iconName: 'Percent',
        path: '/simulators/ppo-clip-visualizer',
        stageId: 18
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Language Models'
  },
  {
    id: 19,
    part: 5,
    partTitle: 'Part V — Reliable AI Systems',
    title: 'Software Architecture, Deployment, and MLOps',
    shortDescription: 'AI service boundaries, multi-tenant isolation, CI/CD evaluation gates, model registries, drift detection, and automated rollback workflows.',
    prerequisites: [3, 13],
    originalTopics: [
      'API design, service boundaries',
      'Authentication, authorization, tenant isolation',
      'Containers, deployment, configuration',
      'Queues, caching, background jobs',
      'Dataset/model versioning',
      'Tracking, artifact management',
      'CI/CD, evaluation gates',
      'Monitoring, rollback, drift, incidents',
      'Reliability targets and recovery'
    ],
    expandedSubtopics: [
      'Microservices vs modular monolith for AI applications',
      'Tenant isolation strategies: Row-level security (RLS) vs multi-tenant schema segregation',
      'Asynchronous task processing with message queues (Redis/RabbitMQ/Celery)',
      'Model registry, artifact provenance, and dataset lineage (MLflow/DVC)',
      'Production monitoring: p95/p99 latency tracking, data drift (Kolmogorov-Smirnov test), concept drift detection'
    ],
    buildFromScratch: [
      'A model-serving API',
      'An evaluation job',
      'A model/prompt release manifest',
      'A monitoring and rollback workflow'
    ],
    projectTitle: 'Deployed AI Product with CI/CD & Operational Dashboard',
    projectDescription: 'A production-grade deployed AI service equipped with containerization, canary deployment pipelines, health checks, and a live monitoring dashboard.',
    masteryCheck: 'Recover from a bad release, dependency outage, malformed-input burst, and database restoration exercise.',
    simulators: [
      {
        id: 'canary-deployment-simulator',
        title: 'Canary Deployment & Rollback Simulator',
        description: 'Simulate shifting traffic between Model v1 and v2, monitoring anomaly thresholds and triggering rollbacks.',
        category: 'systems',
        iconName: 'Server',
        path: '/simulators/canary-deployment-simulator',
        stageId: 19
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Systems'
  },
  {
    id: 20,
    part: 5,
    partTitle: 'Part V — Reliable AI Systems',
    title: 'AI Performance and Distributed Systems',
    shortDescription: 'GPU memory profiling, kernel vectorization, quantization (INT8/INT4), continuous batching, and distributed training paradigms (DDP, FSDP).',
    prerequisites: [3, 8],
    originalTopics: [
      'Profiling and bottlenecks; CPU/GPU memory',
      'Vectorization, kernels; floating-point formats, quantization',
      'Batching, continuous batching',
      'KV-cache memory',
      'Data/tensor/pipeline parallelism',
      'Distributed communication/failures',
      'Speculative decoding',
      'Throughput, latency, quality, and cost'
    ],
    expandedSubtopics: [
      'Hardware architectures: High Bandwidth Memory (HBM), Streaming Multiprocessors, Tensor Cores',
      'Quantization techniques: Post-Training Quantization (PTQ), Quantization-Aware Training (QAT), INT8, FP8, AWQ, GPTQ',
      'Serving engine architectures: Continuous batching, PagedAttention, chunked prefill',
      'Distributed training: Data parallelism (DDP), ZeRO memory optimization, Fully Sharded Data Parallel (FSDP), Tensor Parallelism',
      'Speculative decoding: Small draft model speedup with verification'
    ],
    buildFromScratch: [
      'A benchmark harness',
      'A toy quantizer',
      'A batched inference service',
      'A small distributed-training exercise'
    ],
    projectTitle: 'Profiling & Bottleneck Optimization Report',
    projectDescription: 'Identify a severe computational bottleneck in an inference or training pipeline, optimize it using quantization or batching, and publish measured before/after benchmarks.',
    masteryCheck: 'Demonstrate improvement under representative load without unacceptable quality loss.',
    simulators: [
      {
        id: 'gpu-memory-profiler',
        title: 'GPU VRAM Memory Allocation Breakdown',
        description: 'Interactive visualization of model weights, optimizer states, activations, and KV-cache consuming GPU memory.',
        category: 'hardware',
        iconName: 'HardDrive',
        path: '/simulators/gpu-memory-profiler',
        stageId: 20
      },
      {
        id: 'continuous-batching-lab',
        title: 'Continuous Batching vs Static Batching Lab',
        description: 'Simulate request arrivals and observe how iteration-level scheduling eliminates GPU bubble waste.',
        category: 'systems',
        iconName: 'Layers',
        path: '/simulators/continuous-batching-lab',
        stageId: 20
      }
    ],
    estimatedHours: '80-130 hours',
    category: 'Systems'
  },
  {
    id: 21,
    part: 6,
    partTitle: 'Part VI — Cybersecurity',
    title: 'Security Foundations and Cryptography',
    shortDescription: 'Core security models (CIA, STRIDE), cryptographic hashing, symmetric/asymmetric encryption, PKI, and key management.',
    prerequisites: [3],
    originalTopics: [
      'Assets, threats, vulnerabilities, risks, controls',
      'Confidentiality, integrity, availability',
      'Trust boundaries, threat modeling',
      'Least privilege, defense in depth',
      'Authentication versus authorization',
      'Hashes, MACs, encryption, signatures, key exchange',
      'Password hashing, secure randomness',
      'Certificates, PKI, TLS, key lifecycle',
      'Logs and secure defaults'
    ],
    expandedSubtopics: [
      'Threat modeling: STRIDE, DREAD, and attack surface mapping',
      'Cryptographic hash functions: SHA-256/SHA-3 properties (pre-image and collision resistance)',
      'Symmetric encryption: Block ciphers (AES-GCM, ChaCha20-Poly1305), modes of operation (ECB vs CBC vs GCM)',
      'Asymmetric cryptography: RSA, Diffie-Hellman key exchange, Elliptic Curves (Ed25519)',
      'Secure password storage: Argon2id, bcrypt work factors, salt and pepper mechanics',
      'PKI and X.509: Certificate Authorities, certificate revocation lists (CRL), OCSP stapling'
    ],
    buildFromScratch: [
      'A threat model',
      'A file-integrity checker using a trusted hash implementation',
      'A toy cipher with weakness demonstration (ECB mode visual leak)',
      'A signed-message workflow using vetted libraries'
    ],
    projectTitle: 'Hardening Secrets, Auth, Transport & Access Controls',
    projectDescription: 'Take a previously developed web service and thoroughly harden its identity, secret storage, transport encryption, and granular access controls.',
    masteryCheck: 'Explain why hashing is not encryption, why authentication is insufficient for authorization, and what happens when a key is exposed.',
    simulators: [
      {
        id: 'diffie-hellman-lab',
        title: 'Diffie-Hellman Key Exchange Interactive Simulator',
        description: 'Visualize public/private key mixing and discrete logarithm security without transmitting shared secrets.',
        category: 'security',
        iconName: 'Key',
        path: '/simulators/diffie-hellman-lab',
        stageId: 21
      },
      {
        id: 'aes-modes-leakage',
        title: 'AES-ECB vs CBC / GCM Leakage Visualizer',
        description: 'Encrypt a bitmap image with ECB to demonstrate preserved structural patterns vs authentic randomness under CBC/GCM.',
        category: 'security',
        iconName: 'Lock',
        path: '/simulators/aes-modes-leakage',
        stageId: 21
      }
    ],
    estimatedHours: '70-100 hours',
    category: 'Cybersecurity'
  },
  {
    id: 22,
    part: 6,
    partTitle: 'Part VI — Cybersecurity',
    title: 'Web, API, and Application Security',
    shortDescription: 'OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, SSRF, IDOR), OAuth 2.0/OIDC protocols, rate limiting, and secure code review.',
    prerequisites: [21],
    originalTopics: [
      'Input validation, output encoding',
      'SQL injection, XSS',
      'CSRF, SSRF, path traversal',
      'Object-level authorization',
      'Sessions, cookies, OAuth, OpenID Connect',
      'File uploads, unsafe deserialization',
      'Vulnerable dependencies',
      'Business-logic flaws',
      'Abuse prevention, limits',
      'Secure code review'
    ],
    expandedSubtopics: [
      'SQL Injection: In-band, boolean blind, time-based; parameterized queries and ORM safeguards',
      'Cross-Site Scripting (XSS): Stored, Reflected, DOM-based; CSP (Content Security Policy) headers',
      'Server-Side Request Forgery (SSRF): Cloud metadata endpoint protection (169.254.169.254)',
      'Broken Object-Level Authorization (BOLA/IDOR) prevention',
      'OAuth 2.0 / OpenID Connect: Authorization code grant with PKCE, JWT validation and signing verification'
    ],
    buildFromScratch: [
      'A deliberately vulnerable local application',
      'Security regression tests',
      'Object-authorization checks',
      'A rate limiter',
      'An upload validator'
    ],
    projectTitle: 'Vulnerability Remediation & Retest in Lab Application',
    projectDescription: 'Audit a deliberately vulnerable educational web app, identify vulnerabilities, craft remediation patches, and write automated security regression tests.',
    masteryCheck: 'For each finding, explain root cause, impact, remediation, and evidence that the fix works.',
    simulators: [
      {
        id: 'sqli-vs-parameterized',
        title: 'SQL Injection vs Parameterized Query Simulator',
        description: 'See how unsanitized string concatenations alter the AST of database queries vs prepared statement parameters.',
        category: 'security',
        iconName: 'Database',
        path: '/simulators/sqli-vs-parameterized',
        stageId: 22
      },
      {
        id: 'oauth-pkce-flow',
        title: 'OAuth 2.0 PKCE Handshake Sequence Visualizer',
        description: 'Trace code verifiers, code challenges, authorization codes, and token exchanges step by step.',
        category: 'security',
        iconName: 'ShieldCheck',
        path: '/simulators/oauth-pkce-flow',
        stageId: 22
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Cybersecurity'
  },
  {
    id: 23,
    part: 6,
    partTitle: 'Part VI — Cybersecurity',
    title: 'Network, Operating-System, and Cloud Security',
    shortDescription: 'Network segmentation, packet capture dissection, Linux server hardening, Cloud IAM policies, least privilege, and container security.',
    prerequisites: [3, 21],
    originalTopics: [
      'Segmentation, firewalls, remote access',
      'Packet captures, protocols',
      'Linux/Windows security; users, groups, permissions, processes, services',
      'Hardening, patches',
      'Shared responsibility',
      'IAM, temporary credentials',
      'Storage/network permissions',
      'Container security, orchestration',
      'Infrastructure-as-code review',
      'Backups and disaster recovery'
    ],
    expandedSubtopics: [
      'Network defense: Firewalls (iptables/nftables), DMZ architectures, VPNs, WireGuard',
      'Packet analysis with tcpdump and Wireshark protocol dissection',
      'Linux hardening: Rootless execution, SSH key policies, fail2ban, SELinux/AppArmor profiles',
      'Cloud IAM: Policy evaluations, role assumption, blast radius containment',
      'Container security: Read-only filesystems, seccomp profiles, vulnerability scanning'
    ],
    buildFromScratch: [
      'An isolated network lab',
      'A configuration-audit script',
      'A cloud-permission review exercise',
      'Container hardening checks'
    ],
    projectTitle: 'Hardened Service Deployment with Verified Blast Radius',
    projectDescription: 'Deploy a network service with restricted firewall connectivity and least-privilege cloud IAM credentials; verify exposure via authorized scans.',
    masteryCheck: 'Trace which identity can access which resource and explain a compromised component\'s blast radius.',
    simulators: [
      {
        id: 'packet-sniffer-lab',
        title: 'Network Packet Sniffer & Header Dissector',
        description: 'Inspect Ethernet, IP, TCP, and application payloads with live protocol dissection.',
        category: 'network',
        iconName: 'Wifi',
        path: '/simulators/packet-sniffer-lab',
        stageId: 23
      },
      {
        id: 'iam-blast-radius',
        title: 'Cloud IAM Policy Blast Radius Visualizer',
        description: 'Evaluate role permissions, wildcard actions, and simulate privilege escalation pathways.',
        category: 'security',
        iconName: 'Cloud',
        path: '/simulators/iam-blast-radius',
        stageId: 23
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Cybersecurity'
  },
  {
    id: 24,
    part: 6,
    partTitle: 'Part VI — Cybersecurity',
    title: 'Detection, Incident Response, and Forensics',
    shortDescription: 'Log telemetry, normalization, Sigma/YARA detection rules, incident response lifecycle, evidence preservation, and forensics.',
    prerequisites: [23],
    originalTopics: [
      'Endpoint/network/identity/application logs',
      'Collection, normalization, correlation',
      'Detection rules, false positives',
      'Triage',
      'Incident preparation, containment, recovery, review',
      'Evidence integrity, timelines',
      'Disk/memory/network forensics foundations',
      'Threat intelligence and behavior-based analysis'
    ],
    expandedSubtopics: [
      'SIEM pipelines: Log formats (Syslog, JSON, Windows Events), ingestion, normalization',
      'Detection engineering: Writing Sigma rules, YARA signatures, tuning false-positive ratios',
      'MITRE ATT&CK taxonomy: Mapping tactics, techniques, and procedures (TTPs)',
      'Incident response frameworks (NIST SP 800-61): Triage, containment, eradication, post-incident reporting',
      'Digital forensics: Order of volatility, cryptographic disk imaging, timeline reconstruction'
    ],
    buildFromScratch: [
      'A log normalization pipeline',
      'Rule-based detections',
      'An incident timeline generator',
      'An alert-triage dashboard'
    ],
    projectTitle: 'Simulated Lab Incident Detection, Triage & Recovery',
    projectDescription: 'Simulate a harmless security event in an isolated lab, detect it using custom rules, conduct forensic timeline analysis, and write an incident report.',
    masteryCheck: 'Connect alerts to evidence and explain remaining uncertainty.',
    simulators: [
      {
        id: 'mitre-attack-matrix',
        title: 'MITRE ATT&CK Matrix Interactive Navigator',
        description: 'Explore tactics and techniques with detection rule coverage and defensive mapping.',
        category: 'security',
        iconName: 'Grid',
        path: '/simulators/mitre-attack-matrix',
        stageId: 24
      },
      {
        id: 'forensic-timeline-lab',
        title: 'Forensic Timeline Event Correlation Lab',
        description: 'Correlate authentication logs, process executions, and network connections to uncover attack vectors.',
        category: 'security',
        iconName: 'Clock',
        path: '/simulators/forensic-timeline-lab',
        stageId: 24
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'Cybersecurity'
  },
  {
    id: 25,
    part: 6,
    partTitle: 'Part VI — Cybersecurity',
    title: 'Security Testing and Advanced Specialist Branches',
    shortDescription: 'Scoping assessments, penetration testing ethics, reverse engineering (x86/ARM, Ghidra), malware sandboxing, and specialist branches.',
    prerequisites: [22, 23, 24],
    originalTopics: [
      'Shared foundation: scope, rules of engagement, authorized asset discovery, vulnerability assessment, manual verification, secure reporting, remediation testing, responsible disclosure',
      'Branches: application security and secure development; penetration testing in controlled labs; detection engineering; digital forensics; reverse engineering with assembly/executable formats/debuggers; malware analysis in isolated environments; cloud security; governance/risk/audit/supplier risk; hardware, IoT, and OT security with embedded systems and operational constraints'
    ],
    expandedSubtopics: [
      'Penetration testing methodology: PTES framework, scoping documents, rules of engagement',
      'Reverse engineering fundamentals: x86/ARM disassembly, ELF/PE file headers, Ghidra decompilation, GDB dynamic analysis',
      'Malware analysis: Safe sandbox detonation, behavioral monitoring, anti-analysis evasion bypasses',
      'Hardware and IoT security: UART/JTAG debugging interfaces, SPI flash firmware extraction'
    ],
    buildFromScratch: [
      'A scoped assessment plan',
      'Verification records',
      'Prioritized findings',
      'Remediation retests'
    ],
    projectTitle: 'Authorized Security Assessment & Reproducible Findings',
    projectDescription: 'Execute a scoped security assessment against an authorized lab environment; compile an executive report with verified findings, CVSS scores, and remediation validations.',
    masteryCheck: 'Explain assessment scope, evidence, severity, remediation, and retest results. Each specialist branch requires sustained practice beyond a survey.',
    simulators: [
      {
        id: 'binary-disassembler-view',
        title: 'ELF Binary Header & Disassembly Visualizer',
        description: 'Inspect executable headers, sections (.text, .data, .bss), and interactive assembly instructions.',
        category: 'security',
        iconName: 'FileText',
        path: '/simulators/binary-disassembler-view',
        stageId: 25
      }
    ],
    estimatedHours: '100-150 hours',
    category: 'Cybersecurity'
  },
  {
    id: 26,
    part: 7,
    partTitle: 'Part VII — AI Security and AI for Cybersecurity',
    title: 'Adversarial Machine Learning and Model Privacy',
    shortDescription: 'Evasion attacks (FGSM/PGD), data poisoning, backdoor triggers, membership inference, and differential privacy foundations.',
    prerequisites: [6, 21],
    originalTopics: [
      'Attacker goals, knowledge, capabilities',
      'Evasion, adversarial examples',
      'Poisoning, backdoors',
      'Extraction',
      'Membership inference, inversion',
      'Memorization',
      'Differential privacy foundations',
      'Federated learning and limitations',
      'Robustness evaluation, adaptive attackers'
    ],
    expandedSubtopics: [
      'Adversarial threat model taxonomy: White-box vs black-box attack capabilities',
      'Evasion mathematics: Fast Gradient Sign Method (FGSM), Projected Gradient Descent (PGD)',
      'Data poisoning: Clean-label attacks, backdoor triggers (BadNets)',
      'Privacy attacks: Membership Inference Attacks (MIA), model inversion, training data extraction',
      'Differential Privacy (DP): (epsilon, delta)-DP definitions, Laplace mechanism, DP-SGD gradient noise'
    ],
    buildFromScratch: [
      'A toy adversarial-example experiment',
      'A controlled small-dataset poisoning experiment',
      'A robustness harness',
      'A simple synthetic-data privacy experiment'
    ],
    projectTitle: 'Model Robustness Evaluation under Attacker Capabilities',
    projectDescription: 'Evaluate a machine learning classifier under explicitly parameterized adversary budgets, reporting clean accuracy, attacked accuracy, and defense trade-offs.',
    masteryCheck: 'Report clean accuracy, attacked performance, defense tradeoffs, and limits. One successful defensive test does not establish general security.',
    simulators: [
      {
        id: 'adversarial-perturbation-lab',
        title: 'FGSM Adversarial Perturbation Sandbox',
        description: 'Apply epsilon perturbations to live image tensors and observe confident misclassifications.',
        category: 'neural',
        iconName: 'ShieldAlert',
        path: '/simulators/adversarial-perturbation-lab',
        stageId: 26
      },
      {
        id: 'differential-privacy-budget',
        title: 'Differential Privacy Epsilon Budget Visualizer',
        description: 'Explore the trade-off between privacy guarantees (epsilon) and model utility under added noise.',
        category: 'math',
        iconName: 'Lock',
        path: '/simulators/differential-privacy-budget',
        stageId: 26
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'AI Security'
  },
  {
    id: 27,
    part: 7,
    partTitle: 'Part VII — AI Security and AI for Cybersecurity',
    title: 'LLM, RAG, Agent, and Multimodal Security',
    shortDescription: 'Direct and indirect prompt injection, tool authorization layers, tenant isolation in RAG, memory poisoning, and multimodal attacks.',
    prerequisites: [15, 16, 22],
    originalTopics: [
      'Direct/indirect injection',
      'Untrusted documents/retrieved instructions',
      'Information disclosure',
      'Unsafe generated-output handling',
      'Tool misuse, excessive permissions',
      'Retrieval poisoning, cross-user leakage',
      'Memory poisoning',
      'Model/dependency supply chain',
      'Resource exhaustion and spending abuse',
      'Multimodal injection',
      'Evaluation manipulation',
      'Filter and judge limitations'
    ],
    expandedSubtopics: [
      'OWASP Top 10 for Large Language Model Applications breakdown',
      'Direct jailbreaks vs indirect prompt injection via untrusted retrieved documents',
      'RAG security: Retrieval poisoning, embedding collision attacks, cross-tenant isolation enforcement',
      'Agent permission models: Sandboxing tool execution, rate limiting, human approval thresholds',
      'Multimodal prompt injection embedded in images, audio, and documents'
    ],
    buildFromScratch: [
      'A local adversarial corpus',
      'A tool authorization layer',
      'Tenant-aware retrieval checks',
      'A constrained execution environment',
      'Tool and data-access audit trails'
    ],
    projectTitle: 'Document Assistant Hardening & Security Audit',
    projectDescription: 'Conduct a thorough adversarial assessment of a document assistant, harden tool boundaries against indirect injection, and verify zero cross-tenant leakage.',
    masteryCheck: 'Show that hostile retrieved content cannot grant permissions, alter authorization, or expose another user\'s documents. Treat model outputs and tool arguments as untrusted.',
    simulators: [
      {
        id: 'indirect-injection-simulator',
        title: 'Indirect Prompt Injection Dataflow Simulator',
        description: 'Simulate how poisoned web pages or document chunks hijack LLM reasoning, and how isolation guardrails prevent tool misuse.',
        category: 'security',
        iconName: 'AlertOctagon',
        path: '/simulators/indirect-injection-simulator',
        stageId: 27
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'AI Security'
  },
  {
    id: 28,
    part: 7,
    partTitle: 'Part VII — AI Security and AI for Cybersecurity',
    title: 'AI-Assisted Cybersecurity',
    shortDescription: 'Log classification, alert triage, phishing detection, threat intelligence extraction, and human-in-the-loop security assistant architectures.',
    prerequisites: [6, 24],
    originalTopics: [
      'Log classification',
      'Alert grouping/prioritization',
      'Phishing classification',
      'Anomaly detection',
      'Threat-intelligence extraction',
      'Secure-code assistance',
      'Retrieval over incidents/playbooks',
      'Human oversight and automation limits'
    ],
    expandedSubtopics: [
      'NLP and classification models for automated phishing email and malicious URL detection',
      'Unsupervised anomaly detection in authentication logs (Isolation Forests, Autoencoders)',
      'Threat intelligence extraction: Parsing unstructured CTI reports into STIX/TAXII objects',
      'LLM incident response assistants: Retrieval over internal SOPs, alert summaries, analyst oversight'
    ],
    buildFromScratch: [
      'A classical security-classification baseline',
      'A temporal evaluation pipeline',
      'A security-document retrieval assistant',
      'A constrained alert-summary workflow'
    ],
    projectTitle: 'AI-Powered Security Analyst Assistant',
    projectDescription: 'Build an AI assistant that ingests alerts, correlates them with incident playbooks, generates evidence-backed summaries, and requests human confirmation for actions.',
    masteryCheck: 'Measure precision, recall, false positives, analyst effort, and failure consequences. Account for imbalance, environmental change, and leakage.',
    simulators: [
      {
        id: 'alert-triage-ai-flow',
        title: 'SOC Alert Triage & Prioritization Flow',
        description: 'Watch incoming alerts evaluated by ML classifiers, grouped by incident similarity, and queued for analyst sign-off.',
        category: 'security',
        iconName: 'Bell',
        path: '/simulators/alert-triage-ai-flow',
        stageId: 28
      }
    ],
    estimatedHours: '80-120 hours',
    category: 'AI Security'
  },
  {
    id: 29,
    part: 8,
    partTitle: 'Part VIII — Research and Integration',
    title: 'Research Methods and Advanced Evaluation',
    shortDescription: 'Paper reading, falsifiable hypotheses, ablation studies, statistical significance, LLM-as-a-judge bias mitigation, and reproducibility packages.',
    prerequisites: [6],
    originalTopics: [
      'Literature search, paper reading',
      'Research questions, falsifiable hypotheses',
      'Baselines, controls, ablations',
      'Dataset selection, contamination',
      'Uncertainty, multiple seeds',
      'Human evaluation, rater agreement',
      'Model-judge bias',
      'Reproducibility',
      'Negative results, limitations',
      'Technical writing and peer review'
    ],
    expandedSubtopics: [
      'Paper analysis: Keshav\'s Three-Pass Approach, evaluating claims against empirical evidence',
      'Experimental ablation design: Testing individual component contributions to overall performance',
      'Statistical validation: Bootstrap confidence intervals, permutation tests, effect size reporting',
      'Mitigating LLM judge biases: Position bias, verbosity bias, self-enhancement bias',
      'Reproducibility packages: Docker containers, fixed random seeds, pinned dependencies, data provenance'
    ],
    buildFromScratch: [
      'A reusable experiment runner',
      'Versioned evaluations',
      'Automated result tables with uncertainty',
      'A reproduction package'
    ],
    projectTitle: 'Reproduction & Meaningful Variation Study',
    projectDescription: 'Reproduce a bounded published machine learning or systems result, verify reproducibility across seeds, and investigate an insightful experimental variation.',
    masteryCheck: 'Another person can reproduce the main result and your conclusions stay within the evidence.',
    simulators: [
      {
        id: 'ablation-study-visualizer',
        title: 'Ablation Study Matrix Visualizer',
        description: 'Interactively remove model components to observe individual metric impacts with statistical confidence intervals.',
        category: 'math',
        iconName: 'BarChart2',
        path: '/simulators/ablation-study-visualizer',
        stageId: 29
      }
    ],
    estimatedHours: '100-150 hours',
    category: 'Research'
  },
  {
    id: 30,
    part: 8,
    partTitle: 'Part VIII — Research and Integration',
    title: 'Integrated Capstone Projects',
    shortDescription: 'Four master engineering capstones integrating all 30 preceding stages: Reliable Prediction, Secure Assistant, AI Security Lab, and AI SOC Tool.',
    prerequisites: [19, 20, 25, 27, 28, 29],
    originalTopics: [
      'Capstone A: A reliable predictive system',
      'Capstone B: A secure personal AI assistant',
      'Capstone C: An AI security laboratory',
      'Capstone D: An AI-assisted security operations tool'
    ],
    expandedSubtopics: [
      'Capstone A: Provenance, reproducible preprocessing, justified modeling, deployment, monitoring, access control, recovery',
      'Capstone B: Ingestion, search, grounded generation, permissioned tools, memory, authentication, voice/vision, latency budgeting',
      'Capstone C: Controlled adversarial datasets, injection/poisoning testbeds, privacy audits, attack/defense comparisons',
      'Capstone D: Telemetry ingestion, hybrid ML/rules detection, evidence summaries, human-in-the-loop workflows, incident review'
    ],
    buildFromScratch: [
      'Integrated Predictive Pipeline (Capstone A)',
      'Secure End-to-End AI Assistant (Capstone B)',
      'AI Security Vulnerability Lab (Capstone C)',
      'AI-Assisted SOC Defense System (Capstone D)'
    ],
    projectTitle: 'The 4 Master Engineering Capstones',
    projectDescription: 'The culmination of the entire academy: four end-to-end engineered, tested, and secured software systems demonstrating technical mastery.',
    masteryCheck: 'Complete the four capstones incrementally, verifying results, error analysis, operational measurements, and security threat models.',
    simulators: [
      {
        id: 'capstone-architecture-board',
        title: 'Master Capstone Architecture Board',
        description: 'Interactive blueprint integrating models, data streams, telemetry, and security defense perimeters.',
        category: 'systems',
        iconName: 'Layout',
        path: '/simulators/capstone-architecture-board',
        stageId: 30
      }
    ],
    estimatedHours: '200-350 hours',
    category: 'Research'
  }
];
