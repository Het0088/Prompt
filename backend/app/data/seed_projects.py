from typing import List, Dict, Optional
from ..models.schemas import (
    Project,
    ComputeTier,
    DifficultyLevel,
    TargetOutcome,
)

SEED_PROJECTS: List[Project] = [
    # 1. AI/ML: Realistic & Publication-Grade
    Project(
        id="proj-aiml-01",
        title="Privacy-Preserving Federated Sepsis Early Warning System",
        domain="AI / Healthcare",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=14,
        estimated_hours=320,
        estimated_cost_usd=0.0,
        compute_requirement=ComputeTier.COLAB_FREE,
        required_hardware=[],
        required_skills={
            "python": 4,
            "pytorch": 3,
            "machine_learning": 3,
            "git": 2,
        },
        critical_skills=["python", "machine_learning"],
        target_outcomes=[TargetOutcome.IEEE_PAPER, TargetOutcome.INDUSTRY_GRADE],
        novelty_baseline=92.0,
        risk_factors=[
            "Severe clinical class imbalance (ICU sepsis mortality rate < 8%)",
            "Federated aggregation convergence delay across heterogeneous non-IID nodes",
        ],
        description="A federated learning architecture with differential privacy on PhysioNet 2019 ICU vitals telemetry without centralized data ingestion.",
    ),

    # 2. AI/ML: Deliberately Over-Compute & Over-Budget (Too demanding for standard undergraduates)
    Project(
        id="proj-aiml-02-extreme",
        title="Multi-Modal 3D Brain Tumor Radiomics via Volumetric Vision Transformers",
        domain="AI / Medical Imaging",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=24,
        estimated_hours=750,
        estimated_cost_usd=1200.0,
        compute_requirement=ComputeTier.CLOUD_GPU,
        required_hardware=[],
        required_skills={
            "python": 5,
            "pytorch": 5,
            "computer_vision": 4,
            "cuda": 4,
        },
        critical_skills=["python", "pytorch", "cuda"],
        target_outcomes=[TargetOutcome.IEEE_PAPER],
        novelty_baseline=88.0,
        risk_factors=[
            "High VRAM footprint (>48GB A100 required for volumetric 3D MRI patches)",
            "Long training epochs exceeding standard free Colab timeouts (12-hour limit)",
            "Significant cloud compute expenditure",
        ],
        description="Deep 3D volumetric segmentation of glioblastoma MRI scans using custom transformer attention backbones requiring industrial compute.",
    ),

    # 3. AI/ML: Realistic Low-Resource TinyML
    Project(
        id="proj-aiml-03-tinyml",
        title="On-Device Keyword Spotting via 8-Bit Post-Training Quantization",
        domain="AI / TinyML",
        difficulty=DifficultyLevel.INTERMEDIATE,
        estimated_weeks=10,
        estimated_hours=180,
        estimated_cost_usd=0.0,
        compute_requirement=ComputeTier.CPU_ONLY,
        required_hardware=[],
        required_skills={
            "python": 3,
            "machine_learning": 2,
            "tensorflow": 2,
        },
        critical_skills=["python"],
        target_outcomes=[TargetOutcome.INDUSTRY_GRADE, TargetOutcome.STARTUP_MVP],
        novelty_baseline=74.0,
        risk_factors=[
            "Acoustic noise background degradation in real-world microphone feeds",
            "Quantization loss degradation when dropping from FP32 to INT8 weights",
        ],
        description="Lightweight speech keyword spotting model quantized with TensorFlow Lite Micro for low-power edge inference under 50KB RAM.",
    ),

    # 4. Cybersecurity: Zero-Knowledge & Vision Hybrid
    Project(
        id="proj-cyber-01",
        title="Zero-Knowledge Liveness Proctoring Agent via rPPG & WebAssembly",
        domain="Cybersecurity / Vision",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=14,
        estimated_hours=360,
        estimated_cost_usd=0.0,
        compute_requirement=ComputeTier.COLAB_FREE,
        required_hardware=[],
        required_skills={
            "javascript": 3,
            "python": 3,
            "cryptography": 2,
            "react": 3,
        },
        critical_skills=["javascript", "python"],
        target_outcomes=[TargetOutcome.STARTUP_MVP, TargetOutcome.IEEE_PAPER],
        novelty_baseline=91.0,
        risk_factors=[
            "Lighting variance impacting webcam sub-dermal blood pulse (rPPG) extraction",
            "ZK-SNARK proof generation latency in in-browser WASM runtime",
        ],
        description="Anti-cheating exam proctor validating remote student pulse liveness locally and emitting zero-knowledge proofs without uploading video feeds.",
    ),

    # 5. Cybersecurity: Hardware-Dependent PQC
    Project(
        id="proj-cyber-02-hardware",
        title="Post-Quantum Cryptographic VPN Gateway for SCADA Infrastructure",
        domain="Cybersecurity / Networks",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=16,
        estimated_hours=420,
        estimated_cost_usd=160.0,
        compute_requirement=ComputeTier.LOCAL_GPU,
        required_hardware=["raspberry_pi", "ethernet_switch"],
        required_skills={
            "c": 3,
            "linux": 3,
            "cryptography": 4,
            "networking": 3,
        },
        critical_skills=["c", "networking"],
        target_outcomes=[TargetOutcome.INDUSTRY_GRADE, TargetOutcome.IEEE_PAPER],
        novelty_baseline=94.0,
        risk_factors=[
            "Large public key sizes of Kyber-768 / Dilithium causing network packet fragmentation",
            "Physical micro-controller setup and latency overhead during SCADA handshake cycles",
        ],
        description="Hybrid WireGuard tunnel integrating NIST post-quantum key encapsulation (ML-KEM) running on Raspberry Pi edge gateways.",
    ),

    # 6. Cybersecurity: Low-Level Fuzzer
    Project(
        id="proj-cyber-03-fuzzer",
        title="Kernel-Assisted Binary Firmware Vulnerability Fuzzer with eBPF",
        domain="Cybersecurity / Systems",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=15,
        estimated_hours=380,
        estimated_cost_usd=0.0,
        compute_requirement=ComputeTier.CPU_ONLY,
        required_hardware=[],
        required_skills={
            "c": 4,
            "linux": 4,
            "operating_systems": 3,
        },
        critical_skills=["c", "linux"],
        target_outcomes=[TargetOutcome.INDUSTRY_GRADE],
        novelty_baseline=86.0,
        risk_factors=[
            "Kernel panic crashes during unconstrained binary fuzzing iterations",
            "Steep learning curve of Linux eBPF ring-buffer verifier rules",
        ],
        description="Coverage-guided fuzzing engine monitoring kernel execution path branching via eBPF probes for zero-day memory corruption discovery.",
    ),

    # 7. IoT / Robotics: High Hardware Cost
    Project(
        id="proj-iot-01-drone",
        title="Autonomous Agro-Drone Multi-Spectral Crop Stress Classifier",
        domain="IoT / Robotics",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=16,
        estimated_hours=440,
        estimated_cost_usd=650.0,
        compute_requirement=ComputeTier.LOCAL_GPU,
        required_hardware=["drone_platform", "multispectral_camera", "esp32"],
        required_skills={
            "python": 3,
            "embedded_c": 3,
            "computer_vision": 3,
        },
        critical_skills=["embedded_c"],
        target_outcomes=[TargetOutcome.SOCIAL_GOOD, TargetOutcome.STARTUP_MVP],
        novelty_baseline=89.0,
        risk_factors=[
            "High hardware procurement expense (multispectral optical filters, UAV chassis)",
            "Outdoor aerodynamic flight instability and optical radiometric calibration drift",
        ],
        description="Aerial crop row mapping calculating NDVI and NDRE spectral vegetation indexes to automate precision irrigation micro-valves.",
    ),

    # 8. IoT: Low-Cost Accessible Telemetry
    Project(
        id="proj-iot-02-lora",
        title="LoRaWAN Mesh Telemetry Network for Remote Water Reservoir Monitoring",
        domain="IoT / Embedded",
        difficulty=DifficultyLevel.INTERMEDIATE,
        estimated_weeks=11,
        estimated_hours=210,
        estimated_cost_usd=55.0,
        compute_requirement=ComputeTier.CPU_ONLY,
        required_hardware=["esp32", "lora_module", "water_sensors"],
        required_skills={
            "embedded_c": 2,
            "python": 2,
            "electronics": 2,
        },
        critical_skills=["embedded_c"],
        target_outcomes=[TargetOutcome.SOCIAL_GOOD, TargetOutcome.INDUSTRY_GRADE],
        novelty_baseline=76.0,
        risk_factors=[
            "Sub-gigahertz RF signal attenuation through physical obstacles in rugged terrain",
            "Capacitive probe calibration drift under mineralized water conditions",
        ],
        description="Solar-powered ESP32 sensor clusters reporting pH, turbidity, and reservoir depth over 3km radio distances without cellular SIM cards.",
    ),

    # 9. Software Engineering: Realistic Modular Architecture
    Project(
        id="proj-se-01",
        title="Micro-Frontend Orchestration Platform with Automated Contract Testing",
        domain="Software Engineering",
        difficulty=DifficultyLevel.INTERMEDIATE,
        estimated_weeks=12,
        estimated_hours=260,
        estimated_cost_usd=0.0,
        compute_requirement=ComputeTier.CPU_ONLY,
        required_hardware=[],
        required_skills={
            "javascript": 4,
            "react": 4,
            "node": 3,
            "docker": 2,
        },
        critical_skills=["javascript", "react"],
        target_outcomes=[TargetOutcome.INDUSTRY_GRADE, TargetOutcome.STARTUP_MVP],
        novelty_baseline=78.0,
        risk_factors=[
            "Version skew and CSS style bleeding between decoupled micro-app bundles",
            "Runtime module federation dependency sharing collisions",
        ],
        description="Enterprise web portal runtime loading isolated micro-frontends with consumer-driven contract verification via Pact.",
    ),

    # 10. Software Engineering: Advanced Distributed Systems
    Project(
        id="proj-se-02-distributed",
        title="High-Throughput Distributed Key-Value Store with Raft Consensus",
        domain="Software Engineering / Systems",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=15,
        estimated_hours=370,
        estimated_cost_usd=0.0,
        compute_requirement=ComputeTier.CPU_ONLY,
        required_hardware=[],
        required_skills={
            "go": 4,
            "distributed_systems": 3,
            "linux": 3,
        },
        critical_skills=["go"],
        target_outcomes=[TargetOutcome.INDUSTRY_GRADE],
        novelty_baseline=82.0,
        risk_factors=[
            "Subtle network partition split-brain edge cases in Raft leader election",
            "LSM-tree compaction write amplification under sustained 50k QPS load",
        ],
        description="Fault-tolerant distributed storage engine in Go implementing log replication, snapshotting, and linearizable read index queries.",
    ),

    # 11. Data Science / FinTech: Temporal Graph AI
    Project(
        id="proj-fintech-01",
        title="Mempool Flash-Loan Exploit Interceptor via Dynamic Temporal GNNs",
        domain="FinTech / Blockchain",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=13,
        estimated_hours=310,
        estimated_cost_usd=25.0,
        compute_requirement=ComputeTier.LOCAL_GPU,
        required_hardware=[],
        required_skills={
            "python": 4,
            "pytorch": 3,
            "graph_algorithms": 3,
        },
        critical_skills=["python", "pytorch"],
        target_outcomes=[TargetOutcome.STARTUP_MVP, TargetOutcome.IEEE_PAPER],
        novelty_baseline=93.0,
        risk_factors=[
            "Strict real-time graph inference latency requirement (<180ms) before block finalization",
            "Adversarial smart contract obfuscation and complex peeling chain mixer topologies",
        ],
        description="Real-time blockchain security monitor analyzing Ethereum mempool token flow graphs to flag flash-loan attacks before miners seal the block.",
    ),

    # 12. Data Science: Deliberately Too-Long Timeline
    Project(
        id="proj-ds-02-long",
        title="Global Satellite Deforestation Multi-Decadal Spatio-Temporal Pipeline",
        domain="Data Science / GIS",
        difficulty=DifficultyLevel.ADVANCED,
        estimated_weeks=28,
        estimated_hours=800,
        estimated_cost_usd=400.0,
        compute_requirement=ComputeTier.CLOUD_GPU,
        required_hardware=[],
        required_skills={
            "python": 4,
            "data_science": 4,
            "gis": 3,
            "cloud_computing": 3,
        },
        critical_skills=["python", "data_science"],
        target_outcomes=[TargetOutcome.IEEE_PAPER, TargetOutcome.SOCIAL_GOOD],
        novelty_baseline=85.0,
        risk_factors=[
            "Massive petabyte-scale Sentinel/Landsat ingestion time exceeding semester duration",
            "Cloud storage and egress bandwidth costs for multitemporal raster cubes",
        ],
        description="Planetary-scale deforestation tracking requiring 28 weeks of historical satellite processing across hundreds of gigabytes of geospatial rasters.",
    ),
]


def get_all_seed_projects() -> List[Project]:
    """Returns a fresh copy of all seed projects."""
    return [p.model_copy() for p in SEED_PROJECTS]


def get_seed_project_by_id(project_id: str) -> Optional[Project]:
    """Finds a seed project by ID."""
    clean_id = project_id.strip().lower()
    for p in SEED_PROJECTS:
        if p.id.lower() == clean_id:
            return p.model_copy()
    return None
