import { SDG_GOALS, countries, getStatusColor } from '../data/sdgData'

const ALL_17_SDGS = [
  { id: 1,  icon: '🏠', label: 'No Poverty',                  color: '#e5243b', tracked: true,  dataNote: 'World Bank poverty headcount ratio — good Africa coverage' },
  { id: 2,  icon: '🌾', label: 'Zero Hunger',                 color: '#dda63a', tracked: true,  dataNote: 'FAO undernourishment rate — annual, 53 AU countries' },
  { id: 3,  icon: '🏥', label: 'Good Health & Well-being',    color: '#4c9f38', tracked: true,  dataNote: 'WHO under-5 mortality — consistent time-series available' },
  { id: 4,  icon: '📚', label: 'Quality Education',           color: '#c5192d', tracked: true,  dataNote: 'UNESCO primary completion rate — broad country coverage' },
  { id: 5,  icon: '⚥',  label: 'Gender Equality',            color: '#ff3a21', tracked: false, dataNote: 'Gender gap indices exist but composite scoring is contested; adds Phase 5' },
  { id: 6,  icon: '💧', label: 'Clean Water & Sanitation',    color: '#26bde2', tracked: false, dataNote: 'WHO/UNICEF JMP data available — planned for Phase 5 expansion' },
  { id: 7,  icon: '⚡', label: 'Affordable & Clean Energy',   color: '#fcc30b', tracked: true,  dataNote: 'World Bank electricity access — excellent Africa coverage' },
  { id: 8,  icon: '💼', label: 'Decent Work & Economic Growth',color: '#a21942',tracked: true,  dataNote: 'World Bank GDP per capita growth — annual, all countries' },
  { id: 9,  icon: '🏗️', label: 'Industry, Innovation & Infrastructure', color: '#fd6925', tracked: false, dataNote: 'Infrastructure indices fragmented; no single comparable Africa metric' },
  { id: 10, icon: '⚖️', label: 'Reduced Inequalities',        color: '#dd1367', tracked: false, dataNote: 'Gini coefficients have major data gaps across SSA — unreliable for scoring' },
  { id: 11, icon: '🏙️', label: 'Sustainable Cities',          color: '#fd9d24', tracked: false, dataNote: 'Urban data highly fragmented; slum population data outdated in many countries' },
  { id: 12, icon: '♻️', label: 'Responsible Consumption',     color: '#bf8b2e', tracked: false, dataNote: 'Material footprint data largely unavailable for African nations' },
  { id: 13, icon: '🌍', label: 'Climate Action',              color: '#3f7e44', tracked: true,  dataNote: 'UNFCCC/IEA CO₂ per capita — available and updated' },
  { id: 14, icon: '🐠', label: 'Life Below Water',            color: '#0a97d9', tracked: false, dataNote: 'Ocean health indicators mostly cover coastal nations only' },
  { id: 15, icon: '🌿', label: 'Life on Land',                color: '#56c02b', tracked: false, dataNote: 'Forest cover and biodiversity data improving but not yet annual for all AU states' },
  { id: 16, icon: '🕊️', label: 'Peace, Justice & Strong Institutions', color: '#00689d', tracked: false, dataNote: 'Fragile States Index and governance data exist — methodology review ongoing' },
  { id: 17, icon: '🤝', label: 'Partnerships for the Goals', color: '#19486a', tracked: false, dataNote: 'ODA and financing data available from OECD — composite scoring complex' },
]

export default function SDG17Panel({ setActiveTab }) {
  const tracked = ALL_17_SDGS.filter(g => g.tracked)
  const notTracked = ALL_17_SDGS.filter(g => !g.tracked)

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div className="card" style={{ padding: '28px', borderTop: '4px solid var(--accent-blue)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', marginBottom: '10px' }}>
          All 17 Sustainable Development Goals
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '720px' }}>
          The UN's 2030 Agenda sets 17 goals with 169 targets and 231 unique indicators.
          This dashboard currently scores <strong>{tracked.length} goals</strong> where open, country-level,
          annually updated data exists for African nations. The remaining <strong>{notTracked.length} goals</strong> are shown
          below with honest notes on why they're not yet scored — and what's needed to track them properly.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{tracked.length} goals scored in dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--grey)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{notTracked.length} goals — data gaps, shown below</span>
          </div>
        </div>
      </div>

      {/* All 17 in order */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {ALL_17_SDGS.map(goal => {
          // Compute live avg score for tracked goals
          let avgScore = null
          let improving = 0
          if (goal.tracked) {
            const scores = countries.map(c => c.goals[goal.id]?.score).filter(s => s !== undefined && s !== null)
            avgScore = scores.length ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null
            improving = countries.filter(c => c.goals[goal.id]?.trend === 'improving').length
          }
          const avgStatus = avgScore >= 70 ? 'green' : avgScore >= 55 ? 'yellow' : avgScore >= 40 ? 'orange' : avgScore !== null ? 'red' : null

          return (
            <div key={goal.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              opacity: goal.tracked ? 1 : 0.75,
            }}>
              {/* Coloured top strip */}
              <div style={{ height: '4px', background: goal.color }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{goal.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>SDG {goal.id}</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.3 }}>{goal.label}</div>
                    </div>
                  </div>
                  {goal.tracked ? (
                    <span style={{ fontSize: '10px', background: '#dcfce7', color: 'var(--green)', border: '1px solid #86efac', borderRadius: '4px', padding: '2px 7px', fontWeight: 700, flexShrink: 0 }}>
                      ✓ Tracked
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', background: '#f5f5f4', color: 'var(--grey)', border: '1px solid #d6d3d1', borderRadius: '4px', padding: '2px 7px', fontWeight: 600, flexShrink: 0 }}>
                      Data Gap
                    </span>
                  )}
                </div>

                {/* Score for tracked goals */}
                {goal.tracked && avgScore !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color: getStatusColor(avgStatus), lineHeight: 1 }}>
                      {avgScore}
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>avg score / 100</div>
                      <div style={{ fontSize: '10px', color: 'var(--green)', marginTop: '1px' }}>↑ {improving} countries improving</div>
                    </div>
                    <div style={{ flex: 1, height: '4px', background: 'var(--bg-inset)', borderRadius: '2px', overflow: 'hidden', marginLeft: 'auto', maxWidth: '80px' }}>
                      <div style={{ width: `${avgScore}%`, height: '100%', background: getStatusColor(avgStatus), borderRadius: '2px' }} />
                    </div>
                  </div>
                )}

                {/* Data note */}
                <div style={{
                  fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6,
                  padding: '8px 10px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)',
                  borderLeft: `3px solid ${goal.color}60`,
                }}>
                  {goal.tracked ? '📡 ' : '⚠ '}
                  {goal.dataNote}
                </div>

                {/* Link to deep dive for tracked goals */}
                {goal.tracked && (
                  <button
                    onClick={() => setActiveTab('table')}
                    style={{ marginTop: '10px', fontSize: '11px', color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                  >
                    View in Scorecard →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Roadmap note */}
      <div style={{ padding: '18px 22px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text-primary)' }}>Expansion roadmap:</strong>{' '}
        SDGs 6 (Clean Water) and 16 (Peace & Institutions) are next for Phase 5 — data pipelines are being validated.
        SDGs 5, 10, and 17 require more nuanced composite scoring that's currently under methodology review.
        All additions will be open-sourced and documented.
      </div>
    </div>
  )
}
