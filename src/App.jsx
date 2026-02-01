import { useState, useEffect } from 'react'
import { fetchBuildingsData } from './services/api'
import Sidebar from './components/Sidebar'
import BuildingsView from './components/BuildingsView'
import DevicesView from './components/DevicesView'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedView, setSelectedView] = useState('buildings')
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchBuildingsData()
        
        if (result && result.buildings && Array.isArray(result.buildings)) {
          setData(result)
        } else {
          console.warn('Invalid data structure:', result)
          setData({ buildings: [] })
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading buildings data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Error loading data</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="app-error">
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className={`app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar
        buildings={data.buildings || []}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={setSelectedBuilding}
        onViewChange={setSelectedView}
        currentView={selectedView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="main-content">
        {selectedView === 'buildings' && (
          <BuildingsView 
            buildings={data.buildings || []}
            onEditBuilding={(building) => {
              alert(`Edit building: ${building.name}`)
            }}
            onViewBuildingDetails={(building) => {
              setSelectedBuilding(building.id)
              // Could navigate to building details view or filter devices
            }}
            onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
        )}
        {selectedView === 'devices' && (
          <DevicesView buildings={data.buildings || []} />
        )}
      </main>
    </div>
  )
}

export default App
