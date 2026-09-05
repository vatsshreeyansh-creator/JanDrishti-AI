export interface DistrictCoordinates {
  lat: number;
  lng: number;
}

export const JHARKHAND_CENTER: [number, number] = [23.6102, 85.2799];
export const JHARKHAND_ZOOM = 7;

/**
 * Static dictionary of all 24 official Jharkhand districts
 * with their administrative headquarters coordinates.
 */
export const JHARKHAND_DISTRICTS: Record<string, DistrictCoordinates> = {
  'Bokaro': { lat: 23.6693, lng: 86.1511 },
  'Chatra': { lat: 24.2093, lng: 84.8710 },
  'Deoghar': { lat: 24.4826, lng: 86.7000 },
  'Dhanbad': { lat: 23.7957, lng: 86.4304 },
  'Dumka': { lat: 24.2676, lng: 87.2479 },
  'East Singhbhum': { lat: 22.8046, lng: 86.2029 },
  'Garhwa': { lat: 24.1611, lng: 83.8052 },
  'Giridih': { lat: 24.1856, lng: 86.3094 },
  'Godda': { lat: 24.8267, lng: 87.2139 },
  'Gumla': { lat: 23.0442, lng: 84.5414 },
  'Hazaribagh': { lat: 23.9925, lng: 85.3637 },
  'Jamtara': { lat: 23.9632, lng: 86.8029 },
  'Khunti': { lat: 23.0744, lng: 85.2789 },
  'Koderma': { lat: 24.4674, lng: 85.5938 },
  'Latehar': { lat: 23.7441, lng: 84.5020 },
  'Lohardaga': { lat: 23.4354, lng: 84.6806 },
  'Pakur': { lat: 24.6334, lng: 87.8493 },
  'Palamu': { lat: 24.0384, lng: 84.0704 },
  'Ramgarh': { lat: 23.6300, lng: 85.5126 },
  'Ranchi': { lat: 23.3441, lng: 85.3096 },
  'Sahibganj': { lat: 25.2425, lng: 87.6433 },
  'Saraikela Kharsawan': { lat: 22.7006, lng: 85.9309 },
  'Simdega': { lat: 22.6148, lng: 84.5100 },
  'West Singhbhum': { lat: 22.5562, lng: 85.8118 }
};

export const JHARKHAND_DISTRICT_NAMES = Object.keys(JHARKHAND_DISTRICTS).sort();

export const getDistrictCoords = (districtName: string): DistrictCoordinates => {
  if (JHARKHAND_DISTRICTS[districtName]) {
    return JHARKHAND_DISTRICTS[districtName];
  }
  // Fallback to state capital Ranchi
  return JHARKHAND_DISTRICTS['Ranchi'];
};
