import { countries, SDG_GOALS, SECTOR_STATS, getStatusColor, getStatusLabel, computeRegionSummary } from '../data/sdgData'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ padding: '20px', minWidth: '140px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color: color || 'var(--text-primary)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>{sub}</div>}
    </div>
  )
}

function StatusPill({ status }) {
  return (
    <span className={`tag-${status}`} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
      {getStatusLabel(status)}
    </span>
  )
}

function RankRow({ rank, country, onClick }) {
  const overall = country.sdgScore
  const status = overall >= 70 ? 'green' : overall >= 55 ? 'yellow' : overall >= 40 ? 'orange' : 'red'

  return (
    <div
      onClick={() => onClick(country)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 14px', borderBottom: '1px solid var(--border)',
        cursor: 'pointer', transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '11px', width: '20px', textAlign: 'right' }}>
        {rank}
      </span>
      <span style={{ fontSize: '20px' }}>{country.flag}</span>
      <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: '13px' }}>{country.name}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '80px', height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${overall}%`, height: '100%', background: getStatusColor(status), borderRadius: '2px', transition: 'width 0.6s ease' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: getStatusColor(status), width: '36px', textAlign: 'right' }}>
          {overall}
        </span>
      </div>
      <StatusPill status={status} />
    </div>
  )
}

export default function Overview({ setActiveTab, setSelectedCountry }) {
  const sorted = [...countries].sort((a, b) => b.sdgScore - a.sdgScore)
  const top5 = sorted.slice(0, 5)
  const bottom5 = sorted.slice(-5).reverse()
  const regionData = computeRegionSummary()

  // Count statuses across all goals
  const statusCounts = { green: 0, yellow: 0, orange: 0, red: 0 }
  countries.forEach(c => {
    SDG_GOALS.forEach(g => {
      const s = c.goals[g.id]?.status
      if (s && statusCounts[s] !== undefined) statusCounts[s]++
    })
  })

  const handleCountryClick = (country) => {
    setSelectedCountry(country)
    setActiveTab('country')
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Headline alert */}
      <div style={{
        background: 'rgba(240,165,0,0.07)', border: '1px solid rgba(240,165,0,0.25)',
        borderLeft: '4px solid var(--accent-gold)', borderRadius: '8px', padding: '16px 20px',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '4px' }}>
          ⚠ SDG Deadline: 5 Years Remaining
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '700px' }}>
          Africa is making progress in 12 of the 17 SDGs, but the current pace is insufficient to achieve them by 2030.
          Data gaps prevent a full picture — nearly 120 indicators lack sufficient country-level data across the continent.
        </p>
      </div>

      {/* Top stat cards */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <StatCard label="Countries Tracked" value={`${SECTOR_STATS.coveredCountries}`} sub={`of 54 AU members`} />
        <StatCard label="SDGs Monitored" value={SECTOR_STATS.goalsTracked} sub="of 17 total goals" />
        <StatCard label="On Track" value={SECTOR_STATS.onTrackCount} sub="score ≥ 70" color="var(--green)" />
        <StatCard label="At Risk" value={SECTOR_STATS.atRiskCount} sub="score < 50" color="var(--red)" />
        <StatCard label="Top Performer" value={SECTOR_STATS.topCountry?.flag} sub={SECTOR_STATS.topCountry?.name} color="var(--accent-cyan)" />
        <StatCard label="Needs Most Support" value={SECTOR_STATS.bottomCountry?.flag} sub={SECTOR_STATS.bottomCountry?.name} color="var(--orange)" />
      </div>

      {/* Status breakdown */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Goal Status Breakdown — All Countries
        </h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { key: 'green',  label: 'On Track',   color: 'var(--green)' },
            { key: 'yellow', label: 'Moderate',    color: 'var(--yellow)' },
            { key: 'orange', label: 'At Risk',     color: 'var(--orange)' },
            { key: 'red',    label: 'Off Track',   color: 'var(--red)' },
          ].map(({ key, label, color }) => {
            const total = Object.values(statusCounts).reduce((s, v) => s + v, 0)
            const pct = ((statusCounts[key] / total) * 100).toFixed(0)
            return (
              <div key={key} style={{ flex: 1, minWidth: '120px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color }}>{pct}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{statusCounts[key]} goal-country pairs</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rankings and Region */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>

        {/* Top 5 */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              ▲ Top Performers
            </h3>
          </div>
          {top5.map((c, i) => <RankRow key={c.iso} rank={i + 1} country={c} onClick={handleCountryClick} />)}
        </div>

        {/* Bottom 5 */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              ▼ Needs Most Support
            </h3>
          </div>
          {bottom5.map((c, i) => <RankRow key={c.iso} rank={countries.length - i} country={c} onClick={handleCountryClick} />)}
        </div>

        {/* Region summary */}
        <div className="card" style={{ padding: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
            ⊞ By Region (Sample)
          </h3>
          {regionData.map(r => {
            const status = r.avgScore >= 70 ? 'green' : r.avgScore >= 55 ? 'yellow' : r.avgScore >= 40 ? 'orange' : 'red'
            return (
              <div key={r.region} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{r.region}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: getStatusColor(status) }}>
                    {r.avgScore}
                  </span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${r.avgScore}%`, height: '100%', background: getStatusColor(status), borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>{r.count} countries in sample</div>
              </div>
            )
          })}
          <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(0,212,184,0.06)', border: '1px solid rgba(0,212,184,0.15)', borderRadius: '6px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              ℹ Sample covers {countries.length} of 54 countries. Full dataset expansion in progress.
            </p>
          </div>
        </div>
      </div>

      {/* SDG Goals grid */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Goals at a Glance
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {SDG_GOALS.map(goal => {
            const allScores = countries.map(c => c.goals[goal.id]?.score).filter(Boolean)
            const avg = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(0) : '—'
            const avgStatus = avg >= 70 ? 'green' : avg >= 55 ? 'yellow' : avg >= 40 ? 'orange' : 'red'
            return (
              <div key={goal.id} style={{
                padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px',
                border: `1px solid ${goal.color}30`,
                borderLeft: `3px solid ${goal.color}`,
              }}>
                <div style={{ fontSize: '18px', marginBottom: '6px' }}>{goal.icon}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>SDG {goal.id}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>{goal.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: getStatusColor(avgStatus) }}>
                  {avg}<span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>avg across sample</div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
