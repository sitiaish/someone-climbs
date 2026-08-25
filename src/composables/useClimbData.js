import { computed } from 'vue'
import allRoutes from '@/assets/data.json'
import allClimbs from '@/assets/allclimbs.json'

// ---------------------------------------------------------------------------
// Grade ordering — French sport climbing system
// ---------------------------------------------------------------------------
const GRADE_ORDER = [

  '5a', '5a+', '5b', '5b+', '5c', '5c+',
  '6a', '6a+', '6b', '6b+', '6c', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+',
  '8a', '8a+', '8b', '8b+', '8c', '8c+',
  '9a', '9a+', '9b', '9b+', '9c',
]

// Some routes have grades like "6c+/7a" — take the higher one
function normaliseGrade(raw) {
  if (!raw) return null
  if (raw.includes('/')) {
    const parts = raw.split('/')
    return parts.reduce((best, g) => {
      return gradeRank(g.trim()) > gradeRank(best) ? g.trim() : best
    }, parts[0].trim())
  }
  return raw.trim()
}

export function gradeRank(g) {
  const normalised = normaliseGrade(g)
  const idx = GRADE_ORDER.indexOf(normalised)
  return idx === -1 ? -1 : idx
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
export function toTimestamp(r) {
  return new Date(r.Year, r.Month - 1, r.Date).getTime()
}

export function formatMonthYear(month, year) {
  return new Date(year, month - 1).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Main composable
// ---------------------------------------------------------------------------
export function useClimbData() {

  // ── Raw refs (plain arrays — no need for ref() since they never mutate) ──

  const routes = allRoutes       // 36 sport climbing routes, detailed
  const climbs = allClimbs         // 21 trip-level records, both types

  // ── Q1: Hardest grade ────────────────────────────────────────────────────

  const hardestRoute = computed(() => {
    return [...routes].sort((a, b) => gradeRank(b.Grade) - gradeRank(a.Grade))[0]
  })

  const gradeDistribution = computed(() => {
    // Count how many routes at each grade, sorted easy → hard
    const counts = {}
    routes.forEach(r => {
      const g = normaliseGrade(r.Grade)
      counts[g] = (counts[g] || 0) + 1
    })
    return GRADE_ORDER
      .filter(g => counts[g])
      .map(g => ({ grade: g, count: counts[g], rank: gradeRank(g) }))
  })

  // ── Q2: Tick types ────────────────────────────────────────────────────────

  const tickCounts = computed(() => {
    const counts = { Onsight: 0, Flash: 0, 'Red point': 0 }
    routes.forEach(r => {
      if (counts[r.Finish] !== undefined) counts[r.Finish]++
    })
    const total = routes.length
    return Object.entries(counts).map(([type, count]) => ({
      type,
      label: type === 'Red point' ? 'Redpoint' : type,
      count,
      pct: Math.round((count / total) * 100),
    }))
  })

  // ── Q3: Bouldering vs Lead ────────────────────────────────────────────────

  const climbTypeSplit = computed(() => {
    const counts = { Lead: 0, Bouldering: 0 }
    climbs.forEach(c => {
      counts[c.type] = (counts[c.type] || 0) + 1
    })
    const total = climbs.length
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      pct: Math.round((count / total) * 100),
    }))
  })

  // ── Q4: Countries ─────────────────────────────────────────────────────────

  const countriesData = computed(() => {
    const counts = {}
    climbs.forEach(c => {
      counts[c.country] = (counts[c.country] || 0) + 1
    })
    return Object.entries(counts)
      .map(([country, trips]) => ({ country, trips }))
      .sort((a, b) => b.trips - a.trips)
  })

  // ── Q5: All SVG routes ────────────────────────────────────────────────────

  const svgRoutes = computed(() => {
    return routes
      .filter(r => r.D)
      .map(r => ({
        name:     r.Route,
        d:        r.D,
        grade:    normaliseGrade(r.Grade),
        finish:   r.Finish,
        location: r.Location,
        crag:     r.Crag,
      }))
  })

  // ── Q8: Crazy names ───────────────────────────────────────────────────────

  // Tab 1 — all unique route names (both datasets)
  const allRouteNames = computed(() => {
    const fromDetailed = routes.map(r => r.Route)
    const fromGeneral = climbs.flatMap(c =>
      c.routes
        ? c.routes.split(',').map(r => r.trim()).filter(Boolean)
        : []
    )
    // Deduplicate
    return [...new Set([...fromDetailed, ...fromGeneral])]
  })

  const cragAreaWords = computed(() => {
    const counts = {}
    routes.forEach(r => {
      const crag = r.Crag?.trim()
      const area = r.Area?.trim()
      if (crag) counts[crag] = (counts[crag] || 0) + 1
      if (area) counts[area] = (counts[area] || 0) + 1
    })
    return Object.entries(counts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
  })

  // ── Q9: Trip lengths ──────────────────────────────────────────────────────

  const tripLengths = computed(() => {
    const groups = {}
    routes.forEach(r => {
      const key = r['By Trip']
      if (!groups[key]) groups[key] = []
      groups[key].push(new Date(r.Year, r.Month - 1, r.Date))
    })

    return Object.entries(groups)
      .map(([trip, dates]) => {
        const sorted = dates.sort((a, b) => a - b)
        const first  = sorted[0]
        const last   = sorted[sorted.length - 1]
        const days   = Math.round((last - first) / (1000 * 60 * 60 * 24)) + 1
        // Find location for this trip
        const sample = routes.find(r => r['By Trip'] === trip)
        return {
          trip,
          location: `${sample.Location}, ${sample.Country}`,
          startDate: first,
          endDate: last,
          days,
          label: formatMonthYear(first.getMonth() + 1, first.getFullYear()),
        }
      })
      .sort((a, b) => b.startDate - a.startDate)
  })

  const avgTripDays = computed(() => {
    const total = tripLengths.value.reduce((sum, t) => sum + t.days, 0)
    return Math.round(total / tripLengths.value.length)
  })

  const longestTrip = computed(() => {
    return tripLengths.value.reduce((max, t) => t.days > max.days ? t : max, tripLengths.value[0])
  })

  // ── Expose ────────────────────────────────────────────────────────────────

  return {
    // raw
    routes,
    climbs,

    // Q1
    hardestRoute,
    gradeDistribution,

    // Q2
    tickCounts,

    // Q3
    climbTypeSplit,

    // Q4
    countriesData,

    // Q5
    svgRoutes,

    // Q8
    allRouteNames,
    cragAreaWords,

    // Q9
    tripLengths,
    avgTripDays,
    longestTrip,

    // helpers — exported so answer components can use them directly
    gradeRank,
    normaliseGrade,
    GRADE_ORDER,
    formatMonthYear,
  }
}
