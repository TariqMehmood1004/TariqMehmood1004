// Generates the static SVG cards used by README.md.
// Edit the data below, then run: node scripts/build-cards.mjs
import { mkdirSync, writeFileSync } from 'node:fs'

const OUT = new URL('../assets/', import.meta.url)
const SANS = `Inter, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif`
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
const C = { bg: '#0a0a0a', line: '#1f1f1f', chip: '#151515', text: '#fafafa', body: '#d4d4d4', muted: '#8a8a8a', accent: '#f5a524' }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function wrap(text, max) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max) { lines.push(line); line = word }
    else line = (line + ' ' + word).trim()
  }
  if (line) lines.push(line)
  return lines
}

const svg = (w, h, label, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="16" fill="${C.bg}" stroke="${C.line}" />
${body}
</svg>
`

const eyebrow = (x, y, text, anchor = 'start') =>
  `  <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${SANS}" font-size="12" font-weight="600" letter-spacing="2.5" fill="${C.accent}">${esc(text.toUpperCase())}</text>`

function write(name, content) {
  const url = new URL(name, OUT)
  mkdirSync(new URL('./', url), { recursive: true })
  writeFileSync(url, content)
  console.log('wrote assets/' + name)
}

// ---------------------------------------------------------------- stats strip
const STATS = [
  ['9', '+', 'Years in production'],
  ['100', '+', 'Client projects delivered'],
  ['85', '%', 'Downtime cut, smart building'],
  ['8', '+', 'Engineers led'],
  ['19', '', 'npm packages published'],
]
{
  const w = 1200, h = 150, col = w / STATS.length
  const cells = STATS.map(([n, suffix, label], i) => {
    const cx = col * i + col / 2
    const divider = i ? `  <line x1="${col * i}" y1="32" x2="${col * i}" y2="${h - 32}" stroke="${C.line}" />\n` : ''
    return `${divider}  <text x="${cx}" y="80" text-anchor="middle" font-family="${SANS}" font-size="46" font-weight="800" letter-spacing="-1.5" fill="${C.text}">${n}<tspan fill="${C.accent}">${suffix}</tspan></text>
  <text x="${cx}" y="110" text-anchor="middle" font-family="${SANS}" font-size="11.5" font-weight="600" letter-spacing="2" fill="${C.muted}">${esc(label.toUpperCase())}</text>`
  })
  write('stats.svg', svg(w, h, 'Career highlights', cells.join('\n')))
}

// ---------------------------------------------------------------- project cards
export const PROJECTS = [
  {
    slug: '01-manufacturing-platform', eyebrow: '01 · Current role · 2026 – Present',
    title: 'Enterprise Manufacturing Platform', role: 'Senior Software Engineer & Solution Architect',
    desc: 'Event-driven microservices connecting product lifecycle, production planning and ERP workflows around a single system of record, prepared for device telemetry and AI-assisted planning.',
    tags: ['.NET', 'PostgreSQL', 'Redis', 'Message queues'],
  },
  {
    slug: '02-tygent', eyebrow: '02 · Personal · AI platform', metric: ['8', 'AI agents'],
    title: 'Tygent', role: 'Multi-agent recruitment AI · Creator & Architect',
    desc: 'Eight specialized agents analyze resumes and job descriptions, match candidates, flag hiring risks and assess interview readiness, streamed live to the recruiter over SSE.',
    tags: ['Next.js', 'OpenAI', 'Drizzle', 'SSE'],
  },
  {
    slug: '03-commerce-payments', eyebrow: '03 · SwiftNine LLC · 2026', metric: ['4', 'Payment providers'],
    title: 'Commerce & Payments', role: 'Multi-tenant commerce backend · Senior Engineer',
    desc: 'One centralized backend behind multiple Shopify and WooCommerce storefronts: product sync, cross-store checkout and Stripe, PayPal, Adyen and OceanPayment behind one payment layer.',
    tags: ['Node.js', 'PostgreSQL', 'Stripe', 'Adyen'],
  },
  {
    slug: '04-axiljs', eyebrow: '04 · Open source · 2026 – Present', metric: ['19', 'npm packages'],
    title: 'AxilJS', role: 'Backend ecosystem · Creator & Architect',
    desc: 'A modular TypeScript backend toolkit from HTTP and routing to ORM, auth, real-time, queues, AI and observability, built for both low-latency monoliths and microservices.',
    tags: ['TypeScript', 'Node.js', 'Kafka', 'Kubernetes'],
  },
  {
    slug: '05-smart-building', eyebrow: '05 · Pakistan Air Force · Hyetel X', metric: ['85%', 'Less downtime'],
    title: 'Smart Building Automation', role: 'Building management system · Senior Engineer',
    desc: 'Monitors and controls 16+ building subsystems in real time, handles millions of requests with clustering and worker threads, and predicts failures with AI anomaly detection.',
    tags: ['Node.js', 'Python', 'Socket.IO', 'Kafka'],
  },
  {
    slug: '06-emergi-mentors', eyebrow: '06 · Emergi Mentors · Australia', metric: ['8+', 'Engineers led'],
    title: 'Emergi Mentors', role: 'Mentoring platform · Technical Lead & Architect',
    desc: 'A mentorship marketplace with live video sessions and AI-powered career services, architected and launched while leading an 8+ member engineering team.',
    tags: ['FastAPI', 'Laravel', 'PostgreSQL', 'Docker'],
  },
  {
    slug: '07-casinoze', eyebrow: '07 · Dark Bytes · 2024 – 2025',
    title: 'Casinoze', role: 'Real-time gaming platform · Backend Lead',
    desc: 'Django REST Framework APIs for core workflows and WebSockets for live events, notifications and synchronized clients, with Celery workers and optimized PostgreSQL transactions.',
    tags: ['Django', 'WebSockets', 'Redis', 'Celery'],
  },
  {
    slug: '08-media-player', eyebrow: '08 · Personal · 2025 – Present',
    title: 'SyntaxilitY Media Player', role: 'Cross-platform desktop app · Creator',
    desc: 'An Electron desktop player with playlists, subtitles and lyrics, mini, floating and full-screen modes, and a glass interface whose colors adapt to whatever is playing.',
    tags: ['Electron', 'React', 'TypeScript', 'Zustand'],
  },
]

function chips(x, y, tags) {
  let cx = x
  return tags.map((t) => {
    const w = Math.round(t.length * 7.4 + 26)
    const out = `  <rect x="${cx}" y="${y}" width="${w}" height="28" rx="14" fill="${C.chip}" stroke="#262626" />
  <text x="${cx + w / 2}" y="${y + 18.5}" text-anchor="middle" font-family="${SANS}" font-size="12.5" font-weight="500" fill="#b5b5b5">${esc(t)}</text>`
    cx += w + 8
    return out
  }).join('\n')
}

for (const p of PROJECTS) {
  const w = 600, h = 300
  const parts = [eyebrow(32, 48, p.eyebrow)]
  if (p.metric) {
    parts.push(`  <text x="${w - 32}" y="${92}" text-anchor="end" font-family="${SANS}" font-size="34" font-weight="800" letter-spacing="-1" fill="${C.text}">${esc(p.metric[0])}</text>`)
    parts.push(`  <text x="${w - 32}" y="${112}" text-anchor="end" font-family="${SANS}" font-size="11" font-weight="600" letter-spacing="1.5" fill="${C.muted}">${esc(p.metric[1].toUpperCase())}</text>`)
  }
  parts.push(`  <text x="32" y="96" font-family="${SANS}" font-size="27" font-weight="800" letter-spacing="-0.6" fill="${C.text}">${esc(p.title)}</text>`)
  parts.push(`  <text x="32" y="122" font-family="${SANS}" font-size="14.5" fill="${C.muted}">${esc(p.role)}</text>`)
  wrap(p.desc, 70).slice(0, 4).forEach((line, i) => {
    parts.push(`  <text x="32" y="${162 + i * 22}" font-family="${SANS}" font-size="14.5" fill="${C.body}">${esc(line)}</text>`)
  })
  parts.push(chips(32, 240, p.tags))
  parts.push(`  <text x="${w - 32}" y="${258}" text-anchor="end" font-family="${SANS}" font-size="13" font-weight="600" fill="${C.accent}">View →</text>`)
  write(`projects/${p.slug}.svg`, svg(w, h, `${p.title}: ${p.desc}`, parts.join('\n')))
}

// ---------------------------------------------------------------- AxilJS packages
const PACKAGES = [
  ['core', 'HTTP server, router, middleware'], ['queue', 'Message queue, cron, retry with backoff'],
  ['orm', 'PostgreSQL, MySQL, SQLite, migrations'], ['events', 'Pub/sub event bus'],
  ['auth', 'JWT, password hashing, RBAC'], ['circuit', 'Circuit breaker, retries, timeouts'],
  ['security', 'Helmet, rate limiting, CSRF, sanitization'], ['ai', 'OpenAI, Anthropic, Gemini, Ollama, RAG, MCP'],
  ['validation', 'Schema-based request validation'], ['observability', 'Logs, Prometheus metrics, tracing'],
  ['websocket', 'RFC 6455 server with rooms'], ['cloud', 'Multi-tenancy, audit logs, feature flags'],
  ['testing', 'Test runner and HTTP test client'], ['cli', 'axil create, run, build, test, deploy'],
]
{
  const w = 1200, rowH = 46, top = 150, h = top + Math.ceil(PACKAGES.length / 2) * rowH + 24
  const parts = [
    eyebrow(40, 52, 'Open source · axiljs.dev'),
    `  <text x="40" y="96" font-family="${SANS}" font-size="34" font-weight="800" letter-spacing="-1" fill="${C.text}">AxilJS<tspan fill="${C.accent}">.</tspan></text>`,
    `  <text x="40" y="124" font-family="${SANS}" font-size="15" fill="${C.muted}">The infrastructure I kept rebuilding on every project, packaged once and published to npm.</text>`,
    `  <text x="${w - 40}" y="96" text-anchor="end" font-family="${SANS}" font-size="34" font-weight="800" fill="${C.text}">19</text>`,
    `  <text x="${w - 40}" y="124" text-anchor="end" font-family="${SANS}" font-size="11" font-weight="600" letter-spacing="1.5" fill="${C.muted}">NPM PACKAGES</text>`,
  ]
  PACKAGES.forEach(([name, desc], i) => {
    const x = i % 2 ? 620 : 40, y = top + Math.floor(i / 2) * rowH
    parts.push(`  <line x1="${x}" y1="${y}" x2="${x + 540}" y2="${y}" stroke="${C.line}" />`)
    parts.push(`  <text x="${x}" y="${y + 29}" font-family="${MONO}" font-size="14" fill="${C.accent}">@axiljs/${esc(name)}</text>`)
    parts.push(`  <text x="${x + 200}" y="${y + 29}" font-family="${SANS}" font-size="14" fill="${C.body}">${esc(desc)}</text>`)
  })
  write('axiljs.svg', svg(w, h, 'AxilJS packages', parts.join('\n')))
}

// ---------------------------------------------------------------- expertise
const EXPERTISE = [
  ['Solution Architecture & System Design', 'Microservices · Modular monoliths · Multi-tenant SaaS · SOA · MVC / MVVM / MVT · Database & API design'],
  ['Backend Engineering & APIs', 'Node.js · TypeScript · Python · FastAPI · Django · ASP.NET Core · Prisma · Drizzle · OpenAPI · JWT · OAuth 2.0'],
  ['Event-Driven & Real-Time Systems', 'Apache Kafka · RabbitMQ · Redis · Celery · WebSockets · Socket.IO · SSE · Clustering · Worker threads'],
  ['AI Engineering', 'LLMs · Multi-agent orchestration · RAG · LangChain · OpenAI · Claude · NLP · Computer vision · Anomaly detection'],
  ['Enterprise & Payment Integrations', 'SAP Business One · Odoo 19 · WhatsApp Cloud API · Shopify · WooCommerce · Stripe · PayPal · Adyen'],
  ['Cloud, DevOps & Delivery', 'AWS (EC2, S3, RDS) · Docker · Kubernetes · Nginx · Linux · GitHub Actions · Unit & integration testing'],
  ['Full-Stack, Desktop & Mobile', 'React · Next.js · Redux Toolkit · Zustand · Tailwind CSS · Electron · React Native · Flutter'],
]
{
  const w = 1200, rowH = 74, top = 130, h = top + EXPERTISE.length * rowH + 20
  const parts = [
    eyebrow(40, 52, 'Expertise'),
    `  <text x="40" y="96" font-family="${SANS}" font-size="34" font-weight="800" letter-spacing="-1" fill="${C.text}">What I do best<tspan fill="${C.accent}">.</tspan></text>`,
    `  <text x="${w - 40}" y="96" text-anchor="end" font-family="${SANS}" font-size="15" fill="${C.muted}">Understand the problem, design the system, then ship it properly.</text>`,
  ]
  EXPERTISE.forEach(([title, tools], i) => {
    const y = top + i * rowH
    parts.push(`  <line x1="40" y1="${y}" x2="${w - 40}" y2="${y}" stroke="${C.line}" />`)
    parts.push(`  <text x="40" y="${y + 33}" font-family="${MONO}" font-size="14" fill="${C.accent}">${String(i + 1).padStart(2, '0')}</text>`)
    parts.push(`  <text x="96" y="${y + 33}" font-family="${SANS}" font-size="19" font-weight="700" fill="${C.text}">${esc(title)}</text>`)
    parts.push(`  <text x="96" y="${y + 57}" font-family="${SANS}" font-size="14" fill="${C.muted}">${esc(tools)}</text>`)
  })
  write('expertise.svg', svg(w, h, 'What I do best', parts.join('\n')))
}

// ---------------------------------------------------------------- experience
const EXPERIENCE = [
  ['Sep 2026 – Present', 'Senior Software Engineer & Solution Architect', 'Enterprise manufacturing platform', 'Now'],
  ['Mar 2026 – Aug 2026', 'Senior Software Engineer', 'SwiftNine LLC'],
  ['Aug 2025 – Mar 2026', 'Senior Software Engineer', 'Hyetel X · Pakistan Air Force', 'Contract'],
  ['Mar 2025 – Aug 2025', 'Senior Technical Team Lead', 'LCI Systems', 'Contract'],
  ['Sep 2024 – Apr 2025', 'Senior Full Stack Developer', 'Dark Bytes', 'Contract'],
  ['Jan 2024 – Dec 2024', 'Full Stack Developer', 'MTech Soft LLC', 'Contract'],
  ['Feb 2020 – Nov 2023', 'Full Stack Developer', 'INSTACOM (ISP)', 'Onsite'],
  ['Feb 2017 – Aug 2025', 'Full Stack Engineer', 'Upwork · Freelancer · Fiverr', 'Freelance'],
  ['Jan 2020 – Feb 2024', 'BS Software Engineering', 'COMSATS University Islamabad'],
]
{
  const w = 1200, rowH = 54, top = 130, h = top + EXPERIENCE.length * rowH + 20
  const parts = [
    eyebrow(40, 52, 'Experience'),
    `  <text x="40" y="96" font-family="${SANS}" font-size="34" font-weight="800" letter-spacing="-1" fill="${C.text}">Where I've built<tspan fill="${C.accent}">.</tspan></text>`,
    `  <text x="${w - 40}" y="96" text-anchor="end" font-family="${SANS}" font-size="15" fill="${C.muted}">From freelance projects in 2017 to enterprise platforms.</text>`,
  ]
  EXPERIENCE.forEach(([period, role, company, tag], i) => {
    const y = top + i * rowH
    const now = tag === 'Now'
    parts.push(`  <line x1="40" y1="${y}" x2="${w - 40}" y2="${y}" stroke="${C.line}" />`)
    parts.push(`  <text x="40" y="${y + 34}" font-family="${MONO}" font-size="13.5" fill="${C.muted}">${esc(period)}</text>`)
    parts.push(`  <text x="260" y="${y + 34}" font-family="${SANS}" font-size="17" font-weight="600" fill="${C.text}">${esc(role)}</text>`)
    parts.push(`  <text x="${w - 150}" y="${y + 34}" text-anchor="end" font-family="${SANS}" font-size="15" fill="${C.body}">${esc(company)}</text>`)
    if (tag) {
      const tw = tag.length * 7.6 + 22, tx = w - 40 - tw
      parts.push(`  <rect x="${tx}" y="${y + 16}" width="${tw}" height="24" rx="12" fill="${now ? 'rgba(34,197,94,0.12)' : C.chip}" stroke="${now ? '#22c55e' : '#262626'}" />`)
      parts.push(`  <text x="${tx + tw / 2}" y="${y + 32}" text-anchor="middle" font-family="${SANS}" font-size="11" font-weight="700" letter-spacing="1.2" fill="${now ? '#22c55e' : C.muted}">${esc(tag.toUpperCase())}</text>`)
    }
  })
  write('experience.svg', svg(w, h, 'Experience', parts.join('\n')))
}

// ---------------------------------------------------------------- contact
{
  const w = 1200, h = 230
  const parts = [
    eyebrow(40, 56, 'Contact'),
    `  <text x="40" y="112" font-family="${SANS}" font-size="44" font-weight="800" letter-spacing="-1.5" fill="${C.text}">Let's build something great together<tspan fill="${C.accent}">.</tspan></text>`,
    `  <text x="40" y="162" font-family="${SANS}" font-size="20" font-weight="600" fill="${C.accent}">tariq-mehmood@engineer.com</text>`,
    `  <text x="40" y="192" font-family="${SANS}" font-size="15" fill="${C.muted}">Senior Engineering · Software &amp; Solutions Architecture · AI Engineering · Technical Leadership · Full-time, contract or remote</text>`,
  ]
  write('contact.svg', svg(w, h, 'Contact: tariq-mehmood@engineer.com', parts.join('\n')))
}
