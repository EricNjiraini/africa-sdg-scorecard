import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { countries, SDG_GOALS } from '../data/sdgData'

const countryByIso = Object.fromEntries(countries.map(c => [c.iso, c]))
const AFRICA_ISOS = new Set(countries.map(c => c.iso))

const STATUS_LEGEND = [
  { label: 'On Track',  min: 70,  max: 100, color: '#22c55e' },
  { label: 'Moderate',  min: 55,  max: 69,  color: '#eab308' },
  { label: 'At Risk',   min: 40,  max: 54,  color: '#f97316' },
  { label: 'Off Track', min: 0,   max: 39,  color: '#ef4444' },
  { label: 'No Data',   min: null, max: null, color: '#1e3048' },
]

function scoreToColor(score) {
  if (score == null || score === 0) return '#1e3048'
  if (score >= 70) return '#22c55e'
  if (score >= 55) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

// Natural Earth 50m uses properties.ADM0_A3 for ISO-3
const getIso = (feature) => feature?.properties?.ADM0_A3 || null

function GoalFilter({ selectedGoal, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
      <button
        onClick={() => onSelect(null)}
        style={{
          padding: '4px 10px', fontSize: '10px', borderRadius: '4px', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase',
          background: selectedGoal === null ? 'rgba(0,212,184,0.15)' : 'transparent',
          color: selectedGoal === null ? 'var(--accent-cyan)' : 'var(--text-muted)',
          border: selectedGoal === null ? '1px solid rgba(0,212,184,0.4)' : '1px solid var(--border)',
          transition: 'all 0.15s',
        }}
      >
        Overall
      </button>
      {SDG_GOALS.map(g => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          title={`SDG ${g.id}: ${g.label}`}
          style={{
            padding: '4px 8px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer',
            background: selectedGoal === g.id ? `${g.color}25` : 'transparent',
            color: selectedGoal === g.id ? g.color : 'var(--text-muted)',
            border: selectedGoal === g.id ? `1px solid ${g.color}60` : '1px solid var(--border)',
            transition: 'all 0.15s',
          }}
        >
          {g.icon}
        </button>
      ))}
    </div>
  )
}

export default function MapView({ setActiveTab, setSelectedCountry }) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [geoData, setGeoData] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [status, setStatus] = useState('Loading map data…')

  const getScore = (iso) => {
    const c = countryByIso[iso]
    if (!c) return null
    if (selectedGoal === null) return c.sdgScore || null
    return c.goals?.[selectedGoal]?.score || null
  }

  const getColor = (iso) => scoreToColor(getScore(iso))

  // Natural Earth 50m — accurate borders, ADM0_A3 property for ISO-3
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_admin_0_countries.geojson')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(world => {
        const africaFeatures = world.features.filter(f => AFRICA_ISOS.has(getIso(f)))
        if (africaFeatures.length === 0) throw new Error('No Africa features found')
        setGeoData({ type: 'FeatureCollection', features: africaFeatures })
        setStatus(null)
      })
      .catch(err => {
        console.error('GeoJSON fetch failed:', err)
        setLoadError(true)
        setStatus(`Failed to load map: ${err.message}`)
      })
  }, [])

  // Draw map
  useEffect(() => {
    if (!geoData || !svgRef.current || !containerRef.current) return

    const width = containerRef.current.clientWidth || 700
    const height = Math.min(width * 0.88, 580)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const projection = d3.geoMercator()
      .fitExtent([[20, 20], [width - 20, height - 20]], geoData)

    const path = d3.geoPath().projection(projection)
    const g = svg.append('g')

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', e => g.attr('transform', e.transform))
    svg.call(zoom)

    // Country paths
    g.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', path)
      .attr('fill', d => getColor(getIso(d)))
      .attr('stroke', 'var(--bg-primary)')
      .attr('stroke-width', 0.6)
      .style('cursor', 'pointer')
      .on('mousemove', (event, d) => {
        const iso = getIso(d)
        const c = countryByIso[iso]
        if (c) setHoveredCountry(c)
        d3.select(event.currentTarget)
          .attr('stroke', 'var(--accent-cyan)')
          .attr('stroke-width', 1.5)
          .raise()
      })
      .on('mouseleave', (event) => {
        setHoveredCountry(null)
        d3.select(event.currentTarget)
          .attr('stroke', 'var(--bg-primary)')
          .attr('stroke-width', 0.6)
      })
      .on('click', (event, d) => {
        const c = countryByIso[getIso(d)]
        if (c) {
          setSelectedCountry(c)
          setActiveTab('country')
        }
      })

    // Labels for larger countries
    const LABEL_ISOS = new Set(['NGA','ETH','COD','DZA','ZAF','EGY','SDN','SSD','TZA','KEN','MAR','MOZ','AGO','MLI','NER','TCD','MRT','ZMB','MDG'])
    g.selectAll('text')
      .data(geoData.features.filter(d => LABEL_ISOS.has(getIso(d))))
      .join('text')
      .attr('transform', d => `translate(${path.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '7px')
      .attr('font-family', 'var(--font-mono)')
      .attr('fill', '#e8f0fa')
      .attr('opacity', 0.6)
      .attr('pointer-events', 'none')
      .text(d => countryByIso[getIso(d)]?.name?.split(' ')[0] || '')

    svg.append('text')
      .attr('x', width - 10).attr('y', height - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', '9px')
      .attr('font-family', 'var(--font-mono)')
      .attr('fill', 'var(--text-muted)')
      .attr('pointer-events', 'none')
      .text('scroll to zoom · drag to pan · click to deep-dive')

  }, [geoData])

  // Recolor on goal change without full redraw
  useEffect(() => {
    if (!svgRef.current || !geoData) return
    d3.select(svgRef.current).selectAll('path')
      .transition().duration(350)
      .attr('fill', d => getColor(getIso(d)))
  }, [selectedGoal, geoData])

  const selectedGoalObj = SDG_GOALS.find(g => g.id === selectedGoal)

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '4px' }}>
            🗺 Africa SDG Map
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {selectedGoalObj
              ? `SDG ${selectedGoal}: ${selectedGoalObj.label} — click a country for deep-dive`
              : 'Overall SDG scores — click any country for the full deep-dive'}
          </p>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)',
          padding: '6px 12px', background: 'rgba(0,212,184,0.06)',
          border: '1px solid rgba(0,212,184,0.15)', borderRadius: '6px',
        }}>
          <span style={{ color: 'var(--accent-cyan)' }}>●</span> {countries.length} countries · 2015–2023
        </div>
      </div>

      {/* Goal filter */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Filter by SDG Goal
        </div>
        <GoalFilter selectedGoal={selectedGoal} onSelect={setSelectedGoal} />
      </div>

      {/* Map + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '16px', alignItems: 'start' }}>

        {/* Map */}
        <div ref={containerRef} className="card" style={{ overflow: 'hidden', minHeight: '300px', position: 'relative' }}>
          {status && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '8px',
              color: loadError ? 'var(--red)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: '12px',
            }}>
              {!loadError && (
                <div style={{ fontSize: '20px', color: 'var(--accent-cyan)', animation: 'spin 1.5s linear infinite' }}>◌</div>
              )}
              {status}
            </div>
          )}
          <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Legend */}
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Legend
            </div>
            {STATUS_LEGEND.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: s.color, flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{s.label}</div>
                  {s.min !== null && (
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.min}–{s.max}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Distribution */}
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Distribution
            </div>
            {STATUS_LEGEND.slice(0, 4).map(s => {
              const count = countries.filter(c => {
                const score = selectedGoal ? c.goals?.[selectedGoal]?.score : c.sdgScore
                return score != null && score >= s.min && score <= s.max
              }).length
              const pct = ((count / countries.length) * 100).toFixed(0)
              return (
                <div key={s.label} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '10px', color: s.color }}>{s.label}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{count}</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: s.color, borderRadius: '2px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Hovered country card */}
          {hoveredCountry && (
            <div className="card" style={{ padding: '14px', borderColor: `${scoreToColor(hoveredCountry.sdgScore)}50`, transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px' }}>{hoveredCountry.flag}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{hoveredCountry.name}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{hoveredCountry.region}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 700, color: scoreToColor(hoveredCountry.sdgScore), lineHeight: 1 }}>
                {selectedGoal
                  ? (hoveredCountry.goals?.[selectedGoal]?.score ?? '—')
                  : (hoveredCountry.sdgScore || '—')}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {selectedGoal ? `SDG ${selectedGoal} score` : 'overall score'}
              </div>
              <div style={{ marginTop: '8px', fontSize: '9px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                click to open →
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note */}
      <div style={{ padding: '12px 16px', background: 'rgba(75,85,99,0.1)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Map Note:</strong> Borders from Natural Earth 1:50m.
        Dark countries have no data in the dataset. Scroll to zoom · drag to pan · click any country for its deep-dive.
        Thresholds: ≥70 On Track · 55–69 Moderate · 40–54 At Risk · &lt;40 Off Track.
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
