/**
 * Miscellaneous Settings Handlers
 * Webhooks, push notifications, form persistence
 */

// Webhook handlers
window.openAddWebhook = async () => {
  const t = window.t
  const { scheduleRender } = window._appInternals
  const { addWebhook, WEBHOOK_TYPES } = await import('../services/webhooks.js');
  const url = prompt(t('webhookURL') || 'URL du webhook (Discord/Telegram/Slack):');
  if (!url) return;
  const type = url.includes('discord') ? WEBHOOK_TYPES.DISCORD
    : url.includes('telegram') ? WEBHOOK_TYPES.TELEGRAM
    : url.includes('slack') ? WEBHOOK_TYPES.SLACK
    : WEBHOOK_TYPES.CUSTOM;
  addWebhook({ type, url, name: type.charAt(0).toUpperCase() + type.slice(1) + ' Webhook' });
  scheduleRender(() => window._appInternals.render());
};
window.toggleWebhookAction = async (id) => {
  const { scheduleRender } = window._appInternals
  const { toggleWebhook } = await import('../services/webhooks.js');
  toggleWebhook(id);
  scheduleRender(() => window._appInternals.render());
};
window.removeWebhookAction = async (id) => {
  const { scheduleRender } = window._appInternals
  const { removeWebhook } = await import('../services/webhooks.js');
  removeWebhook(id);
  scheduleRender(() => window._appInternals.render());
};

// Form persistence handler
window.clearFormDraft = async (formId) => {
  const { scheduleRender } = window._appInternals
  const { clearDraft } = await import('../utils/formPersistence.js');
  clearDraft(formId);
  scheduleRender(() => window._appInternals.render());
};

// ==================== PUSH NOTIFICATION HANDLERS ====================

window.togglePushNotifications = async () => {
  const t = window.t
  const { scheduleRender } = window._appInternals
  const { isPushEnabled, enablePushNotifications, disablePushNotifications } = await import('../services/pushNotifications.js')
  if (isPushEnabled()) {
    disablePushNotifications()
    window.showToast(t('pushDisabled') || 'Notifications push désactivées', 'info')
  } else {
    const result = await enablePushNotifications()
    if (result.success) {
      window.showToast(t('pushEnabled') || 'Notifications push activées', 'success')
    } else {
      window.showToast(t('pushDenied') || 'Notifications refusées par le navigateur', 'warning')
    }
  }
  scheduleRender(() => window._appInternals.render())
}
