// ============================================================
// Africa SDG Scorecard — Master Data Model
// Sources: World Bank, WHO, FAO, UNESCO UIS, UN SDG Database
// License: All source data under CC BY / open public use
// Last updated: 2025
// ============================================================
//
// STATUS KEY (traffic light):
//   "green"  = On track / Goal achieved
//   "yellow" = Moderate progress, likely achievable
//   "orange" = Slow progress, at risk
//   "red"    = Regressing or very far off track
//   "grey"   = Insufficient data
//
// SCORES are 0–100 (distance to SDG target, 100 = target met)
// ============================================================

export const SDG_GOALS = [
  { id: 1,  label: 'No Poverty',          color: '#e5243b', icon: '🏠' },
  { id: 2,  label: 'Zero Hunger',         color: '#dda63a', icon: '🌾' },
  { id: 3,  label: 'Good Health',         color: '#4c9f38', icon: '🏥' },
  { id: 4,  label: 'Quality Education',   color: '#c5192d', icon: '📚' },
  { id: 7,  label: 'Clean Energy',        color: '#fcc30b', icon: '⚡' },
  { id: 8,  label: 'Decent Work',         color: '#a21942', icon: '💼' },
  { id: 13, label: 'Climate Action',      color: '#3f7e44', icon: '🌍' },
]

export const REGIONS = [
  'East Africa',
  'West Africa',
  'Southern Africa',
  'North Africa',
  'Central Africa',
]

// ============================================================
// COUNTRY DATA
// Each country has:
//   - meta: name, iso, region, population, incomeGroup
//   - sdgScore: overall 0–100 composite (from SDSN SDG Index 2024/25 where available)
//   - sdgRank: continental rank
//   - goals: per-goal object with score, status, keyIndicator, value, unit, trend
// ============================================================

export const countries = [
  {
    iso: 'KEN', name: 'Kenya', flag: '🇰🇪',
    region: 'East Africa', population: 55.1, incomeGroup: 'Lower-middle',
    sdgScore: 54.2, sdgRank: 12,
    goals: {
      1:  { score: 48, status: 'orange', keyIndicator: 'Poverty headcount (<$2.15/day)', value: 36.1, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      2:  { score: 44, status: 'orange', keyIndicator: 'Undernourishment rate', value: 25.8, unit: '%', trend: 'stable',    source: 'FAO 2023' },
      3:  { score: 61, status: 'yellow', keyIndicator: 'Under-5 mortality rate', value: 41.1, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 63, status: 'yellow', keyIndicator: 'Primary completion rate', value: 84.7, unit: '%', trend: 'improving', source: 'UNESCO 2023' },
      7:  { score: 58, status: 'yellow', keyIndicator: 'Access to electricity', value: 75.2, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      8:  { score: 52, status: 'orange', keyIndicator: 'GDP per capita growth', value: 4.2,  unit: '%', trend: 'stable',    source: 'World Bank 2023' },
      13: { score: 55, status: 'yellow', keyIndicator: 'CO₂ emissions per capita', value: 0.38, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'ETH', name: 'Ethiopia', flag: '🇪🇹',
    region: 'East Africa', population: 126.5, incomeGroup: 'Low',
    sdgScore: 48.7, sdgRank: 28,
    goals: {
      1:  { score: 38, status: 'red',    keyIndicator: 'Poverty headcount (<$2.15/day)', value: 26.1, unit: '%', trend: 'worsening', source: 'World Bank 2022' },
      2:  { score: 35, status: 'red',    keyIndicator: 'Undernourishment rate', value: 35.6, unit: '%', trend: 'worsening', source: 'FAO 2023' },
      3:  { score: 52, status: 'orange', keyIndicator: 'Under-5 mortality rate', value: 47.8, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 55, status: 'orange', keyIndicator: 'Primary completion rate', value: 68.2, unit: '%', trend: 'improving', source: 'UNESCO 2023' },
      7:  { score: 42, status: 'orange', keyIndicator: 'Access to electricity', value: 44.3, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      8:  { score: 45, status: 'orange', keyIndicator: 'GDP per capita growth', value: 6.1,  unit: '%', trend: 'stable',    source: 'World Bank 2023' },
      13: { score: 68, status: 'yellow', keyIndicator: 'CO₂ emissions per capita', value: 0.14, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'TZA', name: 'Tanzania', flag: '🇹🇿',
    region: 'East Africa', population: 65.5, incomeGroup: 'Low',
    sdgScore: 51.3, sdgRank: 20,
    goals: {
      1:  { score: 42, status: 'orange', keyIndicator: 'Poverty headcount (<$2.15/day)', value: 44.2, unit: '%', trend: 'stable',    source: 'World Bank 2022' },
      2:  { score: 40, status: 'orange', keyIndicator: 'Undernourishment rate', value: 29.1, unit: '%', trend: 'stable',    source: 'FAO 2023' },
      3:  { score: 58, status: 'yellow', keyIndicator: 'Under-5 mortality rate', value: 51.7, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 61, status: 'yellow', keyIndicator: 'Primary completion rate', value: 79.3, unit: '%', trend: 'improving', source: 'UNESCO 2023' },
      7:  { score: 50, status: 'orange', keyIndicator: 'Access to electricity', value: 38.1, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      8:  { score: 50, status: 'orange', keyIndicator: 'GDP per capita growth', value: 4.8,  unit: '%', trend: 'stable',    source: 'World Bank 2023' },
      13: { score: 70, status: 'yellow', keyIndicator: 'CO₂ emissions per capita', value: 0.22, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'UGA', name: 'Uganda', flag: '🇺🇬',
    region: 'East Africa', population: 48.6, incomeGroup: 'Low',
    sdgScore: 50.1, sdgRank: 24,
    goals: {
      1:  { score: 40, status: 'orange', keyIndicator: 'Poverty headcount (<$2.15/day)', value: 41.7, unit: '%', trend: 'stable',    source: 'World Bank 2022' },
      2:  { score: 38, status: 'red',    keyIndicator: 'Undernourishment rate', value: 32.4, unit: '%', trend: 'worsening', source: 'FAO 2023' },
      3:  { score: 55, status: 'orange', keyIndicator: 'Under-5 mortality rate', value: 46.3, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 57, status: 'yellow', keyIndicator: 'Primary completion rate', value: 71.8, unit: '%', trend: 'improving', source: 'UNESCO 2023' },
      7:  { score: 40, status: 'orange', keyIndicator: 'Access to electricity', value: 41.5, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      8:  { score: 48, status: 'orange', keyIndicator: 'GDP per capita growth', value: 5.3,  unit: '%', trend: 'improving', source: 'World Bank 2023' },
      13: { score: 72, status: 'yellow', keyIndicator: 'CO₂ emissions per capita', value: 0.15, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'RWA', name: 'Rwanda', flag: '🇷🇼',
    region: 'East Africa', population: 14.1, incomeGroup: 'Low',
    sdgScore: 60.5, sdgRank: 5,
    goals: {
      1:  { score: 58, status: 'yellow', keyIndicator: 'Poverty headcount (<$2.15/day)', value: 52.4, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      2:  { score: 50, status: 'orange', keyIndicator: 'Undernourishment rate', value: 33.8, unit: '%', trend: 'improving', source: 'FAO 2023' },
      3:  { score: 68, status: 'yellow', keyIndicator: 'Under-5 mortality rate', value: 32.7, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 75, status: 'green',  keyIndicator: 'Primary completion rate', value: 92.1, unit: '%', trend: 'improving', source: 'UNESCO 2023' },
      7:  { score: 72, status: 'yellow', keyIndicator: 'Access to electricity', value: 53.4, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      8:  { score: 62, status: 'yellow', keyIndicator: 'GDP per capita growth', value: 8.2,  unit: '%', trend: 'improving', source: 'World Bank 2023' },
      13: { score: 74, status: 'yellow', keyIndicator: 'CO₂ emissions per capita', value: 0.11, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'NGA', name: 'Nigeria', flag: '🇳🇬',
    region: 'West Africa', population: 223.8, incomeGroup: 'Lower-middle',
    sdgScore: 43.8, sdgRank: 42,
    goals: {
      1:  { score: 30, status: 'red',    keyIndicator: 'Poverty headcount (<$2.15/day)', value: 39.1, unit: '%', trend: 'worsening', source: 'World Bank 2022' },
      2:  { score: 28, status: 'red',    keyIndicator: 'Undernourishment rate', value: 14.8, unit: '%', trend: 'worsening', source: 'FAO 2023' },
      3:  { score: 45, status: 'orange', keyIndicator: 'Under-5 mortality rate', value: 112.0, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 48, status: 'orange', keyIndicator: 'Primary completion rate', value: 68.9, unit: '%', trend: 'stable',    source: 'UNESCO 2023' },
      7:  { score: 52, status: 'orange', keyIndicator: 'Access to electricity', value: 55.4, unit: '%', trend: 'stable',    source: 'World Bank 2022' },
      8:  { score: 38, status: 'red',    keyIndicator: 'GDP per capita growth', value: 2.9,  unit: '%', trend: 'worsening', source: 'World Bank 2023' },
      13: { score: 40, status: 'orange', keyIndicator: 'CO₂ emissions per capita', value: 0.62, unit: 't', trend: 'worsening', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'GHA', name: 'Ghana', flag: '🇬🇭',
    region: 'West Africa', population: 33.5, incomeGroup: 'Lower-middle',
    sdgScore: 55.8, sdgRank: 9,
    goals: {
      1:  { score: 55, status: 'yellow', keyIndicator: 'Poverty headcount (<$2.15/day)', value: 21.4, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      2:  { score: 52, status: 'orange', keyIndicator: 'Undernourishment rate', value: 6.7,  unit: '%', trend: 'stable',    source: 'FAO 2023' },
      3:  { score: 63, status: 'yellow', keyIndicator: 'Under-5 mortality rate', value: 43.2, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 72, status: 'yellow', keyIndicator: 'Primary completion rate', value: 89.2, unit: '%', trend: 'improving', source: 'UNESCO 2023' },
      7:  { score: 68, status: 'yellow', keyIndicator: 'Access to electricity', value: 85.0, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      8:  { score: 48, status: 'orange', keyIndicator: 'GDP per capita growth', value: 3.1,  unit: '%', trend: 'worsening', source: 'World Bank 2023' },
      13: { score: 55, status: 'yellow', keyIndicator: 'CO₂ emissions per capita', value: 0.47, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'ZAF', name: 'South Africa', flag: '🇿🇦',
    region: 'Southern Africa', population: 60.4, incomeGroup: 'Upper-middle',
    sdgScore: 58.3, sdgRank: 7,
    goals: {
      1:  { score: 38, status: 'red',    keyIndicator: 'Poverty headcount (<$2.15/day)', value: 18.9, unit: '%', trend: 'worsening', source: 'World Bank 2022' },
      2:  { score: 50, status: 'orange', keyIndicator: 'Undernourishment rate', value: 7.1,  unit: '%', trend: 'stable',    source: 'FAO 2023' },
      3:  { score: 62, status: 'yellow', keyIndicator: 'Under-5 mortality rate', value: 31.3, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 72, status: 'yellow', keyIndicator: 'Primary completion rate', value: 93.5, unit: '%', trend: 'stable',    source: 'UNESCO 2023' },
      7:  { score: 78, status: 'yellow', keyIndicator: 'Access to electricity', value: 84.2, unit: '%', trend: 'stable',    source: 'World Bank 2022' },
      8:  { score: 35, status: 'red',    keyIndicator: 'GDP per capita growth', value: 0.6,  unit: '%', trend: 'worsening', source: 'World Bank 2023' },
      13: { score: 28, status: 'red',    keyIndicator: 'CO₂ emissions per capita', value: 6.84, unit: 't', trend: 'worsening', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'EGY', name: 'Egypt', flag: '🇪🇬',
    region: 'North Africa', population: 105.9, incomeGroup: 'Lower-middle',
    sdgScore: 62.1, sdgRank: 3,
    goals: {
      1:  { score: 68, status: 'yellow', keyIndicator: 'Poverty headcount (<$2.15/day)', value: 3.8,  unit: '%', trend: 'stable',    source: 'World Bank 2022' },
      2:  { score: 62, status: 'yellow', keyIndicator: 'Undernourishment rate', value: 6.1,  unit: '%', trend: 'improving', source: 'FAO 2023' },
      3:  { score: 70, status: 'yellow', keyIndicator: 'Under-5 mortality rate', value: 18.5, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 78, status: 'yellow', keyIndicator: 'Primary completion rate', value: 97.8, unit: '%', trend: 'stable',    source: 'UNESCO 2023' },
      7:  { score: 88, status: 'green',  keyIndicator: 'Access to electricity', value: 99.9, unit: '%', trend: 'stable',    source: 'World Bank 2022' },
      8:  { score: 58, status: 'yellow', keyIndicator: 'GDP per capita growth', value: 3.8,  unit: '%', trend: 'worsening', source: 'World Bank 2023' },
      13: { score: 38, status: 'red',    keyIndicator: 'CO₂ emissions per capita', value: 2.44, unit: 't', trend: 'worsening', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'MAR', name: 'Morocco', flag: '🇲🇦',
    region: 'North Africa', population: 37.5, incomeGroup: 'Lower-middle',
    sdgScore: 64.8, sdgRank: 1,
    goals: {
      1:  { score: 72, status: 'yellow', keyIndicator: 'Poverty headcount (<$2.15/day)', value: 1.0,  unit: '%', trend: 'improving', source: 'World Bank 2022' },
      2:  { score: 65, status: 'yellow', keyIndicator: 'Undernourishment rate', value: 5.1,  unit: '%', trend: 'improving', source: 'FAO 2023' },
      3:  { score: 72, status: 'yellow', keyIndicator: 'Under-5 mortality rate', value: 20.3, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 76, status: 'yellow', keyIndicator: 'Primary completion rate', value: 95.2, unit: '%', trend: 'improving', source: 'UNESCO 2023' },
      7:  { score: 85, status: 'green',  keyIndicator: 'Access to electricity', value: 100.0, unit: '%', trend: 'stable',   source: 'World Bank 2022' },
      8:  { score: 60, status: 'yellow', keyIndicator: 'GDP per capita growth', value: 3.4,  unit: '%', trend: 'stable',    source: 'World Bank 2023' },
      13: { score: 52, status: 'orange', keyIndicator: 'CO₂ emissions per capita', value: 1.82, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'SEN', name: 'Senegal', flag: '🇸🇳',
    region: 'West Africa', population: 17.8, incomeGroup: 'Low',
    sdgScore: 52.4, sdgRank: 17,
    goals: {
      1:  { score: 45, status: 'orange', keyIndicator: 'Poverty headcount (<$2.15/day)', value: 36.2, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      2:  { score: 42, status: 'orange', keyIndicator: 'Undernourishment rate', value: 9.8,  unit: '%', trend: 'stable',    source: 'FAO 2023' },
      3:  { score: 58, status: 'yellow', keyIndicator: 'Under-5 mortality rate', value: 41.2, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 60, status: 'yellow', keyIndicator: 'Primary completion rate', value: 76.8, unit: '%', trend: 'improving', source: 'UNESCO 2023' },
      7:  { score: 62, status: 'yellow', keyIndicator: 'Access to electricity', value: 67.2, unit: '%', trend: 'improving', source: 'World Bank 2022' },
      8:  { score: 55, status: 'yellow', keyIndicator: 'GDP per capita growth', value: 5.5,  unit: '%', trend: 'improving', source: 'World Bank 2023' },
      13: { score: 65, status: 'yellow', keyIndicator: 'CO₂ emissions per capita', value: 0.64, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
  {
    iso: 'COD', name: 'DR Congo', flag: '🇨🇩',
    region: 'Central Africa', population: 102.3, incomeGroup: 'Low',
    sdgScore: 38.2, sdgRank: 51,
    goals: {
      1:  { score: 22, status: 'red',    keyIndicator: 'Poverty headcount (<$2.15/day)', value: 76.6, unit: '%', trend: 'worsening', source: 'World Bank 2022' },
      2:  { score: 20, status: 'red',    keyIndicator: 'Undernourishment rate', value: 41.5, unit: '%', trend: 'worsening', source: 'FAO 2023' },
      3:  { score: 38, status: 'red',    keyIndicator: 'Under-5 mortality rate', value: 83.7, unit: '/1000', trend: 'improving', source: 'WHO 2023' },
      4:  { score: 42, status: 'orange', keyIndicator: 'Primary completion rate', value: 52.3, unit: '%', trend: 'stable',    source: 'UNESCO 2023' },
      7:  { score: 22, status: 'red',    keyIndicator: 'Access to electricity', value: 19.1, unit: '%', trend: 'stable',    source: 'World Bank 2022' },
      8:  { score: 35, status: 'red',    keyIndicator: 'GDP per capita growth', value: 4.5,  unit: '%', trend: 'stable',    source: 'World Bank 2023' },
      13: { score: 78, status: 'yellow', keyIndicator: 'CO₂ emissions per capita', value: 0.04, unit: 't', trend: 'stable', source: 'UNFCCC 2022' },
    }
  },
]

// ============================================================
// COMPUTED HELPERS
// ============================================================

export function getStatusColor(status) {
  const map = { green: '#22c55e', yellow: '#eab308', orange: '#f97316', red: '#ef4444', grey: '#4b5563' }
  return map[status] || map.grey
}

export function getStatusLabel(status) {
  const map = { green: 'On Track', yellow: 'Moderate', orange: 'At Risk', red: 'Off Track', grey: 'No Data' }
  return map[status] || 'Unknown'
}

export function getTrendIcon(trend) {
  return trend === 'improving' ? '↑' : trend === 'worsening' ? '↓' : '→'
}

export function getOverallStatus(score) {
  if (score >= 70) return 'green'
  if (score >= 55) return 'yellow'
  if (score >= 40) return 'orange'
  return 'red'
}

export function computeRegionSummary() {
  const regionMap = {}
  countries.forEach(c => {
    if (!regionMap[c.region]) regionMap[c.region] = { count: 0, totalScore: 0 }
    regionMap[c.region].count++
    regionMap[c.region].totalScore += c.sdgScore
  })
  return Object.entries(regionMap).map(([region, d]) => ({
    region,
    avgScore: +(d.totalScore / d.count).toFixed(1),
    count: d.count,
  })).sort((a, b) => b.avgScore - a.avgScore)
}

export const SECTOR_STATS = {
  totalCountries: 54,
  coveredCountries: countries.length,
  dataYear: '2023–2025',
  lastUpdated: 'April 2026',
  goalsTracked: SDG_GOALS.length,
  onTrackCount: countries.filter(c => c.sdgScore >= 70).length,
  atRiskCount: countries.filter(c => c.sdgScore < 50).length,
  topCountry: [...countries].sort((a, b) => b.sdgScore - a.sdgScore)[0],
  bottomCountry: [...countries].sort((a, b) => a.sdgScore - b.sdgScore)[0],
}
