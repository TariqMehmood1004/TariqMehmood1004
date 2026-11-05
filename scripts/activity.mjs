// Builds assets/activity.svg from the GitHub GraphQL API.
// Runs daily in .github/workflows/activity.yml; locally: GITHUB_TOKEN=$(gh auth token) node scripts/activity.mjs
import { writeFileSync } from 'node:fs'

const LOGIN = process.env.GITHUB_LOGIN || 'TariqMehmood1004'
const TOKEN = process.env.GITHUB_TOKEN
if (!TOKEN) throw new Error('GITHUB_TOKEN is required')

const SANS = `Inter, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif`
const C = { bg: '#0a0a0a', line: '#1f1f1f', text: '#fafafa', body: '#d4d4d4', muted: '#8a8a8a', accent: '#f5a524' }
const LEVELS = ['#161616', '#4a3510', '#7a5512', '#b87b17', '#f5a524']

async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': LOGIN },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

const { user } = await gql(`query($login: String!) {
  user(login: $login) {
    followers { totalCount }
    contributionsCollection {
      totalCommitContributions totalPullRequestContributions restrictedContributionsCount
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } }
    }
  }
}`, { login: LOGIN })

// Stars and languages across every non-fork repository the user owns.
let stars = 0, repoCount = 0, cursor = null
const langs = new Map()
do {
  const { user: page } = await gql(`query($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(first: 100, after: $cursor, ownerAffiliations: OWNER, isFork: false) {
        totalCount pageInfo { hasNextPage endCursor }
        nodes { stargazerCount languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } } }
      }
    }
  }`, { login: LOGIN, cursor })
  const repos = page.repositories
  repoCount = repos.totalCount
  for (const r of repos.nodes) {
    stars += r.stargazerCount
    for (const { size, node } of r.languages.edges) {
      const prev = langs.get(node.name) || { size: 0, color: node.color || C.muted }
      langs.set(node.name, { ...prev, size: prev.size + size })
    }
  }
  cursor = repos.pageInfo.hasNextPage ? repos.pageInfo.endCursor : null
} while (cursor)

const cc = user.contributionsCollection
const weeks = cc.contributionCalendar.weeks
const days = weeks.flatMap((w) => w.contributionDays)

// Streaks: today may still be empty, so the current streak may end yesterday.
let longest = 0, run = 0
for (const d of days) { run = d.contributionCount ? run + 1 : 0; longest = Math.max(longest, run) }
let current = 0
for (let i = days.length - 1; i >= 0; i--) {
  if (days[i].contributionCount) current++
  else if (i === days.length - 1) continue
  else break
}

const fmt = (n) => n.toLocaleString('en-US')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const W = 1200, H = 470
const parts = []

parts.push(`  <text x="40" y="52" font-family="${SANS}" font-size="12" font-weight="600" letter-spacing="2.5" fill="${C.accent}">GITHUB ACTIVITY · LAST 12 MONTHS</text>`)
parts.push(`  <text x="${W - 40}" y="52" text-anchor="end" font-family="${SANS}" font-size="12" font-weight="600" letter-spacing="2" fill="${C.muted}">UPDATED ${new Date().toISOString().slice(0, 10)}</text>`)

// Contribution heatmap
const cell = 15, gap = 4, gx = (W - weeks.length * (cell + gap) + gap) / 2, gy = 80
const levelIndex = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }
weeks.forEach((w, wi) => w.contributionDays.forEach((d) => {
  const di = new Date(d.date + 'T00:00:00Z').getUTCDay()
  parts.push(`  <rect x="${gx + wi * (cell + gap)}" y="${gy + di * (cell + gap)}" width="${cell}" height="${cell}" rx="3" fill="${LEVELS[levelIndex[d.contributionLevel]]}"><title>${d.date}: ${d.contributionCount}</title></rect>`)
}))

// Metrics row
const metrics = [
  [fmt(cc.contributionCalendar.totalContributions), 'Contributions'],
  [fmt(cc.totalCommitContributions + cc.restrictedContributionsCount), 'Commits'],
  [fmt(cc.totalPullRequestContributions), 'Pull requests'],
  [`${current}`, 'Current streak'],
  [`${longest}`, 'Longest streak'],
  [fmt(repoCount), 'Repositories'],
  [fmt(stars), 'Stars earned'],
]
const my = 260, col = (W - 80) / metrics.length
parts.push(`  <line x1="40" y1="${my - 20}" x2="${W - 40}" y2="${my - 20}" stroke="${C.line}" />`)
metrics.forEach(([value, label], i) => {
  const cx = 40 + col * i + col / 2
  parts.push(`  <text x="${cx}" y="${my + 34}" text-anchor="middle" font-family="${SANS}" font-size="32" font-weight="800" letter-spacing="-1" fill="${C.text}">${esc(value)}</text>`)
  parts.push(`  <text x="${cx}" y="${my + 58}" text-anchor="middle" font-family="${SANS}" font-size="11" font-weight="600" letter-spacing="1.5" fill="${C.muted}">${esc(label.toUpperCase())}</text>`)
})

// Language bar
const total = [...langs.values()].reduce((a, l) => a + l.size, 0) || 1
const sorted = [...langs.entries()].sort((a, b) => b[1].size - a[1].size)
const top = sorted.slice(0, 7)
const other = total - top.reduce((a, [, l]) => a + l.size, 0)
if (other > 0) top.push(['Other', { size: other, color: '#3a3a3a' }])
const by = 360, bw = W - 80
parts.push(`  <line x1="40" y1="${by - 20}" x2="${W - 40}" y2="${by - 20}" stroke="${C.line}" />`)
parts.push(`  <clipPath id="bar"><rect x="40" y="${by}" width="${bw}" height="10" rx="5" /></clipPath>`)
let bx = 40
const segs = top.map(([name, l]) => {
  const w = (l.size / total) * bw
  const seg = `    <rect x="${bx}" y="${by}" width="${w}" height="10" fill="${l.color}" />`
  bx += w
  return seg
})
parts.push(`  <g clip-path="url(#bar)">\n${segs.join('\n')}\n  </g>`)
let lx = 40
for (const [name, l] of top) {
  const label = `${name} ${((l.size / total) * 100).toFixed(1)}%`
  parts.push(`  <circle cx="${lx + 5}" cy="${by + 42}" r="5" fill="${l.color}" />`)
  parts.push(`  <text x="${lx + 16}" y="${by + 47}" font-family="${SANS}" font-size="13.5" fill="${C.body}">${esc(label)}</text>`)
  lx += label.length * 7.4 + 44
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub activity for ${LOGIN}">
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="${C.bg}" stroke="${C.line}" />
${parts.join('\n')}
</svg>
`
writeFileSync(new URL('../assets/activity.svg', import.meta.url), svg)
console.log(`wrote assets/activity.svg (${fmt(cc.contributionCalendar.totalContributions)} contributions, ${repoCount} repos)`)
