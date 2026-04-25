import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  Cell, Legend,
} from 'recharts'
import { countries, SDG_GOALS, getStatusColor } from '../data/sdgData'

const CHART_BG = '#070c14'
const GRID_COLOR = '#1e3048'
const TEXT_COLOR = '#7a99bb'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#111d2e', border: '1px solid #2a4060',
      borderRadius: '6px', padding: '10px 14px', fontSize: '12px',
    }}>
      <div style={{ color: '#e8f0fa', fontWeight: 700, marginBottom: '4px' }}>{label || payload[0]?.payload?.name}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#7a99bb' }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function Charts() {
  // Bar chart — overall SDG scores
  const scoreData = [...countries]
    .sort((a, b) => b.sdgScore - a.sdgScore)
    .map(c => ({
      name: c.flag + ' ' + c.name.slice(0, 8),
      score: c.sdgScore,
      status: c.sdgScore >= 70 ? 'green' : c.sdgScore >= 55 ? 'yellow' : c.sdgScore >= 40 ? 'orange' : 'red',
    }))

  // Scatter — population vs SDG score
  const scatterData = countries.map(c => ({
    name: c.flag + ' ' + c.name,
    x: Math.log10(c.population),
    y: c.sdgScore,
    status: c.sdgScore >= 70 ? 'green' : c.sdgScore >= 55 ? 'yellow' : c.sdgScore >= 40 ? 'orange' : 'red',
  }))

  // Radar — avg per SDG goal
  const radarData = SDG_GOALS.map(g => {
    const scores = countries.map(c => c.goals[g.id]?.score).filter(Boolean)
    return {
      goal: `SDG ${g.id}\n${g.icon}`,
      avg: scores.length ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
    }
  })

  // Bar — avg score by SDG goal
  const goalAvgData = SDG_GOALS.map(g => {
    const scores = countries.map(c => c.goals[g.id]?.score).filter(Boolean)
    const avg = scores.length ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0
    return { name: `${g.icon} SDG ${g.id}`, label: g.label, avg, color: g.color }
  })

  const chartTitle = (t) => (
    <h3 style={{
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
      color: 'var(--text-secondary)', textTransform: 'uppercase',
      letterSpacing: '1px', marginBottom: '16px',
    }}>{t}</h3>
  )

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Overall SDG Scores Bar */}
      <div className="card" style={{ padding: '20px' }}>
        {chartTitle('Overall SDG Score by Country (0–100)')}
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={scoreData} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="name" tick={{ fill: TEXT_COLOR, fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
            <YAxis domain={[0, 100]} tick={{ fill: TEXT_COLOR, fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[3, 3, 0, 0]}>
              {scoreData.map((entry, i) => (
                <Cell key={i} fill={getStatusColor(entry.status)} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Goal avg + Scatter side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Avg score per SDG */}
        <div className="card" style={{ padding: '20px' }}>
          {chartTitle('Avg Score per SDG Goal')}
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={goalAvgData} layout="vertical" margin={{ top: 0, right: 24, left: 16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: TEXT_COLOR, fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: TEXT_COLOR, fontSize: 11 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" radius={[0, 3, 3, 0]}>
                {goalAvgData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="card" style={{ padding: '20px' }}>
          {chartTitle('SDG Profile — Continent Average')}
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={GRID_COLOR} />
              <PolarAngleAxis dataKey="goal" tick={{ fill: TEXT_COLOR, fontSize: 10 }} />
              <Radar name="Avg Score" dataKey="avg" stroke="#00d4b8" fill="#00d4b8" fillOpacity={0.18} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scatter — population vs score */}
      <div className="card" style={{ padding: '20px' }}>
        {chartTitle('Population Size vs SDG Score (log scale)')}
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis
              type="number" dataKey="x"
              name="Population (log₁₀, millions)"
              tick={{ fill: TEXT_COLOR, fontSize: 10 }}
              label={{ value: 'Population (log scale)', fill: TEXT_COLOR, fontSize: 10, position: 'insideBottom', offset: -4 }}
            />
            <YAxis
              type="number" dataKey="y" domain={[30, 80]}
              tick={{ fill: TEXT_COLOR, fontSize: 11 }}
              label={{ value: 'SDG Score', fill: TEXT_COLOR, fontSize: 10, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: GRID_COLOR }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div style={{ background: '#111d2e', border: '1px solid #2a4060', borderRadius: '6px', padding: '10px 14px', fontSize: '12px' }}>
                    <div style={{ color: '#e8f0fa', fontWeight: 700 }}>{d?.name}</div>
                    <div style={{ color: TEXT_COLOR }}>SDG Score: <strong style={{ color: getStatusColor(d.status) }}>{d?.y}</strong></div>
                    <div style={{ color: TEXT_COLOR }}>Pop: ~{Math.round(Math.pow(10, d?.x) * 10) / 10}M</div>
                  </div>
                )
              }}
            />
            <Scatter data={scatterData}>
              {scatterData.map((entry, i) => (
                <Cell key={i} fill={getStatusColor(entry.status)} opacity={0.85} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
          No strong correlation found between country size and SDG performance — governance and investment matter more.
        </p>
      </div>

    </div>
  )
}
