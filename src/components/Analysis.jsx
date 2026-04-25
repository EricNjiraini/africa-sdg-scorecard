import { countries, SDG_GOALS, getStatusColor, getStatusLabel, getFastestMovers, getFastestDeclining, getGoalTrendBreakdown } from '../data/sdgData'

function InsightBox({ color, icon, title, children }) {
  return (
    <div style={{
      borderLeft: `3px solid ${color}`,
      background: `${color}0d`,
      border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`,
      padding: '16px 20px', marginBottom: '12px', borderRadius: '0 8px 8px 0',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color, marginBottom: '6px', fontSize: '14px' }}>
        {icon} {title}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7 }}>{children}</p>
    </div>
  )
}

function MoverCard({ country, label, color, slopeKey }) {
  const slopes = Object.values(country.goals || {})
    .map(g => g.trendSlope).filter(s => s != null)
  const avg = slopes.length ? (slopes.reduce((a, b) => a + b, 0) / slopes.length).toFixed(2) : '—'
  const status = country.sdgScore >= 70 ? 'green' : country.sdgScore >= 55 ? 'yellow' : country.sdgScore >= 40 ? 'orange' : 'red'

  return (
    <div className="card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '28px' }}>{country.flag}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{country.name}</div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{country.region}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: getStatusColor(status) }}>
          {country.sdgScore}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color }}>
          {avg > 0 ? '+' : ''}{avg} pts/yr
        </div>
      </div>
    </div>
  )
}

function GoalTrendBar({ goal }) {
  // Safe fallback if function doesn't exist yet (before Phase 3 data is loaded)
  const breakdown = typeof getGoalTrendBreakdown === 'function'
    ? getGoalTrendBreakdown(goal.id)
    : { improving: 0, stable: 0, worsening: 0, noData: 0 }

  const total = breakdown.improving + breakdown.stable + breakdown.worsening + (breakdown.noData || 0)
  const pctI = total ? ((breakdown.improving / total) * 100).toFixed(0) : 0
  const pctS = total ? ((breakdown.stable / total) * 100).toFixed(0) : 0
  const pctW = total ? ((breakdown.worsening / total) * 100).toFixed(0) : 0

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{goal.icon}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{goal.label}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
          <span style={{ color: 'var(--green)' }}>↑{pctI}%</span>
          <span style={{ color: 'var(--text-muted)' }}>→{pctS}%</span>
          <span style={{ color: 'var(--red)' }}>↓{pctW}%</span>
        </div>
      </div>
      {/* Stacked bar */}
      <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${pctI}%`, background: 'var(--green)',       transition: 'width 0.6s' }} />
        <div style={{ width: `${pctS}%`, background: 'var(--text-muted)', opacity: 0.4, transition: 'width 0.6s' }} />
        <div style={{ width: `${pctW}%`, background: 'var(--red)',         transition: 'width 0.6s' }} />
      </div>
    </div>
  )
}

export default function Analysis() {
  // Safe fallbacks for when real data isn't loaded yet
  const movers   = typeof getFastestMovers   === 'function' ? getFastestMovers(5)   : []
  const decliners = typeof getFastestDeclining === 'function' ? getFastestDeclining(5) : []

  // Per-goal insight table (works on both sample and real data)
  const goalInsights = SDG_GOALS.map(goal => {
    const withData = countries.filter(c => c.goals && c.goals[goal.id])
    const best  = [...withData].sort((a, b) => b.goals[goal.id].score - a.goals[goal.id].score)[0]
    const worst = [...withData].sort((a, b) => a.goals[goal.id].score - b.goals[goal.id].score)[0]
    const avg   = withData.length
      ? +(withData.reduce((s, c) => s + c.goals[goal.id].score, 0) / withData.length).toFixed(1)
      : 0
    const improving = withData.filter(c => c.goals[goal.id].trend === 'improving').length
    return { goal, best, worst, avg, improving, total: withData.length }
  })

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Macro overview */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', marginBottom: '16px' }}>
          🌍 Africa's SDG Journey — 2015 to 2025
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '12px' }}>
          A decade into the 2030 Agenda, Africa presents a story of two realities. On one hand, measurable gains:
          child mortality rates have fallen steadily across most of Sub-Saharan Africa, primary school enrollment
          has expanded, and electricity access has grown faster than any other region globally since 2015.
          On the other, structural headwinds — debt burdens, climate shocks, conflict, and COVID-19 aftereffects —
          have reversed or stalled progress on hunger, poverty, and economic growth in several countries.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          With just five years remaining, the continent needs to roughly triple its pace of progress on most
          indicators to reach 2030 targets. The data gap itself is a governance challenge: nearly 120 SDG
          indicators still lack sufficient country-level data across Africa, making monitoring — and therefore
          accountability — structurally limited.
        </p>
      </div>

      {/* Phase 3: Fastest movers + decliners */}
      {(movers.length > 0 || decliners.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                ▲ Fastest Improving — Trend Leaders
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Highest average score improvement per year (all goals)
              </p>
            </div>
            <div style={{ padding: '10px' }}>
              {movers.map((c, i) => <MoverCard key={c.iso} country={c} color="var(--green)" />)}
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                ▼ Fastest Declining — Needs Attention
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Highest average score deterioration per year (all goals)
              </p>
            </div>
            <div style={{ padding: '10px' }}>
              {decliners.map((c, i) => <MoverCard key={c.iso} country={c} color="var(--red)" />)}
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Goal trend breakdown */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Trend Breakdown by SDG Goal
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          % of countries improving / stable / worsening per goal (linear regression, 2015–2023)
        </p>
        {SDG_GOALS.map(goal => <GoalTrendBar key={goal.id} goal={goal} />)}
      </div>

      {/* Narrative insights */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          📈 Key Trends
        </h3>
        <InsightBox color="var(--green)" icon="⚡" title="Clean Energy — The Bright Spot">
          SDG 7 leads all goals with the highest average score in the sample. North African nations (Morocco, Egypt)
          have achieved near-universal electricity access, while East African countries are improving rapidly
          through off-grid solar and mini-grid expansion. Clean cooking access, however, remains severely lagged —
          with over 900 million Africans still relying on solid biomass.
        </InsightBox>
        <InsightBox color="var(--green)" icon="📚" title="Education Gains Are Sustained">
          SDG 4 primary completion rates have improved in nearly every sampled country since 2015. Rwanda stands
          out — crossing 92% completion and maintaining gender parity — while Ethiopia and Uganda have made
          significant strides from low baselines. Secondary and tertiary education quality gaps persist.
        </InsightBox>
        <InsightBox color="var(--yellow)" icon="🏥" title="Health Progress — Real But Fragile">
          Under-5 mortality has declined continent-wide and UHC coverage is expanding. But gains are uneven.
          The COVID-19 pandemic set back immunization programs in 2020–2022, and full recovery is incomplete
          in lower-income countries.
        </InsightBox>
        <InsightBox color="var(--red)" icon="🍽️" title="Hunger Is Getting Worse, Not Better">
          SDG 2 (Zero Hunger) is the most alarming regression. FAO data shows undernourishment rising in Eastern
          and Central Africa — driven by climate shocks, conflict, and currency crises eroding food import
          capacity. Several countries are tracking in the wrong direction on this goal.
        </InsightBox>
        <InsightBox color="var(--red)" icon="🌡️" title="Climate Responsibility — A Profound Injustice">
          Africa contributes under 4% of global cumulative CO₂ emissions yet faces disproportionate climate
          impacts. South Africa, as the continent's most industrialized economy, is the clear outlier at high
          per-capita emissions — largely coal-driven. For most African countries, SDG 13 is a financing
          and adaptation challenge, not an emissions reduction one.
        </InsightBox>
      </div>

      {/* Per-goal table */}
      <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Goal-by-Goal Snapshot
        </h3>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {['Goal', 'Avg Score', 'Best Performer', 'Needs Support', '% Improving'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {goalInsights.map(({ goal, best, worst, avg, improving, total }) => {
              const status = avg >= 70 ? 'green' : avg >= 55 ? 'yellow' : avg >= 40 ? 'orange' : 'red'
              return (
                <tr key={goal.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{goal.icon}</span>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>SDG {goal.id}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{goal.label}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: getStatusColor(status) }}>
                      {avg}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '16px' }}>{best?.flag}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                      {best?.name} ({best?.goals[goal.id]?.score})
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '16px' }}>{worst?.flag}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                      {worst?.name} ({worst?.goals[goal.id]?.score})
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '50px', height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${total ? (improving / total) * 100 : 0}%`, height: '100%', background: 'var(--green)', borderRadius: '2px' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)' }}>
                        {total ? ((improving / total) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Methodology note */}
      <div style={{ padding: '14px 18px', background: 'rgba(75,85,99,0.1)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Methodology Note:</strong>{' '}
        Trend direction computed via linear regression on 8-year score series (2015–2023). A slope ≥ 0.8
        score points/year = "improving"; ≤ −0.8 = "worsening"; between = "stable". Overall country score
        is a simple average across tracked goals. Data: WHO, FAO, World Bank, UNESCO UIS, UNFCCC.
        For informational purposes only. Not affiliated with the United Nations.
      </div>
    </div>
  )
}
