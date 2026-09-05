/**
 * Official Google PromptWars Demo Scenarios
 * Configured to immediately demonstrate the Reality Check & Reforge capabilities
 */

// SCENARIO A: Unrealistic 3D Medical Diagnostics on CPU
export const DEMO_SCENARIO_A_PROFILE = {
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

export const DEMO_SCENARIO_A_IDEA = "Real-time AI medical diagnosis using large 3D medical images";

// SCENARIO B: Saturated Undergraduate Cliché - Face Recognition Attendance
export const DEMO_SCENARIO_B_PROFILE = {
  major: "Computer Science",
  academicLevel: "B.Tech Final Year",
  teamSize: 2,
  weeksAvailable: 10,
  weeklyHoursPerMember: 10,
  budgetLimitUsd: 20.0,
  computeTier: "cpu_only",
  hardwareAvailable: [],
  skills: {
    python: 3,
    opencv: 2,
    javascript: 2,
  },
  targetOutcome: "industry_grade",
};

export const DEMO_SCENARIO_B_IDEA = "AI Face Recognition Attendance System";

// Backwards compatibility aliases
export const DEMO_STUDENT_PROFILE = DEMO_SCENARIO_A_PROFILE;
export const DEMO_RAW_IDEA = DEMO_SCENARIO_A_IDEA;

export const ALTERNATIVE_DEMO_IDEAS = [
  {
    label: "3D Medical Imaging (High Compute/Data Risk)",
    idea: DEMO_SCENARIO_A_IDEA,
    summary: "Requires Cloud GPU + HIPAA clearance + 22 weeks. Catches extreme compute and regulatory barriers.",
  },
  {
    label: "Face Recognition Attendance (Undergraduate Cliché)",
    idea: DEMO_SCENARIO_B_IDEA,
    summary: "Detects repository saturation and applies the edge-based liveness verification twist.",
  },
  {
    label: "Agri-Drone Aerial Spraying (Hardware & Budget Risk)",
    idea: "Autonomous crop disease aerial spraying drone using custom multispectral cameras and LiDAR",
    summary: "Requires physical UAV + LiDAR + $650 budget. Catches hardware dependency gaps.",
  },
  {
    label: "TinyML Keyword Spotter (Feasible Low-Resource)",
    idea: "On-device voice keyword spotting with 8-bit quantization for embedded micro-controllers",
    summary: "Feasible within student constraints and CPU compute.",
  },
];
