/**
 * ForgeGrad AI - Frontend API Service Layer
 * Connects directly to the deterministic backend & Gemini Intelligence layer on /api/v1
 */

export function getApiBaseUrl() {
  const customUrl = import.meta.env.VITE_API_URL;
  if (customUrl) {
    const clean = customUrl.trim().replace(/\/+$/, '');
    if (clean.endsWith('/api/v1')) return clean;
    if (clean.endsWith('/api')) return `${clean}/v1`;
    return `${clean}/api/v1`;
  }
  // In production (Vercel), default directly to live deployed Render backend
  if (import.meta.env.PROD) {
    return 'https://prompt-l2ho.onrender.com/api/v1';
  }
  // In local development, Vite proxies /api to http://127.0.0.1:8000
  return '/api/v1';
}

export function getHealthUrl() {
  const customUrl = import.meta.env.VITE_API_URL;
  if (customUrl) {
    const clean = customUrl.trim().replace(/\/+$/, '');
    if (clean.endsWith('/api/v1')) return `${clean.replace(/\/api\/v1$/, '')}/api/health`;
    if (clean.endsWith('/api')) return `${clean}/health`;
    return `${clean}/api/health`;
  }
  // In production (Vercel), default directly to live deployed Render health endpoint
  if (import.meta.env.PROD) {
    return 'https://prompt-l2ho.onrender.com/api/health';
  }
  return '/api/health';
}

export const API_BASE_URL = getApiBaseUrl();

export async function fetchBackendHealth() {
  try {
    const res = await fetch(getHealthUrl());
    if (!res.ok) throw new Error(`Health check returned status ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: "offline", error: err.message };
  }
}

function normalizeStudentProfile(studentProfile) {
  return {
    major: studentProfile.major || "Computer Science",
    team_size: parseInt(studentProfile.team_size || studentProfile.teamSize, 10) || 3,
    weeks_available: parseInt(studentProfile.weeks_available || studentProfile.weeksAvailable, 10) || 12,
    weekly_hours_per_member: parseInt(studentProfile.weekly_hours_per_member || studentProfile.weeklyHoursPerMember, 10) || 15,
    budget_limit_usd: parseFloat(studentProfile.budget_limit_usd !== undefined ? studentProfile.budget_limit_usd : studentProfile.budgetLimitUsd) || 0.0,
    compute_tier: studentProfile.compute_tier || studentProfile.computeTier || "cpu_only",
    hardware_available: studentProfile.hardware_available || studentProfile.hardwareAvailable || [],
    skills: studentProfile.skills || {},
    target_outcome: studentProfile.target_outcome || studentProfile.targetOutcome || "industry_grade",
  };
}

export async function submitRealityCheck(studentProfile, rawIdea, candidateProjectId = null) {
  const payload = {
    student_profile: normalizeStudentProfile(studentProfile),
    raw_project_idea: rawIdea.trim(),
    candidate_project_id: candidateProjectId || null,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}/reality-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.detail || `Server returned error status ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: "Reality Check request timed out. Please verify backend service availability and connectivity.",
      };
    }
    return {
      success: false,
      error: err.message || "Failed to communicate with ForgeGrad backend service.",
    };
  }
}

export async function fetchGeminiStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/gemini/status`);
    if (!res.ok) throw new Error("Status check failed");
    return await res.json();
  } catch {
    return {
      configured: false,
      status: "offline_fallback",
      message: "Backend unreachable or offline",
    };
  }
}

export async function reforgeWithGemini(studentProfile, rawIdea) {
  const payload = {
    student_profile: normalizeStudentProfile(studentProfile),
    raw_idea: rawIdea.trim(),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 40000); // 40s for deep LLM audit & reforge

  try {
    const response = await fetch(`${API_BASE_URL}/gemini/reforge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.detail || `Reforge failed with status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.message || "Failed to communicate with Gemini Reforging service.",
    };
  }
}

export async function refineReforgedProject(studentProfile, currentReforge, instruction) {
  const payload = {
    student_profile: normalizeStudentProfile(studentProfile),
    current_reforge: currentReforge,
    refinement_instruction: instruction.trim(),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch(`${API_BASE_URL}/gemini/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.detail || `Refinement failed with status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.message || "Failed to refine project.",
    };
  }
}

export async function fetchSeedProjects(domain = null, difficulty = null) {
  try {
    let url = `${API_BASE_URL}/projects`;
    const params = new URLSearchParams();
    if (domain) params.append('domain', domain);
    if (difficulty) params.append('difficulty', difficulty);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch project catalog");
    return await res.json();
  } catch (err) {
    console.warn("Could not fetch projects from backend:", err);
    return [];
  }
}
