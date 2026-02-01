import { useMemo, memo } from 'react'
import { countItems, countOnlineDevices } from '../utils/dataTransform'
import './BuildingsView.css'
// Icon files were removed from the repo; use inline SVGs instead

const BuildingCard = memo(({ building, onEdit, onViewDetails }) => {
  const floorsCount = useMemo(() => countItems(building, 'floors'), [building])
  const spacesCount = useMemo(() => countItems(building, 'spaces'), [building])
  const roomsCount = useMemo(() => countItems(building, 'rooms'), [building])
  const devicesCount = useMemo(() => countItems(building, 'devices'), [building])
  const onlineDevicesCount = useMemo(() => countOnlineDevices(building), [building])
  
  return (
    <div className="building-card">
      <div className="building-card-icon-large" aria-hidden>
        <svg width="142" height="142" viewBox="0 0 265 265" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9.5" y="0" width="75" height="255" rx="2" stroke="#6BADDC" strokeWidth="3" fill="none"/>
          <rect x="0" y="0" width="75" height="255" rx="2" stroke="#6BADDC" strokeWidth="3" fill="none"/>
          <rect x="170" y="142" width="37" height="123" rx="2" stroke="#6BADDC" strokeWidth="3" fill="none"/>
          <rect x="170" y="142" width="37" height="123" rx="2" stroke="#6BADDC" strokeWidth="3" fill="none"/>
          <g fill="#6BADDC">
            <rect x="24" y="19" width="15" height="15" rx="1"/>
            <rect x="62" y="19" width="15" height="15" rx="1"/>
            <rect x="24" y="76" width="15" height="15" rx="1"/>
            <rect x="62" y="76" width="15" height="15" rx="1"/>
            <rect x="24" y="133" width="15" height="15" rx="1"/>
            <rect x="62" y="133" width="15" height="15" rx="1"/>
            <rect x="24" y="190" width="15" height="15" rx="1"/>
            <rect x="62" y="190" width="15" height="15" rx="1"/>
          </g>
          <rect x="189" y="161" width="15" height="15" rx="1" fill="#6BADDC"/>
          <rect x="189" y="199" width="15" height="15" rx="1" fill="#6BADDC"/>
        </svg>
      </div>
      <div className="building-card-content">
        <div className="building-card-header">
          <div className="building-name-section">
            <h3 className="building-name">{building.name || 'Unnamed Building'}</h3>
            {building.address && (() => {
              // Extract number from address if it starts with a number
              const addressMatch = building.address.match(/^(\d+)\s*(.+)$/);
              const addressNumber = addressMatch ? addressMatch[1] : null;
              const addressText = addressMatch ? addressMatch[2] : building.address;
              
              return (
                <div className="building-address-row-inline">
                  {addressNumber && (
                    <span className="building-address-number">{addressNumber}</span>
                  )}
                  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" className="location-icon-inline">
                    <path d="M14.5 0C6.49 0 0 6.49 0 14.5C0 22.51 14.5 29 14.5 29C14.5 29 29 22.51 29 14.5C29 6.49 22.51 0 14.5 0ZM14.5 19.75C11.6 19.75 9.25 17.4 9.25 14.5C9.25 11.6 11.6 9.25 14.5 9.25C17.4 9.25 19.75 11.6 19.75 14.5C19.75 17.4 17.4 19.75 14.5 19.75Z" fill="#7B8190"/>
                  </svg>
                  <p className="building-address-inline">{addressText}</p>
                </div>
              );
            })()}
          </div>
          <div className="building-card-actions">
            <button 
              className="edit-icon-btn" 
              title="Edit building"
              aria-label={`Edit ${building.name || 'building'}`}
              onClick={(e) => {
                e.stopPropagation()
                if (onEdit) {
                  onEdit(building)
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.333 2.00001C11.5084 1.82475 11.7163 1.68607 11.9447 1.59233C12.1731 1.49859 12.4173 1.45178 12.6637 1.45468C12.9101 1.45758 13.1529 1.51013 13.3785 1.60919C13.6041 1.70825 13.8078 1.85165 13.9773 2.03134C14.1469 2.21103 14.2787 2.42318 14.3655 2.65473C14.4523 2.88628 14.4922 3.13249 14.4827 3.37888C14.4732 3.62527 14.4144 3.86691 14.31 4.08801L13.2467 6.33334L9.66667 2.75334L11.333 2.00001ZM8.66667 4.66668L2.66667 10.6667V13.3333H5.33333L11.3333 7.33334L8.66667 4.66668Z" fill="currentColor"/>
              </svg>
            </button>
            <button 
              className="arrow-icon-btn" 
              title="View details"
              aria-label={`View details for ${building.name || 'building'}`}
              onClick={(e) => {
                e.stopPropagation()
                if (onViewDetails) {
                  onViewDetails(building)
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="building-stats-divider"></div>
        <div className="building-stats">
          <div className="stat-item">
            <svg width="22" height="28" viewBox="0 0 22 28" className="stat-icon" aria-hidden>
              <rect x="2" y="6" width="18" height="21" rx="2" stroke="#6BADDC" strokeWidth="3" fill="none"/>
              <rect x="5" y="10" width="4" height="4" rx="1.5" fill="#6BADDC"/>
              <rect x="11" y="10" width="4" height="4" rx="1.5" fill="#6BADDC"/>
              <rect x="5" y="16" width="4" height="4" rx="1.5" fill="#6BADDC"/>
              <rect x="11" y="16" width="4" height="4" rx="1.5" fill="#6BADDC"/>
            </svg>
            <span className="stat-text">Floors: {floorsCount}</span>
          </div>
          <div className="stat-item">
            <svg width="22" height="28" viewBox="0 0 22 28" className="stat-icon" aria-hidden>
              <rect x="2" y="6" width="18" height="21" rx="2" stroke="#6BADDC" strokeWidth="3" fill="none"/>
              <rect x="5" y="10" width="4" height="4" rx="1.5" fill="#6BADDC"/>
              <rect x="11" y="10" width="4" height="4" rx="1.5" fill="#6BADDC"/>
              <rect x="5" y="16" width="4" height="4" rx="1.5" fill="#6BADDC"/>
              <rect x="11" y="16" width="4" height="4" rx="1.5" fill="#6BADDC"/>
            </svg>
            <span className="stat-text">Apartments: {spacesCount}</span>
          </div>
          <div className="stat-item">
            <svg width="22" height="28" viewBox="0 0 22 28" className="stat-icon" aria-hidden>
              <rect x="2" y="6" width="18" height="21" rx="2" stroke="#75788B" strokeWidth="3" fill="none"/>
              <rect x="5" y="10" width="4" height="4" rx="1.5" fill="#75788B"/>
              <rect x="11" y="10" width="4" height="4" rx="1.5" fill="#75788B"/>
              <rect x="5" y="16" width="4" height="4" rx="1.5" fill="#75788B"/>
              <rect x="11" y="16" width="4" height="4" rx="1.5" fill="#75788B"/>
            </svg>
            <span className="stat-text">Rooms: {roomsCount}</span>
          </div>
          <div className="stat-item">
            <svg width="22" height="28" viewBox="0 0 22 28" className="stat-icon" aria-hidden>
              <rect x="2" y="6" width="18" height="21" rx="2" stroke="#75788B" strokeWidth="3" fill="none"/>
              <rect x="5" y="10" width="4" height="4" rx="1.5" fill="#75788B"/>
              <rect x="11" y="10" width="4" height="4" rx="1.5" fill="#75788B"/>
              <rect x="5" y="16" width="4" height="4" rx="1.5" fill="#75788B"/>
              <rect x="11" y="16" width="4" height="4" rx="1.5" fill="#75788B"/>
            </svg>
            <span className="stat-text">Devices: {devicesCount}</span>
          </div>
          <div className="stat-item">
            <div className="online-dot"></div>
            <span className="stat-text">Online dev {onlineDevicesCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

BuildingCard.displayName = 'BuildingCard'

const BuildingsView = ({ buildings, onEditBuilding, onViewBuildingDetails, onToggleMenu, sidebarOpen }) => {
  const memoizedBuildings = useMemo(() => {
    if (!buildings || !Array.isArray(buildings) || buildings.length === 0) {
      return []
    }
    return buildings
  }, [buildings])
  
  if (memoizedBuildings.length === 0) {
    return (
      <div className="buildings-view-empty">
        <p>No buildings available</p>
      </div>
    )
  }
  
  return (
    <div className="buildings-view">
      <div className="buildings-view-header">
        <div className="buildings-header-left">
          {!sidebarOpen && (
            <button 
              className="menu-toggle-btn" 
              onClick={onToggleMenu}
              aria-label="Show menu"
              title="Show menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <h1 className="buildings-title">Buildings ({memoizedBuildings.length})</h1>
        </div>
        <button className="create-building-btn">+ Create a new building</button>
      </div>
      <div className="buildings-grid">
        {memoizedBuildings.map(building => (
          <BuildingCard 
            key={building.id || `building-${building.name}`} 
            building={building}
            onEdit={onEditBuilding}
            onViewDetails={onViewBuildingDetails}
          />
        ))}
      </div>
    </div>
  )
}

export default BuildingsView
