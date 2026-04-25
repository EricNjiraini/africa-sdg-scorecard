import { SDG_GOALS } from '../data/sdgData'

const SOURCES = [
  {
    org: 'UN Statistics Division (UNSD)',
    dataset: 'Global SDG Indicators Database',
    url: 'https://unstats.un.org/sdgs/indicators/database/',
    license: 'Free public use',
    goals: [1, 2, 3, 4, 7, 8, 13],
    description: 'Official SDG indicators compiled through the UN System for the Secretary-General\'s annual progress report.',
  },
  {
    org: 'World Bank',
    dataset: 'World Development Indicators',
    url: 'https://data.worldbank.org/',
    license: 'CC BY 4.0',
    goals: [1, 7, 8],
    description: 'Poverty headcount ratios, electricity access, GDP growth, and population data.',
  },
  {
    org: 'World Health Organization (WHO)',
    dataset: 'Global Health Observatory',
    url: 'https://www.who.int/data/gho',
    license: 'CC BY (open)',
    goals: [3],
    description: 'Under-5 and maternal mortality rates, UHC service coverage index.',
  },
  {
    org: 'FAO',
    dataset: 'FAOSTAT & State of Food Security Report',
    url: 'https://www.fao.org/faostat',
    license: 'CC BY-NC-SA 3.0',
    goals: [2],
    description: 'Undernourishment rates, food insecurity indicators, and food production statistics.',
  },
  {
    org: 'UNESCO Institute for Statistics (UIS)',
    dataset: 'Education Data',
    url: 'http://data.uis.unesco.org/',
    license: 'Open access',
    goals: [4],
    description: 'Primary and secondary school completion rates, out-of-school population, literacy rates.',
  },
  {
    org: 'UNFCCC / Climate Watch (WRI)',
    dataset: 'GHG Inventory Data & NDC Tracker',
    url: 'https://climatewatchdata.org/',
    license: 'Open',
    goals: [13],
    description: 'Country-level CO₂ and GHG emissions per capita, Nationally Determined Contributions status.',
  },
  {
    org: 'SDSN / Sustainable Development Report 2025',
    dataset: 'SDG Index & Dashboards',
    url: 'https://dashboards.sdgindex.org/',
    license: 'Open access (CC)',
    goals: [1, 2, 3, 4, 7, 8, 13],
    description: 'Composite SDG Index scores and country rankings used for overall score benchmarking.',
  },
]

export default function Sources() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div className="card" style={{ padding: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
          Data Sources & Methodology
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7 }}>
          All data is sourced from official UN agencies, international organizations, and open government datasets.
          Every source is either CC BY 4.0, CC BY-NC-SA 3.0, or explicitly published for free public use.
          This dashboard is non-commercial and for informational purposes only.
        </p>
      </div>

      {/* Score methodology */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Scoring Methodology
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7, marginBottom: '12px' }}>
              Scores (0–100) represent distance to the 2030 SDG target for each indicator, where 100 = target fully achieved.
              This approach is adapted from the SDSN Sustainable Development Report methodology, peer-reviewed by Nature Geoscience.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7 }}>
              Overall country scores are composite averages across tracked goals, weighted equally.
              Trend direction is based on year-on-year movement since the 2015 SDG baseline.
            </p>
          </div>
          <div style={{ background: 'var(--bg-primary)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Traffic Light Key
            </div>
            {[
              { status: 'green',  label: 'On Track',  range: 'Score ≥ 70',  color: 'var(--green)' },
              { status: 'yellow', label: 'Moderate',  range: 'Score 55–69', color: 'var(--yellow)' },
              { status: 'orange', label: 'At Risk',   range: 'Score 40–54', color: 'var(--orange)' },
              { status: 'red',    label: 'Off Track', range: 'Score < 40',  color: 'var(--red)' },
              { status: 'grey',   label: 'No Data',   range: 'Insufficient coverage', color: 'var(--grey)' },
            ].map(({ label, range, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}80` }} />
                <span style={{ color, fontFamily: 'var(--font-mono)', fontSize: '11px', width: '80px' }}>{label}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sources table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SOURCES.map((s, i) => (
          <div key={i} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>
                    {s.org}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-cyan)', background: 'rgba(0,212,184,0.1)', border: '1px solid rgba(0,212,184,0.2)', padding: '1px 7px', borderRadius: '3px' }}>
                    {s.license}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--accent-blue)', marginBottom: '6px' }}>
                  {s.dataset}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.description}</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {s.goals.map(gid => {
                    const goal = SDG_GOALS.find(g => g.id === gid)
                    return goal ? (
                      <span key={gid} style={{
                        fontSize: '10px', padding: '2px 7px', borderRadius: '3px',
                        background: `${goal.color}20`, color: goal.color,
                        border: `1px solid ${goal.color}40`,
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {goal.icon} SDG {gid}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
              <a
                href={s.url} target="_blank" rel="noopener noreferrer"
                style={{
                  fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0,212,184,0.3)', borderRadius: '4px', padding: '5px 10px',
                  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(0,212,184,0.1)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                Visit Source ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '16px 20px', background: 'rgba(75,85,99,0.1)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Disclaimer:</strong> This dashboard is an independent data journalism project
        built for informational and portfolio purposes. It is not affiliated with, endorsed by, or officially connected to
        the United Nations, WHO, FAO, World Bank, or any other organization cited. Data may contain errors or lags
        inherent in international statistical systems. No commercial use.
      </div>
    </div>
  )
}
