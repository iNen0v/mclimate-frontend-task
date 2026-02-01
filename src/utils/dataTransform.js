// Recursively count items in the hierarchy
export const countItems = (item, type) => {
  if (!item) return 0
  
  let count = 0
  
  if (type === 'floors') {
    count = item.floors?.length || 0
    if (item.floors) {
      item.floors.forEach(floor => {
        count += countItems(floor, 'floors')
      })
    }
  } else if (type === 'spaces') {
    count = item.spaces?.length || 0
    if (item.floors) {
      item.floors.forEach(floor => {
        count += countItems(floor, 'spaces')
      })
    }
    if (item.spaces) {
      item.spaces.forEach(space => {
        count += countItems(space, 'spaces')
      })
    }
  } else if (type === 'rooms') {
    count = item.rooms?.length || 0
    if (item.spaces) {
      item.spaces.forEach(space => {
        count += countItems(space, 'rooms')
      })
    }
    if (item.rooms) {
      item.rooms.forEach(room => {
        count += countItems(room, 'rooms')
      })
    }
  } else if (type === 'devices') {
    count = item.devices?.length || 0
    if (item.floors) {
      item.floors.forEach(floor => {
        count += countItems(floor, 'devices')
      })
    }
    if (item.spaces) {
      item.spaces.forEach(space => {
        count += countItems(space, 'devices')
      })
    }
    if (item.rooms) {
      item.rooms.forEach(room => {
        count += countItems(room, 'devices')
      })
    }
  }
  
  return count
}

// Recursively count online devices
export const countOnlineDevices = (item) => {
  if (!item) return 0
  
  let count = 0
  
  if (item.devices) {
    count = item.devices.filter(device => device.isOnline === true).length
  }
  
  if (item.floors) {
    item.floors.forEach(floor => {
      count += countOnlineDevices(floor)
    })
  }
  
  if (item.spaces) {
    item.spaces.forEach(space => {
      count += countOnlineDevices(space)
    })
  }
  
  if (item.rooms) {
    item.rooms.forEach(room => {
      count += countOnlineDevices(room)
    })
  }
  
  return count
}

// Extract all devices from buildings and add location info
export const extractAllDevices = (buildings) => {
  const devices = []
  
  const traverse = (item, path = []) => {
    if (item.devices && item.devices.length > 0) {
      item.devices.forEach(device => {
        devices.push({
          ...device,
          buildingId: path[0]?.id,
          buildingName: path[0]?.name,
          locationPath: path.map(p => p.name).join(' > ')
        })
      })
    }
    
    if (item.floors) {
      item.floors.forEach(floor => {
        traverse(floor, [...path, { id: item.id, name: item.name }, { id: floor.id, name: floor.name }])
      })
    }
    
    if (item.spaces) {
      item.spaces.forEach(space => {
        traverse(space, [...path, { id: item.id, name: item.name }, { id: space.id, name: space.name }])
      })
    }
    
    if (item.rooms) {
      item.rooms.forEach(room => {
        traverse(room, [...path, { id: item.id, name: item.name }, { id: room.id, name: room.name }])
      })
    }
  }
  
  buildings.forEach(building => {
    traverse(building, [{ id: building.id, name: building.name }])
  })
  
  return devices
}

// Group devices by their type
export const groupDevicesByType = (devices) => {
  const grouped = {}
  
  devices.forEach(device => {
    const type = device.deviceType || 'Unknown'
    if (!grouped[type]) {
      grouped[type] = []
    }
    grouped[type].push(device)
  })
  
  return grouped
}

// Build tree structure for sidebar (buildings -> floors -> spaces -> rooms, devices excluded)
export const buildSidebarTree = (buildings) => {
  return buildings.map(building => ({
    id: building.id,
    name: building.name,
    type: 'building',
    children: buildChildrenTree(building)
  }))
}

const buildChildrenTree = (item) => {
  const children = []
  
  if (item.floors && item.floors.length > 0) {
    item.floors.forEach(floor => {
      children.push({
        id: floor.id,
        name: floor.name,
        type: 'floor',
        children: buildChildrenTree(floor)
      })
    })
  }
  
  if (item.spaces && item.spaces.length > 0) {
    item.spaces.forEach(space => {
      children.push({
        id: space.id,
        name: space.name,
        type: 'space',
        children: buildChildrenTree(space)
      })
    })
  }
  
  if (item.rooms && item.rooms.length > 0) {
    item.rooms.forEach(room => {
      children.push({
        id: room.id,
        name: room.name,
        type: 'room',
        children: buildChildrenTree(room)
      })
    })
  }
  
  // Devices should NOT appear in the sidebar (as per requirements)
  // Devices are only shown in the Devices Table View
  
  return children.length > 0 ? children : null
}
