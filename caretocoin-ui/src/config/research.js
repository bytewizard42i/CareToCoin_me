// =============================================================================
// RESEARCH HELPER
// -----------------------------------------------------------------------------
// Builds a research panel for ANY catalog entity (relief org, on-ramp,
// off-ramp). It derives sensible defaults from the entity (live news search
// link, ranking-service lookup links) so you get a research panel for free.
//
// To ENRICH an entity, add an optional `research` block to its catalog entry:
//   research: {
//     email: 'partnerships@org.org',
//     contactUrl: 'https://org.org/contact',
//     newsQuery: 'custom search terms',
//     rankings: [{ service: 'Charity Navigator', url: '...', note: '4/4 (verify)' }],
//     news: [{ title: '...', url: '...', source: '...', date: '2026-06-25' }],
//   }
// Anything you omit is filled in by the defaults below.
// =============================================================================

const enc = encodeURIComponent;

// Live search links (open in a new tab). These are SEARCHES, not claims, so
// they stay correct over time and never assert a stale rating.
const googleNews = (q) => `https://news.google.com/search?q=${enc(q)}`;
const trustpilot = (name) => `https://www.trustpilot.com/search?query=${enc(name)}`;
const crunchbase = (name) => `https://www.crunchbase.com/textsearch?q=${enc(name)}`;
const bbb = (name) => `https://www.bbb.org/search?find_text=${enc(name)}`;
const charityNavigator = (name) => `https://www.charitynavigator.org/search?q=${enc(name)}`;
const candid = (name) => `https://www.guidestar.org/search?q=${enc(name)}`;

// kind: 'org' | 'onramp' | 'offramp'
function defaultRankings(entity, kind) {
  const name = entity.name || entity.shortName || entity.id;
  if (kind === 'org') {
    return [
      { service: 'Charity Navigator', url: charityNavigator(name), note: 'Lookup (verify rating)' },
      { service: 'Candid / GuideStar', url: candid(name), note: 'Nonprofit profile' },
      { service: 'BBB Wise Giving', url: bbb(name), note: 'Accreditation lookup' },
    ];
  }
  // fintech ramps
  return [
    { service: 'Trustpilot', url: trustpilot(name), note: 'User reviews' },
    { service: 'Crunchbase', url: crunchbase(name), note: 'Company profile' },
    { service: 'BBB', url: bbb(name), note: 'Business profile' },
  ];
}

function defaultNewsQuery(entity, kind) {
  const name = entity.name || entity.shortName || entity.id;
  // Orgs get the disaster context so news is relevant to the campaign.
  return kind === 'org' ? `${name} Venezuela earthquake relief` : `${name} crypto Venezuela`;
}

/**
 * Build the research view-model for an entity.
 * @param {Object} entity  a catalog entry (org / onramp / offramp)
 * @param {('org'|'onramp'|'offramp')} kind
 */
export function buildResearch(entity, kind) {
  if (!entity) return null;
  const r = entity.research || {};
  const newsQuery = r.newsQuery || defaultNewsQuery(entity, kind);
  return {
    name: entity.name || entity.shortName || entity.id,
    url: entity.website || r.contactUrl || null,
    contactUrl: r.contactUrl || entity.website || null,
    email: r.email || null, // never guessed; blank means "find on their site"
    rankings: r.rankings || defaultRankings(entity, kind),
    news: r.news || [], // optional curated items
    newsSearchUrl: googleNews(newsQuery), // always a live search link
    verifyNote: entity.verifyNote || null,
    verified: entity.verified ?? null,
  };
}
