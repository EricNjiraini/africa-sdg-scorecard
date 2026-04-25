# 🌍 Africa SDG Scorecard

A Bloomberg Terminal-style dashboard tracking progress across 7 Sustainable Development Goals for 54 African nations (2015–2030).

**Live:** [ericnjiraini.github.io/africa-sdg-scorecard](https://ericnjiraini.github.io/africa-sdg-scorecard)

## Features
- **Overview** — Sector-wide headline stats, top/bottom country rankings, regional breakdown
- **Scorecard** — Sortable, filterable heatmap table (54 countries × 7 SDGs)
- **Charts** — Bar, radar, scatter chart visualisations
- **Country Deep-Dive** — Per-country profile with goal-by-goal breakdown
- **Analysis** — Narrative sector analysis and trend insights
- **Sources** — Full data attribution and methodology

## Data Sources
All data is open-licensed and sourced from:
| Source | Dataset | License |
|---|---|---|
| UN Statistics Division | Global SDG Indicators Database | Free public use |
| World Bank | World Development Indicators | CC BY 4.0 |
| WHO | Global Health Observatory | CC BY |
| FAO | FAOSTAT | CC BY-NC-SA 3.0 |
| UNESCO UIS | Education Statistics | Open |
| UNFCCC / Climate Watch | GHG Inventory Data | Open |
| SDSN | SDG Index 2025 | Open |

## Tech Stack
- React 19 + Vite
- Tailwind CSS v4
- Recharts
- GitHub Pages (deployment)

## SDGs Tracked
| # | Goal | Key Indicator |
|---|---|---|
| 1 | No Poverty | Poverty headcount <$2.15/day |
| 2 | Zero Hunger | Undernourishment rate |
| 3 | Good Health | Under-5 mortality rate |
| 4 | Quality Education | Primary completion rate |
| 7 | Clean Energy | Electricity access |
| 8 | Decent Work | GDP per capita growth |
| 13 | Climate Action | CO₂ per capita |

## Local Development
```bash
npm install
npm run dev
```

## Deploy
Push to `main` branch — GitHub Actions builds and deploys automatically.

---
Built by [Eric Njiraini](https://ericnjiraini.github.io/me) · For informational purposes only · Not affiliated with the United Nations
