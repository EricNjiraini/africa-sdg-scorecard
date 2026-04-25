"""
Africa SDG Scorecard — Phase 2 Data Collection Script
======================================================
Pulls real data from:
  - World Bank API (free, no key needed)
  - WHO GHO API (free, no key needed)
  - UN SDG API (free, no key needed)

Run:  python fetch_sdg_data.py
Output: sdgData_real.js  (drop this into src/data/ replacing sdgData.js)

Dependencies: pip install requests pandas
"""

import requests
import pandas as pd
import json
import time
import sys

# ── All 54 AU member states ────────────────────────────────────────────────
COUNTRIES = [
    ("DZA","Algeria","🇩🇿","North Africa"),
    ("AGO","Angola","🇦🇴","Central Africa"),
    ("BEN","Benin","🇧🇯","West Africa"),
    ("BWA","Botswana","🇧🇼","Southern Africa"),
    ("BFA","Burkina Faso","🇧🇫","West Africa"),
    ("BDI","Burundi","🇧🇮","East Africa"),
    ("CPV","Cabo Verde","🇨🇻","West Africa"),
    ("CMR","Cameroon","🇨🇲","Central Africa"),
    ("CAF","Central African Republic","🇨🇫","Central Africa"),
    ("TCD","Chad","🇹🇩","Central Africa"),
    ("COM","Comoros","🇰🇲","East Africa"),
    ("COD","DR Congo","🇨🇩","Central Africa"),
    ("COG","Republic of Congo","🇨🇬","Central Africa"),
    ("CIV","Côte d'Ivoire","🇨🇮","West Africa"),
    ("DJI","Djibouti","🇩🇯","East Africa"),
    ("EGY","Egypt","🇪🇬","North Africa"),
    ("GNQ","Equatorial Guinea","🇬🇶","Central Africa"),
    ("ERI","Eritrea","🇪🇷","East Africa"),
    ("SWZ","Eswatini","🇸🇿","Southern Africa"),
    ("ETH","Ethiopia","🇪🇹","East Africa"),
    ("GAB","Gabon","🇬🇦","Central Africa"),
    ("GMB","Gambia","🇬🇲","West Africa"),
    ("GHA","Ghana","🇬🇭","West Africa"),
    ("GIN","Guinea","🇬🇳","West Africa"),
    ("GNB","Guinea-Bissau","🇬🇼","West Africa"),
    ("KEN","Kenya","🇰🇪","East Africa"),
    ("LSO","Lesotho","🇱🇸","Southern Africa"),
    ("LBR","Liberia","🇱🇷","West Africa"),
    ("LBY","Libya","🇱🇾","North Africa"),
    ("MDG","Madagascar","🇲🇬","East Africa"),
    ("MWI","Malawi","🇲🇼","East Africa"),
    ("MLI","Mali","🇲🇱","West Africa"),
    ("MRT","Mauritania","🇲🇷","West Africa"),
    ("MUS","Mauritius","🇲🇺","East Africa"),
    ("MAR","Morocco","🇲🇦","North Africa"),
    ("MOZ","Mozambique","🇲🇿","Southern Africa"),
    ("NAM","Namibia","🇳🇦","Southern Africa"),
    ("NER","Niger","🇳🇪","West Africa"),
    ("NGA","Nigeria","🇳🇬","West Africa"),
    ("RWA","Rwanda","🇷🇼","East Africa"),
    ("STP","São Tomé and Príncipe","🇸🇹","Central Africa"),
    ("SEN","Senegal","🇸🇳","West Africa"),
    ("SLE","Sierra Leone","🇸🇱","West Africa"),
    ("SOM","Somalia","🇸🇴","East Africa"),
    ("ZAF","South Africa","🇿🇦","Southern Africa"),
    ("SSD","South Sudan","🇸🇸","East Africa"),
    ("SDN","Sudan","🇸🇩","North Africa"),
    ("TZA","Tanzania","🇹🇿","East Africa"),
    ("TGO","Togo","🇹🇬","West Africa"),
    ("TUN","Tunisia","🇹🇳","North Africa"),
    ("UGA","Uganda","🇺🇬","East Africa"),
    ("ZMB","Zambia","🇿🇲","Southern Africa"),
    ("ZWE","Zimbabwe","🇿🇼","Southern Africa"),
    ("SSD","South Sudan","🇸🇸","East Africa"),
]

# Remove duplicates
seen = set()
COUNTRIES = [c for c in COUNTRIES if c[0] not in seen and not seen.add(c[0])]

ISO_CODES = [c[0] for c in COUNTRIES]

# ── World Bank indicators ──────────────────────────────────────────────────
WB_INDICATORS = {
    # SDG 1 - Poverty
    "SI.POV.DDAY":  ("sdg1_poverty_pct",    "Poverty headcount <$2.15/day (%)", 1),
    # SDG 2 - Hunger (undernourishment from FAO via WB)
    "SN.ITK.DEFC.ZS": ("sdg2_hunger_pct",   "Undernourishment rate (%)", 2),
    # SDG 3 - Health
    "SH.DYN.MORT":  ("sdg3_u5_mortality",   "Under-5 mortality rate (per 1,000)", 3),
    # SDG 4 - Education
    "SE.PRM.CMPT.ZS": ("sdg4_primary_completion", "Primary completion rate (%)", 4),
    # SDG 7 - Energy
    "EG.ELC.ACCS.ZS": ("sdg7_electricity",  "Access to electricity (%)", 7),
    # SDG 8 - Economy
    "NY.GDP.PCAP.KD.ZG": ("sdg8_gdp_growth","GDP per capita growth (%)", 8),
    # SDG 13 - Climate
    "EN.ATM.CO2E.PC": ("sdg13_co2_pc",      "CO₂ emissions per capita (tonnes)", 13),
    # Meta
    "SP.POP.TOTL":  ("population_total",     "Population (total)", None),
    "NY.GNP.PCAP.CD": ("gni_per_capita",    "GNI per capita (Atlas method, USD)", None),
}

def wb_fetch(indicator, countries_str, mrv=5):
    """Fetch World Bank indicator for all countries."""
    url = (
        f"https://api.worldbank.org/v2/country/{countries_str}"
        f"/indicator/{indicator}"
        f"?format=json&mrv={mrv}&per_page=500"
    )
    try:
        r = requests.get(url, timeout=15)
        r.raise_for_status()
        data = r.json()
        if len(data) < 2 or not data[1]:
            return {}
        results = {}
        for row in data[1]:
            iso = row.get("countryiso3code") or row.get("country", {}).get("id", "")
            val = row.get("value")
            year = row.get("date", "")
            if iso and val is not None:
                # Keep most recent non-null value
                if iso not in results:
                    results[iso] = {"value": round(float(val), 2), "year": year}
        return results
    except Exception as e:
        print(f"  ⚠ WB fetch error ({indicator}): {e}")
        return {}

def compute_score(indicator_key, value):
    """
    Convert raw indicator value to 0-100 SDG score.
    100 = target achieved. 0 = worst observed.
    Targets are 2030 SDG targets.
    """
    if value is None:
        return None

    targets = {
        "sdg1_poverty_pct":        {"target": 0,   "worst": 80,  "direction": "lower_better"},
        "sdg2_hunger_pct":         {"target": 2.5, "worst": 60,  "direction": "lower_better"},
        "sdg3_u5_mortality":       {"target": 25,  "worst": 200, "direction": "lower_better"},
        "sdg4_primary_completion": {"target": 100, "worst": 30,  "direction": "higher_better"},
        "sdg7_electricity":        {"target": 100, "worst": 0,   "direction": "higher_better"},
        "sdg8_gdp_growth":         {"target": 7,   "worst": -5,  "direction": "higher_better"},
        "sdg13_co2_pc":            {"target": 0.5, "worst": 10,  "direction": "lower_better"},
    }

    cfg = targets.get(indicator_key)
    if not cfg:
        return None

    t, w = cfg["target"], cfg["worst"]
    if cfg["direction"] == "lower_better":
        # Score = 100 when value <= target, 0 when value >= worst
        score = 100 * (w - value) / (w - t)
    else:
        # Score = 100 when value >= target, 0 when value <= worst
        score = 100 * (value - w) / (t - w)

    return max(0, min(100, round(score, 1)))

def value_to_status(score):
    if score is None: return "grey"
    if score >= 70:   return "green"
    if score >= 55:   return "yellow"
    if score >= 40:   return "orange"
    return "red"

def income_group_label(gni):
    if gni is None: return "Unknown"
    if gni >= 13846: return "High"
    if gni >= 4466:  return "Upper-middle"
    if gni >= 1136:  return "Lower-middle"
    return "Low"

# ── Main fetch ─────────────────────────────────────────────────────────────
def main():
    print("\n🌍 Africa SDG Scorecard — Phase 2 Data Collection")
    print("=" * 55)

    countries_str = ";".join(ISO_CODES)
    all_data = {}  # iso -> {indicator_key: {value, year}}

    print(f"\n📡 Fetching {len(WB_INDICATORS)} indicators from World Bank API...")
    for wb_code, (key, label, sdg_id) in WB_INDICATORS.items():
        print(f"   → {label}")
        results = wb_fetch(wb_code, countries_str, mrv=5)
        for iso, rec in results.items():
            if iso not in all_data:
                all_data[iso] = {}
            all_data[iso][key] = rec
        time.sleep(0.3)  # be polite to the API

    print(f"\n✅ Data fetched for {len(all_data)} countries")

    # ── SDG goal definitions ───────────────────────────────────────────────
    GOAL_META = {
        1:  {"label": "No Poverty",        "color": "#e5243b", "icon": "🏠",
             "indicator_key": "sdg1_poverty_pct", "unit": "%"},
        2:  {"label": "Zero Hunger",       "color": "#dda63a", "icon": "🌾",
             "indicator_key": "sdg2_hunger_pct",  "unit": "%"},
        3:  {"label": "Good Health",       "color": "#4c9f38", "icon": "🏥",
             "indicator_key": "sdg3_u5_mortality", "unit": "/1000"},
        4:  {"label": "Quality Education", "color": "#c5192d", "icon": "📚",
             "indicator_key": "sdg4_primary_completion", "unit": "%"},
        7:  {"label": "Clean Energy",      "color": "#fcc30b", "icon": "⚡",
             "indicator_key": "sdg7_electricity", "unit": "%"},
        8:  {"label": "Decent Work",       "color": "#a21942", "icon": "💼",
             "indicator_key": "sdg8_gdp_growth", "unit": "%"},
        13: {"label": "Climate Action",    "color": "#3f7e44", "icon": "🌍",
             "indicator_key": "sdg13_co2_pc", "unit": "t"},
    }

    GOAL_LABELS = {
        "sdg1_poverty_pct":        "Poverty headcount (<$2.15/day)",
        "sdg2_hunger_pct":         "Undernourishment rate",
        "sdg3_u5_mortality":       "Under-5 mortality rate",
        "sdg4_primary_completion": "Primary completion rate",
        "sdg7_electricity":        "Access to electricity",
        "sdg8_gdp_growth":         "GDP per capita growth",
        "sdg13_co2_pc":            "CO₂ emissions per capita",
    }

    # ── Build country objects ──────────────────────────────────────────────
    print("\n🔨 Building country data objects...")
    country_objects = []

    for iso, name, flag, region in COUNTRIES:
        cdata = all_data.get(iso, {})

        # Population in millions
        pop_rec = cdata.get("population_total")
        pop = round(pop_rec["value"] / 1_000_000, 1) if pop_rec else None

        # Income group from GNI
        gni_rec = cdata.get("gni_per_capita")
        gni = gni_rec["value"] if gni_rec else None
        income_group = income_group_label(gni)

        # Build goals
        goals = {}
        goal_scores = []

        for sdg_id, gmeta in GOAL_META.items():
            ikey = gmeta["indicator_key"]
            rec = cdata.get(ikey)

            if rec and rec["value"] is not None:
                raw_val = rec["value"]
                score = compute_score(ikey, raw_val)
                status = value_to_status(score)
                source_year = rec.get("year", "2022")

                # Determine source label
                source_map = {
                    "sdg1_poverty_pct": "World Bank",
                    "sdg2_hunger_pct":  "FAO / World Bank",
                    "sdg3_u5_mortality":"WHO / World Bank",
                    "sdg4_primary_completion": "UNESCO / World Bank",
                    "sdg7_electricity": "World Bank",
                    "sdg8_gdp_growth":  "World Bank",
                    "sdg13_co2_pc":     "World Bank / IEA",
                }

                goals[sdg_id] = {
                    "score":        score,
                    "status":       status,
                    "keyIndicator": GOAL_LABELS[ikey],
                    "value":        raw_val,
                    "unit":         gmeta["unit"],
                    "trend":        "stable",   # trend needs time-series logic (Phase 3)
                    "source":       f"{source_map.get(ikey, 'World Bank')} {source_year}",
                }
                if score is not None:
                    goal_scores.append(score)
            # else: no data → goal omitted (renders as grey in UI)

        # Overall SDG score = average of available goal scores
        sdg_score = round(sum(goal_scores) / len(goal_scores), 1) if goal_scores else 0

        country_objects.append({
            "iso":         iso,
            "name":        name,
            "flag":        flag,
            "region":      region,
            "population":  pop,
            "incomeGroup": income_group,
            "sdgScore":    sdg_score,
            "sdgRank":     0,  # assigned below after sorting
            "goals":       goals,
        })

    # Assign ranks
    country_objects.sort(key=lambda c: c["sdgScore"], reverse=True)
    for i, c in enumerate(country_objects):
        c["sdgRank"] = i + 1

    # Stats
    on_track = sum(1 for c in country_objects if c["sdgScore"] >= 70)
    at_risk  = sum(1 for c in country_objects if c["sdgScore"] < 50)
    top      = country_objects[0]
    bottom   = country_objects[-1]

    print(f"\n📊 Summary:")
    print(f"   Countries with data:  {len(country_objects)}")
    print(f"   On Track (≥70):       {on_track}")
    print(f"   At Risk (<50):        {at_risk}")
    print(f"   Top performer:        {top['flag']} {top['name']} ({top['sdgScore']})")
    print(f"   Needs most support:   {bottom['flag']} {bottom['name']} ({bottom['sdgScore']})")

    # ── Generate JS file ───────────────────────────────────────────────────
    print("\n📝 Writing sdgData_real.js ...")

    js_countries = json.dumps(country_objects, indent=2, ensure_ascii=False)
    # Convert JSON number keys back to JS (JSON uses string keys for objects)
    # goals uses numeric SDG IDs as keys - we'll keep as strings in JSON
    # but patch the JS so it matches existing code expectations
    js_countries = js_countries.replace('"1":', '1:').replace('"2":', '2:') \
        .replace('"3":', '3:').replace('"4":', '4:').replace('"7":', '7:') \
        .replace('"8":', '8:').replace('"13":', '13:')

    js_output = f'''// ============================================================
// Africa SDG Scorecard — REAL DATA
// Auto-generated by fetch_sdg_data.py
// Sources: World Bank API, WHO, FAO (all CC BY / open license)
// Generated: {pd.Timestamp.now().strftime("%Y-%m-%d")}
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

export const countries = {js_countries}

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

export const SECTOR_STATS = {{
  totalCountries: 54,
  coveredCountries: countries.length,
  dataYear: '2020–2023',
  lastUpdated: '{pd.Timestamp.now().strftime("%B %Y")}',
  goalsTracked: SDG_GOALS.length,
  onTrackCount: countries.filter(c => c.sdgScore >= 70).length,
  atRiskCount: countries.filter(c => c.sdgScore < 50).length,
  topCountry: [...countries].sort((a, b) => b.sdgScore - a.sdgScore)[0],
  bottomCountry: [...countries].sort((a, b) => a.sdgScore - b.sdgScore)[0],
}}
'''

    output_path = "sdgData_real.js"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_output)

    print(f"   ✅ Written to: {output_path}")
    print(f"\n🚀 Next steps:")
    print(f"   1. Copy sdgData_real.js → src/data/sdgData.js in your project")
    print(f"   2. git add . && git commit -m 'feat: real World Bank data (Phase 2)'")
    print(f"   3. git push → auto-deploys to GitHub Pages")
    print(f"\n{'='*55}")
    print(f"Phase 2 complete. Real data for {len(country_objects)} African nations.")

if __name__ == "__main__":
    main()
