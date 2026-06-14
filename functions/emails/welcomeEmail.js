/**
 * Welcome Email — sent when a new user signs up
 * Multilingual: FR, EN, ES, DE (based on user's app language)
 */

const { sendEmail } = require('./sendEmail')

const TEMPLATES = {
  fr: {
    subject: 'Bienvenue sur SpotHitch',
    greeting: 'Salut',
    welcome: 'Bienvenue dans la communauté SpotHitch !',
    intro: 'Tu fais maintenant partie de la communauté des autostoppeurs. Voici comment bien démarrer :',
    step1: 'Explore la carte pour trouver les meilleurs spots de stop près de toi',
    step2: 'Ajoute ton premier spot pour aider la communauté',
    step3: 'Active le Mode Gardien pour voyager en sécurité',
    step4: 'Consulte les guides pays pour préparer ton prochain voyage',
    cta: 'Ouvrir SpotHitch',
    footer: 'Bon voyage et bonne route !',
    team: "L'équipe SpotHitch",
    unsub: 'Tu reçois cet email car tu as créé un compte sur spothitch.com',
  },
  en: {
    subject: 'Welcome to SpotHitch',
    greeting: 'Hi',
    welcome: 'Welcome to the SpotHitch community!',
    intro: "You're now part of the hitchhiking community. Here's how to get started:",
    step1: 'Explore the map to find the best hitchhiking spots near you',
    step2: 'Add your first spot to help the community',
    step3: 'Activate Guardian Mode to travel safely',
    step4: 'Check the country guides to prepare your next trip',
    cta: 'Open SpotHitch',
    footer: 'Happy travels and safe roads!',
    team: 'The SpotHitch Team',
    unsub: 'You received this email because you created an account on spothitch.com',
  },
  es: {
    subject: 'Bienvenido a SpotHitch',
    greeting: 'Hola',
    welcome: 'Bienvenido a la comunidad SpotHitch!',
    intro: 'Ahora formas parte de la comunidad de autoestopistas. Asi puedes empezar:',
    step1: 'Explora el mapa para encontrar los mejores puntos de autostop cerca de ti',
    step2: 'Agrega tu primer spot para ayudar a la comunidad',
    step3: 'Activa el Modo Guardian para viajar con seguridad',
    step4: 'Consulta las guias por pais para preparar tu proximo viaje',
    cta: 'Abrir SpotHitch',
    footer: 'Buen viaje y buena ruta!',
    team: 'El equipo SpotHitch',
    unsub: 'Recibiste este correo porque creaste una cuenta en spothitch.com',
  },
  de: {
    subject: 'Willkommen bei SpotHitch',
    greeting: 'Hallo',
    welcome: 'Willkommen in der SpotHitch Community!',
    intro: 'Du bist jetzt Teil der Tramper-Community. So startest du am besten:',
    step1: 'Entdecke die Karte und finde die besten Tramperstellen in deiner Nahe',
    step2: 'Fuge deinen ersten Spot hinzu, um der Community zu helfen',
    step3: 'Aktiviere den Wachter-Modus, um sicher zu reisen',
    step4: 'Schau dir die Landerguides an, um deine nachste Reise vorzubereiten',
    cta: 'SpotHitch offnen',
    footer: 'Gute Reise und sichere Strassen!',
    team: 'Das SpotHitch Team',
    unsub: 'Du erhaltst diese E-Mail, weil du ein Konto auf spothitch.com erstellt hast',
  },
}

/**
 * Build welcome email HTML
 * @param {string} name - User display name
 * @param {string} lang - Language code (fr, en, es, de)
 * @returns {{ subject: string, html: string }}
 */
function buildWelcomeEmail(name, lang = 'en') {
  const t = TEMPLATES[lang] || TEMPLATES.en
  const displayName = name || t.greeting

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f1b2d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <!-- Header -->
    <div style="text-align:center;padding:24px 0">
      <div style="font-size:28px;font-weight:800;color:#f0a830;letter-spacing:-0.5px">SpotHitch</div>
      <div style="font-size:13px;color:#94a3b8;margin-top:4px">The hitchhiking community</div>
    </div>

    <!-- Card -->
    <div style="background:#1e293b;border-radius:16px;padding:32px 24px;border:1px solid #334155">
      <h1 style="color:#f8fafc;font-size:22px;font-weight:700;margin:0 0 8px">${t.greeting} ${escapeHtml(displayName)} !</h1>
      <p style="color:#f0a830;font-size:16px;font-weight:600;margin:0 0 16px">${t.welcome}</p>
      <p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0 0 24px">${t.intro}</p>

      <!-- Steps -->
      <div style="margin:0 0 24px">
        <div style="display:flex;align-items:flex-start;margin-bottom:12px">
          <div style="min-width:28px;height:28px;border-radius:50%;background:#f0a830;color:#0f1b2d;font-weight:700;font-size:13px;text-align:center;line-height:28px;margin-right:12px">1</div>
          <p style="color:#e2e8f0;font-size:14px;margin:4px 0 0;line-height:1.5">${t.step1}</p>
        </div>
        <div style="display:flex;align-items:flex-start;margin-bottom:12px">
          <div style="min-width:28px;height:28px;border-radius:50%;background:#f0a830;color:#0f1b2d;font-weight:700;font-size:13px;text-align:center;line-height:28px;margin-right:12px">2</div>
          <p style="color:#e2e8f0;font-size:14px;margin:4px 0 0;line-height:1.5">${t.step2}</p>
        </div>
        <div style="display:flex;align-items:flex-start;margin-bottom:12px">
          <div style="min-width:28px;height:28px;border-radius:50%;background:#f0a830;color:#0f1b2d;font-weight:700;font-size:13px;text-align:center;line-height:28px;margin-right:12px">3</div>
          <p style="color:#e2e8f0;font-size:14px;margin:4px 0 0;line-height:1.5">${t.step3}</p>
        </div>
        <div style="display:flex;align-items:flex-start;margin-bottom:12px">
          <div style="min-width:28px;height:28px;border-radius:50%;background:#f0a830;color:#0f1b2d;font-weight:700;font-size:13px;text-align:center;line-height:28px;margin-right:12px">4</div>
          <p style="color:#e2e8f0;font-size:14px;margin:4px 0 0;line-height:1.5">${t.step4}</p>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0 8px">
        <a href="https://spothitch.com" style="display:inline-block;padding:14px 36px;background:#f0a830;color:#0f1b2d;font-weight:700;font-size:15px;text-decoration:none;border-radius:12px">${t.cta}</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0">
      <p style="color:#94a3b8;font-size:14px;margin:0 0 4px">${t.footer}</p>
      <p style="color:#64748b;font-size:13px;margin:0">${t.team}</p>
      <p style="color:#475569;font-size:11px;margin:16px 0 0">${t.unsub}</p>
    </div>
  </div>
</body>
</html>`

  return { subject: t.subject, html }
}

/** Escape HTML to prevent XSS in email */
function escapeHtml(str) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Send welcome email to a new user
 * @param {string} email - User email
 * @param {string} name - User display name
 * @param {string} lang - Language code
 */
async function sendWelcomeEmail(email, name, lang) {
  if (!email) return null
  const { subject, html } = buildWelcomeEmail(name, lang)
  return sendEmail({ to: email, subject, html })
}

module.exports = { sendWelcomeEmail, buildWelcomeEmail }
