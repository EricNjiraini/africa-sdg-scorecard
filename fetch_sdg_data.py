"""
Africa SDG Scorecard — Phase 2 + 3 Data Collection Script
==========================================================
Phase 2: Real data from World Bank API for all 54 AU countries
Phase 3: Trend direction (improving/stable/worsening) via
         linear regression on 5-year time series

Run:    python fetch_sdg_data.py
Output: sdgData_real.js  →  copy to src/data/sdgData.js

Dependencies: pip install requests pandas numpy
"""

import requests
import pandas as pd
import numpy as np
import json
import time

# ── 54 AU member states ────────────────────────────────────────────────────
COUNTRIES = [
    ("DZA", "Algeria",                  "🇩🇿", "North Africa"),
    ("AGO", "Angola",                   "🇦🇴", "Central Africa"),
    ("BEN", "Benin",                    "🇧🇯", "West Africa"),
    ("BWA", "Botswana",                 "🇧🇼", "Southern Africa"),
    ("BFA", "Burkina Faso",             "🇧🇫", "West Africa"),
    ("BDI", "Burundi",                  "🇧🇮", "East Africa"),
    ("CPV", "Cabo Verde",               "🇨🇻", "West Africa"),
    ("CMR", "Cameroon",                 "🇨🇲", "Central Africa"),
    ("CAF", "Central African Republic", "🇨🇫", "Central Africa"),
    ("TCD", "Chad",                     "🇹🇩", "Central Africa"),
    ("COM", "Comoros",                  "🇰🇲", "East Africa"),
    ("COD", "DR Congo",                 "🇨🇩", "Central Africa"),
    ("COG", "Republic of Congo",        "🇨🇬", "Central Africa"),
    ("CIV", "Côte d'Ivoire",           "🇨🇮", "West Africa"),
    ("DJI", "Djibouti",                 "🇩🇯", "East Africa"),
    ("EGY", "Egypt",                    "🇪🇬", "North Africa"),
    ("GNQ", "Equatorial Guinea",        "🇬🇶", "Central Africa"),
    ("ERI", "Eritrea",                  "🇪🇷", "East Africa"),
    ("SWZ", "Eswatini",                 "🇸🇿", "Southern Africa"),
    ("ETH", "Ethiopia",                 "🇪🇹", "East Africa"),
    ("GAB", "Gabon",                    "🇬🇦", "Central Africa"),
    ("GMB", "Gambia",                   "🇬🇲", "West Africa"),
    ("GHA", "Ghana",                    "🇬🇭", "West Africa"),
    ("GIN", "Guinea",                   "🇬🇳", "West Africa"),
    ("GNB", "Guinea-Bissau",            "🇬🇼", "West Africa"),
    ("KEN", "Kenya",                    "🇰🇪", "East Africa"),
    ("LSO", "Lesotho",                  "🇱🇸", "Southern Africa"),
    ("LBR", "Liberia",                  "🇱🇷", "West Africa"),
    ("LBY", "Libya",                    "🇱🇾", "North Africa"),
    ("MDG", "Madagascar",               "🇲🇬", "East Africa"),
    ("MWI", "Malawi",                   "🇲🇼", "East Africa"),
    ("MLI", "Mali",                     "🇲🇱", "West Africa"),
    ("MRT", "Mauritania",               "🇲🇷", "West Africa"),
    ("MUS", "Mauritius",                "🇲🇺", "East Africa"),
    ("MAR", "Morocco",                  "🇲🇦", "North Africa"),
    ("MOZ", "Mozambique",               "🇲🇿", "Southern Africa"),
    ("NAM", "Namibia",                  "🇳🇦", "Southern Africa"),
    ("NER", "Niger",                    "🇳🇪", "West Africa"),
    ("NGA", "Nigeria",                  "🇳🇬", "West Africa"),
    ("RWA", "Rwanda",                   "🇷🇼", "East Africa"),
    ("STP", "São Tomé and Príncipe",   "🇸🇹", "Central Africa"),
    ("SEN", "Senegal",                  "🇸🇳", "West Africa"),
    ("SLE", "Sierra Leone",             "🇸🇱", "West Africa"),
    ("SOM", "Somalia",                  "🇸🇴", "East Africa"),
    ("ZAF", "South Africa",             "🇿🇦", "Southern Africa"),
    ("SSD", "South Sudan",              "🇸🇸", "East Africa"),
    ("SDN", "Sudan",                    "🇸🇩", "North Africa"),
    ("TZA", "Tanzania",                 "🇹🇿", "East Africa"),
    ("TGO", "Togo",                     "🇹🇬", "West Africa"),
    ("TUN", "Tunisia",                  "🇹🇳", "North Africa"),
    ("UGA", "Uganda",                   "🇺🇬", "East Africa"),
    ("ZMB", "Zambia",                   "🇿🇲", "Southern Africa"),
    ("ZWE", "Zimbabwe",                 "🇿🇼", "Southern Africa"),
]

# Deduplicate
seen = set()
COUNTRIES = [c for c in COUNTRIES if c[0] not in seen and not seen.add(c[0])]
ISO_CODES = [c[0] for c in COUNTRIES]

# ── Indicator config ───────────────────────────────────────────────────────
# WB_CODE → (internal_key, sdg_id, direction, target, worst, unit, label, source_label)
# direction: "lower_better" | "higher_better"
INDICATORS = {
    "SI.POV.DDAY":     ("sdg1", 1,  "lower_better",  0,    80,   "%",     "Poverty headcount (<$2.15/day)",  "World Bank"),
    "SN.ITK.DEFC.ZS":  ("sdg2", 2,  "lower_better",  2.5,  60,   "%",     "Undernourishment rate",           "FAO / World Bank"),
    "SH.DYN.MORT":     ("sdg3", 3,  "lower_better",  25,   200,  "/1000", "Under-5 mortality rate",          "WHO / World Bank"),
    "SE.PRM.CMPT.ZS":  ("sdg4", 4,  "higher_better", 100,  20,   "%",     "Primary completion rate",         "UNESCO / World Bank"),
    "EG.ELC.ACCS.ZS":  ("sdg7", 7,  "higher_better", 100,  0,    "%",     "Access to electricity",           "World Bank"),
    "NY.GDP.PCAP.KD.ZG":("sdg8", 8, "higher_better", 7,    -10,  "%",     "GDP per capita growth",           "World Bank"),
    "EN.ATM.CO2E.PC":  ("sdg13",13, "lower_better",  0.5,  12,   "t",     "CO₂ emissions per capita",        "World Bank / IEA"),
    # Meta — not scored
    "SP.POP.TOTL":     ("pop",  None, None, None, None, None, "Population", None),
    "NY.GNP.PCAP.CD":  ("gni",  None, None, None, None, None, "GNI per capita", None),
}

# ── Trend thresholds (annualised score change) ─────────────────────────────
# If score is improving by ≥ TREND_THRESHOLD per year → "improving"
# If worsening by ≥ TREND_THRESHOLD per year → "worsening"
# Otherwise → "stable"
TREND_THRESHOLD = 0.8  # score points per year


# ══════════════════════════════════════════════════════════════════════════
# FETCHING
# ══════════════════════════════════════════════════════════════════════════

def wb_fetch_timeseries(wb_code, countries_str, mrv=8):
    """
    Fetch up to `mrv` years of data for all countries at once.
    Returns: {iso: [(year_int, value), ...]} sorted oldest → newest
    """
    url = (
        f"https://api.worldbank.org/v2/country/{countries_str}"
        f"/indicator/{wb_code}"
        f"?format=json&mrv={mrv}&per_page=2000"
    )
    try:
        r = requests.get(url, timeout=20)
        r.raise_for_status()
        payload = r.json()
        if len(payload) < 2 or not payload[1]:
            return {}

        series = {}
        for row in payload[1]:
            iso = row.get("countryiso3code") or ""
            val = row.get("value")
            yr  = row.get("date", "")
            if iso and val is not None:
                try:
                    yr_int = int(yr)
                    if iso not in series:
                        series[iso] = []
                    series[iso].append((yr_int, round(float(val), 3)))
                except ValueError:
                    pass

        # Sort each country's series oldest → newest
        for iso in series:
            series[iso].sort(key=lambda x: x[0])

        return series

    except Exception as e:
        print(f"  ⚠ WB fetch error ({wb_code}): {e}")
        return {}


# ══════════════════════════════════════════════════════════════════════════
# SCORING
# ══════════════════════════════════════════════════════════════════════════

def to_score(ikey, value, direction, target, worst):
    """Convert raw value → 0-100 SDG progress score."""
    if value is None:
        return None
    if direction == "lower_better":
        s = 100 * (worst - value) / (worst - target)
    else:
        s = 100 * (value - worst) / (target - worst)
    return max(0.0, min(100.0, round(s, 1)))


def status_from_score(score):
    if score is None: return "grey"
    if score >= 70:   return "green"
    if score >= 55:   return "yellow"
    if score >= 40:   return "orange"
    return "red"


# ══════════════════════════════════════════════════════════════════════════
# PHASE 3 — TREND COMPUTATION
# ══════════════════════════════════════════════════════════════════════════

def compute_trend(timeseries, direction, target, worst, threshold=TREND_THRESHOLD):
    """
    Given a list of (year, raw_value) pairs, compute trend direction.

    Method: Convert each point to a score (0-100), then fit a linear
    regression on year → score. The slope (score points per year) tells us
    the direction and pace of change.

    Returns: "improving" | "worsening" | "stable"
    """
    if not timeseries or len(timeseries) < 2:
        return "stable"

    # Convert to scores
    scored = []
    for yr, val in timeseries:
        s = to_score(None, val, direction, target, worst)
        if s is not None:
            scored.append((yr, s))

    if len(scored) < 2:
        return "stable"

    years  = np.array([p[0] for p in scored], dtype=float)
    scores = np.array([p[1] for p in scored], dtype=float)

    # Linear regression: score = slope * year + intercept
    slope = np.polyfit(years, scores, 1)[0]

    # slope > 0 means score improving (moving toward target)
    if slope >= threshold:
        return "improving"
    elif slope <= -threshold:
        return "worsening"
    else:
        return "stable"


def trend_summary(timeseries, direction, target, worst):
    """
    Returns dict with trend, slope, baseline_score, current_score,
    and sparkline-ready series for the UI.
    """
    if not timeseries or len(timeseries) < 2:
        return {"trend": "stable", "slope": 0, "sparkline": []}

    scored = [(yr, to_score(None, val, direction, target, worst))
              for yr, val in timeseries
              if to_score(None, val, direction, target, worst) is not None]

    if len(scored) < 2:
        return {"trend": "stable", "slope": 0, "sparkline": []}

    years  = np.array([p[0] for p in scored], dtype=float)
    scores = np.array([p[1] for p in scored], dtype=float)
    slope  = float(np.polyfit(years, scores, 1)[0])

    trend = "improving" if slope >= TREND_THRESHOLD else \
            "worsening" if slope <= -TREND_THRESHOLD else "stable"

    # Build sparkline: list of {year, score} for last 6 data points
    sparkline = [{"year": int(yr), "score": round(sc, 1)}
                 for yr, sc in scored[-6:]]

    return {
        "trend":          trend,
        "slope":          round(slope, 3),   # score pts/year — useful for Analysis tab
        "baseline_score": scored[0][1],      # earliest available
        "current_score":  scored[-1][1],     # most recent
        "sparkline":      sparkline,
    }


# ══════════════════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════════════════

def income_group(gni):
    if gni is None: return "Unknown"
    if gni >= 13846: return "High"
    if gni >= 4466:  return "Upper-middle"
    if gni >= 1136:  return "Lower-middle"
    return "Low"


# ══════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════

def main():
    print("\n🌍 Africa SDG Scorecard — Phase 2 + 3 Data Pipeline")
    print("=" * 57)

    countries_str = ";".join(ISO_CODES)

    # ── 1. Fetch all time-series data ──────────────────────────────────────
    print(f"\n📡 Fetching time-series (8 yrs) for {len(INDICATORS)} indicators...")
    raw_series = {}  # wb_code → {iso → [(year, value), ...]}

    for wb_code, cfg in INDICATORS.items():
        ikey = cfg[0]
        print(f"   → {cfg[6]}")
        raw_series[wb_code] = wb_fetch_timeseries(wb_code, countries_str, mrv=8)
        time.sleep(0.35)  # polite rate limiting

    # ── 2. Build per-country data structure ────────────────────────────────
    print(f"\n🔨 Computing scores + trends for {len(COUNTRIES)} countries...")

    country_objects = []

    for iso, name, flag, region in COUNTRIES:

        # Meta: population and GNI
        pop_series = raw_series.get("SP.POP.TOTL", {}).get(iso, [])
        gni_series = raw_series.get("NY.GNP.PCAP.CD", {}).get(iso, [])
        pop = round(pop_series[-1][1] / 1_000_000, 1) if pop_series else None
        gni = gni_series[-1][1] if gni_series else None

        goals = {}
        goal_scores = []

        for wb_code, (ikey, sdg_id, direction, target, worst, unit, label, source_label) in INDICATORS.items():
            if sdg_id is None:
                continue  # meta indicator, skip

            ts = raw_series.get(wb_code, {}).get(iso, [])
            if not ts:
                continue  # no data → goal omitted → grey in UI

            # Most recent value
            latest_year, latest_val = ts[-1]
            score = to_score(ikey, latest_val, direction, target, worst)
            status = status_from_score(score)

            # Phase 3: trend
            tinfo = trend_summary(ts, direction, target, worst)

            goals[sdg_id] = {
                "score":        score,
                "status":       status,
                "keyIndicator": label,
                "value":        latest_val,
                "unit":         unit,
                "trend":        tinfo["trend"],
                "trendSlope":   tinfo["slope"],          # score pts/year
                "sparkline":    tinfo["sparkline"],      # for mini chart in UI
                "source":       f"{source_label} {latest_year}",
            }

            if score is not None:
                goal_scores.append(score)

        # Overall score = average of tracked goals
        sdg_score = round(sum(goal_scores) / len(goal_scores), 1) if goal_scores else 0

        country_objects.append({
            "iso":         iso,
            "name":        name,
            "flag":        flag,
            "region":      region,
            "population":  pop,
            "incomeGroup": income_group(gni),
            "sdgScore":    sdg_score,
            "sdgRank":     0,
            "goals":       goals,
        })

    # Assign continental ranks
    country_objects.sort(key=lambda c: c["sdgScore"], reverse=True)
    for i, c in enumerate(country_objects):
        c["sdgRank"] = i + 1

    # ── 3. Summary stats ───────────────────────────────────────────────────
    with_data   = [c for c in country_objects if c["sdgScore"] > 0]
    on_track    = sum(1 for c in with_data if c["sdgScore"] >= 70)
    at_risk     = sum(1 for c in with_data if c["sdgScore"] < 50)
    top         = with_data[0]
    bottom      = with_data[-1]

    # Trend breakdown across all goal-country pairs
    all_trends = []
    for c in country_objects:
        for g in c["goals"].values():
            all_trends.append(g["trend"])
    trend_counts = {t: all_trends.count(t) for t in ["improving", "stable", "worsening"]}

    print(f"\n📊 Pipeline Summary:")
    print(f"   Countries processed:  {len(country_objects)}")
    print(f"   With data:            {len(with_data)}")
    print(f"   On Track (≥70):       {on_track}")
    print(f"   At Risk (<50):        {at_risk}")
    print(f"   Top performer:        {top['flag']} {top['name']} ({top['sdgScore']})")
    print(f"   Needs most support:   {bottom['flag']} {bottom['name']} ({bottom['sdgScore']})")
    print(f"\n   Trend breakdown ({len(all_trends)} goal-country pairs):")
    print(f"   ↑ Improving:  {trend_counts['improving']}  "
          f"→ Stable: {trend_counts['stable']}  "
          f"↓ Worsening: {trend_counts['worsening']}")

    # ── 4. Generate sdgData_real.js ────────────────────────────────────────
    print(f"\n📝 Writing sdgData_real.js ...")

    countries_json = json.dumps(country_objects, indent=2, ensure_ascii=False)

    # Convert JSON string keys "1","2",... back to JS numeric keys 1:, 2:,...
    for gid in ["1", "2", "3", "4", "7", "8", "13"]:
        countries_json = countries_json.replace(f'"{gid}":', f'{gid}:')

    now = pd.Timestamp.now()

    js = f'''// ============================================================
// Africa SDG Scorecard — REAL DATA (Phase 2 + 3)
// Auto-generated by fetch_sdg_data.py
// DO NOT EDIT MANUALLY — re-run the script to update
//
// Source: World Bank Open Data API (CC BY 4.0)
// Generated: {now.strftime("%Y-%m-%d %H:%M UTC")}
// Countries: {len(country_objects)} AU member states
// Trend method: Linear regression on 8-year score series
// ============================================================

export const SDG_GOALS = [
  {{ id: 1,  label: 'No Poverty',          color: '#e5243b', icon: '🏠' }},
  {{ id: 2,  label: 'Zero Hunger',         color: '#dda63a', icon: '🌾' }},
  {{ id: 3,  label: 'Good Health',         color: '#4c9f38', icon: '🏥' }},
  {{ id: 4,  label: 'Quality Education',   color: '#c5192d', icon: '📚' }},
  {{ id: 7,  label: 'Clean Energy',        color: '#fcc30b', icon: '⚡' }},
  {{ id: 8,  label: 'Decent Work',         color: '#a21942', icon: '💼' }},
  {{ id: 13, label: 'Climate Action',      color: '#3f7e44', icon: '🌍' }},
]

export const REGIONS = [
  'East Africa', 'West Africa', 'Southern Africa', 'North Africa', 'Central Africa',
]

export const countries = {countries_json}

// ── Utility functions (unchanged from original) ──────────────────────────

export function getStatusColor(status) {{
  const map = {{ green: '#22c55e', yellow: '#eab308', orange: '#f97316', red: '#ef4444', grey: '#4b5563' }}
  return map[status] || map.grey
}}

export function getStatusLabel(status) {{
  const map = {{ green: 'On Track', yellow: 'Moderate', orange: 'At Risk', red: 'Off Track', grey: 'No Data' }}
  return map[status] || 'Unknown'
}}

export function getTrendIcon(trend) {{
  return trend === 'improving' ? '↑' : trend === 'worsening' ? '↓' : '→'
}}

export function getTrendColor(trend) {{
  return trend === 'improving' ? '#22c55e' : trend === 'worsening' ? '#ef4444' : '#7a99bb'
}}

export function getOverallStatus(score) {{
  if (score >= 70) return 'green'
  if (score >= 55) return 'yellow'
  if (score >= 40) return 'orange'
  return 'red'
}}

export function computeRegionSummary() {{
  const regionMap = {{}}
  countries.forEach(c => {{
    if (!regionMap[c.region]) regionMap[c.region] = {{ count: 0, totalScore: 0 }}
    regionMap[c.region].count++
    regionMap[c.region].totalScore += c.sdgScore
  }})
  return Object.entries(regionMap).map(([region, d]) => ({{
    region,
    avgScore: +(d.totalScore / d.count).toFixed(1),
    count: d.count,
  }})).sort((a, b) => b.avgScore - a.avgScore)
}}

// ── Trend analytics helpers (new in Phase 3) ─────────────────────────────

/** Returns all countries sorted by how fast they are improving overall */
export function getFastestMovers(n = 5) {{
  return [...countries]
    .map(c => {{
      const slopes = Object.values(c.goals)
        .map(g => g.trendSlope)
        .filter(s => s != null)
      const avgSlope = slopes.length
        ? slopes.reduce((a, b) => a + b, 0) / slopes.length
        : 0
      return {{ ...c, avgSlope }}
    }})
    .sort((a, b) => b.avgSlope - a.avgSlope)
    .slice(0, n)
}}

/** Returns all countries sorted by fastest deterioration */
export function getFastestDeclining(n = 5) {{
  return [...countries]
    .map(c => {{
      const slopes = Object.values(c.goals)
        .map(g => g.trendSlope)
        .filter(s => s != null)
      const avgSlope = slopes.length
        ? slopes.reduce((a, b) => a + b, 0) / slopes.length
        : 0
      return {{ ...c, avgSlope }}
    }})
    .sort((a, b) => a.avgSlope - b.avgSlope)
    .slice(0, n)
}}

/** Returns trend breakdown for a given SDG goal across all countries */
export function getGoalTrendBreakdown(sdgId) {{
  const counts = {{ improving: 0, stable: 0, worsening: 0, noData: 0 }}
  countries.forEach(c => {{
    const g = c.goals[sdgId]
    if (!g) counts.noData++
    else counts[g.trend] = (counts[g.trend] || 0) + 1
  }})
  return counts
}}

export const SECTOR_STATS = {{
  totalCountries: 54,
  coveredCountries: countries.filter(c => c.sdgScore > 0).length,
  dataYear: '2015–2023',
  lastUpdated: '{now.strftime("%B %Y")}',
  goalsTracked: SDG_GOALS.length,
  onTrackCount: countries.filter(c => c.sdgScore >= 70).length,
  atRiskCount:  countries.filter(c => c.sdgScore > 0 && c.sdgScore < 50).length,
  topCountry:   [...countries].filter(c => c.sdgScore > 0).sort((a, b) => b.sdgScore - a.sdgScore)[0],
  bottomCountry:[...countries].filter(c => c.sdgScore > 0).sort((a, b) => a.sdgScore - b.sdgScore)[0],
  trendCounts: {{
    improving:  countries.flatMap(c => Object.values(c.goals)).filter(g => g.trend === 'improving').length,
    stable:     countries.flatMap(c => Object.values(c.goals)).filter(g => g.trend === 'stable').length,
    worsening:  countries.flatMap(c => Object.values(c.goals)).filter(g => g.trend === 'worsening').length,
  }},
}}
'''

    with open("sdgData_real.js", "w", encoding="utf-8") as f:
        f.write(js)

    print("   ✅ Written: sdgData_real.js")
    print(f"\n🚀 Next steps:")
    print(f"   1. cp sdgData_real.js africa-sdg-scorecard/src/data/sdgData.js")
    print(f"   2. git add . && git commit -m 'feat: Phase 2+3 — real data + trend analysis'")
    print(f"   3. git push  →  auto-deploys in ~60s")
    print(f"\n{'='*57}")
    print(f"Phase 2+3 complete. {len(country_objects)} countries, real data, computed trends.")


if __name__ == "__main__":
    main()
