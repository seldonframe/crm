# Competitor Pricing Facts — verified 2026-07-08

Source of truth for "[Competitor] pricing" SEO pages. Every block lists the canonical
public pricing URL, plans, stacked add-on costs, annual discount, quote-gating, free tier.

**Verification legend**
- ✅ = fetched from the live pricing page 2026-07-08
- 🔶 = live page is JS/geo/quote-gated; numbers from multiple 2026 third-party sources (hedged with ~)
- ❌ = quote-gated; only publicly-reported numbers included

---

## CRM / Marketing

### 1. GoHighLevel ✅
- pricingUrl: https://www.gohighlevel.com/pricing
- plans:
  - Starter — "$97/mo" — solo marketers & small agencies — 3 sub-accounts; unlimited contacts & users
  - Unlimited — "$297/mo" — growing agencies — unlimited sub-accounts; rebill phone/email at cost; basic API
  - Agency Pro (SaaS) — "$497/mo" — agencies going SaaS-mode — SaaS mode; rebill with markup; advanced API
  - Enterprise — custom ("Speak with Our Enterprise Team")
- addOns/meters: **AI Employee** "$50/mo per sub-account" (Growth/Starter-level) or "$97/mo per sub-account" (Unlimited-level); telephony (Twilio) + email (Mailgun/LC) usage rebilled at cost (Starter) — usage-metered SMS/voice/email on top of every plan
- annualDiscount: pay 10 months ("$970/yr", "$2,970/yr", "$4,970/yr") ≈ 2 months free
- quoteGated: false (Enterprise only)
- freeTier: none (14-day free trial)

### 2. ActiveCampaign 🔶 (plan names ✅ from live page; dollar figures third-party — configurator-gated)
- pricingUrl: https://www.activecampaign.com/pricing
- plans (at 1,000 contacts, billed annually):
  - Starter — "from ~$15/mo @1k contacts" (~$19 monthly) — beginners doing personalized email — 1 user; 10× contact email send limit; 5 actions/automation
  - Plus — "from ~$49/mo @1k contacts" (~$59 monthly) — SMBs adding automation — 1 user; 10× send limit; unlimited automation actions
  - Pro — "from ~$79/mo @1k contacts" (~$99 monthly) — teams needing orchestration — 3 users; 12× send limit; advanced segmentation
  - Enterprise — "from ~$145/mo @1k contacts" (~$179 monthly) — scaled email programs — 5 users; 15× send limit; SSO, dedicated team
- addOns/meters: price scales with contact count (matrix pricing); SMS add-on; WhatsApp add-on; transactional email add-on; AI Activities add-on; Enhanced CRM (Pipelines, Sales Engagement) add-on; custom reporting; extra users/contacts
- annualDiscount: ~20% vs monthly
- quoteGated: false (but exact price requires the on-page contact-count configurator)
- freeTier: none — 14-day free trial

### 3. HubSpot (Marketing Hub) ✅
- pricingUrl: https://www.hubspot.com/pricing/marketing
- plans:
  - Free Tools — "$0" — trying HubSpot — up to 2 users; HubSpot branding
  - Marketing Hub Starter — "$15/mo/seat" list (live page showed a "starts at $7/mo/seat (was $20)" promo on 2026-07-08 — treat $15/seat annual, $20 monthly as list) — small teams starting email/forms — 1,000 marketing contacts; sends = 5× contact tier
  - Marketing Hub Professional — "starts at $800/mo" (3 core seats) — real marketing teams — 2,000 marketing contacts; sends = 10× tier; **+ "$3,000" one-time onboarding fee (required)**
  - Marketing Hub Enterprise — "starts at $3,600/mo" (5 core seats) — large orgs — 10,000 marketing contacts; sends = 20× tier; **+ "$7,000" one-time onboarding fee (required)**
- addOns/meters: extra marketing contacts sold in tiers on top; extra seats "$45/mo" (Pro) / "$75/mo" (Enterprise); HubSpot Credits (AI/Breeze) bundled per tier (500/3,000/5,000), more purchasable; SMS is a separate add-on
- annualDiscount: Starter ~25% cheaper annual ($15 vs $20); Pro/Enterprise quoted annual-commit
- quoteGated: false
- freeTier: yes — free tools, 2 users

### 4. ClickFunnels ✅
- pricingUrl: https://www.clickfunnels.com/pricing
- plans:
  - Launch — "$97/mo" ("$81/mo" annual) — solopreneurs launching funnels — 10K contacts; 50K emails/mo; 1 workspace, 2 team members; 5 domains
  - Scale — "$197/mo" ("$164/mo" annual) — growing businesses — 75K contacts; 300K emails/mo; 5 workspaces, 5 members
  - Optimize — "$297/mo" ("$248/mo" annual) — bigger teams — 150K contacts; 750K emails/mo; 10 workspaces, 10 members
  - Dominate — "$5,997/yr" (annual only) — high-volume operators — 400K contacts; 1.2M emails/mo; 20 workspaces; VIP support + 3-hour private onboarding
- addOns/meters: none advertised — "no transaction fees"; email volume caps are the practical meter (upgrade to raise)
- annualDiscount: ~"Save $194–$594/year" per tier (≈16%)
- quoteGated: false
- freeTier: none — 14-day free trial + 30-day money-back

### 5. Keap ✅
- pricingUrl: https://keap.com/pricing
- plans (single unified plan, contact-tiered):
  - Keap — "from $299/mo" (billed annually at "$2,988/year" = $249/mo effective) — SMBs wanting CRM+automation — 2 user licenses included; price scales with contact count (configurator)
- addOns/meters: extra users "$39/month per user"; **implementation/onboarding services required** (packages priced separately, not listed); Text marketing tiers: Tier 1 included (500 msgs/100 min), then "$24/mo" → "$279/mo" by volume; contact-count overage moves you up tiers
- annualDiscount: ~17% ($299 monthly → $249/mo billed annually)
- quoteGated: partially (contact tiers + implementation packages via sales/configurator)
- freeTier: none — 14-day free trial

### 6. Linktree 🔶 (plan names ✅; USD figures third-party — page shows local currency by geo)
- pricingUrl: https://linktr.ee/s/pricing/
- plans:
  - Free — "$0" — anyone starting a link-in-bio — unlimited links; basic analytics; Linktree branding; 12% seller fee
  - Starter — "~$8/mo (~$5/mo annual)" — creators wanting scheduling/customization — link scheduling, more icons; 9% seller fee
  - Pro — "~$15/mo (~$12/mo annual)" — creators monetizing — advanced analytics, priority links, monetization tools, SEO controls; 9% seller fee
  - Premium — "~$35/mo (~$24/mo annual)" — brands/power sellers — full analytics, commerce, removable branding, priority support; 0% seller fee
- addOns/meters: **seller/commission fee on digital-product sales: 12% (Free) / 9% (Starter & Pro) / 0% (Premium)** — the real meter
- annualDiscount: yes (~30-37% — e.g. Pro $15→$12, Premium $35→$24)
- quoteGated: false
- freeTier: yes — Free forever plan

### 7. Kartra ✅
- pricingUrl: https://kartra.com/pricing/
- plans:
  - Essentials — "$59/mo" ("$52/mo" annual) — solo funnel builders — 500 contacts; 10K emails/mo; 5 pages, 1 product; **5% transaction fee**; Kartra AI 30 uses
  - Starter — "$119/mo" ("$99/mo" annual) — small businesses — 2,500 contacts; unlimited emails/pages/products; 0% transaction fee; 5 team members
  - Growth — "$229/mo" ("$189/mo" annual) — scaling businesses — 12,500 contacts; 3 domains; automations, affiliates, helpdesk; 10 team members
  - Professional — "$549/mo" ("$429/mo" annual) — high-volume marketers — 25,000 contacts; 5 domains; real-time funnel analytics
- addOns/meters: 5% transaction fee on Essentials only; no bolt-on add-ons — contact caps force tier upgrades
- annualDiscount: "Save up to 22%"
- quoteGated: false
- freeTier: none — 14-day free trial + 30-day money-back
- Note: user's remembered $59/$119/$229/$549 confirmed exactly (monthly).

### 8. SharpSpring / Constant Contact "Lead Gen & CRM" ❌ (page 403'd; product reportedly sunsetting)
- pricingUrl: https://www.constantcontact.com/pricing/lead-gen-crm (could not verify load on 2026-07-08 — returned 403 to automated fetch)
- plans: quote-gated. Publicly known/historical: "from ~$449/mo @ 1,000 contacts" (SharpSpring-era anchor, UNVERIFIED for 2026) + mandatory onboarding fee; agency pricing negotiated.
- addOns/meters: onboarding fee (historically ~$1,999, unverified); price scales by contact tier
- annualDiscount: unknown
- quoteGated: **true** — "contact sales"; TrustRadius 2026 notes the product is **discontinued/no longer sold separately** from Constant Contact's flagship — verify before publishing a page on it
- freeTier: none
- ⚠️ SHAKIEST entry of the 25 — recommend framing the SEO page around "legacy SharpSpring users migrating" rather than exact prices.

### 9. Klaviyo ✅ (free tier from live page; paid anchors third-party — plan-builder gated)
- pricingUrl: https://www.klaviyo.com/pricing
- plans (scale by **active profiles**):
  - Free — "$0" — new stores — 250 active profiles; 500 email sends/mo; 150 SMS credits/mo
  - Email — "from $20/mo @ 251–500 profiles; ~$30/mo @ 1k; ~$100/mo @ 5k; ~$400/mo @ 25k" — ecommerce email marketing — sends scale with tier
  - Email + SMS — "from $35/mo" (500 profiles + 1,250 SMS credits) — stores adding SMS — two-way SMS, SMS automations
  - (Enterprise/custom at high profile counts — talk to sales)
- addOns/meters: **SMS credits** beyond allotment ≈ "$0.01–$0.015 per US SMS" (MMS more; priced per country); active-profile growth automatically bumps the monthly price; Composer/Analytics/Customer-Agent AI products priced separately (30%-off promos seen on page)
- annualDiscount: none advertised (monthly usage-based)
- quoteGated: false (plan-builder configurator)
- freeTier: yes — 250 profiles / 500 emails/mo (user's 2026-07-08 verification confirmed)

### 10. Zoho CRM 🔶 (live page geo-served INR; USD from multiple 2026 sources)
- pricingUrl: https://www.zoho.com/crm/zohocrm-pricing.html
- plans (per user/mo, billed annually — monthly ~20–34% higher):
  - Free — "$0" — micro-teams — max 3 users
  - Standard — "~$14/user/mo annual (~$20 monthly)" — small sales teams — scoring rules, custom dashboards
  - Professional — "~$23/user/mo annual (~$35 monthly)" — growing teams — blueprints, inventory, Zia AI included here and up
  - Enterprise — "~$40/user/mo annual (~$50 monthly)" — mature sales orgs — CommandCenter, sandbox, advanced customization
  - Ultimate — "~$52/user/mo annual (~$65 monthly)" — analytics-heavy orgs — enhanced BI, highest limits
- addOns/meters: paid support plans; team-user licenses (lighter seats) sold separately via Zoho Store; Zoho CRM Plus bundle at "~$57/user/mo" is the everything-suite alternative
- annualDiscount: "save up to 34%" (per live page banner)
- quoteGated: false
- freeTier: yes — 3 users

### 11. Salesforce (SMB suites) 🔶 (salesforce.com 403'd automated fetch; figures cross-verified July 2026)
- pricingUrl: https://www.salesforce.com/small-business/pricing/
- plans:
  - Starter Suite — "$25/user/mo" — SMBs starting CRM (sales+service+email in one) — the ONLY edition with monthly billing; simplified setup
  - Pro Suite — "$100/user/mo (billed annually)" — SMBs outgrowing Starter — lead scoring, AppExchange access, more customization
  - (Above SMB: Enterprise "$165/user/mo", Unlimited "$330/user/mo", Agentforce 1 editions — all annual, mostly sales-negotiated)
- addOns/meters: **Agentforce/AI**: usage-priced (Flex Credits; conversational AI historically ~$2/conversation — verify before quoting); many features (CPQ, Marketing Cloud, extra sandboxes) are separate SKUs; integration/implementation costs typically dwarf license fees
- annualDiscount: Pro Suite+ are annual-commit by default; Starter same price monthly/annual
- quoteGated: partially — Starter/Pro public; everything above effectively "contact sales"
- freeTier: Starter Suite free trial (30 days); Foundations free tier exists for existing customers

---

## Voice / Chat AI + Local-SMB

### 12. Vapi ✅
- pricingUrl: https://vapi.ai/pricing
- plans:
  - Build (self-serve, usage-based) — "no platform fee; pay per use" — developers building voice agents — 10 concurrent lines included; 14-day call data retention
  - Scale (annual contract) — "custom — fixed platform fee + volume-based per-minute" — production/enterprise deployments — custom concurrency, retention, SOC 2/HIPAA/PCI, SSO/RBAC, dedicated team
- addOns/meters (the real price):
  - Vapi hosting "$0.05/min"
  - **model/voice/telephony provider costs passed through at cost** (free if you bring your own API keys) — typical all-in lands "~$0.10–$0.30/min" depending on stack (hedged estimate, not on page)
  - extra concurrency "$10 per line/month" beyond 10
  - SMS/chat "$0.005/msg"
  - HIPAA "$2,000/mo"; Zero Data Retention "$1,000/mo"
- annualDiscount: none published (Scale = negotiated annual)
- quoteGated: Scale only
- freeTier: "60+ minutes included" to start; no ongoing free tier

### 13. Retell AI ✅
- pricingUrl: https://www.retellai.com/pricing
- plans:
  - Pay-as-you-go — "$0.07–$0.31/min all-in for voice; $0.002+/msg chat" — teams building AI phone agents — $10 free credits; 20 free concurrent calls; no commitment
  - Enterprise — custom — high volume — dedicated stable server, 24/7 support, SSO, MSA/DPA, 50+ concurrency
- addOns/meters (per-minute components stack):
  - voice infrastructure/orchestration "$0.055/min" (as listed on page)
  - TTS: platform voices (Cartesia/Minimax/Fish/OpenAI) "$0.015/min"; ElevenLabs "$0.040/min"
  - LLM: GPT-4.1 "$0.045/min"; Claude 4.6 Sonnet "$0.08/min"; GPT-5.5 "$0.16/min"
  - telephony "$0.015/min" (Retell Twilio US)
  - Knowledge Base "+$0.005/min"; PII removal "+$0.01/min"; guardrails "+$0.005/min"
  - phone numbers "$2/mo"; extra concurrency "$8/mo per line" beyond 20
- annualDiscount: none published
- quoteGated: Enterprise only
- freeTier: $10 free credits (~60 min)

### 14. Synthflow ⚠️🔶 (pricing model changed — live page is now enterprise-only)
- pricingUrl: https://synthflow.ai/pricing
- plans:
  - Enterprise — "starting ~$30,000/yr, custom-scoped" — contact-center-scale voice AI — custom concurrency, SIP trunking, MSA/DPA, launch support (this is ALL the live page shows as of 2026-07-08)
  - Self-serve — "pay-as-you-go from ~$0.08–$0.09/min" (third-party 2026 sources; NOT on the live pricing page) — smaller teams — enterprise volume rates reportedly down to ~$0.07/min
- addOns/meters: per-minute voice engine cost is the meter; telephony/number costs on top; older tiered plans ($29/$99–450/$449–900/$899–1,400 with bundled minutes) appear in third-party sources but CONFLICT with each other and with the live page — do not quote them as current
- annualDiscount: n/a (custom contracts)
- quoteGated: **true** for the published plan ("contact sales"); self-serve PAYG rates unverified on-page
- freeTier: trial minutes historically; unverified currently
- ⚠️ Second-shakiest entry — recommend "custom/enterprise pricing, reportedly from ~$0.08/min self-serve" framing.

### 15. Chatbase ✅
- pricingUrl: https://www.chatbase.co/pricing
- plans (prices below = as displayed; annual billing shows 20% off, so monthly list ≈ 25% higher):
  - Free — "$0" — kicking the tires — 50 message credits/mo; 1 agent; 1MB training data; agents deleted after 14 days inactivity
  - Hobby — "$32/mo (annual; ~$40 monthly)" — solo builders — 500 credits/mo; 10MB training; 2 seats
  - Standard — "$120/mo (annual; ~$150 monthly)" — SMB support teams — 4,000 credits/mo; 20MB; 3 seats; voice/telephony + API
  - Pro — "$400/mo (annual; ~$500 monthly)" — larger support orgs — 15,000 credits/mo; 40MB; 5 seats
- addOns/meters: extra credits "$40 per 1,000 message credits" (auto-recharge); extra agents "$300 per AI agent / year"; **remove branding "$1,188/year"**; Enterprise = custom (SSO, white-label, audit logs)
- annualDiscount: 20%
- quoteGated: Enterprise only
- freeTier: yes (50 credits/mo)

### 16. Botpress 🔶 (botpress.com 403'd automated fetch; figures from vendor blog "Pricing Updates May 2026" search snippet + third-party)
- pricingUrl: https://botpress.com/pricing
- plans:
  - Pay-as-you-go — "Free" — builders starting out — 500 incoming messages/mo; 1 seat; "$5 monthly AI credit"
  - Plus — "~$79/mo (annual)" — small production bots — removes branding (per third-party), RBAC, knowledge base; unlimited bots (May 2026 update)
  - Team — "~$446/mo (annual; some sources ~$495)" — teams collaborating — more seats/conversations, chat support
  - Enterprise — custom — compliance-heavy orgs — SSO, SLA, dedicated AM
- addOns/meters: **AI spend beyond the bundled credit** (LLM tokens passed through); extra conversations purchased in blocks (each includes proportional AI quota); month-to-month billing costs more than annual
- annualDiscount: yes — quoted prices are annual-plan rates
- quoteGated: Enterprise only
- freeTier: yes
- ⚠️ Mark: exact Plus/Team dollar figures conflict across sources ($79 vs $89–150; $446 vs $495) — quote as "from ~$79/mo".

### 17. Stammer AI ✅
- pricingUrl: https://www.stammer.ai/pricing
- plans:
  - Agency — "$197/month" — agencies white-labeling AI agents — 20+ chat agents, 20+ voice agents; 1M+ char KB; sell to unlimited clients; white-label dashboard + API
  - Full SaaS Mode — "$497/month" — agencies running it as their own SaaS — 100+ chat/voice agents; custom AI functions; 1-on-1 onboarding
  - Enterprise — custom — 1,000+ chat / 250+ voice agents; SSO, self-hosting
- addOns/meters: **per-message AI costs** ("≈$0.001–$0.03+/message" by model) and **voice per-minute** ("$0.11/min" GPT-4.1-nano, "$0.16/min" GPT-4.1); extra chat agents "$10/mo"; extra voice agents "$5/mo"; extra 1M-char KB "$5/mo"
- annualDiscount: none advertised
- quoteGated: Enterprise only
- freeTier: none — 14-day free trial
- Note: no lower solo tier was visible on the live page 2026-07-08 (older $59-ish tiers appear gone).

### 18. Podium ❌ (live pricing page shows NO numbers)
- pricingUrl: https://www.podium.com/pricing
- plans: **quote-gated** — page says "talk to our sales team for details." Publicly reported (third-party, 2026): Core "~$399/mo", Pro "~$599/mo", Signature custom — all UNVERIFIED against Podium itself
- addOns/meters (reported): AI Employee module ~"$99+/mo"; SMS overages; extra users/locations — single-location real-world spend reported "$500–$800/mo"; annual contracts standard
- annualDiscount: unknown (contracts negotiated)
- quoteGated: **true** — "contact sales" (1-801-438-4425 / demo)
- freeTier: none

### 19. Vendasta ✅
- pricingUrl: https://www.vendasta.com/pricing/
- plans (monthly minimum spend model):
  - Starter — "$99/mo minimum" — solopreneurs/startup agencies — 1 team seat; 10 snapshot reports/mo; no long-term contract
  - Professional — "$499/mo minimum" — established agencies — 5 seats; 25 snapshots/mo; 1-year contract
  - Premium — "$999/mo minimum" — multi-location/medium agencies — 10 seats; 50 snapshots/mo; 1-year contract
  - Custom Enterprise — contact sales
- addOns/meters: **"Each $1 spent on select products = $1 off your subscription fee"** (platform fee offsets against wholesale marketplace spend); extra team seats "$30–$65/seat/mo"; wholesale product costs (the real spend) are per-product on top
- annualDiscount: n/a (minimums; Pro/Premium require 1-yr commit)
- quoteGated: Enterprise only (user's $99/$499/$999 minimums confirmed)
- freeTier: free tier historically existed for the platform — not shown on pricing page 2026-07-08

### 20. Goodcall ✅
- pricingUrl: https://www.goodcall.com/pricing
- plans (per agent/phone-line):
  - Starter — "$79/mo per agent" ("$66/mo" annual) — single-location SMBs — unlimited minutes/tokens; 1 logic flow; 3 team members; 100 unique customers/mo
  - Growth — "$129/mo per agent" ("$108/mo" annual) — busier SMBs — 3 flows; 9 members; 25 directory contacts; 250 customers/mo
  - Scale — "$249/mo per agent" ("$208/mo" annual) — multi-team operations — 25 flows; 50 members; 500 customers/mo; unlimited history
  - Enterprise — custom — dedicated AM, custom API, SLA
- addOns/meters: **"$0.50 per additional unique customer"** beyond the monthly cap (the only meter — minutes and AI tokens are unlimited/free)
- annualDiscount: 15%
- quoteGated: Enterprise only
- freeTier: free trial (no permanent free tier)

### 21. Voiceflow 🔶 (live page hides numbers behind app; figures from 4+ concurring 2026 sources)
- pricingUrl: https://www.voiceflow.com/pricing
- plans (credits-based since Apr 2025):
  - Free/Sandbox — "$0" — prototyping — limited credits, 1-2 editors
  - Pro — "from ~$60/mo (10K credits); $90/mo (15K); $120/mo (20K)" — startups launching an agent — includes some editor seats
  - Business — "~$250/mo (50K credits); $500/mo (100K); $1,000/mo (200K)" — production support automation — higher limits, more seats included
  - Enterprise — custom — SSO, compliance, volume credits
- addOns/meters: **editor seats "$50/mo each"** (both tiers, monthly even on annual plans); credit overages beyond allotment; real-world example: 5 editors + 50K msgs ≈ "$450–$500/mo"
- annualDiscount: 10% (base subscription only, NOT seats; reduced from 20% in Apr 2025)
- quoteGated: partially (numbers not rendered on public page; agency tier = "book a demo")
- freeTier: yes

### 22. Lindy ✅
- pricingUrl: https://www.lindy.ai/pricing
- plans:
  - Plus — "$49.99/month" — individuals automating email/calendar — standard usage; up to 2 inboxes
  - Pro — "$99.99/month" — power users — 3× Plus usage; up to 3 inboxes; computer use
  - Max — "$199.99/month" — heavy automation users — 7× Plus usage; up to 5 inboxes; computer use
  - Enterprise — custom — teams — SSO, SCIM, HIPAA, audit logs
- addOns/meters: usage ("credits"/tasks) capped per tier — multipliers only, absolute credit counts not published on page; phone-call/SMS actions consume extra usage (rates not published)
- annualDiscount: none published (month-to-month)
- quoteGated: Enterprise only
- freeTier: **none** — 7-day free trial (full Plus, no card). Note: older free 400-credit tier is gone.

### 23. Durable ✅
- pricingUrl: https://durable.com/pricing (durable.co 301s here)
- plans:
  - Free — "$0" — testing an AI website — durable.site subdomain; CRM to 10 customers; 5 AI images + 10 AI chat messages/mo
  - Launch — "$25/mo" ("$22/mo" annual) — solo service businesses — custom domain; unlimited CRM contacts; 50 AI images, 1,000 AI chat msgs, 20 lead replies/mo; SEO tools
  - Grow — "$49/mo" ("$41/mo" annual) — growing service businesses — unlimited team members; 500 images/mo, unlimited chat, 100 daily lead replies; 1:1 onboarding
- addOns/meters: none published — AI usage caps per tier are the meter (upgrade to raise). Note: invoicing not mentioned on current page (older marketing referenced it)
- annualDiscount: "Save 15%"
- quoteGated: false
- freeTier: yes

### 24. My AI Front Desk ✅ (live page rebranding as "Frontdesk"; third-party sources still describe older $65 tiers)
- pricingUrl: https://www.myaifrontdesk.com/pricing
- plans (as fetched 2026-07-08):
  - Basic — "$20/mo" ("$16/mo" annual) — text-first front desk — 0 voice minutes; 10 chatbot convos + 40 SMS/mo; 1 seat
  - Business-in-a-Box — "$99/mo" ("$79/mo" annual) — SMB AI receptionist — 200 voice min/mo; 100 chatbot convos; 400 SMS; 20 outbound calls/day; 1,000 overage credits + auto-reload; 2 seats
  - Partner / Enterprise — custom — white-label resellers — volume pricing, API, dedicated AM (resellers commit ~5+ licenses, set own retail — commonly $250–$500/mo per client)
- addOns/meters: overage credits — voice "25 credits/min", SMS "4 credits/msg", chatbot "5 credits/convo"; auto-reload "$10 per 1,000 credits" (≈ **$0.25/min voice overage**); enterprise rates "as low as 7 credits"/min
- annualDiscount: 20%
- quoteGated: Partner/Enterprise only
- freeTier: none — 7-day free trial
- ⚠️ Third-party sources cite a "Pro $149/mo ($119 annual, 300 min)" tier not visible on the fetched page — verify in-browser before publishing.

### 25. Smith.ai 🔶 (pricing pages render prices client-side / behind forms; figures from multiple 2026 sources)
- pricingUrl: https://smith.ai/pricing/ai-receptionist (human plans: https://smith.ai/pricing/receptionists)
- plans:
  - AI Receptionist — "from ~$95/mo (~50-60 calls)" up to "~$800/mo" across three tiers — SMBs wanting 24/7 AI answering — per-call effective rate ~$1.60–$1.90 in-tier
  - Virtual (human) Receptionist Starter — "~$292.50/mo / 30 calls" (~$9.75/call) — businesses wanting live agents
  - Virtual Receptionist Basic — "~$765/mo / 90 calls"
  - Virtual Receptionist Pro — "~$1,950/mo / 300 calls"
- addOns/meters: AI overage "~$2.40/call" (down from the old $4.25); **custom AI training fee ~$2,000** (charged separately on monthly plans, bundled into 2026 annual plans); CRM integrations/transfers historically add per-call fees; annual plans price-lock rates and remove overages
- annualDiscount: yes — 2026 annual plans bundle training fee + eliminate overage charges
- quoteGated: effectively yes for exact current numbers (public pages hide prices behind forms; "contact sales" flow) — hedge all figures
- freeTier: none

---

## Publishing guidance (shakiness ranking)

**Quote-gated (say "contact sales" + cite reported ranges):** Podium, Synthflow, SharpSpring/CC Lead Gen & CRM, Smith.ai (semi), Salesforce above Pro Suite, Vapi Scale, Retell/Chatbase/Botpress/Stammer/Goodcall/Vendasta/Lindy Enterprise tiers.

**Shakiest numbers (re-verify in a real browser before publishing):**
1. SharpSpring/Constant Contact Lead Gen & CRM — page 403'd; product may be discontinued entirely
2. Synthflow — pricing model changed to enterprise-first; self-serve PAYG rates conflict across sources
3. Botpress — Plus/Team dollar figures conflict ($79 vs $89–150; $446 vs $495); page 403'd
4. Podium — all numbers third-party
5. Smith.ai — all numbers third-party (form-gated pages)
6. Voiceflow — credible but page is JS-gated; credit sub-tiers may have shifted
7. HubSpot Starter — live page showed "$7/mo/seat" promo vs $15 list; decide which to quote
8. My AI Front Desk — live page vs third-party tier mismatch (possible mid-rebrand)
9. Linktree/Zoho USD figures — geo-served pages; hedged from 2026 sources

**Rock-solid (fetched live 2026-07-08):** GoHighLevel, ClickFunnels, Keap, Kartra, Klaviyo free tier, HubSpot Pro/Enterprise, Vapi, Retell, Chatbase, Stammer, Goodcall, Vendasta, Lindy, Durable, ActiveCampaign plan names.

---

# Appendix — verified 2026-08-24 (seven-competitor wave)

Facts for the 2026-08-24 wave: Bland AI, Birdeye, Weave, Ruby Receptionist, Thryv,
Tidio, ElevenLabs Agents. Same rule as the July block: **no number appears on a
page unless it appears here.** Every vendor page in this appendix was fetched
twice on 2026-08-24 — once by a dedicated research agent, once again directly
before publishing — and every third-party source cited was fetched too.

**Verification legend for this appendix**
- **FETCHED** = read off the vendor's own live page on 2026-08-24
- **DERIVED** = pure arithmetic on two FETCHED numbers (e.g. plan price ÷ included minutes); never an estimate
- **REPORTED** = third-party only; the vendor publishes no such figure. Every REPORTED number is hedged in page copy ("reported by reviewers", "third parties report") and never stated as vendor fact.

---

## 26. Bland AI ✅ FETCHED — quoteGated: false (Enterprise tier only)
- pricingUrl: https://www.bland.ai/pricing (FETCHED 2026-08-24)
- secondary vendor source: https://docs.bland.ai/platform/billing (FETCHED 2026-08-24)
- plans (all FETCHED from the pricing page):
  - Start — "$0/mo platform fee" + "$0.14/min" talk time + "$0.05/min" transfer time — 10 concurrent calls, 100 calls/day, 10 knowledge bases, 1 voice; includes 2 credits + an inbound number the page calls a "$15/mo value"; "No card required"
  - Build — "$299/mo platform fee" + "$0.12/min" talk + "$0.04/min" transfer — 50 concurrent, 2,000 calls/day, 50 knowledge bases, 5 voices
  - Scale — "$499/mo platform fee" + "$0.11/min" talk + "$0.03/min" transfer — 100 concurrent, 5,000 calls/day, 100 knowledge bases, 15 voices
  - Enterprise — Custom, no figure published (QUOTE-GATED); platform fee "contracted to your volume"; unlimited concurrency/calls/knowledge bases/voices; on-prem/VPC, BAA, SSO, data residency available
- meters (FETCHED from docs.bland.ai/platform/billing): SMS "$0.02" per message inbound or outbound; web widget agent messages "$0.01" each; outbound minimum "$0.015" per call; failed calls "$0.015" per call; SIP termination Twilio→Bland "$0.004/min"
- vendor claim quoted verbatim on the page (FETCHED): "No token charges. No model-provider pass-throughs." — the per-minute rate covers LLM, STT and TTS
- BYOT note (FETCHED): customers who bring their own Twilio pay no transfer fee
- annualDiscount: none mentioned anywhere on the page — omitted rather than invented
- freeTier: yes — Start plan at a $0 platform fee, pay per minute
- ⛔ **DO NOT PUBLISH** the pre-restructure model that most third-party articles still describe (~$0.09/min base with custom voice +$0.02/min, KB lookup +$0.01/min, recording +$0.01/min). Bland restructured to plan-tiered all-in rates; neither vendor surface lists those add-ons today. The truthful "stacking" story is the platform fee, transfer time, the failed-call minimum and the SIP termination fee.
- ⛔ dead URL, do not retry: https://docs.bland.ai/platform/pricing returns 404

## 27. Birdeye ❌ QUOTE-GATED — vendor publishes ZERO dollar figures — quoteGated: true
- pricingUrl: https://birdeye.com/pricing/ (FETCHED 2026-08-24, twice)
- FETCHED: no dollar amount of any kind appears on the page. Headline verbatim: "Pricing built around outcomes, not seat counts." Positioning verbatim: "One platform, one contract - replace point products and pay only for what you deploy at your locations". Pricing sits behind a "GET PRICING" lead form.
- FETCHED: the one hard structural fact — buyers self-select a **location band**: 1-3, 4-9, 10-39, 40-249, 250-999, 1000+. Pricing is per location by the vendor's own admission; no dollar amount attaches to any band.
- FETCHED: no plan/tier NAMES are published either. The Starter/Growth/Dominate and Standard/Professional/Premium schemes circulating in the industry come from third parties and conflict with each other — **the pages use the vendor's own location bands as plan rows instead**.
- FETCHED: https://birdeye.com/blog/what-does-birdeye-cost/ — Birdeye's own cost explainer contains zero dollar figures; describes pricing as "custom and flexible", determined by products, location count and contract structure.
- REPORTED (https://wiserreview.com/blog/birdeye-pricing/, published 2025-11-28, updated 2026-07-09; FETCHED 2026-08-24):
  - per-location bands "$299-$349" / "$399-$599" / "$449-$699+"
  - volume pricing "$200-$250" per location at 10 locations
  - "The 8% 'Innovation Fee' added at renewal"
  - integration/setup "$500-$2,000 for complex CRM/POS integrations"
  - add-on modules "$50-$200/month per location"
  - SMS carrier pass-through "$0.01-$0.03 per message"
  - "12-month annual contract billed monthly, with auto-renewal unless written cancellation notice 90 days before renewal"; early termination charges the remaining contract balance
- REPORTED (https://www.reviewflowz.com/blog/how-much-does-birdeye-really-cost, published 2026-01-05; FETCHED 2026-08-24): $349/mo month-to-month vs $299/mo annual entry; $449/mo next tier; ~$3,600/yr single-brand. Author states outright these came from a pricing-form screenshot and past-client feedback, not documentation — **this weakness is stated in page copy**.
- ⚠️ Source-quality note: both third parties sell against Birdeye. Where they disagree on a band (add-ons $50-$200 vs $50-$150), the pages state the SHAPE of the fee, never a precise figure.
- freeTier: none — the pricing page is a lead form

## 28. Weave ❌ MOSTLY QUOTE-GATED — one published number — quoteGated: true
- pricingUrl: https://www.getweave.com/pricing/ (FETCHED 2026-08-24, twice with different prompts to confirm $199 is not a misread of $249)
- FETCHED, verbatim: "Find just what you need and get the most out of Weave with simple plans and pricing, starting from $199 per month." **This $199 floor is the ONLY dollar figure Weave publishes.**
- FETCHED: three tiers — Pro, Elite ("Most Popular"), Ultimate — each with a "Get Pricing" button and no price.
- FETCHED, Ultimate detail verbatim: "up to 15 phones, 1:1 personalized training, and premium analytics tools"
- FETCHED, all-plan inclusions: "Award-winning customer support" and "Expert onboarding"
- FETCHED: no setup fee, hardware cost, per-location pricing or contract term is disclosed anywhere on the page.
- ⚠️ **DISCREPANCY, carried explicitly in page copy:** every third party reports the Pro floor at $249-$250/mo per location, $50 ABOVE Weave's own live page. Neither figure may be published as "the price". Approved framing: *Weave advertises from $199/mo but quotes all three tiers; third parties report the real entry tier at $249-$250/mo per location and customer-reported spend at $300-$500/mo for a small practice.*
- REPORTED (https://noshowcost.com/tools/weave-pricing, content verified 2026-04-28; FETCHED 2026-08-24 — best-sourced of the set, triangulated from G2/Capterra cost notes Jan 2025–May 2026, public webinars, and Reddit): actual spend "$300 to $400" (1-3 providers), "$400 to $500" (2-5), "$500 to $700" (multi-location), "$800 to $1,200" (enterprise multi-location); "$400 one-time port and setup"; customers "frequently mention 15 to 25 percent renewal price increases"
- REPORTED (https://www.iplum.com/blog/weave-pricing-plans; FETCHED 2026-08-24; iPlum competes with Weave): Pro "$249/month" per location; setup "$500-$750"; forms migration "$200" upfront then "$20" per subsequent upload; "Power Pack" "$25 per user per month"; extra phone numbers "$5/month" per line; desk phones "$131.51" per device; bulk-message caps 1,500 / 3,000 / 15,000
- REPORTED (https://emitrr.com/blog/weave-pricing/, updated 2026-08-13; Emitrr competes with Weave): "$250/month" base; setup "$750"; the same $200 / $20 forms fees; the same 1,500 / 3,000 / 15,000 caps; free Yealink VoIP phones on certain plans (**directly contradicts iPlum's $131.51 desk phones — neither hardware figure is published on any page**)
- ⛔ **Setup-fee amount is NOT publishable.** Three sources report $400, $500-$750 and $750. The pages assert only that a one-time fee is *reported to exist* while Weave advertises onboarding as included — that gap is a DISCLOSURE claim we can make, not a fee amount we can quote.
- ⛔ dead/blocked URLs, do not retry: https://www.g2.com/products/weave-weave/pricing (403), https://www.themolarreport.com/learn/weave-pricing (404 — the $249 figure attributed to it in search snippets was never verified against the page, so $249 rests on iPlum alone)
- freeTier: none

## 29. Ruby Receptionist ✅ FETCHED — quoteGated: false
- pricingUrl: https://www.ruby.com/pricing/ (FETCHED 2026-08-24)
- corroborating vendor pages: https://www.ruby.com/plans-and-pricing/ and https://www.ruby.com/faq/ (both FETCHED 2026-08-24)
- plans, virtual receptionist (all FETCHED): "$250" / 50 minutes · "$395" / 100 minutes · "$720" / 200 minutes · "$1,725" / 500 minutes
- plans, live chat (FETCHED, a SEPARATE meter): "$143" / 10 chats · "$335" / 30 chats · "$520" / 50 chats
- bundles (FETCHED): receptionist + 10 chats "$115" · + 30 chats "$268" · + 50 chats "$416"; the page states the bundle is 20% off standalone chat
- ⚠️ Two independent extractions of the same page disagreed on the middle tier NAMES (Starter/Standard/Popular/Enterprise vs Starter/Basic/Popular/Professional) while agreeing exactly on every price and minute count. **The pages therefore name each plan by its included minute count, never by a tier name.**
- DERIVED per-minute (plan price ÷ vendor-published included minutes): $250/50 = **$5.00** · $395/100 = **$3.95** · $720/200 = **$3.60** · $1,725/500 = **$3.45**
- DERIVED per-chat: $143/10 = **$14.30** · $335/30 = **$11.17** · $520/50 = **$10.40**
- FETCHED vendor claim, quoted verbatim in page copy: "no additional or hidden fees for activation, onboarding, setup, customization"
- FETCHED: optional AI enhancements are stated as available on all plans at no extra cost
- ⛔ **Overage rate is NOT published** on /pricing/, /plans-and-pricing/ or /faq/ — all three checked and confirmed silent. Contract length, annual discount and minute-rounding method are also absent. The pages say so explicitly; that absence IS the story.
- REPORTED, flagged stale in page copy (https://vida.io/blog/ruby-receptionists-pricing and https://oncrew.ai/blog/ruby-receptionist-alternatives-2026, both retrieved 2026-08-24): an overage ladder of $5.40 / $4.45 / $4.35 / $4.25 / $3.95 / $3.80 / $3.60 / $3.50 / $3.40 / $3.30 per minute — **quoted against a legacy lineup ("Call Ruby 50" through "Call Ruby 2,500") whose tier names and tier count do not match the four live plans.** Page copy carries only the $5.40-down-to-$3.30 range, labelled reported AND stale.
- freeTier: none

## 30. Thryv 🔶 PARTIALLY PUBLISHED — quoteGated: true (Amplify, Boosts, seats, usage)
- pricingUrl: https://www.thryv.com/pricing/ (FETCHED 2026-08-24, twice with different prompts)
- plans (FETCHED): Starter "$99 per month", 1 user — 60+ listing directories, digital marketing score, AI website builder, AI review management, trackable phone numbers, digital performance insights, 24/7 chat support · Signature "$399 per month" (marked "Recommended"), 5 users — adds social media management, SEO & AEO custom website, advanced listings, competitive insights & heatmap, AI lead insights, 24/7 phone & email support · Amplify "Custom", no amount displayed, button goes to demo scheduling (QUOTE-GATED)
- ⚠️ FETCHED but UNRESOLVED: the page shows an "Annual Save 15%" / "Monthly" toggle and never states which basis the displayed $99/$399 use. Two fetches with different prompts failed to resolve it. **Page copy states the ambiguity rather than picking a side.**
- FETCHED: Thryv Boosts (Ads, Search, Social, Brand) are described as done-for-you marketing services on Signature and Amplify — **no price disclosed anywhere** (QUOTE-GATED)
- FETCHED: no cost is stated for a user beyond the included 1 (Starter) or 5 (Signature)
- FETCHED: no onboarding fee, setup fee, support fee or SMS rate appears on the pricing page
- REPORTED (https://schedulingkit.com/pricing-guides/thryv-pricing and https://tekpon.com/software/thryv/pricing/, both retrieved 2026-08-24): "$250" one-time onboarding fee on all package levels; "$9" monthly support fee; SMS "$0.015" per message; voice "$0.01" per minute; Command Center seats free/Basic, ~"$20" per seat/mo (Plus), ~"$30" per seat/mo (Professional)
- ⛔ **NOT published on any page:** the G2 (4.2-4.6/5) vs Trustpilot (2.3/5) review-sentiment split was in the research pack but was NOT independently fetched, so it was dropped rather than published.
- freeTier: none

## 31. Tidio ✅ FETCHED — quoteGated: true (Premium; Growth/Plus quotas)
- pricingUrl: https://www.tidio.com/pricing/ (FETCHED 2026-08-24, three times across the research and publishing passes)
- plans (all FETCHED, verbatim price strings): Free "$0/mo." · Starter "$24.17/mo." · Growth "Starts at $49.17/mo." · Plus "Starts at $300/mo. + monthly usage" · Premium "Contact for pricing" (QUOTE-GATED)
- included quotas (FETCHED): Free — 50 billable conversations, 50 Lyro AI conversations (one-off), 100 Flows visitors reached, 10 seats · Starter — 100 billable conversations, 50 Lyro AI conversations (one-off), 100 Flows visitors, 10 seats · Growth — up to 2,000 billable conversations, Lyro and Flows both "Custom" · Plus — custom conversations and custom seat count · Premium — Lyro "From 3,000"
- add-ons (FETCHED, verbatim): Lyro AI Agent "Starts at $32.50/mo. From 50 Lyro AI conversations" · Flows "Starts at $24.17/mo. From 2 000 visitors reached"
- FETCHED: annual billing advertised as "Annually (2 months free)"
- FETCHED: the guaranteed 50% Lyro resolution rate and pay-per-resolution billing are **Premium-exclusive**
- DERIVED: $32.50 ÷ 50 = **$0.65 per Lyro AI conversation** at the entry bundle · $24.17 ÷ 2,000 = **~$0.012 per Flows visitor** · $300 ÷ $49.17 = **~6.1x Growth→Plus step**
- ⚠️ FETCHED but UNRESOLVED: whether $24.17 / $49.17 are true month-to-month or annual-billed-monthly. The decimals are arithmetically consistent with the annual "2 months free" discount ($29 × 10 ÷ 12 = $24.17; $59 × 10 ÷ 12 = $49.17) while the toggle read as Monthly. **The implied $29/$59 month-to-month figures are INFERRED and are NOT published anywhere.** Page copy states the ambiguity.
- ⛔ no explicit per-conversation overage rate is published — Tidio sells bundles, not overage. Not invented.
- freeTier: yes — $0/mo Free plan as itemised above

## 32. ElevenLabs Agents ✅ FETCHED — quoteGated: false (Enterprise only)
- pricingUrl: https://elevenlabs.io/pricing/agents (FETCHED 2026-08-24, twice)
- secondary vendor source: https://elevenlabs.io/pricing (FETCHED 2026-08-24 — main plan ladder + the annual "pay for 10 months" 20% structure; it does NOT address agent per-minute rates)
- plans (all FETCHED — price / included agent minutes / concurrent calls): Free "$0" / 15 / 4 · Starter "$6" / 75 / 6 · Creator "$22" (first month 50% off at "$11") / 275 / 10 · Pro "$99" / 1,238 / 20 · Scale "$299" / 3,738 / 30 · Business "$990" / 12,375 / 40 · Enterprise Custom, no figure (QUOTE-GATED)
- rates (FETCHED, verbatim): standard overage "$0.080" per minute · burst "$0.160" per minute when exceeding the plan's concurrency limit, allowing up to 3x normal concurrency · text messages "$0.003" each
- vendor statement quoted verbatim in page copy (FETCHED): "The LLM model and any telephony are billed separately on top, based on usage."
- ⛔ **No LLM rate and no telephony rate is published anywhere.** All-in cost per call is therefore NOT determinable from vendor disclosures; the pages state that $0.08/min is a floor, never a total.
- DERIVED, the strongest finding on this vendor — bundled minutes carry **zero** volume discount. Plan price ÷ included minutes at every paid tier: $6/75 = $0.0800 · $22/275 = $0.0800 · $99/1,238 = $0.0800 · $299/3,738 = $0.0800 · $990/12,375 = $0.0800. Identical to the published overage rate; the subscription is prepaid minutes at list price and a higher tier buys concurrency headroom only. Independently checkable arithmetic on the vendor's own numbers.
- annualDiscount: FETCHED — main plan page structures annual as "pay for 10 months" (two months free, ~20%)
- freeTier: yes — 15 agent minutes/mo, 4 concurrent calls
- ⛔ dead URL, do not retry: https://elevenlabs.io/docs/agents-platform/pricing returns 404

---

## Cross-vendor notes for this wave

1. **Only 3 of the 7 publish a real price book.** Bland AI, Ruby and ElevenLabs do. Tidio and Thryv publish part of one. Weave publishes exactly one number ($199 floor). Birdeye publishes nothing at all.
2. **All the reported-only material comes from vendors' competitors.** Emitrr, iPlum, Reviewflowz, Wiserreview and NoShowCost all sell against or compare the vendors they cost out, so they have a structural incentive to inflate total cost. NoShowCost is the most defensible (it names its method and admits the vendor page is gated); Reviewflowz is the most candid about its own weakness. Where two disagree on a band, the pages publish the SHAPE of the fee, never a precise figure.
3. **Contract lock-in is REPORTED, never vendor-published,** for both Birdeye (12-month, 90-day notice, remaining-balance ETF, ~8% renewal fee) and Weave (contract required, 15-25% renewal increases). Every mention on a page carries "reported by reviewers".
4. **The growth-tax pattern** is structural and can be argued without quoting any unverified competitor number: Birdeye and Weave price per location with add-ons that also multiply per location; Weave layers a per-user add-on on top of that; Bland charges a platform fee that buys a discount rather than an allowance, then meters talk time, transfer time, SMS and web messages separately.
5. **Nothing in the July 2026 block was found stale by this wave.** No fact gathered here contradicts the existing vapi / retell-ai / synthflow registry rows. Those rows still carry `verified: "July 2026"` and are due for their own re-check pass.
