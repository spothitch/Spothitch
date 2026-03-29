/**
 * SOS Handlers — Lazy-load stubs
 * Full versions are defined in SOS.js (loaded when modal opens).
 * These stubs ensure the handlers exist before the modal is loaded.
 */

// SOS open/close
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

// SOS fallback stubs — overridden by SOS.js when modal loads
if (!window.shareSOSLocation) window.shareSOSLocation = () => window.openSOS?.()
if (!window.markSafe) window.markSafe = () => window.setState?.({ sosActive: false, showSOS: false })
if (!window.addEmergencyContact) window.addEmergencyContact = () => {}
if (!window.removeEmergencyContact) window.removeEmergencyContact = () => {}
