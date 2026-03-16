/**
 * SOS Handlers
 * Emergency features: SOS modal, location sharing, emergency contacts
 */

// SOS handlers
window.openSOS = async () => {
  window.setState({ showSOS: true });
  try {
    const { triggerSOSTip } = await import('../services/contextualTips.js');
    triggerSOSTip();
  } catch (e) { /* no-op */ }
};
window.closeSOS = () => window.setState({ showSOS: false });

// Missing handlers (prevent ReferenceError on click)
window.openAccessibilityHelp = () => window.setState({ showAccessibilityHelp: true })
window.showFriendOptions = () => window.showToast(window.t('friendOptionsSoon') || 'Options ami bientôt disponibles', 'info')
window.showFullNavigation = () => window.changeTab('map')
// SOS fallbacks — overridden by SOS.js when modal loads
if (!window.shareSOSLocation) {
  window.shareSOSLocation = () => {
    const t = window.t
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const url = `https://www.google.com/maps?q=${latitude},${longitude}`
          if (navigator.share) {
            navigator.share({ title: 'SOS SpotHitch', text: t('sosShareText') || 'Position urgence', url })
          } else {
            navigator.clipboard?.writeText(url).catch(() => {})
            window.showToast(t('linkCopied') || 'Lien copié !', 'success')
          }
        },
        () => window.showToast(t('positionFailed') || 'Position indisponible', 'error')
      )
    }
  }
}
if (!window.markSafe) {
  window.markSafe = () => {
    const t = window.t
    window.setState({ sosActive: false })
    window.showToast(t('markedSafe') || 'Marqué en sécurité', 'success')
  }
}
if (!window.addEmergencyContact) {
  window.addEmergencyContact = () => {
    const t = window.t
    const name = document.getElementById('emergency-name')?.value
    const phone = document.getElementById('emergency-phone')?.value
    if (!name || !phone) { window.showToast(t('fillNameAndNumber') || 'Nom et numéro requis', 'warning'); return }
    const { emergencyContacts = [] } = window.getState()
    window.setState({ emergencyContacts: [...emergencyContacts, { name, phone }] })
    document.getElementById('emergency-name').value = ''
    document.getElementById('emergency-phone').value = ''
    window.showToast(t('contactAdded') || 'Contact ajouté !', 'success')
  }
}
if (!window.removeEmergencyContact) {
  window.removeEmergencyContact = (index) => {
    const { emergencyContacts = [] } = window.getState()
    window.setState({ emergencyContacts: emergencyContacts.filter((_, i) => i !== index) })
  }
}
