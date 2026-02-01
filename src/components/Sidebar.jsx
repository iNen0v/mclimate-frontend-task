import { useState, useMemo } from 'react'
import { buildSidebarTree } from '../utils/dataTransform'
import './Sidebar.css'
// Icon files were removed from the repo; use inline SVGs instead

const SidebarItem = ({ item, level = 0, selectedId, onSelect, handleItemSelect, selectedBuilding }) => {
  // Buildings parent is expanded, buildings are collapsed by default, sub-items are collapsed
  const [isExpanded, setIsExpanded] = useState(
    item.type === 'buildings-parent'
  )
  const hasChildren = item.children && item.children.length > 0
  
  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(prev => !prev)
    }
    if (onSelect) {
      onSelect(item)
    }
  }
  
  // Check if this item is selected - either by selectedId or if it's a building and matches selectedBuilding
  const isSelected = selectedId === item.id || (item.type === 'building' && selectedBuilding === item.id)
  const iconColor = isSelected ? '#6BADDC' : '#666'
  
  const getIcon = () => {
    const iconColor = isSelected ? '#6BADDC' : '#75788B'
    
    if (item.type === 'buildings-parent') {
      return (
        <span className="sidebar-type-icon">
          <svg width="22" height="29" viewBox="0 0 22 29" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="2" y="6" width="18" height="21" rx="2" stroke={iconColor} strokeWidth="2.5" fill="none"/>
            <rect x="5" y="10" width="4" height="4" rx="0.5" fill={iconColor}/>
            <rect x="11" y="10" width="4" height="4" rx="0.5" fill={iconColor}/>
            <rect x="5" y="16" width="4" height="4" rx="0.5" fill={iconColor}/>
            <rect x="11" y="16" width="4" height="4" rx="0.5" fill={iconColor}/>
            <path d="M2 6L11 2L20 6" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </span>
      )
    }
    if (item.type === 'building') {
      return (
        <span className="sidebar-type-icon">
          <svg width="22" height="29" viewBox="0 0 22 29" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="2" y="6" width="18" height="21" rx="2" stroke={iconColor} strokeWidth="2.5" fill="none"/>
            <rect x="5" y="10" width="4" height="4" rx="0.5" fill={iconColor}/>
            <rect x="11" y="10" width="4" height="4" rx="0.5" fill={iconColor}/>
            <rect x="5" y="16" width="4" height="4" rx="0.5" fill={iconColor}/>
            <rect x="11" y="16" width="4" height="4" rx="0.5" fill={iconColor}/>
            <path d="M2 6L11 2L20 6" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </span>
      )
    }
    if (item.type === 'integrations') {
      return (
        <span className="sidebar-type-icon">
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="13.5" cy="13.5" r="11" stroke={iconColor} strokeWidth="2.5" fill="none"/>
            <circle cx="13.5" cy="13.5" r="7" stroke={iconColor} strokeWidth="2.5" fill="none"/>
            <circle cx="13.5" cy="13.5" r="3" fill={iconColor}/>
          </svg>
        </span>
      )
    }
    // Floor icon - three stacked horizontal lines
    if (item.type === 'floor') {
      return (
        <span className="sidebar-type-icon">
          <svg width="25.5" height="37.5" viewBox="0 0 25.5 37.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="2" y="2" width="21.5" height="10" rx="1.5" stroke={iconColor} strokeWidth="2.5" fill="none" transform="rotate(45 12.75 7)"/>
            <rect x="2" y="12" width="21.5" height="10" rx="1.5" stroke={iconColor} strokeWidth="2.5" fill="none" transform="rotate(45 12.75 17)"/>
            <rect x="2" y="22" width="21.5" height="10" rx="1.5" stroke={iconColor} strokeWidth="2.5" fill="none" transform="rotate(45 12.75 27)"/>
          </svg>
        </span>
      )
    }
    // Space icon - gear/wrench
    if (item.type === 'space') {
      return (
        <span className="sidebar-type-icon">
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12.5 2L15 7L20 7.5L16 11L17 16L12.5 14L8 16L9 11L5 7.5L10 7L12.5 2Z" stroke={iconColor} strokeWidth="2.5" fill="none"/>
            <circle cx="12.5" cy="12.5" r="3" stroke={iconColor} strokeWidth="2.5" fill="none"/>
          </svg>
        </span>
      )
    }
    // Room icon - document/room
    if (item.type === 'room') {
      return (
        <span className="sidebar-type-icon">
          <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="2" y="6" width="18" height="20" rx="2" stroke={iconColor} strokeWidth="2.5" fill="none"/>
            <path d="M7 2L7 6H15V2" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round"/>
            <rect x="6" y="11" width="10" height="2" rx="1" fill={iconColor}/>
            <rect x="6" y="15" width="10" height="2" rx="1" fill={iconColor}/>
            <rect x="6" y="19" width="6" height="2" rx="1" fill={iconColor}/>
          </svg>
        </span>
      )
    }
    if (!hasChildren) return null
    return null
  }
  
  return (
    <div className="sidebar-item-wrapper">
      <div
        className={`sidebar-item ${isSelected ? 'selected' : ''}`}
        style={{ 
          paddingLeft: `${20 + level * 20}px`
        }}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-label={`${item.name}${hasChildren ? `, ${isExpanded ? 'expanded' : 'collapsed'}` : ''}`}
      >
        {getIcon()}
        <span className="sidebar-item-name" style={{ color: isSelected ? '#6BADDC' : '#75788B' }}>{item.name}</span>
        {hasChildren && (
          <span className="sidebar-expand-icon" style={{ color: isSelected ? '#6BADDC' : '#75788B' }}>
            {isExpanded ? '^' : 'v'}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="sidebar-children">
          {item.children.map(child => (
            <SidebarItem
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={handleItemSelect || onSelect}
              handleItemSelect={handleItemSelect}
              selectedBuilding={selectedBuilding}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Sidebar = ({ buildings, selectedBuilding, onSelectBuilding, onViewChange, currentView, isOpen = true, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  
  const tree = useMemo(() => {
    if (!buildings || !Array.isArray(buildings) || buildings.length === 0) {
      return []
    }
    try {
      return buildSidebarTree(buildings)
    } catch (error) {
      console.error('Error building sidebar tree:', error)
      return []
    }
  }, [buildings])
  
  const handleItemSelect = (item) => {
    if (item.type === 'building') {
      onSelectBuilding(item.id)
      onViewChange('buildings')
      setSelectedId(null) // Clear selectedId when building is selected
    } else if (item.type === 'floor' || item.type === 'space' || item.type === 'room') {
      // Select floor, space, or room items
      setSelectedId(item.id)
    }
  }
  
  const handleBuildingsParentSelect = (item) => {
    if (item && item.type === 'buildings-parent') {
      onSelectBuilding(null)
      onViewChange('buildings')
      setSelectedId(null)
    }
  }
  
  const buildingsCount = buildings?.length || 0
  
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${!isOpen ? 'hidden' : ''}`}>
      <div className="sidebar-top-header">
        <button 
          className="enterprise-button"
          onClick={() => onViewChange('enterprise')}
          aria-label="Enterprise"
        >
          <div className="logo-circle">
            <span className="logo-letter">M</span>
          </div>
          {!isCollapsed && (
            <div className="logo-text">
              <div className="logo-enterprise">Enterprise</div>
              <div className="logo-by">by MClimate</div>
            </div>
          )}
        </button>
        <div className="sidebar-header-actions">
          <button className="bell-icon-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C8.9 2 8 2.9 8 4V5.58C6.27 6.25 5 7.9 5 9.79V14H4C3.45 14 3 14.45 3 15C3 15.55 3.45 16 4 16H16C16.55 16 17 15.55 17 15C17 14.45 16.55 14 16 14H15V9.79C15 7.9 13.73 6.25 12 5.58V4C12 2.9 11.1 2 10 2ZM10 18C11.1 18 12 17.1 12 16H8C8 17.1 8.9 18 10 18Z" fill="currentColor"/>
            </svg>
            <span className="notification-dot"></span>
          </button>
          <button 
            className="collapse-btn" 
            onClick={() => {
              if (onToggle) {
                onToggle()
              } else {
                setIsCollapsed(!isCollapsed)
              }
            }}
            aria-label={!isOpen ? "Show sidebar" : "Hide sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="sidebar-header">
        <div className="sidebar-tabs">
          <button 
            className={`sidebar-tab ${currentView === 'enterprise' ? 'active' : ''}`}
            onClick={() => {
              // Could add enterprise view if needed
            }}
            aria-label="Enterprise view"
          >
            Enterprise
          </button>
          <button 
            className={`sidebar-tab ${currentView === 'buildings' ? 'active' : ''}`}
            onClick={() => onViewChange('buildings')}
          >
            Buildings ({buildingsCount})
          </button>
        </div>
        <div className="sidebar-search">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
            <path d="M13 13L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search..." className="search-input-sidebar" />
        </div>
      </div>
      <div className="sidebar-content">
        {tree.length === 0 ? (
          <div className="sidebar-empty">No buildings found</div>
        ) : (
          <>
            <SidebarItem
              item={{
                id: 'buildings-parent',
                name: 'Buildings',
                type: 'buildings-parent',
                children: tree
              }}
              selectedId={selectedId || (selectedBuilding ? null : 'buildings-parent')}
              onSelect={handleBuildingsParentSelect}
              handleItemSelect={handleItemSelect}
              selectedBuilding={selectedBuilding}
            />
            <div className="sidebar-divider"></div>
            <div className="sidebar-section-title">DASHBOARDS</div>
            <div className="sidebar-dashboard-card">
              <div className="sidebar-dashboard-illustration">
                <svg width="142" height="142" viewBox="0 0 142 142" fill="none">
                  <rect width="142" height="142" rx="8" fill="#EFF8FD"/>
                  <circle cx="71" cy="40" r="10" fill="#42C1F4"/>
                  <rect x="30" y="70" width="82" height="5" rx="2.5" fill="#64D3FF"/>
                  <rect x="30" y="82" width="60" height="5" rx="2.5" fill="#42C1F4"/>
                  <rect x="30" y="94" width="70" height="5" rx="2.5" fill="#64D3FF"/>
                  <circle cx="105" cy="105" r="15" fill="#7CD194"/>
                  <path d="M98 105L102 109L112 99" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="20" y="20" width="20" height="20" rx="2" fill="#64D3FF" opacity="0.6"/>
                  <rect x="45" y="20" width="20" height="20" rx="2" fill="#42C1F4" opacity="0.6"/>
                </svg>
              </div>
              <p className="sidebar-dashboard-empty-text">You have not created any dashboards for your building</p>
              <button className="add-dashboard-btn">
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none">
                  <circle cx="15.5" cy="15.5" r="15.5" fill="url(#dashboard-gradient)"/>
                  <path d="M15.5 10V21M10 15.5H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="dashboard-gradient" x1="0" y1="0" x2="31" y2="31" gradientUnits="userSpaceOnUse">
                      <stop offset="0.2415" stopColor="#4AADEA"/>
                      <stop offset="0.2415" stopColor="#4AACEA"/>
                      <stop offset="0.7817" stopColor="#2871E9"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>Add a new dashboard</span>
              </button>
            </div>
            <div className="sidebar-divider"></div>
            <SidebarItem
              item={{
                id: 'integrations',
                name: 'Integrations',
                type: 'integrations',
                children: null
              }}
              selectedId={null}
              onSelect={(item) => {
                // Handle integrations click if needed
              }}
            />
          </>
        )}
      </div>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">YN</div>
          <div className="user-info">
            <div className="user-name">Your...</div>
          </div>
          <button className="user-dropdown">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
