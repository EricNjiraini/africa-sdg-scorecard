import { useState } from 'react'
import Header from './components/Header'
import Overview from './components/Overview'
import Story from './components/Story'
import SDG17Panel from './components/SDG17Panel'
import Scorecard from './components/Scorecard'
import Charts from './components/Charts'
import MapView from './components/MapView'
import CountryDeepDive from './components/CountryDeepDive'
import Analysis from './components/Analysis'
import Sources from './components/Sources'

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCountry, setSelectedCountry] = useState(null)

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <Overview setActiveTab={setActiveTab} setSelectedCountry={setSelectedCountry} />
      case 'story':    return <Story setActiveTab={setActiveTab} />
      case 'sdg17':    return <SDG17Panel setActiveTab={setActiveTab} />
      case 'table':    return <Scorecard setActiveTab={setActiveTab} setSelectedCountry={setSelectedCountry} />
      case 'charts':   return <Charts />
      case 'map':      return <MapView setActiveTab={setActiveTab} setSelectedCountry={setSelectedCountry} />
      case 'country':  return <CountryDeepDive selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      case 'analysis': return <Analysis />
      case 'sources':  return <Sources />
      default:         return <Overview setActiveTab={setActiveTab} setSelectedCountry={setSelectedCountry} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {renderTab()}
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '1440px', margin: '0 auto',
        fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)',
      }}>
        <span>Africa SDG Scorecard · Built by Eric Njiraini · Nairobi, Kenya</span>
        <span>Data: WHO · FAO · World Bank · UNESCO · UNFCCC · Informational only · Not affiliated with the UN</span>
      </footer>
    </div>
  )
}
