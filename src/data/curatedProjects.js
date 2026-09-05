// Curated high-impact, IEEE & Industry-grade Capstone Project Archetypes
// Designed to demonstrate novel engineering twists over standard clichés

export const CURATED_PROJECTS = [
  {
    id: "proj-1",
    title: "NeuroEdge: Federated Privacy-Preserving ICU Patient Deterioration Predictor",
    domain: "AI & Healthcare Tech",
    branch: "Computer Science & AI/DS",
    targetType: "IEEE Research Publication",
    noveltyScore: 94,
    clicheWarning: "Standard ICU mortality predictors use centralized XGBoost on static MIMIC-III data, completely ignoring HIPAA/GDPR hospital data silos.",
    unfairTwist: "Implements Federated Learning (Flower framework) across decentralized simulated hospital nodes with Differential Privacy (ε=1.2) and Spatio-Temporal Graph Neural Networks (ST-GNN) on real-time biometric streams.",
    summary: "A decentralized edge-AI system that forecasts septic shock and cardiopulmonary arrest 6 hours before clinical onset without centralizing patient telemetry.",
    difficulty: "Advanced",
    estimatedWeeks: 16,
    techStack: {
      frontend: "React 19, Recharts, Tailwind/Vanilla CSS, WebSockets",
      backend: "FastAPI, Python 3.11, Celery worker queue",
      mlModels: "PyTorch, Spatio-Temporal GNN, Flower (Federated Learning), Opacus (Differential Privacy)",
      database: "TimescaleDB (Time-series vitals), Redis (Broker)",
      devops: "Docker, Kubernetes edge minikube, ONNX Runtime Edge"
    },
    architecture: {
      client: "Hospital ICU Clinician Dashboard (Live vitals & 6h risk heatmaps)",
      gateway: "FastAPI Async Gateway with mTLS authentication",
      orchestration: "Federated Aggregator (FedAvg + Secure Aggregation Protocol)",
      edgeNodes: "Local Hospital Enclaves training local ST-GNN weights on synthetic/MIMIC streams",
      storage: "TimescaleDB for local patient telemetry; zero raw data leaves local node"
    },
    datasets: [
      {
        name: "PhysioNet / Computing in Cardiology Challenge 2019 (Sepsis)",
        size: "40,336 ICU patient records with hourly vitals",
        url: "https://physionet.org/content/challenge-2019/1.0.0/",
        type: "Open Access (Credentialed)",
        license: "ODC-BY"
      },
      {
        name: "MIMIC-IV Waveform Database (ECG & Arterial Blood Pressure)",
        size: "High-resolution physiologic waveforms",
        url: "https://physionet.org/content/mimic4wdb/0.1.0/",
        type: "Credentialed Research",
        license: "PhysioNet Restricted"
      }
    ],
    roadmap: [
      { week: "Weeks 1-3", phase: "Literature Review & IRB/Data Prep", task: "Review 15+ IEEE/Lancet papers on ICU sepsis early warning; ingest and sanitize PhysioNet challenge data with missing-value imputation (MICE)." },
      { week: "Weeks 4-6", phase: "Baseline & ST-GNN Formulation", task: "Build baseline centralized GRU/LSTM; formulate Spatio-Temporal Graph structure mapping cross-vital correlations (HR, MAP, Lactate, SpO2)." },
      { week: "Weeks 7-9", phase: "Federated Framework Integration", task: "Deploy Flower federated orchestration across 4 simulated local hospital nodes; evaluate convergence rates vs centralized baseline." },
      { week: "Weeks 10-12", phase: "Differential Privacy & Edge Quantization", task: "Add Opacus DP-SGD gradient clipping; quantize model to INT8 via ONNX Runtime for <50ms edge inference." },
      { week: "Weeks 13-14", phase: "Clinician Dashboard & Explainability", task: "Integrate SHAP / Integrated Gradients for feature attribution in clinician UI; WebSocket telemetry feed." },
      { week: "Weeks 15-16", phase: "Empirical Evaluation & Paper Drafting", task: "Benchmark AUROC, AUPRC, false alarm reduction; draft IEEE Transactions format research paper & defense slides." }
    ],
    defenseQA: [
      {
        q: "Why use Federated Learning instead of training one unified massive model in AWS/GCP?",
        a: "Healthcare data cannot be legally centralized across institutions under HIPAA, GDPR, and Indian DPDP Act 2023. Federated learning trains local parameters on hospital edge servers and only transmits cryptographically masked weight updates, ensuring zero PII leakage while achieving 96.2% of centralized AUROC.",
        examinerTrap: "Watch out for examiners asking about 'poisoning attacks'—be ready to explain Byzantine-robust aggregation algorithms like Trimmed Mean or Krum."
      },
      {
        q: "How do you handle severe class imbalance where only 6-8% of ICU patients develop sepsis?",
        a: "We address this using Focal Loss (gamma=2.0) combined with dynamic temporal oversampling in the edge data pipeline, prioritizing precision-recall AUC (AUPRC) over misleading accuracy or raw AUROC metrics.",
        examinerTrap: "Never quote raw accuracy! High accuracy is meaningless in imbalanced medical datasets."
      },
      {
        q: "How will your system perform in real-time when patient telemetry arrives at 100Hz?",
        a: "Through ONNX INT8 runtime quantization and TimescaleDB downsampling buckets, inferencing latency is clocked under 42ms per patient window on a standard consumer CPU, comfortably meeting the 1000ms real-time ICU threshold.",
        examinerTrap: "Examiners want exact latency numbers in milliseconds, not 'it runs very fast'."
      }
    ]
  },
  {
    id: "proj-2",
    title: "ZeroSpoof: Multi-Spectral Liveness & Zero-Knowledge Proctoring Agent",
    domain: "Cybersecurity & Computer Vision",
    branch: "Computer Science / Cyber Security",
    targetType: "Patentable Product & Defense Ready",
    noveltyScore: 91,
    clicheWarning: "Standard exam proctoring projects use basic OpenCV Haar-cascades or dlib head-pose estimation that students bypass with 2D photos, deepfakes, or screen mirrors.",
    unfairTwist: "Combines 3D Depth estimation (rPPG blood volume pulse detection from consumer webcams) with zk-SNARK cryptographic proofs to verify exam integrity without transmitting intrusive video feeds to the cloud.",
    summary: "A privacy-first autonomous exam proctoring agent that detects deepfakes, screen reflection spoofing, and remote assistance while preserving student privacy through zero-knowledge proofs.",
    difficulty: "Advanced",
    estimatedWeeks: 16,
    techStack: {
      frontend: "WebAssembly (WASM), MediaPipe, Canvas2D, React 19",
      backend: "Go (Golang) Microservices, Gin Web Framework, Circom (zk-SNARKs)",
      mlModels: "PyTorch, 3DMM Morphable Face Model, Remote Photoplethysmography (rPPG CNN)",
      database: "PostgreSQL, IPFS for zero-knowledge audit hash records",
      devops: "WebAssembly in-browser compilation, Docker, Envoy proxy"
    },
    architecture: {
      client: "WASM-compiled in-browser client analyzing webcam frames at 30 FPS locally",
      visionEngine: "rPPG sub-dermal pulse frequency tracker + 3D gaze mesh vector calculation",
      zkProofGen: "Circom circuit generating proof of attentiveness without exposing raw video",
      backend: "Go audit service validating zero-knowledge proof tokens onto immutable log",
      storage: "Zero video stored; only cryptographic proof hashes and timestamped anomalies recorded"
    },
    datasets: [
      {
        name: "CASIA-SURF 3D Mask & Print Anti-Spoofing Dataset",
        size: "21,115 videos across 1,000 subjects with RGB, Depth, and IR",
        url: "https://sites.google.com/view/casia-surf-celebv-2020",
        type: "Academic Research License",
        license: "Free Academic"
      },
      {
        name: "UBFC-rPPG Remote Heart Rate Biometrics",
        size: "Realistic video dataset for non-contact heart rate extraction",
        url: "https://zenodo.org/record/3406414",
        type: "Open Academic",
        license: "CC-BY 4.0"
      }
    ],
    roadmap: [
      { week: "Weeks 1-3", phase: "Attack Vector Analysis & rPPG Setup", task: "Catalog 8 primary cheating vectors (silicone mask, printed photo, deepfake loop, secondary monitor); set up optical rPPG skin extraction." },
      { week: "Weeks 4-6", phase: "Anti-Spoofing Vision Architecture", task: "Train dual-stream CNN evaluating micro-texture variations and blood-flow frequency (0.75 - 2.5 Hz cardiac range)." },
      { week: "Weeks 7-9", phase: "Zero-Knowledge Circuit Design", task: "Write Circom circuits to prove: 'Student was present & attentive between t1 and t2' without uploading facial frames." },
      { week: "Weeks 10-12", phase: "WASM In-Browser Compilation", task: "Compile vision models into ONNX Web / WebAssembly to execute on student's local browser with <25% CPU utilization." },
      { week: "Weeks 13-14", phase: "Auditing Dashboard & Anti-Bypass Testing", task: "Develop Proctor Incident Dashboard; stress-test with OBS virtual camera, DeepFaceLab, and printouts." },
      { week: "Weeks 15-16", phase: "Paper & Benchmark Documentation", task: "Benchmark False Rejection Rate (FRR) vs False Acceptance Rate (FAR); prepare live adversarial demo for external viva." }
    ],
    defenseQA: [
      {
        q: "Can a student spoof your rPPG pulse detector with a high-resolution 4K video playback on an iPad?",
        a: "No, because screen displays emit backlight PWM flicker and lack the sub-dermal chromatic phase shifts caused by hemoglobin absorption under ambient light. Our FFT spectral analysis detects the 60Hz/120Hz display refresh frequency and flags it as synthetic.",
        examinerTrap: "The examiner thinks they got you with video playback. Explain the spectral Fourier transform of screen refresh rates vs biological pulse."
      },
      {
        q: "Why did you choose zk-SNARKs instead of simply hashing the video frames?",
        a: "Hashing a video confirms it hasn't been tampered with, but still requires storing sensitive video of a student's bedroom on cloud servers. zk-SNARKs allow the client to mathematically prove compliance to the rules without anyone ever seeing the video stream.",
        examinerTrap: "Clarify the distinction between integrity verification (hashing) vs zero-knowledge privacy verification (zk-SNARKs)."
      },
      {
        q: "Doesn't WebAssembly ML in browser crash on low-end dual-core student laptops?",
        a: "We designed a lightweight pipeline: facial landmarks run every frame via WebGL shaders, while the heavier rPPG pulse FFT runs at 2Hz intervals in a Web Worker thread, keeping RAM usage below 210MB and CPU usage below 22% on an Intel Core i3.",
        examinerTrap: "Be prepared with specific profiling numbers (RAM footprint, FPS, CPU utilization)."
      }
    ]
  },
  {
    id: "proj-3",
    title: "AgroSpectral: Drone-Based Multi-Spectral Hyperspectral Crop Stress & Irrigation AI",
    domain: "IoT, Drone Tech & Agritech",
    branch: "IoT / Robotics / AI / Electrical",
    targetType: "Hardware-Software Hybrid & Social Impact",
    noveltyScore: 92,
    clicheWarning: "Most student agritech projects just feed smartphone leaves into a basic MobileNet trained on Kaggle PlantVillage dataset without real-world utility.",
    unfairTwist: "Integrates edge-computing on Raspberry Pi / ESP32-CAM with NDVI/NDRE spectral vegetation indexing, LoRaWAN mesh networking, and soil-moisture sensors for micro-localized autonomous drip irrigation control.",
    summary: "An autonomous aerial-ground hybrid system that pinpoints nitrogen deficiency, water stress, and early pest infestations 10 days before visible leaf discoloration.",
    difficulty: "Advanced",
    estimatedWeeks: 16,
    techStack: {
      frontend: "Leaflet.js GIS Mapping, Dashboard UI, React 19",
      backend: "Python FastAPI, MQTT Broker (Eclipse Mosquitto), LoRaWAN Gateway",
      mlModels: "YOLOv11-OBB (Oriented Bounding Boxes for crop rows), Spectral Index Formulator",
      hardware: "ESP32-S3 Microcontrollers, NoIR Camera Module with Dual Band-pass Filter, LoRa SX1278",
      database: "PostgreSQL with PostGIS extension for spatial vector coordinates"
    },
    architecture: {
      aerialNode: "Drone with Modified NoIR NIR camera running lightweight YOLOv11-OBB crop row segmentation",
      groundSensors: "Solar-powered ESP32 LoRa nodes measuring volumetric water content & soil EC",
      gateway: "Raspberry Pi 4 acting as edge gateway aggregating LoRa packets and computing NDVI indices",
      cloudServer: "FastAPI server running spatial interpolation (Kriging) to produce prescription irrigation maps",
      actuator: "Solenoid valve relay matrix delivering precision micro-dosing to stressed farm sub-grids"
    },
    datasets: [
      {
        name: "Agriculture-Vision: Large Aerial Agricultural Semantic Segmentation",
        size: "94,986 high-resolution aerial images across 9 crop anomalies",
        url: "https://www.agriculture-vision.com/",
        type: "Open Academic Research",
        license: "CVPR Open"
      },
      {
        name: "ICRISAT Semi-Arid Tropics Soil & Crop Sensor Telemetry",
        size: "3 years of continuous soil moisture & ambient microclimate records",
        url: "https://dataverse.harvard.edu/dataverse/icrisat",
        type: "Open Data",
        license: "CC0 Public Domain"
      }
    ],
    roadmap: [
      { week: "Weeks 1-3", phase: "Hardware Acquisition & Optical Calibration", task: "Calibrate NoIR camera with 680nm/850nm optical filters for Normalized Difference Vegetation Index (NDVI)." },
      { week: "Weeks 4-6", phase: "LoRaWAN Mesh Field Testing", task: "Deploy 6 ESP32 ground sensor nodes with soil capacitive sensors; establish 1.8km point-to-point packet reliability." },
      { week: "Weeks 7-9", phase: "Aerial Imagery Processing Pipeline", task: "Implement orthomosaic stitching and radiometric calibration on drone camera snapshots." },
      { week: "Weeks 10-12", phase: "Spatial Kriging & Prescription Engine", task: "Build GIS spatial interpolation linking ground moisture sensors with aerial spectral heatmaps in PostGIS." },
      { week: "Weeks 13-14", phase: "Automated Drip Actuation & Web GIS", task: "Construct Relay solenoid valve controller driven by MQTT; build interactive Leaflet map for farmer." },
      { week: "Weeks 15-16", phase: "Field Demonstration & Defense Presentation", task: "Measure water conservation percentage (target 32% savings) vs fixed schedule; finalize viva demo video." }
    ],
    defenseQA: [
      {
        q: "Why can't farmers just use free Sentinel-2 or Landsat satellite imagery instead of your expensive drone/sensors?",
        a: "Sentinel-2 has a 10-meter ground spatial resolution and a 5-day revisit cycle. A 10m pixel lumps 40 different crop plants into one average value, hiding localized pest outbreaks and fungal spores until the whole plot is infected. Our drone offers 1.2cm/pixel resolution and on-demand flight, catching stress at plant-level.",
        examinerTrap: "Satellite comparison is the favorite question of agritech examiners. Memorize spatial resolution (10m vs 1.2cm) and temporal latency (5 days vs immediate)."
      },
      {
        q: "What happens when it rains or the soil sensors get corroded?",
        a: "We use capacitive corrosion-resistant soil sensors (not resistive prongs) sealed in IP67 marine-grade epoxy. The telemetry engine includes anomaly detection that flags sensor drift or electrical faults whenever soil moisture readings violate hydrological physical bounds.",
        examinerTrap: "Resistive sensors corrode in 2 weeks. Always emphasize capacitive or TDR (Time Domain Reflectometry) sensors."
      },
      {
        q: "How does your system operate in remote Indian villages without 4G/5G connectivity?",
        a: "The entire ground-to-drone pipeline operates on license-free 865-867 MHz LoRaWAN mesh networking, communicating up to 3km without any cellular or internet infrastructure. The local Raspberry Pi edge controller runs all decisions locally.",
        examinerTrap: "Emphasize offline-first edge autonomy; never depend on continuous internet for agricultural field work."
      }
    ]
  },
  {
    id: "proj-4",
    title: "GraphSentry: Real-Time Fraud & Sybil Detection in DeFi Protocols via Temporal GNNs",
    domain: "FinTech & Blockchain",
    branch: "Computer Science / Information Technology",
    targetType: "FinTech Product & Research",
    noveltyScore: 93,
    clicheWarning: "Standard fintech projects use tabular credit card fraud detection on Kaggle Credit Card dataset using logistic regression or basic Random Forest.",
    unfairTwist: "Builds a dynamic Temporal Graph Neural Network (T-GNN) that continuously monitors Ethereum / EVM mempool and liquidity pool transactions to intercept flash-loan exploits and Sybil wallet rings before block finalization.",
    summary: "An autonomous blockchain security intelligence engine that tracks illicit fund routing, mixer peeling chains, and smart contract vulnerability exploits in real-time.",
    difficulty: "Advanced",
    estimatedWeeks: 16,
    techStack: {
      frontend: "React 19, Force-Graph-3D, ECharts, Tailwind CSS",
      backend: "Rust / Python FastAPI, Web3.py, Alchemy RPC, Redis Pub/Sub",
      mlModels: "PyTorch Geometric, Dynamic Temporal Graph Convolutional Network (T-GCN)",
      database: "Neo4j Graph Database, ClickHouse (Columnar transaction warehouse)",
      devops: "Docker, Local Hardhat/Anvil blockchain fork for exploit simulation"
    },
    architecture: {
      ingestion: "WebSockets connected to Ethereum Goerli/Sepolia or local Anvil mempool nodes",
      graphStore: "Neo4j holding entity nodes (wallets, smart contracts, liquidity pools) and directed edges",
      tGnnEngine: "PyTorch Geometric worker analyzing 3-hop topological graphs in 120ms sliding windows",
      alertGateway: "FastAPI websocket server broadcasting risk scores and 3D visual graph paths to dashboard",
      mitigation: "Automated Flashbots Private RPC submission to front-run and neutralize detected exploits"
    },
    datasets: [
      {
        name: "Elliptic Bitcoin & Ethereum Transaction Graph Dataset",
        size: "203,769 node entities with 234,355 directed edges and licit/illicit labels",
        url: "https://www.kaggle.com/datasets/ellipticco/elliptic-data-set",
        type: "Open Academic",
        license: "CC-BY 4.0"
      },
      {
        name: "Web3 Hack Database (DeFi Exploit Transactions)",
        size: "Curated dataset of 450+ verified DeFi hacks and flash-loan vectors",
        url: "https://github.com/SunWeb3Sec/DeFiHackLabs",
        type: "Open Source",
        license: "MIT"
      }
    ],
    roadmap: [
      { week: "Weeks 1-3", phase: "Mempool Ingestion & Graph Schema", task: "Configure Web3 RPC hooks to stream pending mempool transactions; design Neo4j schema for account abstraction." },
      { week: "Weeks 4-6", phase: "Graph Feature Extraction", task: "Compute topological features: in-degree, out-degree, PageRank, token velocity, and cyclic transaction loops." },
      { week: "Weeks 7-9", phase: "Temporal GNN Architecture Training", task: "Train T-GCN on historical hack datasets to recognize peeling chains and flash loan arbitrage signatures." },
      { week: "Weeks 10-12", phase: "Mempool Speed Optimization", task: "Achieve sub-200ms graph inference to ensure detection occurs within standard Ethereum block times (12s)." },
      { week: "Weeks 13-14", phase: "Interactive 3D Forensic UI", task: "Implement ForceGraph3D for investigative investigators to trace coin-mixer hops and wallet clustering." },
      { week: "Weeks 15-16", phase: "Exploit Simulation & Defense Preparation", task: "Simulate live flash loan attack on local Anvil fork; prove pre-block interception; finalize thesis." }
    ],
    defenseQA: [
      {
        q: "Why is a Graph Neural Network superior to an XGBoost model given tabular transaction features?",
        a: "Tabular models treat each transaction in isolation or require manual feature engineering across fixed time windows. Sophisticated money laundering and Sybil attackers intentionally break transactions into micro-amounts across dozens of intermediary disposable hops (peeling chains). GNNs preserve high-order topological structure and multi-hop neighborhood relationships that tabular models are mathematically blind to.",
        examinerTrap: "Examiners will ask why tabular models aren't enough. Explain the relational nature of multi-hop graphs."
      },
      {
        q: "How does your system prevent false positives that lock honest high-frequency traders?",
        a: "We implement an asymmetric Cost-Sensitive Loss function during model training, heavily penalizing false positives. Furthermore, our system outputs a continuous Confidence Score and requires a corroborating signature check before any automated transaction front-running is initiated.",
        examinerTrap: "Discuss precision-recall trade-offs and threshold tuning."
      },
      {
        q: "Can attackers simply use Tornado Cash or privacy mixers to completely evade your graph analysis?",
        a: "Mixers break direct edge connections, but temporal heuristics (such as deposit/withdrawal amounts, gas price correlations, and timing analysis within small anonymity sets) allow probabilistic graph re-linking with over 78% accuracy on low-liquidity mixer pools.",
        examinerTrap: "Don't claim 100% deanonymization; state realistic probabilistic linkage within anonymity sets."
      }
    ]
  },
  {
    id: "proj-5",
    title: "QuantumSafe: Post-Quantum Cryptographic VPN Gateway for Critical Infrastructure",
    domain: "Cybersecurity & Networks",
    branch: "Cybersecurity / Computer Science / Networks",
    targetType: "Industry Defense & Infrastructure",
    noveltyScore: 96,
    clicheWarning: "Standard networking projects build simple OpenVPN servers or basic packet sniffers using Wireshark without any novel cryptographic defense.",
    unfairTwist: "Implements NIST-standardized Post-Quantum Cryptography (ML-KEM / Kyber-768 for key encapsulation and ML-DSA / Dilithium for digital signatures) over a WireGuard Linux kernel tunnel to protect SCADA/IoT against 'Harvest Now, Decrypt Later' attacks.",
    summary: "A production-grade post-quantum hybrid VPN tunnel that protects industrial ICS/SCADA systems against future quantum computer decryption attacks while maintaining low latency.",
    difficulty: "Advanced",
    estimatedWeeks: 16,
    techStack: {
      frontend: "React 19, Recharts Network Telemetry, Terminal UI emulator",
      backend: "C / Rust, liboqs (Open Quantum Safe), WireGuard Go",
      mlModels: "Statistical Shannon Entropy Classifier for Encrypted Traffic Anomaly Detection",
      database: "SQLite for audit trails and handshake benchmarks",
      devops: "Linux Kernel modules, Docker, eBPF network probe"
    },
    architecture: {
      gatewayA: "SCADA PLC edge device running Kyber-768 hybrid KEM wrapper",
      pqcEngine: "liboqs integrated into WireGuard noise handshake protocol",
      quantumTunnel: "Encrypted UDP tunnel transmitting post-quantum encapsulated session keys",
      gatewayB: "Central Control Room gateway authenticating with Dilithium-3 signatures",
      telemetry: "eBPF kernel probe measuring handshake latency, packet jitter, and throughput"
    },
    datasets: [
      {
        name: "NIST Post-Quantum Cryptography Reference Implementations & Benchmarks",
        size: "Official FIPS 203 & FIPS 204 test vectors and latency catalogs",
        url: "https://csrc.nist.gov/projects/post-quantum-cryptography",
        type: "Public Domain",
        license: "Public Domain"
      },
      {
        name: "ICS-SCADA Network Intrusion Dataset (Water Treatment Plant)",
        size: "Industrial SCADA network PCAPs with cyber-physical attack sequences",
        url: "https://itrust.sutd.edu.sg/itrust-labs_datasets/dataset_info/",
        type: "Academic Research License",
        license: "Academic"
      }
    ],
    roadmap: [
      { week: "Weeks 1-3", phase: "NIST PQC Standards Review & liboqs Setup", task: "Compile liboqs on ARM and x86 architectures; benchmark Kyber-512/768 vs classic RSA-4096 and ECDH." },
      { week: "Weeks 4-6", phase: "WireGuard Noise Protocol Extension", task: "Modify WireGuard Handshake initiation to incorporate post-quantum pre-shared key (PQ-PSK) hybrid exchange." },
      { week: "Weeks 7-9", phase: "Packet Fragmentation & MTU Tuning", task: "Handle larger public key sizes of Kyber-768 (1184 bytes) to prevent IP packet fragmentation across WAN links." },
      { week: "Weeks 10-12", phase: "eBPF Telemetry & Performance Benchmarking", task: "Deploy eBPF probes in Linux kernel to measure RTT latency, throughput degradation, and CPU cycle overhead." },
      { week: "Weeks 13-14", phase: "Admin Security Dashboard", task: "Build web dashboard monitoring live quantum-resistant handshakes, re-keying intervals, and SCADA telemetry." },
      { week: "Weeks 15-16", phase: "Defense Demonstration & Thesis Write-up", task: "Demonstrate live Wireshark capture proving resistance to Shor's algorithm attacks; finalize viva presentation." }
    ],
    defenseQA: [
      {
        q: "Quantum computers that can break RSA don't exist yet. Why should an examiner care about this project today?",
        a: "Hostile state actors are actively conducting 'Harvest Now, Decrypt Later' (HNDL) attacks—recording petabytes of encrypted government, defense, and power-grid telemetry today so they can decrypt it in 5-8 years when cryptanalytically relevant quantum computers (CRQCs) arrive. Critical infrastructure secrets have 20+ year lifespans, making PQC migration an urgent priority today, as mandated by the US White House NSM-10 and Indian Cyber Security directives.",
        examinerTrap: "Always cite the 'Harvest Now, Decrypt Later' doctrine and national security timelines."
      },
      {
        q: "What is the primary drawback of Post-Quantum algorithms like Kyber and Dilithium compared to ECC?",
        a: "Public key and ciphertext sizes: an ECC Curve25519 public key is just 32 bytes, whereas Kyber-768 requires 1,184 bytes, and Dilithium-3 signatures require 3,293 bytes. This causes network packet fragmentation if MTU is not properly tuned. We solved this with hybrid encapsulation and TCP/UDP buffer window scaling.",
        examinerTrap: "Examiners test whether you know the memory and network overhead of lattice-based cryptography."
      },
      {
        q: "How did you measure that your system is truly quantum-resistant?",
        a: "We verified our key generation and encapsulation routines against official NIST FIPS 203 Known Answer Tests (KAT) vectors with zero bit error, and mathematically proved the security reduction to the hardness of Module Learning With Errors (M-LWE) lattice problems.",
        examinerTrap: "Point to standard NIST KAT vectors; you cannot 'simulate' a 4,000-qubit machine, but you can prove cryptographic compliance."
      }
    ]
  }
];

export const BRANCHES = [
  "Computer Science & Engineering",
  "AI & Data Science",
  "Cybersecurity & Digital Forensics",
  "IoT & Embedded Systems",
  "Information Technology",
  "Robotics & Automation",
  "Biomedical & Healthcare Tech",
  "Electrical & Electronics (ECE)"
];

export const TARGET_OUTCOMES = [
  "IEEE / Scopus Conference Paper",
  "Patentable Capstone & Startup MVP",
  "Industry-Grade Production System",
  "Social Impact & Local Community Solution"
];

export const RESOURCE_TIERS = [
  "Free / Zero Budget (Google Colab, Free Tiers, Open APIs)",
  "Moderate (Local Laptop with NVIDIA RTX GPU)",
  "Hardware Hybrid (ESP32 / Raspberry Pi / Sensors)",
  "Cloud Scaled (AWS / GCP / Modal / Groq / Gemini API)"
];
