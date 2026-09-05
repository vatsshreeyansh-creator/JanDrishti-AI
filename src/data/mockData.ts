export const mockComplaints = [
  { id: 'C001', text: "The main pipeline in Sector 4 is leaking again. Half the street is flooded, and our taps are running dry for 3 days.", category: 'Water', sentiment: 'critical', location: [28.6139, 77.2090], aiTags: ['leakage', 'flooded', 'no supply', '3 days'], aiPriority: 95 },
  { id: 'C002', text: "Streetlights on MG Road have been completely off for a week. It feels very unsafe for women returning from night shifts.", category: 'Safety', sentiment: 'high', location: [28.6120, 77.2110], aiTags: ['no lights', 'unsafe', 'women safety'], aiPriority: 88 },
  { id: 'C003', text: "Potholes near the primary school are causing traffic jams and accidents every morning.", category: 'Roads', sentiment: 'medium', location: [28.6250, 77.2000], aiTags: ['potholes', 'school zone', 'accidents'], aiPriority: 75 },
  { id: 'C004', text: "Garbage hasn't been collected in Block C for 4 days. The smell is unbearable and stray dogs are spreading it.", category: 'Sanitation', sentiment: 'high', location: [28.6300, 77.2200], aiTags: ['uncollected', 'stray dogs', 'health hazard'], aiPriority: 82 },
  { id: 'C005', text: "The new park benches are broken already. Need maintenance.", category: 'Parks', sentiment: 'low', location: [28.6050, 77.2300], aiTags: ['broken bench', 'maintenance'], aiPriority: 30 },
];

export const mockImpactMetrics = [
  { month: 'Jan', beforeJanDrishti: 45, withJanDrishti: 20 },
  { month: 'Feb', beforeJanDrishti: 42, withJanDrishti: 18 },
  { month: 'Mar', beforeJanDrishti: 48, withJanDrishti: 15 },
  { month: 'Apr', beforeJanDrishti: 50, withJanDrishti: 12 },
  { month: 'May', beforeJanDrishti: 46, withJanDrishti: 10 },
  { month: 'Jun', beforeJanDrishti: 43, withJanDrishti: 8 },
];

export const mockCategories = [
  { name: 'Water Supply', value: 400 },
  { name: 'Road Infrastructure', value: 300 },
  { name: 'Public Safety', value: 300 },
  { name: 'Sanitation', value: 200 },
];

export const regionScores = [
  { region: 'North District', score: 85, budgetNeeded: 120, citizenImpact: 45000 },
  { region: 'South District', score: 62, budgetNeeded: 45, citizenImpact: 12000 },
  { region: 'East District', score: 92, budgetNeeded: 180, citizenImpact: 78000 },
  { region: 'West District', score: 45, budgetNeeded: 30, citizenImpact: 5000 },
  { region: 'Central District', score: 78, budgetNeeded: 90, citizenImpact: 35000 },
];
