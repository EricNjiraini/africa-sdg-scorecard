import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { countries, SDG_GOALS, getStatusColor } from '../data/sdgData'

// Build a lookup map: ISO-3 → country object
const countryByIso = Object.fromEntries(countries.map(c => [c.iso, c]))

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

function scoreToStatus(score) {
  if (!score || score === 0) return 'grey'
  if (score >= 70) return 'green'
  if (score >= 55) return 'yellow'
  if (score >= 40) return 'orange'
  return 'red'
}

// Tooltip component
function Tooltip({ country, position }) {
  if (!country) return null
  const { x, y } = position
  const status = scoreToStatus(country.sdgScore)
  const statusColor = scoreToColor(country.sdgScore)

  return (
    <div style={{
      position: 'fixed',
      left: x + 14,
      top: y - 10,
      background: '#0d1623',
      border: `1px solid ${statusColor}40`,
      borderLeft: `3px solid ${statusColor}`,
      borderRadius: '6px',
      padding: '10px 14px',
      pointerEvents: 'none',
      zIndex: 1000,
      minWidth: '180px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span style={{ fontSize: '20px' }}>{country.flag}</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#e8f0fa', fontFamily: 'Syne, sans-serif' }}>
            {country.name}
          </div>
          <div style={{ fontSize: '10px', color: '#3d5a78', fontFamily: 'Space Mono, monospace' }}>
            {country.region}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: '#3d5a78', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
          SDG Score
        </span>
        <span style={{ fontSize: '22px', fontWeight: 700, color: statusColor, fontFamily: 'Space Mono, monospace' }}>
          {country.sdgScore || '—'}
        </span>
      </div>
      <div style={{ marginTop: '6px', fontSize: '10px', color: '#7a99bb', fontFamily: 'Space Mono, monospace' }}>
        Click to open deep-dive →
      </div>
    </div>
  )
}

// Per-goal filter pills
function GoalFilter({ selectedGoal, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
      <button
        onClick={() => onSelect(null)}
        style={{
          padding: '4px 10px', fontSize: '10px', borderRadius: '4px', cursor: 'pointer',
          fontFamily: 'Space Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase',
          background: selectedGoal === null ? 'rgba(0,212,184,0.15)' : 'transparent',
          color: selectedGoal === null ? '#00d4b8' : '#3d5a78',
          border: selectedGoal === null ? '1px solid rgba(0,212,184,0.4)' : '1px solid #1e3048',
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
            padding: '4px 8px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer',
            background: selectedGoal === g.id ? `${g.color}25` : 'transparent',
            color: selectedGoal === g.id ? g.color : '#3d5a78',
            border: selectedGoal === g.id ? `1px solid ${g.color}60` : '1px solid #1e3048',
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
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [selectedGoal, setSelectedGoal] = useState(null) // null = overall score
  const [geoData, setGeoData] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // Score accessor based on selected goal
  const getScore = (iso) => {
    const c = countryByIso[iso]
    if (!c) return null
    if (selectedGoal === null) return c.sdgScore || null
    return c.goals?.[selectedGoal]?.score || null
  }

  const getColor = (iso) => scoreToColor(getScore(iso))

  // Fetch Africa TopoJSON/GeoJSON
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        // Use topojson if available, else fallback to a direct Africa GeoJSON
        import('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js')
          .catch(() => null)
          .then(topo => {
            if (topo) {
              const geojson = topo.feature(world, world.objects.countries)
              setGeoData(geojson)
            }
          })
      })
      .catch(() => setLoadError(true))
  }, [])

  // Fetch GeoJSON directly (simpler approach — no topojson needed)
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(r => r.json())
      .then(geojson => {
        // Filter to Africa only using ISO-3 codes from our dataset
        const africaIsos = new Set(countries.map(c => c.iso))
        const africaFeatures = geojson.features.filter(f => {
          const iso = f.properties?.ISO_A3 || f.properties?.iso_a3
          return africaIsos.has(iso)
        })
        setGeoData({ type: 'FeatureCollection', features: africaFeatures })
        setLoadError(false)
      })
      .catch(() => setLoadError(true))
  }, [])

  // Draw the map with D3
  useEffect(() => {
    if (!geoData || !svgRef.current) return

    const container = svgRef.current.parentElement
    const width = container.clientWidth || 700
    const height = Math.min(width * 0.9, 580)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const projection = d3.geoMercator()
      .fitSize([width - 40, height - 40], geoData)
      .translate([width / 2, height / 2 + 20])

    const path = d3.geoPath().projection(projection)

    const g = svg.append('g')

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
    svg.call(zoom)

    // Draw countries
    g.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', path)
      .attr('fill', d => {
        const iso = d.properties?.ISO_A3 || d.properties?.iso_a3
        return getColor(iso)
      })
      .attr('stroke', '#070c14')
      .attr('stroke-width', 0.8)
      .style('cursor', d => {
        const iso = d.properties?.ISO_A3 || d.properties?.iso_a3
        return countryByIso[iso] ? 'pointer' : 'default'
      })
      .style('transition', 'fill 0.3s ease')
      .on('mousemove', (event, d) => {
        const iso = d.properties?.ISO_A3 || d.properties?.iso_a3
        const c = countryByIso[iso]
        if (c) {
          setHoveredCountry(c)
          setTooltipPos({ x: event.clientX, y: event.clientY })
          d3.select(event.currentTarget)
            .attr('stroke', '#00d4b8')
            .attr('stroke-width', 1.5)
        }
      })
      .on('mouseleave', (event) => {
        setHoveredCountry(null)
        d3.select(event.currentTarget)
          .attr('stroke', '#070c14')
          .attr('stroke-width', 0.8)
      })
      .on('click', (event, d) => {
        const iso = d.properties?.ISO_A3 || d.properties?.iso_a3
        const c = countryByIso[iso]
        if (c) {
          setSelectedCountry(c)
          setActiveTab('country')
        }
      })

    // Country labels for larger countries
    const LABEL_ISOS = new Set(['NGA', 'ETH', 'COD', 'DZA', 'ZAF', 'EGY', 'SDN', 'TZA', 'KEN', 'MAR', 'MOZ', 'AGO', 'MLI', 'NER', 'TCD', 'MRT'])
    g.selectAll('text')
      .data(geoData.features.filter(d => {
        const iso = d.properties?.ISO_A3 || d.properties?.iso_a3
        return LABEL_ISOS.has(iso) && countryByIso[iso]
      }))
      .join('text')
      .attr('transform', d => {
        const centroid = path.centroid(d)
        return `translate(${centroid})`
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '7px')
      .attr('font-family', 'Space Mono, monospace')
      .attr('fill', '#e8f0fa')
      .attr('opacity', 0.7)
      .attr('pointer-events', 'none')
      .text(d => {
        const iso = d.properties?.ISO_A3 || d.properties?.iso_a3
        return countryByIso[iso]?.name?.split(' ')[0] || ''
      })

    // Zoom controls
    svg.append('text')
      .attr('x', width - 20).attr('y', height - 40)
      .attr('text-anchor', 'end')
      .attr('font-size', '9px').attr('font-family', 'Space Mono, monospace')
      .attr('fill', '#3d5a78').attr('pointer-events', 'none')
      .text('scroll to zoom · click to open deep-dive')

  }, [geoData, selectedGoal])

  // Redraw colors when goal changes (without full re-render)
  useEffect(() => {
    if (!svgRef.current || !geoData) return
    d3.select(svgRef.current).selectAll('path')
      .transition().duration(400)
      .attr('fill', d => {
        const iso = d.properties?.ISO_A3 || d.properties?.iso_a3
        return getColor(iso)
      })
  }, [selectedGoal, geoData])

  const selectedGoalObj = SDG_GOALS.find(g => g.id === selectedGoal)

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: '#e8f0fa', marginBottom: '4px' }}>
            🗺 Africa SDG Map
          </h2>
          <p style={{ fontSize: '12px', color: '#7a99bb' }}>
            {selectedGoalObj
              ? `Showing SDG ${selectedGoal}: ${selectedGoalObj.label} — click a country for deep-dive`
              : 'Choropleth of overall SDG scores — click a country for deep-dive'}
          </p>
        </div>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#3d5a78',
          padding: '6px 12px', background: 'rgba(0,212,184,0.06)',
          border: '1px solid rgba(0,212,184,0.15)', borderRadius: '6px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ color: '#00d4b8' }}>●</span>
          {countries.length} countries · 2015–2023 data
        </div>
      </div>

      {/* Goal filter */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: '10px', color: '#3d5a78', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Filter by SDG Goal
        </div>
        <GoalFilter selectedGoal={selectedGoal} onSelect={setSelectedGoal} />
      </div>

      {/* Map + legend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '16px', alignItems: 'start' }}>

        {/* Map card */}
        <div className="card" style={{ overflow: 'hidden', position: 'relative' }}>
          {loadError && (
            <div style={{ padding: '60px', textAlign: 'center', color: '#3d5a78', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
              ⚠ Map data unavailable — check network connection
            </div>
          )}
          {!geoData && !loadError && (
            <div style={{ padding: '60px', textAlign: 'center', color: '#3d5a78', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
              <div style={{ marginBottom: '8px', color: '#00d4b8' }}>◌</div>
              Loading map data…
            </div>
          )}
          <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
        </div>

        {/* Legend + stats panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Color legend */}
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '10px', color: '#3d5a78', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Score Legend
            </div>
            {STATUS_LEGEND.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: s.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#e8f0fa' }}>{s.label}</div>
                  {s.min !== null && (
                    <div style={{ fontSize: '9px', color: '#3d5a78', fontFamily: 'Space Mono, monospace' }}>
                      {s.min}–{s.max}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Score distribution */}
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '10px', color: '#3d5a78', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Distribution
            </div>
            {STATUS_LEGEND.slice(0, 4).map(s => {
              const count = countries.filter(c => {
                const score = selectedGoal ? c.goals?.[selectedGoal]?.score : c.sdgScore
                return score >= s.min && score <= s.max
              }).length
              const pct = ((count / countries.length) * 100).toFixed(0)
              return (
                <div key={s.label} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '10px', color: s.color }}>{s.label}</span>
                    <span style={{ fontSize: '10px', color: '#3d5a78', fontFamily: 'Space Mono, monospace' }}>{count}</span>
                  </div>
                  <div style={{ height: '3px', background: '#070c14', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: s.color, borderRadius: '2px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Hovered country info */}
          {hoveredCountry && (
            <div className="card" style={{ padding: '14px', borderColor: `${scoreToColor(hoveredCountry.sdgScore)}40` }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{hoveredCountry.flag}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#e8f0fa', fontFamily: 'Syne, sans-serif' }}>{hoveredCountry.name}</div>
                  <div style={{ fontSize: '9px', color: '#3d5a78', fontFamily: 'Space Mono, monospace' }}>{hoveredCountry.region}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '28px', fontWeight: 700, color: scoreToColor(hoveredCountry.sdgScore), lineHeight: 1 }}>
                {selectedGoal ? hoveredCountry.goals?.[selectedGoal]?.score ?? '—' : hoveredCountry.sdgScore}
              </div>
              <div style={{ fontSize: '9px', color: '#3d5a78', marginTop: '2px' }}>
                {selectedGoal ? `SDG ${selectedGoal} score` : 'overall score'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Methodology note */}
      <div style={{ padding: '12px 16px', background: 'rgba(75,85,99,0.1)', border: '1px solid #1e3048', borderRadius: '8px', fontSize: '11px', color: '#3d5a78', lineHeight: 1.7 }}>
        <strong style={{ color: '#7a99bb' }}>Map Note:</strong> Countries not in the dataset appear dark.
        Scroll to zoom, drag to pan. Click any country to open its full deep-dive. Score thresholds: ≥70 On Track · 55–69 Moderate · 40–54 At Risk · &lt;40 Off Track.
      </div>
    </div>
  )
}
