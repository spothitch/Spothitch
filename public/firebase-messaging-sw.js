/**
 * Firebase Cloud Messaging Service Worker
 * Handles push notifications in the background
 */

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyAQ7-VOm2mgqINlp8HOcOt7TWpioy06E5c',
  authDomain: 'spothitch.firebaseapp.com',
  projectId: 'spothitch',
  storageBucket: 'spothitch.firebasestorage.app',
  messagingSenderId: '314974309234',
  appId: '1:314974309234:web:88a3bf8a027e353c3b6beb',
})

const messaging = firebase.messaging()

// Mini i18n for action buttons (SW has no access to the app's i18n system)
const SW_LABELS = {
  fr: { checkin: 'Je vais bien', alert: 'Envoyer une alerte' },
  en: { checkin: "I'm safe", alert: 'Send alert' },
  es: { checkin: 'Estoy bien', alert: 'Enviar alerta' },
  de: { checkin: 'Mir geht es gut', alert: 'Alarm senden' },
}
function getLabels() {
  const lang = (self.navigator?.language || 'en').slice(0, 2)
  return SW_LABELS[lang] || SW_LABELS.en
}

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {}
  const data = payload.data || {}

  const title = notification.title || 'SpotHitch'
  const options = {
    body: notification.body || '',
    icon: notification.icon || '/icon-192.png',
    badge: '/icon-96.png',
    tag: data.tag || 'spothitch-notification',
    data: { url: data.url || '/', ...data },
    vibrate: data.type === 'guardian_overdue'
      ? [500, 200, 500, 200, 500, 200, 500]
      : [100, 50, 100],
    requireInteraction: data.type === 'guardian_overdue',
  }

  // Add translated action buttons for guardian overdue alerts
  if (data.type === 'guardian_overdue') {
    const labels = getLabels()
    options.actions = [
      { action: 'checkin', title: labels.checkin },
      { action: 'alert', title: labels.alert },
    ]
  }

  self.registration.showNotification(title, options)
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data || {}
  const action = event.action

  // Handle guardian mode actions
  if (action === 'checkin') {
    // Open app with check-in action
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        const appClient = clients.find((c) => c.url.includes(self.location.origin))
        if (appClient) {
          appClient.focus()
          appClient.postMessage({ type: 'GUARDIAN_CHECKIN' })
        } else {
          self.clients.openWindow('/?guardian=checkin')
        }
      })
    )
    return
  }

  if (action === 'alert') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        const appClient = clients.find((c) => c.url.includes(self.location.origin))
        if (appClient) {
          appClient.focus()
          appClient.postMessage({ type: 'GUARDIAN_ALERT' })
        } else {
          self.clients.openWindow('/?guardian=alert')
        }
      })
    )
    return
  }

  // Default: open the URL from data
  const urlToOpen = data.url || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const appClient = clients.find((c) => c.url.includes(self.location.origin))
      if (appClient) {
        appClient.focus()
        if (urlToOpen !== '/') {
          appClient.navigate(urlToOpen)
        }
      } else {
        self.clients.openWindow(urlToOpen)
      }
    })
  )
})
