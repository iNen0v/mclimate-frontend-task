import { useMemo, useState, useCallback, useEffect, memo } from 'react'
import { extractAllDevices, groupDevicesByType } from '../utils/dataTransform'
import './DevicesView.css'

const DeviceRow = memo(({ device, isOffline, isSelected, onSelect }) => {
  const isOnline = device.isOnline !== false // Assume online if not specified
  const rowColor = isOffline ? '#AFB5BC' : '#4A5056'
  const deviceId = device.id || device.serialNumber || `device-${device.name}`
  
  return (
    <tr className="device-row" style={{ color: rowColor }}>
      <td className="device-cell">
        <button className="eye-icon-btn" aria-label="View device">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 12C14 12 10.5 14.5 9 18C10.5 21.5 14 24 18 24C22 24 25.5 21.5 27 18C25.5 14.5 22 12 18 12ZM18 22C16.34 22 15 20.66 15 19C15 17.34 16.34 16 18 16C19.66 16 21 17.34 21 19C21 20.66 19.66 22 18 22Z" fill="#75788B"/>
          </svg>
        </button>
      </td>
      <td className="device-cell">
        <input 
          type="checkbox" 
          className="table-checkbox" 
          checked={isSelected}
          onChange={(e) => onSelect && onSelect(deviceId, e.target.checked)}
          aria-label={`Select device ${device.name || device.serialNumber || 'N/A'}`}
        />
      </td>
      <td className="device-cell device-name-cell">
        <div className="device-name-wrapper">
          <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
          <span>{device.name || 'N/A'}</span>
        </div>
      </td>
      <td className="device-cell">
        {device.targetTemperature !== undefined ? `${device.targetTemperature}°C` : 'N/A'}
      </td>
      <td className="device-cell">
        {device.temperature !== undefined ? `${device.temperature}°C` : 'N/A'}
      </td>
      <td className="device-cell">
        {device.humidity !== undefined ? `${device.humidity}%` : 'N/A'}
      </td>
      <td className="device-cell">
        {device.valveOpening !== undefined ? `${device.valveOpening}%` : 'N/A'}
      </td>
      <td className="device-cell">
        {device.battery !== undefined ? `${device.battery} V` : 'N/A'}
      </td>
      <td className="device-cell">
        {device.openWindow !== undefined ? (device.openWindow ? 'Detected' : 'Not detected') : 'N/A'}
      </td>
      <td className="device-cell devEUI">
        {device.devEUI || device.serialNumber || 'N/A'}
      </td>
    </tr>
  )
})

DeviceRow.displayName = 'DeviceRow'

const DeviceTable = memo(({ deviceType, devices, selectedDevices, onSelectDevice, onSelectAll }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const deviceIds = devices.map(d => d.id || d.serialNumber || `device-${d.name}`)
  const allSelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.has(id))
  const someSelected = deviceIds.some(id => selectedDevices.has(id))
  
  const handleSelectAll = (e) => {
    e.stopPropagation()
    if (onSelectAll) {
      onSelectAll(deviceIds, !allSelected)
    }
  }
  
  return (
    <div className="device-table-container">
      <div 
        className="device-table-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${deviceType} device group, ${devices.length} devices, ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        <h3 className="device-type-title">
          {deviceType}
          <span className="device-count-badge">{devices.length}</span>
        </h3>
        <svg className="expand-icon" width="27" height="27" viewBox="0 0 27 27" fill="none" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
          <path d="M13.5 9L18 13.5L9 13.5L13.5 9Z" fill="#6BADDC" fillRule="evenodd"/>
        </svg>
      </div>
      {isExpanded && (
        <div className="device-table-wrapper">
          <table className="device-table">
            <thead>
              <tr>
                <th></th>
                <th>
                  <input 
                    type="checkbox" 
                    className="table-checkbox" 
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected && !allSelected
                    }}
                    onChange={handleSelectAll}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Select all devices"
                  />
                </th>
                <th>Device name</th>
                <th>Target t°</th>
                <th>Measured t°</th>
                <th>Humidity</th>
                <th>Valve opening</th>
                <th>Battery</th>
                <th>Open Window</th>
                <th>DevEUI</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => {
                const deviceId = device.id || device.serialNumber || `device-${index}`
                return (
                  <DeviceRow 
                    key={deviceId} 
                    device={device}
                    index={index}
                    isOffline={index % 4 === 1} // Simulate some offline devices
                    isSelected={selectedDevices.has(deviceId)}
                    onSelect={onSelectDevice}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
})

DeviceTable.displayName = 'DeviceTable'

const DevicesView = ({ buildings }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedDevices, setSelectedDevices] = useState(new Set())
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  const allDevices = useMemo(() => {
    if (!buildings || buildings.length === 0) return []
    return extractAllDevices(buildings)
  }, [buildings])
  
  const filteredDevices = useMemo(() => {
    if (!debouncedSearch.trim()) return allDevices
    const term = debouncedSearch.toLowerCase()
    return allDevices.filter(device => {
      return (
        (device.name && device.name.toLowerCase().includes(term)) ||
        (device.serialNumber && device.serialNumber.toLowerCase().includes(term)) ||
        (device.deviceType && device.deviceType.toLowerCase().includes(term)) ||
        (device.locationPath && device.locationPath.toLowerCase().includes(term))
      )
    })
  }, [allDevices, debouncedSearch])
  
  const groupedDevices = useMemo(() => {
    return groupDevicesByType(filteredDevices)
  }, [filteredDevices])
  
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])
  
  const handleSelectDevice = useCallback((deviceId, isSelected) => {
    setSelectedDevices(prev => {
      const newSet = new Set(prev)
      if (isSelected) {
        newSet.add(deviceId)
      } else {
        newSet.delete(deviceId)
      }
      return newSet
    })
  }, [])
  
  const handleSelectAll = useCallback((deviceIds, isSelected) => {
    setSelectedDevices(prev => {
      const newSet = new Set(prev)
      if (isSelected) {
        deviceIds.forEach(id => newSet.add(id))
      } else {
        deviceIds.forEach(id => newSet.delete(id))
      }
      return newSet
    })
  }, [])
  
  const handleClearSelection = useCallback(() => {
    setSelectedDevices(new Set())
  }, [])
  
  if (allDevices.length === 0) {
    return (
      <div className="devices-view-empty">
        <p>No devices found</p>
      </div>
    )
  }
  
  const deviceTypes = Object.keys(groupedDevices).sort()
  
  return (
    <div className="devices-view">
      <div className="devices-view-header">
        <div className="devices-tabs">
          <button className="devices-tab active">All devices</button>
          <button className="devices-tab">Rooms</button>
        </div>
        <div className="devices-subtabs">
          <button className="devices-subtab active">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginRight: '8px', flexShrink: 0 }}>
              <path d="M14 4L4 10V24L14 18L24 24V10L14 4Z" fill="#6BADDC"/>
            </svg>
            Main view
          </button>
          <button className="devices-subtab">Networking</button>
          <button className="devices-subtab">Battery health</button>
          <button className="devices-subtab">Structure</button>
          <button className="devices-subtab">
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none" style={{ marginRight: '8px', flexShrink: 0 }}>
              <path d="M18.5 4L22 14L32 17.5L22 21L18.5 31L15 21L5 17.5L15 14L18.5 4Z" fill="#6BADDC"/>
            </svg>
            Custom view
          </button>
          <button className="devices-subtab-add">
            <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
              <circle cx="19.5" cy="19.5" r="19.5" fill="#6BADDC"/>
              <path d="M19.5 12V27M12 19.5H27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="devices-actions-bar">
        <div className="search-container">
          <svg className="search-icon" width="38" height="38" viewBox="0 0 38 38" fill="none">
            <circle cx="19" cy="19" r="17" stroke="#4B5157" strokeWidth="2"/>
            <path d="M26 26L32 32" stroke="#4B5157" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search devices"
          />
        </div>
        <div className="devices-action-buttons">
          <button className="action-button filter">
            <span>Filter</span>
            <span className="badge">0</span>
          </button>
          <button className="export-btn">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" style={{ flexShrink: 0 }}>
              <path d="M8.33 8.33H29.67V29.67H8.33V8.33Z" stroke="#4A5056" strokeWidth="2"/>
              <path d="M12.5 12.5H25.5V25.5H12.5V12.5Z" stroke="#4A5056" strokeWidth="2"/>
            </svg>
            <span>Export</span>
          </button>
          <button className="add-device-btn">+ Add new device</button>
        </div>
      </div>
      
      <div className="devices-content">
        {deviceTypes.length === 0 ? (
          <div className="devices-view-empty">
            <p>No devices match your search</p>
          </div>
        ) : (
          deviceTypes.map(deviceType => (
            <DeviceTable
              key={deviceType}
              deviceType={deviceType}
              devices={groupedDevices[deviceType]}
              selectedDevices={selectedDevices}
              onSelectDevice={handleSelectDevice}
              onSelectAll={handleSelectAll}
            />
          ))
        )}
      </div>
      {selectedDevices.size > 0 && (
        <div className="floating-action-bar">
          <div className="floating-action-bar-text">
            {selectedDevices.size} device{selectedDevices.size !== 1 ? 's' : ''} selected
          </div>
          <div className="floating-action-bar-actions">
            <button className="floating-action-bar-btn manage" aria-label="Manage">
              <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
                <circle cx="27" cy="27" r="25" stroke="#6BADDC" strokeWidth="2" fill="none"/>
                <path d="M27 18V36M18 27H36" stroke="#6BADDC" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="floating-action-bar-btn fuota" aria-label="FUOTA">
              <svg width="61" height="61" viewBox="0 0 61 61" fill="none">
                <rect x="5" y="5" width="51" height="51" rx="8" stroke="#6BADDC" strokeWidth="2" fill="none"/>
                <path d="M20 30.5L27 37.5L41 23.5" stroke="#6BADDC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="floating-action-bar-btn move" aria-label="Move">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <path d="M28 8L36 20H20L28 8Z" stroke="#6BADDC" strokeWidth="2" fill="none"/>
                <path d="M28 48L36 36H20L28 48Z" stroke="#6BADDC" strokeWidth="2" fill="none"/>
                <path d="M8 28L20 20V36L8 28Z" stroke="#6BADDC" strokeWidth="2" fill="none"/>
                <path d="M48 28L36 20V36L48 28Z" stroke="#6BADDC" strokeWidth="2" fill="none"/>
              </svg>
            </button>
            <button className="floating-action-bar-btn delete" aria-label="Delete" onClick={handleClearSelection}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M11 11L33 33M33 11L11 33" stroke="#6BADDC" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DevicesView
