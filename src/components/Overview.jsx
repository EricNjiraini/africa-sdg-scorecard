import { countries, SDG_GOALS, SECTOR_STATS, getStatusColor, getStatusLabel, computeRegionSummary } from '../data/sdgData'

function StatCard({ label, value, sub, color, bg }) {
  return (
    <div style={{
      background: bg || 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)', minWidth: '140px', flex: 1,
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 700, color: color || 'var(--text-primary)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>{sub}</div>}
    </div>
  )
}

function RankRow({ rank, country, onClick }) {
  const overall = country.sdgScore
  const status = overall >= 70 ? 'green' : overall >= 55 ? 'yellow' : overall >= 40 ? 'orange' : 'red'
  return (
    <div
      onClick={() => onClick(country)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 14px', borderBottom: '1px solid var(--border)',
        cursor: 'pointer', transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-inset)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '11px', width: '18px', textAlign: 'right' }}>{rank}</span>
      <span style={{ fontSize: '18px' }}>{country.flag}</span>
      <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{country.name}</span>
      <div style={{ width: '70px', height: '4px', background: 'var(--bg-inset)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${overall}%`, height: '100%', background: getStatusColor(status), borderRadius: '2px' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: getStatusColor(status), width: '34px', textAlign: 'right', fontWeight: 700 }}>{overall}</span>
    </div>
  )
}

export default function Overview({ setActiveTab, setSelectedCountry }) {
  const sorted = [...countries].sort((a, b) => b.sdgScore - a.sdgScore)
  const top5   = sorted.slice(0, 5)
  const bottom5 = sorted.slice(-5).reverse()
  const regionData = computeRegionSummary()

  // Accurate status counts from real data
  const statusCounts = { green: 0, yellow: 0, orange: 0, red: 0, grey: 0 }
  let totalPairs = 0
  countries.forEach(c => {
    SDG_GOALS.forEach(g => {
      const s = c.goals[g.id]?.status
      totalPairs++
      if (s && statusCounts[s] !== undefined) statusCounts[s]++
      else statusCounts.grey++
    })
  })

  // Computed from real data — how many goals have majority-improving trend
  const improvingGoals = SDG_GOALS.filter(g => {
    const trends = countries.map(c => c.goals[g.id]?.trend).filter(Boolean)
    const improving = trends.filter(t => t === 'improving').length
    return improving > trends.length / 2
  }).length

  const handleCountryClick = (c) => { setSelectedCountry(c); setActiveTab('country') }

  // Years left to 2030
  const yearsLeft = 2030 - new Date().getFullYear()

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Hero banner — honest, human framing */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px',
        boxShadow: 'var(--shadow-sm)',
        borderLeft: '4px solid var(--accent-terra)',
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-terra)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              {yearsLeft} years to the deadline
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', lineHeight: 1.25, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Africa's SDG journey is real —<br />
              <span style={{ color: 'var(--accent-terra)' }}>but the pace must triple.</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.75, marginBottom: '10px' }}>
              Based on current trajectories across {SECTOR_STATS.coveredCountries} African nations,{' '}
              <strong>{improvingGoals} of {SDG_GOALS.length} tracked goals</strong> show majority-improving trends.
              Progress on child mortality and electricity access is measurable and real. But hunger is worsening
              in several countries, poverty reduction has stalled, and climate vulnerability is rising.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.7 }}>
              This dashboard tracks <strong>{SDG_GOALS.length} SDGs</strong> where high-quality, country-level
              open data exists — specifically from World Bank, WHO, FAO, UNESCO, and UNFCCC APIs.
              The remaining 10 SDGs lack sufficient Africa-specific data for reliable scoring
              and are surfaced in the <button onClick={() => setActiveTab('sdg17')} style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px', padding: 0 }}>All 17 SDGs panel →</button>
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '180px' }}>
            {[
              { label: 'Countries tracked', value: SECTOR_STATS.coveredCountries, sub: 'of 54 AU members', color: 'var(--accent-blue)', bg: '#eff6ff' },
              { label: 'Goals improving', value: `${improvingGoals}/${SDG_GOALS.length}`, sub: 'majority of countries', color: 'var(--green)', bg: '#dcfce7' },
              { label: 'Countries at risk', value: SECTOR_STATS.atRiskCount, sub: 'score below 50', color: 'var(--red)', bg: '#fee2e2' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 'var(--radius-sm)', padding: '12px 16px', border: `1px solid ${s.color}30` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: s.color }}>{s.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status breakdown — computed from actual data */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
            Goal Status Breakdown
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {countries.length} countries × {SDG_GOALS.length} goals = {totalPairs} data points
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { key: 'green',  label: 'On Track',  color: 'var(--green)',  bg: '#dcfce7' },
            { key: 'yellow', label: 'Moderate',  color: 'var(--yellow)', bg: '#fef9c3' },
            { key: 'orange', label: 'At Risk',   color: 'var(--orange)', bg: '#ffedd5' },
            { key: 'red',    label: 'Off Track', color: 'var(--red)',    bg: '#fee2e2' },
            { key: 'grey',   label: 'No Data',   color: 'var(--grey)',   bg: '#f5f5f4' },
          ].map(({ key, label, color, bg }) => {
            const count = statusCounts[key]
            const pct = totalPairs ? ((count / totalPairs) * 100).toFixed(0) : 0
            return (
              <div key={key} style={{ flex: 1, minWidth: '120px', background: bg, borderRadius: 'var(--radius-sm)', padding: '14px', border: `1px solid ${color}30` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color, lineHeight: 1 }}>{pct}%</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color, marginTop: '4px' }}>{label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{count} pairs</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px' }}>Top Performers</h3>
          </div>
          {top5.map((c, i) => <RankRow key={c.iso} rank={i + 1} country={c} onClick={handleCountryClick} />)}
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px' }}>Needs Most Support</h3>
          </div>
          {bottom5.map((c, i) => <RankRow key={c.iso} rank={countries.length - i} country={c} onClick={handleCountryClick} />)}
        </div>
      </div>

      {/* Region summary */}
      <div className="card" style={{ padding: '22px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>By Region</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {regionData.map(r => {
            const status = r.avgScore >= 70 ? 'green' : r.avgScore >= 55 ? 'yellow' : r.avgScore >= 40 ? 'orange' : 'red'
            const bg = { green: '#dcfce7', yellow: '#fef9c3', orange: '#ffedd5', red: '#fee2e2' }[status]
            return (
              <div key={r.region} style={{ background: bg, borderRadius: 'var(--radius-sm)', padding: '14px 16px', border: `1px solid ${getStatusColor(status)}30` }}>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>{r.region}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: getStatusColor(status) }}>{r.avgScore}</div>
                <div style={{ height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px', margin: '8px 0 4px', overflow: 'hidden' }}>
                  <div style={{ width: `${r.avgScore}%`, height: '100%', background: getStatusColor(status), borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{r.count} countries</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 7 Tracked SDG goals grid */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>Tracked Goals at a Glance</h3>
          <button onClick={() => setActiveTab('sdg17')} style={{ fontSize: '12px', color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            View all 17 SDGs →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {SDG_GOALS.map(goal => {
            const scores = countries.map(c => c.goals[goal.id]?.score).filter(s => s !== undefined && s !== null)
            const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(0) : null
            const avgStatus = avg >= 70 ? 'green' : avg >= 55 ? 'yellow' : avg >= 40 ? 'orange' : 'red'
            const improving = countries.filter(c => c.goals[goal.id]?.trend === 'improving').length
            return (
              <div key={goal.id} style={{
                padding: '14px', borderRadius: 'var(--radius-sm)',
                border: `1px solid ${goal.color}40`,
                borderTop: `3px solid ${goal.color}`,
                background: 'var(--bg-card)',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{goal.icon}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SDG {goal.id}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>{goal.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: getStatusColor(avgStatus) }}>
                  {avg ?? '—'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>avg · {improving} countries improving</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
