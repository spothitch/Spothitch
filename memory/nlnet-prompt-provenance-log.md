# Prompt Provenance Log — SpotHitch NLNet Application

**Model:** Claude Opus (Anthropic), via Claude Code CLI
**Date:** March 26, 2026
**Applicant:** Antoine

All application texts were written by me. The AI was used for research and fact-checking only. The full conversation log is available upon request.

---

## Prompt 1 — Market rates research for budget estimation

**Prompt:**
Research the following and give me FACTS with sources:
1. Belgian freelance/project coordinator rates per month (junior level, first project)
2. Senior full-stack developer daily rates in Europe (freelance)
3. Cybersecurity expert daily rates in Europe (freelance)
4. UX/UI Designer daily rates in Europe (freelance)
5. PWA/Service Worker expert daily rates in Europe
6. GIS/Cartography developer daily rates in Europe
7. GDPR/Tech lawyer hourly rates in Belgium/Europe
8. Sound designer rates for app alerts (freelance, small project)
9. MapTiler Cloud pricing (annual plans)
10. Firebase Blaze pricing (Cloud Functions, typical small app usage)
11. Twilio SMS pricing in Europe (per SMS, estimated annual for ~1000 users)
12. Geocoding API pricing (MapTiler, Geoapify, alternatives)
13. VPS server pricing (small backend, European providers)
14. BrowserStack pricing (annual plan)
15. Sentry Team pricing (annual)
16. Plausible Analytics pricing
17. Apple Developer Program annual fee
18. DeepL Pro pricing
19. Bug bounty program costs for small open source projects
20. FOSDEM attendance costs
21. Capacitor (Ionic) - is it really free and open source?

Search the web for current 2025-2026 pricing. Give exact numbers with sources when possible. Don't make up numbers.

**Unedited output:**

## 1. Belgian Freelance/Project Coordinator Rates (Junior Level)
- Daily rate (junior): Typically EUR 250-400/day in Belgium for a junior project coordinator/manager.
- Monthly (full-time equivalent): ~EUR 4,000-6,500/month gross as a freelancer.
- Source: Belgian freelance platforms like Freelance.be, Robert Half Belgium salary guides.

## 2. Senior Full-Stack Developer Daily Rates (Europe, Freelance)
- Western Europe (BE/FR/NL/DE): EUR 500-800/day
- Source: Malt.com platform data, Hays Technology Salary Guide 2025, freelancermap.com rate index.

## 3. Cybersecurity Expert Daily Rates (Europe, Freelance)
- Western Europe: EUR 700-1,200/day
- Source: Hays Cybersecurity Salary Guide, freelancermap.com. (ISC)2 Cybersecurity Workforce Study.

## 4. UX/UI Designer Daily Rates (Europe, Freelance)
- Mid-level: EUR 450-650/day
- Source: Malt.com designer rate data, Toptal rate ranges.

## 5. PWA/Service Worker Expert Daily Rates (Europe)
- Rate: EUR 500-800/day (same as senior front-end/JS specialist)
- Source: Malt, Toptal, freelancermap.

## 6. GIS/Cartography Developer Daily Rates (Europe)
- EUR 450-750/day for GIS developers
- Source: freelancermap.com GIS category, Malt.com.

## 7. GDPR/Tech Lawyer Hourly Rates (Belgium/Europe)
- Senior/specialized GDPR lawyer: EUR 250-450/hour
- Source: Belgian Bar Association, DLA Piper GDPR benchmarks.

## 8. Sound Designer Rates (App Alerts, Freelance, Small Project)
- Custom alert sounds (small set, 5-10 sounds): EUR 200-800 total project
- Source: Fiverr/Upwork rate ranges, SoundBetter.com marketplace.

## 9. MapTiler Cloud Pricing
- Starting: ~EUR 20/month (billed annually)
- Professional: ~EUR 75/month (billed annually)
- Source: maptiler.com/cloud/pricing

## 10. Firebase Blaze Pricing
- Typical small app (1,000 users): $0-25/month (most stay within free tier)
- Source: firebase.google.com/pricing

## 11. Twilio SMS Pricing in Europe
- Belgium: ~$0.0636/SMS
- France: ~$0.0740/SMS
- Source: twilio.com/sms/pricing

## 12. Geocoding API Pricing
- MapTiler Geocoding: 100,000 requests/month (free plan), included in paid plans
- Nominatim (OSM): Free (self-hosted or limited public API)
- Source: Each provider's pricing page.

## 13. VPS Server Pricing (European Providers)
- Hetzner Cloud CX22: EUR 4.51/month (2 vCPU, 4GB RAM)
- Source: Each provider's pricing page.

## 14. BrowserStack Pricing
- Open source projects can apply for a free plan.
- Source: browserstack.com/pricing, browserstack.com/open-source

## 15. Sentry Team Pricing
- Developer: Free (1 user, 5K errors/month)
- Source: sentry.io/pricing

## 16. Plausible Analytics Pricing
- 10K pageviews/month: EUR 9/month (EUR 108/year)
- Self-hosted: Free (open source, AGPL)
- Source: plausible.io/pricing

## 17. Apple Developer Program Annual Fee
- Individual: $99/year (USD)
- Source: developer.apple.com/programs

## 18. DeepL Pro Pricing
- API Free: EUR 0 (500,000 chars/month)
- API Pro: EUR 5.49/month + EUR 25/million chars
- Source: deepl.com/pro

## 19. Bug Bounty Program Costs
- HackerOne: Free for open source
- Huntr.dev: Free platform specifically for open source projects
- Typical bounties: Critical $100-500, High $50-200
- Source: HackerOne, huntr.dev

## 20. FOSDEM Attendance Costs
- Admission: FREE
- Location: Brussels, Belgium (first weekend of February)
- Total estimate (non-local): EUR 150-400 for a weekend
- Source: fosdem.org

## 21. Capacitor (Ionic)
- License: MIT License (permissive, commercial use allowed)
- Cost: $0 for the framework itself
- Source: capacitorjs.com, github.com/ionic-team/capacitor/blob/main/LICENSE

---

## Prompt 2 — Competitor research: safety apps (first round)

**Prompt:**
Search the web thoroughly for ALL existing apps and open source projects that offer personal safety features for travelers, hitchhikers, or vulnerable people. I need to know if any of them combine these features:
1. E2E encrypted GPS tracking
2. Automatic check-in with silence detection
3. Offline SOS
4. Community alert to nearby users
5. Open source

Search for: OwnTracks, Life360, bSafe, Trusted Contacts, Guardian SRM, Kitestring, Watch Over Me, Bugle, Cairn, SafeTrek/Noonlight, any open source personal safety project on GitHub, any NGI Zero funded safety/tracking project, Trekarta, OrganicMaps, OsmAnd, Signal, Wire, any app that combines check-in + silence detection + SOS + offline.

For each one, tell me: Is it open source? Does it have E2E encrypted position sharing? Does it have automatic check-in with silence detection? Does it work offline? Does it have community alerts to nearby users? Is it still maintained/active?

**Unedited output (summary — full output was ~4000 words):**

35 projects analyzed. Key findings:

- OwnTracks: Open source, NO E2E encryption, NO check-in/silence detection, NO SOS. Active.
- Life360: Proprietary, NO E2E, PARTIAL crash detection, NO offline. Sold user data (The Markup, 2021). Active.
- bSafe: Proprietary, NOT E2E, YES check-in timer + fake call. Active, 125 countries.
- Kitestring: NOT open source, YES silence detection via SMS. Still referenced in 2025.
- Cairn: Proprietary, YES overdue alerts. Active.
- Noonlight: Proprietary, YES SOS with dispatcher, NO offline. Active.
- Grid: Open source, YES E2E GPS (Matrix protocol). NO safety features. Active.
- ChasR: Open source, YES E2E GPS (libsodium). NO safety features. Active.
- Circulo (Guardian Project): Open source, YES E2E GPS, PARTIAL manual check-in. NO offline SOS, NO community alerts. Active, audited March 2025.
- Meshtastic: Open source, YES E2E (AES-256), YES offline (LoRa radio). Requires hardware. Active.
- Haven (Guardian Project): Open source. Room surveillance, not personal tracking. Unpublished from Google Play April 2025.
- Briar: Open source, YES E2E, YES offline (Bluetooth). Messaging only, no safety features.

CONCLUSION: No project combines all 5 features. The closest is Circulo (3/5) but lacks offline SOS and community alerts.

---

## Prompt 3 — Competitor research: ALL travel and safety apps (second round, 68 apps)

**Prompt:**
Search the web VERY thoroughly for ALL apps and projects (open source or not) that offer features for travelers, hitchhikers, backpackers, or personal safety. I need to compare them against SpotHitch which has 25 features. Search for apps that have ANY of these features:
1. Community spot map 2. Country guides 3. Route planning 4. Travel journal 5. Gas station finder 6. Traveler proximity radar 7. Travel companion finder 8. Country-specific chat rooms 9. Accommodation tips 10. Learning/quizzes about countries 11. Community events 12. Messaging between travelers 13. E2E encrypted GPS tracking 14. Automatic check-in with silence detection 15. Automatic SMS alert 16. SOS emergency button 17. Fake call 18. Silent alarm 19. Community alert to nearby users 20. Audio/video evidence recording 21. Offline mode 22. Open source

Search specifically for: Hitchmap, Hitchwiki, HitchR, Trustroots, BeWelcome, Warmshowers, Couchsurfing, Hostelworld, Maps.me, Organic Maps, Polarsteps, TripIt, Backpackr, Travello, Tourlina, Life360, bSafe, Kitestring, Cairn, Noonlight, Citizen, SafeUs, HollieGuard, UrSafe, Watch Over Me, OwnTracks, Grid, ChasR, Circulo, TICE, Traccar, Hauk, OsmAnd, Organic Maps, Trekarta, Maps.me, GasBuddy, Waze, iOverlander, Park4Night, Wikicamps.

**Unedited output (summary — full output was ~8000 words):**

68 applications analyzed across categories: hitchhiking, hospitality exchange, backpacker social, travel tracking, trip planning, safety, GPS sharing, offline maps, gas stations, camping, volunteer, outdoor, rideshare, satellite SOS, quiz/gamification, community safety.

Key findings per category:
- Hitchhiking: Hitchmap (spots only), Hitchwiki (wiki guides), HitchR (not launched, 1 App Store review)
- Travel social: Travello (1.2M users), Couchsurfing (14M users), Hostelworld, Backpackr, Tourlina
- Safety: Life360, bSafe, HollieGuard, UrSafe, Noonlight, Watch Over Me, iMSafe
- Open source GPS: OwnTracks, Grid, ChasR, Traccar, Hauk, TICE
- Offline maps: OsmAnd, Organic Maps, CoMaps, Trekarta

CONCLUSION: No single app combines travel community features with personal safety features. The market is clearly split: travel apps have zero safety, safety apps have zero travel community, GPS sharing apps have neither.

SpotHitch scoring 25/25 features. Next closest: Meshtastic 7.5/25 (requires hardware), Couchsurfing 6.5/25, OsmAnd 6.5/25.

---

## Prompt 4 — HitchR competitor deep dive

**Prompt:**
Search the web thoroughly for everything about HitchR (hitchr.world). I need to know: What is it? Who created it? Is it launched? What features does it have? Does it have ANY safety features? Is it open source? Business model? How many users? GitHub? Social media? Funding?

**Unedited output (summary — full output was ~3000 words):**

- Founded by Adam Renak and Dan Smith (British), incorporated August 2024 in London (Hitchr Ltd, company number 15880143)
- App on iOS (released January 28, 2026) and Android. 1 single App Store rating.
- Features: hitchhiking spot map (uses Hitchmap data), GPS trip tracking, notes/photos, stats
- Safety features mentioned: "ID checks, verified profiles" on homepage but no evidence of implementation. No SOS, no guardian mode, no fake call, no encrypted GPS.
- NOT open source. No GitHub repository.
- Kickstarter FAILED: raised 1,727 GBP out of 10,000 GBP goal (17%), 31 backers.
- No other funding found. No revenue.
- ~32K Instagram followers, ~8,600 Substack subscribers. Practically zero actual app users.
- Closest description: "Strava for hitchhiking"

CONCLUSION: HitchR is a pre-launch startup with essentially zero users, failed crowdfunding, no safety features, not open source. Not a meaningful competitor to SpotHitch.
