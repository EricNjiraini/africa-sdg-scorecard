import { useState } from 'react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { countries, SDG_GOALS, getStatusColor, getStatusLabel, getTrendIcon } from '../data/sdgData'

// ── Sparkline mini chart ──────────────────────────────────────────────────
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return (
    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>— no series</span>
  )
  return (
    <ResponsiveContainer width={80} height={28}>
      <LineChart data={data}>
        <Line
          type="monotone" dataKey="score"
          stroke={color} strokeWidth={1.5}
          dot={false} isAnimationActive={false}
        />
        <Tooltip
          contentStyle={{ background: '#111d2e', border: '1px solid #2a4060', borderRadius: '4px', fontSize: '10px', padding: '4px 8px' }}
          labelFormatter={l => `${l}`}
          formatter={v => [`${v}`, 'Score']}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Trend badge ───────────────────────────────────────────────────────────
function TrendBadge({ trend, slope }) {
  const cfg = {
    improving: { icon: '↑', color: 'var(--green)',  bg: 'rgba(34,197,94,0.1)',   label: 'Improving' },
    worsening: { icon: '↓', color: 'var(--red)',    bg: 'rgba(239,68,68,0.1)',   label: 'Worsening' },
    stable:    { icon: '→', color: 'var(--text-muted)', bg: 'rgba(75,85,99,0.15)', label: 'Stable' },
  }
  const c = cfg[trend] || cfg.stable
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: '4px',
      background: c.bg, color: c.color,
      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
    }}>
      {c.icon} {c.label}
      {slope != null && (
        <span style={{ opacity: 0.7, fontWeight: 400 }}>
          {slope > 0 ? '+' : ''}{slope}/yr
        </span>
      )}
    </span>
  )
}

// ── Goal card ─────────────────────────────────────────────────────────────
function GoalCard({ goal, data }) {
  if (!data) return (
    <div className="card" style={{ padding: '16px', opacity: 0.35 }}>
      <div style={{ fontSize: '20px', marginBottom: '6px' }}>{goal.icon}</div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SDG {goal.id}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{goal.label}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No data</div>
    </div>
  )

  const color = getStatusColor(data.status)

  return (
    <div className="card" style={{ padding: '16px', borderLeft: `3px solid ${color}` }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '18px', marginBottom: '3px' }}>{goal.icon}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SDG {goal.id}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{goal.label}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 700, color, lineHeight: 1 }}>
            {data.score}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>/100</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', background: 'var(--bg-inset)', borderRadius: '2px', marginBottom: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${data.score}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
      </div>

      {/* Key indicator value */}
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{data.keyIndicator}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '10px' }}>
        {data.value}<span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '3px' }}>{data.unit}</span>
      </div>

      {/* Phase 3: Sparkline + trend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Sparkline data={data.sparkline} color={color} />
        <TrendBadge trend={data.trend} slope={data.trendSlope} />
      </div>

      {/* Status + source */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`tag-${data.status}`} style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
          {getStatusLabel(data.status)}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{data.source}</span>
      </div>
    </div>
  )
}

// ── Country selector bar ───────────────────────────────────────────────────
function CountryPicker({ current, onSelect }) {
  const [search, setSearch] = useState('')
  const sorted = [...countries].sort((a, b) => b.sdgScore - a.sdgScore)
  const filtered = search
    ? sorted.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : sorted

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '6px', padding: '7px 12px', color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)', fontSize: '12px', outline: 'none',
          width: '200px',
        }}
      />
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {filtered.map(c => (
          <button
            key={c.iso}
            onClick={() => onSelect(c)}
            title={`${c.name} — ${c.sdgScore}`}
            style={{
              padding: '5px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '15px',
              border: '1px solid',
              borderColor: current.iso === c.iso ? 'var(--accent-cyan)' : 'var(--border)',
              background: current.iso === c.iso ? 'rgba(0,212,184,0.1)' : 'transparent',
              transition: 'all 0.12s',
            }}
          >
            {c.flag}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function CountryDeepDive({ selectedCountry, setSelectedCountry }) {
  const sorted = [...countries].sort((a, b) => b.sdgScore - a.sdgScore)
  const current = selectedCountry || sorted[0]

  const overallStatus = current.sdgScore >= 70 ? 'green' : current.sdgScore >= 55 ? 'yellow' : current.sdgScore >= 40 ? 'orange' : 'red'
  const rank = sorted.findIndex(c => c.iso === current.iso) + 1

  // Compute overall trend from goal trends
  const goalList = Object.values(current.goals || {})
  const improving  = goalList.filter(g => g.trend === 'improving').length
  const worsening  = goalList.filter(g => g.trend === 'worsening').length
  const overallTrend = improving > worsening ? 'improving' : worsening > improving ? 'worsening' : 'stable'
  const avgSlope = goalList.length
    ? (goalList.reduce((s, g) => s + (g.trendSlope || 0), 0) / goalList.length).toFixed(2)
    : 0

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Country picker */}
      <CountryPicker current={current} onSelect={setSelectedCountry} />

      {/* Country header card */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '56px', lineHeight: 1 }}>{current.flag}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, lineHeight: 1, color: 'var(--text-primary)' }}>
                {current.name}
              </h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                {current.region} · {current.incomeGroup} income · Pop. {current.population}M
              </div>
              <div style={{ marginTop: '8px' }}>
                <TrendBadge trend={overallTrend} slope={avgSlope} />
                <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  overall trajectory · {improving}↑ {worsening}↓ across {goalList.length} goals
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '40px', fontWeight: 700, color: getStatusColor(overallStatus), lineHeight: 1 }}>
                {current.sdgScore}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>SDG Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '40px', fontWeight: 700, color: 'var(--text-secondary)', lineHeight: 1 }}>
                #{rank}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Africa Rank</div>
            </div>
            <span className={`tag-${overallStatus}`} style={{ padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px' }}>
              {getStatusLabel(overallStatus)}
            </span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Distance to 2030 SDG target (0 → 100)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{current.sdgScore}/100</span>
          </div>
          <div style={{ height: '8px', background: 'var(--bg-inset)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${current.sdgScore}%`, height: '100%', borderRadius: '4px',
              background: `linear-gradient(90deg, ${getStatusColor('red')}, ${getStatusColor(overallStatus)})`,
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Goal cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
        {SDG_GOALS.map(goal => (
          <GoalCard key={goal.id} goal={goal} data={current.goals[goal.id]} />
        ))}
      </div>

      {/* Phase 3 trend insight box */}
      {goalList.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
        }}>
          {[
            { label: '↑ Improving Goals', count: improving, color: 'var(--green)', goals: goalList.filter(g => g.trend === 'improving') },
            { label: '→ Stable Goals',    count: goalList.length - improving - worsening, color: 'var(--text-muted)', goals: goalList.filter(g => g.trend === 'stable') },
            { label: '↓ Worsening Goals', count: worsening, color: 'var(--red)', goals: goalList.filter(g => g.trend === 'worsening') },
          ].map(({ label, count, color, goals: gs }) => (
            <div key={label} className="card" style={{ padding: '14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color, marginBottom: '2px' }}>
                {count}
              </div>
              <div style={{ fontSize: '11px', color, marginBottom: '8px' }}>{label}</div>
              {gs.length > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  {gs.map(g => g.keyIndicator).join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '12px 16px', background: 'rgba(61,156,240,0.06)', border: '1px solid rgba(61,156,240,0.18)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
        ℹ Trend = linear regression on 8-year score series (2015–2023). Slope = score points/year.
        Data: WHO, FAO, World Bank, UNESCO UIS, UNFCCC — all open license.
      </div>
    </div>
  )
}
