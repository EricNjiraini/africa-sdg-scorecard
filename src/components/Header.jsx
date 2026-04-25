import { SECTOR_STATS } from '../data/sdgData'

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview',   label: '◉ Overview' },
    { id: 'table',      label: '≡ Scorecard' },
    { id: 'charts',     label: '⌗ Charts' },
    { id: 'map',        label: '🗺 Map' },
    { id: 'country',    label: '⊞ Country Deep-Dive' },
    { id: 'analysis',   label: '◈ Analysis' },
    { id: 'sources',    label: '⊙ Sources' },
  ]

  return (
    <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '8px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
      }}>
        <span style={{ color: 'var(--accent-cyan)' }}>● LIVE DATA</span>
        <span>
          {SECTOR_STATS.coveredCountries} countries tracked &nbsp;|&nbsp;
          {SECTOR_STATS.goalsTracked} SDGs &nbsp;|&nbsp;
          Data: {SECTOR_STATS.dataYear} &nbsp;|&nbsp;
          Updated: {SECTOR_STATS.lastUpdated}
        </span>
        <span>FOR INFORMATIONAL PURPOSES ONLY</span>
      </div>

      {/* Title */}
      <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--accent-gold)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            Africa · SDG Progress Intelligence
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
          }}>
            Africa SDG Scorecard
            <span style={{ color: 'var(--accent-cyan)', marginLeft: '10px', fontSize: '60%', fontWeight: 400 }}>
              2015 → 2030
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Tracking 54 nations across 7 Sustainable Development Goals
          </p>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '24px', textAlign: 'right' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: 'var(--green)', fontWeight: 700 }}>
              {SECTOR_STATS.onTrackCount}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>On Track</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: 'var(--red)', fontWeight: 700 }}>
              {SECTOR_STATS.atRiskCount}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>At Risk</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: 'var(--accent-gold)', fontWeight: 700 }}>
              2030
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Deadline</div>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <nav style={{ padding: '0 24px', display: 'flex', gap: '2px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              border: 'none',
              borderTop: activeTab === tab.id ? `2px solid var(--accent-cyan)` : '2px solid transparent',
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
