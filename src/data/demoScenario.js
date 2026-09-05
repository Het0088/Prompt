/**
 * Official Google PromptWars Demo Scenario
 * Configured to immediately demonstrate the Reality Check capability
 */

export const DEMO_STUDENT_PROFILE = {
  major: "Computer Science",
  academicLevel: "B.Tech Final Year",
  teamSize: 3,
  weeksAvailable: 12,
  weeklyHoursPerMember: 15,
  budgetLimitUsd: 50.0,
  computeTier: "cpu_only",
  hardwareAvailable: [],
  skills: {
    python: 3,
    pytorch: 1,
    machine_learning: 2,
    javascript: 3,
    react: 3,
    sql: 3,
  },
  targetOutcome: "ieee_paper",
};

export const DEMO_RAW_IDEA = "Real-time AI medical diagnosis using large 3D medical images";

export const ALTERNATIVE_DEMO_IDEAS = [
  {
    label: "3D Medical Imaging (High Compute/Data Risk)",
    idea: "Real-time AI medical diagnosis using large 3D medical images",
    summary: "Requires Cloud GPU + HIPAA clearance + 22 weeks. Catches extreme compute and regulatory barriers.",
  },
  {
    label: "Agri-Drone Aerial Spraying (Hardware & Budget Risk)",
    idea: "Autonomous crop disease aerial spraying drone using custom multispectral cameras and LiDAR",
    summary: "Requires physical UAV + LiDAR + $650 budget. Catches hardware dependency gaps.",
  },
  {
    label: "Face Recognition Attendance (Undergraduate Cliché)",
    idea: "Face recognition based student attendance system using OpenCV and webcam",
    summary: "Detects repository saturation and applies the edge-based liveness verification twist.",
  },
  {
    label: "TinyML Keyword Spotter (Feasible Low-Resource)",
    idea: "On-device voice keyword spotting with 8-bit quantization for embedded micro-controllers",
    summary: "Feasible within student constraints and CPU compute.",
  },
];
