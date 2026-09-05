const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

export const fetchDashboardStats = async () => {
  const res = await fetch(`${API_URL}/dashboard/stats`);
  return res.json();
};

export const fetchReports = async (limit = 1000, sortBy = 'priority') => {
  const res = await fetch(`${API_URL}/reports?limit=${limit}&sort_by=${sortBy}`);
  return res.json();
};

export const submitReport = async (
  text: string, 
  location?: { lat?: number; lng?: number; name?: string; district?: string; state?: string }
) => {
  const res = await fetch(`${API_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      lat: location?.lat,
      lng: location?.lng,
      location_name: location?.name,
      district: location?.district,
      state: location?.state,
    })
  });

  if (!res.ok) {
    let errorDetail = `Report registration failed (${res.status})`;
    try {
      const errorJson = await res.json();
      if (errorJson?.detail) {
        errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
      }
    } catch {
      // fallback to status code message
    }
    throw new Error(errorDetail);
  }

  return res.json();
};

export const transcribeAudio = async (audioBlob: Blob): Promise<{ text: string; language: string }> => {
  const formData = new FormData();
  let ext = 'webm';
  if (audioBlob.type.includes('mp4') || audioBlob.type.includes('m4a')) {
    ext = 'mp4';
  } else if (audioBlob.type.includes('ogg')) {
    ext = 'ogg';
  } else if (audioBlob.type.includes('wav')) {
    ext = 'wav';
  } else if (audioBlob.type.includes('aac')) {
    ext = 'aac';
  }
  formData.append('file', audioBlob, `speech.${ext}`);

  const res = await fetch(`${API_URL}/audio/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorDetail = `Transcription failed (${res.status})`;
    try {
      const errorJson = await res.json();
      if (errorJson?.detail) {
        errorDetail = errorJson.detail;
      }
    } catch {
      // fallback to status code message
    }
    throw new Error(errorDetail);
  }

  return res.json();
};

export const fetchHotspots = async () => {
  const res = await fetch(`${API_URL}/hotspots`);
  return res.json();
};

export const fetchRecommendations = async () => {
  const res = await fetch(`${API_URL}/recommendations`);
  return res.json();
};

export const simulateBudget = async (budgetCr: number) => {
  const res = await fetch(`${API_URL}/budget/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ total_budget_cr: budgetCr })
  });
  return res.json();
};

export const updateReportStatus = async (id: number, status: string) => {
  const res = await fetch(`${API_URL}/reports/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
};

export const fetchRisks = async () => {
  const res = await fetch(`${API_URL}/risks`);
  return res.json();
};

export const fetchImpacts = async () => {
  const res = await fetch(`${API_URL}/impact`);
  return res.json();
};

export const fetchReportDetails = async (id: number) => {
  const res = await fetch(`${API_URL}/reports/${id}`);
  return res.json();
};

export const fetchNotifications = async () => {
  const res = await fetch(`${API_URL}/notifications`);
  return res.json();
};

export const markNotificationRead = async (id: number) => {
  const res = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PATCH',
  });
  return res.json();
};
