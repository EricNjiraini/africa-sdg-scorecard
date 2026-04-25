import { useState } from 'react'
import Header from './components/Header'
import Overview from './components/Overview'
import Scorecard from './components/Scorecard'
import Charts from './components/Charts'
import CountryDeepDive from './components/CountryDeepDive'
import Analysis from './components/Analysis'
import Sources from './components/Sources'

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCountry, setSelectedCountry] = useState(null)

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':  return <Overview setActiveTab={setActiveTab} setSelectedCountry={setSelectedCountry} />
      case 'table':     return <Scorecard setActiveTab={setActiveTab} setSelectedCountry={setSelectedCountry} />
      case 'charts':    return <Charts />
      case 'country':   return <CountryDeepDive selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      case 'analysis':  return <Analysis />
      case 'sources':   return <Sources />
      default:          return <Overview setActiveTab={setActiveTab} setSelectedCountry={setSelectedCountry} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {renderTab()}
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)',
        maxWidth: '1400px', margin: '0 auto',
      }}>
        <span>Africa SDG Scorecard — Built by Eric Njiraini · Data: WHO, FAO, World Bank, UNSD, UNESCO, UNFCCC</span>
        <span>For informational purposes only · Not affiliated with the United Nations</span>
      </footer>
    </div>
  )
}
