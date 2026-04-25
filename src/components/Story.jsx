export default function Story({ setActiveTab }) {
  return (
    <div style={{ padding: '28px', maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Hero */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        padding: '36px 40px', border: '1px solid var(--border)',
        borderTop: '4px solid var(--accent-terra)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-terra)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Why this exists
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', lineHeight: 1.2, marginBottom: '16px' }}>
          Africa's development data exists.<br />
          <span style={{ color: 'var(--accent-terra)' }}>It's just not easy to find or read.</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '14px' }}>
          The UN, World Bank, WHO, FAO, and UNESCO publish comprehensive country-level data on sustainable
          development across Africa. It's open, freely available, and updated annually. But it lives scattered
          across 12 different portals, buried in PDF reports, or accessible only through raw API calls
          that require technical expertise to interpret.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          This scorecard was built to change that — to make Africa's SDG story readable, comparable,
          and honest, for anyone who cares about the continent's trajectory.
        </p>
      </div>

      {/* Who it's for */}
      <div className="card" style={{ padding: '28px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>
          Who uses this?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {[
            { icon: '📊', title: 'Data & Analytics Teams', desc: 'At NGOs, development banks, and government ministries needing a fast cross-country view before deep-dive analysis.' },
            { icon: '🏛️', title: 'Policy & Advocacy', desc: 'Teams building evidence for funding proposals, policy briefs, or public advocacy who need reliable, citable data.' },
            { icon: '📰', title: 'Journalists & Researchers', desc: 'Anyone covering Africa\'s development story who needs accurate, source-attributed data without a data science background.' },
            { icon: '🌍', title: 'Development Practitioners', desc: 'Field teams at organisations like Habitat for Humanity, BURN Manufacturing, or UNDP needing country context.' },
          ].map(u => (
            <div key={u.title} style={{ padding: '18px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{u.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>{u.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{u.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What gap it fills */}
      <div className="card" style={{ padding: '28px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>
          The gap this fills
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
          Existing tools either cover the whole world (too broad to be useful for Africa-specific work)
          or require GIS expertise and API access. There is no Africa-only, public-facing, plain-language
          SDG progress dashboard built for practitioners — not statisticians.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'UN SDG Global Database', issue: 'Global scope, technical interface, no regional narrative' },
            { label: 'SDSN SDG Index Report', issue: 'Annual PDF report — not interactive, not real-time' },
            { label: 'World Bank Data Portal', issue: 'Indicator-by-indicator — no cross-SDG country view' },
            { label: 'This scorecard', issue: '✓ Africa-only · ✓ Cross-goal · ✓ Trend analysis · ✓ Open source', highlight: true },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', borderRadius: 'var(--radius-sm)',
              background: r.highlight ? '#dcfce7' : 'var(--bg-inset)',
              border: `1px solid ${r.highlight ? 'var(--green)' : 'var(--border)'}`,
              gap: '16px',
            }}>
              <span style={{ fontWeight: 600, fontSize: '13px', color: r.highlight ? 'var(--green)' : 'var(--text-primary)' }}>{r.label}</span>
              <span style={{ fontSize: '12px', color: r.highlight ? 'var(--green)' : 'var(--text-muted)', textAlign: 'right' }}>{r.issue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why 7 SDGs */}
      <div className="card" style={{ padding: '28px', borderLeft: '4px solid var(--accent-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>
          Why 7 SDGs, not all 17?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '12px' }}>
          This is an intentional data-quality decision, not a limitation. The 7 tracked goals have:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {[
            'Consistent, annual, country-level data for most African nations from reliable UN and World Bank sources',
            'Clear, quantifiable 2030 targets that can be scored on a 0–100 scale',
            'At least 5 years of historical data — enough for meaningful trend analysis',
            'Open, CC-licensed data that can legally be republished',
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fef9c3', border: '1px solid var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-gold)' }}>✓</span>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          The remaining 10 SDGs — covering areas like gender equality, sustainable cities, and life below water —
          are shown in the <button onClick={() => setActiveTab('sdg17')} style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', padding: 0 }}>All 17 SDGs panel</button>,
          with honest notes on data availability and what's needed to track them properly.
        </p>
      </div>

      {/* Methodology */}
      <div className="card" style={{ padding: '28px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>
          How scores are calculated
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '16px' }}>
          Each score (0–100) represents a country's distance to its 2030 SDG target, adapted from the SDSN
          Sustainable Development Report methodology. A score of 100 means the target is achieved.
          Trend direction is computed via linear regression on 8 years of annual data — not just a
          comparison of two points.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { score: '≥ 70', label: 'On Track', color: 'var(--green)', bg: '#dcfce7' },
            { score: '55–69', label: 'Moderate progress', color: 'var(--yellow)', bg: '#fef9c3' },
            { score: '40–54', label: 'At risk', color: 'var(--orange)', bg: '#ffedd5' },
            { score: '< 40', label: 'Off track', color: 'var(--red)', bg: '#fee2e2' },
          ].map(s => (
            <div key={s.score} style={{ background: s.bg, borderRadius: 'var(--radius-sm)', padding: '12px 14px', border: `1px solid ${s.color}30` }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: s.color }}>{s.score}</span>
              <span style={{ fontSize: '12px', color: s.color, marginLeft: '8px' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Builder note */}
      <div style={{ padding: '20px 24px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
        Built by <strong style={{ color: 'var(--text-primary)' }}>Eric Njiraini</strong> — Data Analytics Manager, Nairobi.
        Open source. Non-commercial. All data attributed to source. Not affiliated with or endorsed by the United Nations.
        <br />Source code available on <a href="https://github.com/EricNjiraini/africa-sdg-scorecard" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>GitHub →</a>
      </div>
    </div>
  )
}
