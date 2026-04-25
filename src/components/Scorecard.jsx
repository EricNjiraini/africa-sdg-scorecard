import { useState } from 'react'
import { countries, SDG_GOALS, getStatusColor, getStatusLabel } from '../data/sdgData'

function TrafficDot({ status }) {
  const color = getStatusColor(status)
  return (
    <span title={getStatusLabel(status)} style={{
      display: 'inline-block', width: '10px', height: '10px',
      borderRadius: '50%', background: color,
      boxShadow: `0 0 6px ${color}80`,
    }} />
  )
}

export default function Scorecard({ setActiveTab, setSelectedCountry }) {
  const [sortBy, setSortBy] = useState('sdgScore')
  const [sortDir, setSortDir] = useState('desc')
  const [filterRegion, setFilterRegion] = useState('All')

  const regions = ['All', ...new Set(countries.map(c => c.region))]

  const toggleSort = (field) => {
    if (sortBy === field) setDir => setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('desc') }
  }

  // Fix toggle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  const filtered = countries
    .filter(c => filterRegion === 'All' || c.region === filterRegion)
    .sort((a, b) => {
      let va, vb
      if (sortBy === 'sdgScore') { va = a.sdgScore; vb = b.sdgScore }
      else if (sortBy === 'name') { va = a.name; vb = b.name; return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va) }
      else {
        const gid = parseInt(sortBy.replace('sdg', ''))
        va = a.goals[gid]?.score || 0
        vb = b.goals[gid]?.score || 0
      }
      return sortDir === 'asc' ? va - vb : vb - va
    })

  const SortBtn = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '0',
        color: sortBy === field ? 'var(--accent-cyan)' : 'var(--text-muted)',
        fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase',
        letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '3px',
        whiteSpace: 'nowrap',
      }}
    >
      {label} {sortBy === field ? (sortDir === 'desc' ? '▼' : '▲') : ''}
    </button>
  )

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FILTER:</span>
        {regions.map(r => (
          <button
            key={r}
            onClick={() => setFilterRegion(r)}
            style={{
              padding: '5px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', border: '1px solid',
              borderColor: filterRegion === r ? 'var(--accent-cyan)' : 'var(--border)',
              background: filterRegion === r ? 'rgba(0,212,184,0.1)' : 'transparent',
              color: filterRegion === r ? 'var(--accent-cyan)' : 'var(--text-muted)',
            }}
          >{r}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} countries
        </span>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS:</span>
        {[['green','On Track'],['yellow','Moderate'],['orange','At Risk'],['red','Off Track'],['grey','No Data']].map(([s, l]) => (
          <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <TrafficDot status={s} /> {l}
          </span>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', position: 'sticky', left: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>
                <SortBtn field="name" label="Country" />
              </th>
              <th style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                <SortBtn field="sdgScore" label="Score" />
              </th>
              {SDG_GOALS.map(g => (
                <th key={g.id} style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--border)', minWidth: '80px' }}>
                  <SortBtn field={`sdg${g.id}`} label={`SDG ${g.id}`} />
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '1px', fontFamily: 'var(--font-body)', textTransform: 'none', letterSpacing: 0 }}>
                    {g.icon} {g.label}
                  </div>
                </th>
              ))}
              <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => {
              const overallStatus = c.sdgScore >= 70 ? 'green' : c.sdgScore >= 55 ? 'yellow' : c.sdgScore >= 40 ? 'orange' : 'red'
              return (
                <tr
                  key={c.iso}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setSelectedCountry(c); setActiveTab('country') }}
                >
                  <td style={{ padding: '10px 14px', position: 'sticky', left: 0, background: 'var(--bg-primary)', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{c.flag}</span>
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{c.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{c.region}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700,
                      color: getStatusColor(overallStatus),
                    }}>{c.sdgScore}</span>
                  </td>
                  {SDG_GOALS.map(g => {
                    const goal = c.goals[g.id]
                    return (
                      <td key={g.id} style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {goal ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <TrafficDot status={goal.status} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: getStatusColor(goal.status) }}>
                              {goal.score}
                            </span>
                          </div>
                        ) : (
                          <TrafficDot status="grey" />
                        )}
                      </td>
                    )
                  })}
                  <td style={{ padding: '10px 14px' }}>
                    <button style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)',
                      background: 'none', border: '1px solid rgba(0,212,184,0.3)', borderRadius: '3px',
                      padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                      Deep Dive →
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        ⚠ Score = 0–100 distance to SDG target (100 = target achieved). Click any row to open Country Deep-Dive.
      </p>
    </div>
  )
}
