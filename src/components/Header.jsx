import { SECTOR_STATS } from '../data/sdgData'

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'story',    label: 'About' },
    { id: 'sdg17',    label: 'All 17 SDGs' },
    { id: 'table',    label: 'Scorecard' },
    { id: 'charts',   label: 'Charts' },
    { id: 'map',      label: 'Map' },
    { id: 'country',  label: 'Country' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'sources',  label: 'Sources' },
  ]

  return (
    <header style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Title row */}
      <div style={{ padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          {/* Coloured flag stripe */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            {['#c2410c','#b45309','#16a34a','#0369a1','#7c3aed'].map(c => (
              <div key={c} style={{ width: '20px', height: '3px', borderRadius: '2px', background: c }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              Africa SDG Scorecard
            </h1>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>2015 → 2030</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '3px' }}>
            {SECTOR_STATS.coveredCountries} nations · {SECTOR_STATS.goalsTracked} tracked SDGs · Data {SECTOR_STATS.dataYear}
          </p>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { val: SECTOR_STATS.onTrackCount, label: 'On Track', color: 'var(--green)', bg: '#dcfce7' },
            { val: SECTOR_STATS.atRiskCount,  label: 'At Risk',  color: 'var(--red)',   bg: '#fee2e2' },
            { val: 2030,                       label: 'Deadline', color: 'var(--accent-gold)', bg: '#fef9c3' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 'var(--radius-sm)', padding: '8px 14px', textAlign: 'center', minWidth: '70px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '10px', color: s.color, marginTop: '2px', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '0 28px', display: 'flex', gap: '2px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 14px',
              fontSize: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--accent-terra)' : 'var(--text-muted)',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-terra)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
