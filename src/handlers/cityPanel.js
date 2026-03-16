/**
 * City Panel Handlers
 * Open/close city panels, select routes, view spots on map
 */

// City Panel handlers
window.openCityPanel = async (citySlug, cityName, lat, lng, countryCode, countryName) => {
  const { actions } = window._appInternals
  const parsedLat = parseFloat(lat)
  const parsedLng = parseFloat(lng)

  // Force-load the country's spots before building city info
  try {
    const { loadSpotsInBounds, getAllLoadedSpots } = await import('../services/spotLoader.js')
    await loadSpotsInBounds({
      north: parsedLat + 3,
      south: parsedLat - 3,
      east: parsedLng + 3,
      west: parsedLng - 3,
    })
    // Merge newly loaded spots into state
    const allLoaded = getAllLoadedSpots()
    const current = window.getState().spots || []
    const existingIds = new Set(current.map(s => s.id))
    const newSpots = allLoaded.filter(s => !existingIds.has(s.id))
    if (newSpots.length > 0) {
      actions.setSpots([...current, ...newSpots])
    }
  } catch (e) {
    console.warn('Failed to load spots for city panel:', e)
  }

  const { buildCityInfo } = await import('../services/cityRoutes.js')
  const { spots } = window.getState()
  const cityInfo = buildCityInfo(spots, cityName, parsedLat, parsedLng, countryCode, countryName)

  // Always show city panel — even with 0 spots (guide info is still useful)
  const panelData = cityInfo || {
    name: cityName,
    slug: citySlug,
    lat: parsedLat,
    lng: parsedLng,
    country: countryCode || '',
    countryName: countryName || '',
    spotCount: 0,
    avgWait: 0,
    avgRating: 0,
    routesList: [],
    spots: [],
  }
  window.setState({ selectedCity: citySlug, cityData: panelData, selectedRoute: null })
  if (window.homeMapInstance) {
    window.homeMapInstance.flyTo({ center: [parsedLng, parsedLat], zoom: 11 })
  }
}
window.closeCityPanel = () => window.setState({ selectedCity: null, selectedRoute: null, cityData: null })
window.selectCityRoute = (citySlug, routeSlug) => {
  window.setState({ selectedRoute: routeSlug })
  const { cityData } = window.getState()
  if (cityData) {
    const route = cityData.routesList?.find(r => r.slug === routeSlug)
    if (route && window.homeMapInstance) {
      window.homeMapInstance.flyTo({ center: [route.destLon, route.destLat], zoom: 12 })
    }
  }
}
window.viewCitySpotsOnMap = () => {
  const { cityData } = window.getState()
  if (cityData && window.homeMapInstance) {
    window.homeMapInstance.flyTo({ center: [cityData.lng, cityData.lat], zoom: 13 })
    window.setState({ selectedCity: null, selectedRoute: null, cityData: null })
  }
}
