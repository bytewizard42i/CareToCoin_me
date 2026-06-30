// =============================================================================
// RELIEF ORG CATALOG
// -----------------------------------------------------------------------------
// This is a TEMPLATE you edit by hand. To add or remove an org the user can
// donate to, add/remove an entry below. Anything with `enabled: true` shows up
// as a choice in the UI automatically. Nothing else needs to change.
//
// IMPORTANT: these are REAL organizations. In demoLand they are selectable
// choices only and NO real funds move. Before routing real money to any of
// these in realDeal, verify the org's current wallet/payout details and legal
// status (see `verified` + `verifyNote`). Never hardcode a real payout target
// you have not confirmed.
// =============================================================================

/**
 * @typedef {Object} ReliefOrg
 * @property {string}  id          stable key (used by providers + contracts)
 * @property {boolean} enabled     show as a choice in the UI
 * @property {string}  name        display name
 * @property {string}  shortName   compact label
 * @property {string}  scope       "global" | "venezuela" | region tag
 * @property {string}  category    "red-cross" | "faith" | "un" | "medical" | "food" | "aggregator"
 * @property {string}  blurb       one-line description shown to the donor
 * @property {string}  website     official site (for the user to verify)
 * @property {boolean} verified    have WE confirmed payout details? (false in demo)
 * @property {string}  verifyNote  what still needs checking before real routing
 * @property {string}  emoji       small visual marker
 */

/** @type {ReliefOrg[]} */
export const reliefOrgs = [
  {
    id: 'cruz-roja-venezolana',
    enabled: true,
    name: 'Cruz Roja Venezolana (Venezuelan Red Cross)',
    shortName: 'Cruz Roja VE',
    scope: 'venezuela',
    category: 'red-cross',
    blurb: 'National Red Cross society coordinating on-the-ground earthquake relief.',
    website: 'https://www.cruzrojavenezolana.org',
    verified: false,
    verifyNote: 'Confirm official donation channel + any Midnight/crypto payout address before real routing.',
    emoji: '🩸',
  },
  {
    id: 'caritas-venezuela',
    enabled: true,
    name: 'Cáritas de Venezuela',
    shortName: 'Cáritas VE',
    scope: 'venezuela',
    category: 'faith',
    blurb: 'Catholic humanitarian network with deep local distribution reach.',
    website: 'https://caritasvenezuela.org',
    verified: false,
    verifyNote: 'Confirm legal entity + payout channel before real routing.',
    emoji: '⛪',
  },
  {
    id: 'ifrc',
    enabled: true,
    name: 'International Federation of Red Cross and Red Crescent Societies',
    shortName: 'IFRC',
    scope: 'global',
    category: 'red-cross',
    blurb: 'Global Red Cross federation funding national-society disaster response.',
    website: 'https://www.ifrc.org',
    verified: false,
    verifyNote: 'Confirm earmarking path to Venezuela appeal before real routing.',
    emoji: '🌐',
  },
  {
    id: 'msf',
    enabled: true,
    name: 'Médicos Sin Fronteras (Doctors Without Borders)',
    shortName: 'MSF',
    scope: 'global',
    category: 'medical',
    blurb: 'Emergency medical teams for trauma and post-disaster health needs.',
    website: 'https://www.msf.org',
    verified: false,
    verifyNote: 'MSF often restricts earmarking; confirm acceptance of crypto + Venezuela designation.',
    emoji: '🚑',
  },
  {
    id: 'world-central-kitchen',
    enabled: true,
    name: 'World Central Kitchen',
    shortName: 'WCK',
    scope: 'global',
    category: 'food',
    blurb: 'Rapid-deploy meals for disaster zones; frequent earthquake responder.',
    website: 'https://wck.org',
    verified: false,
    verifyNote: 'Confirm active Venezuela deployment + payout channel before real routing.',
    emoji: '🍲',
  },
  {
    id: 'unicef-venezuela',
    enabled: true,
    name: 'UNICEF Venezuela',
    shortName: 'UNICEF VE',
    scope: 'venezuela',
    category: 'un',
    blurb: 'UN agency focused on children affected by the disaster.',
    website: 'https://www.unicef.org/venezuela',
    verified: false,
    verifyNote: 'Confirm crypto-acceptance path (UNICEF CryptoFund) + earmarking before real routing.',
    emoji: '👶',
  },
  {
    id: 'globalgiving-venezuela',
    enabled: true,
    name: 'GlobalGiving — Venezuela Earthquake Relief Fund',
    shortName: 'GlobalGiving',
    scope: 'venezuela',
    category: 'aggregator',
    blurb: 'Aggregator routing to vetted local partners; useful as a GoFundMe-style bridge.',
    website: 'https://www.globalgiving.org',
    verified: false,
    verifyNote: 'Good candidate for the external-bridge arm; confirm fund exists + payout API.',
    emoji: '🤝',
  },
];

/** Only the enabled orgs, for the UI. */
export const enabledReliefOrgs = () => reliefOrgs.filter((o) => o.enabled);

export const getReliefOrg = (id) => reliefOrgs.find((o) => o.id === id);
