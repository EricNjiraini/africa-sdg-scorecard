import { useState } from 'react'
import { countries, SDG_GOALS, getStatusColor, getStatusLabel, getTrendIcon } from '../data/sdgData'

function GoalCard({ goal, data }) {
  if (!data) return (
    <div className="card" style={{ padding: '16px', opacity: 0.4 }}>
      <div style={{ fontSize: '20px', marginBottom: '6px' }}>{goal.icon}</div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SDG {goal.id}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{goal.label}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No data</div>
    </div>
  )

  const color = getStatusColor(data.status)

  return (
    <div className="card" style={{ padding: '16px', borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '18px', marginBottom: '4px' }}>{goal.icon}</div>
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
      <div style={{ height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', marginBottom: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${data.score}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{data.keyIndicator}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--text-primary)' }}>
          {data.value}<span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '3px' }}>{data.unit}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{
            fontSize: '12px', fontWeight: 700,
            color: data.trend === 'improving' ? 'var(--green)' : data.trend === 'worsening' ? 'var(--red)' : 'var(--text-muted)',
          }}>
            {getTrendIcon(data.trend)}
          </span>
          <span className={`tag-${data.status}`} style={{ padding: '2px 7px', borderRadius: '3px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
            {getStatusLabel(data.status)}
          </span>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
        Source: {data.source}
      </div>
    </div>
  )
}

export default function CountryDeepDive({ selectedCountry, setSelectedCountry }) {
  const sorted = [...countries].sort((a, b) => b.sdgScore - a.sdgScore)
  const current = selectedCountry || sorted[0]

  const overallStatus = current.sdgScore >= 70 ? 'green' : current.sdgScore >= 55 ? 'yellow' : current.sdgScore >= 40 ? 'orange' : 'red'
  const rank = sorted.findIndex(c => c.iso === current.iso) + 1

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Country selector */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {sorted.map(c => (
          <button
            key={c.iso}
            onClick={() => setSelectedCountry(c)}
            title={c.name}
            style={{
              padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px',
              border: '1px solid',
              borderColor: current.iso === c.iso ? 'var(--accent-cyan)' : 'var(--border)',
              background: current.iso === c.iso ? 'rgba(0,212,184,0.1)' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            {c.flag}
          </button>
        ))}
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center', fontFamily: 'var(--font-mono)' }}>
          ← select a country
        </span>
      </div>

      {/* Country header */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '52px' }}>{current.flag}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {current.name}
              </h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                {current.region} · {current.incomeGroup} income · Pop. {current.population}M
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 700, color: getStatusColor(overallStatus), lineHeight: 1 }}>
                {current.sdgScore}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>SDG Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 700, color: 'var(--text-secondary)', lineHeight: 1 }}>
                #{rank}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Africa Rank</div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className={`tag-${overallStatus}`} style={{ padding: '6px 14px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {getStatusLabel(overallStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Distance to SDG target (0 → 100)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{current.sdgScore}/100</span>
          </div>
          <div style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${current.sdgScore}%`, height: '100%',
              background: `linear-gradient(90deg, ${getStatusColor('red')}, ${getStatusColor(overallStatus)})`,
              borderRadius: '4px', transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Goal cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {SDG_GOALS.map(goal => (
          <GoalCard key={goal.id} goal={goal} data={current.goals[goal.id]} />
        ))}
      </div>

      {/* Notes */}
      <div style={{
        padding: '14px 18px', background: 'rgba(61,156,240,0.06)',
        border: '1px solid rgba(61,156,240,0.18)', borderRadius: '8px',
        fontSize: '12px', color: 'var(--text-muted)',
      }}>
        ℹ All data sourced from official UN agencies (WHO, FAO, World Bank, UNESCO UIS, UNFCCC).
        Scores represent distance to 2030 SDG target (100 = target fully achieved).
        Trends reflect direction of change since 2015 baseline.
      </div>
    </div>
  )
}
