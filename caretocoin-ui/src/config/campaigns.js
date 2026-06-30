// =============================================================================
// CAMPAIGN CATALOG
// -----------------------------------------------------------------------------
// A Campaign is the generic unit of giving (see docs/MASTER_PLAN.md s.1).
// type: "disaster-relief" | "political" | "general" | "external-bridge"
// The flagship is the June 24, 2026 Venezuela earthquake relief campaign,
// tied to a SentinelDID-style EmergencyEvent (see docs/MASTER_PLAN.md s.2).
// =============================================================================

/** @type {Array<Object>} */
export const campaigns = [
  {
    id: 've-2026-06-24-san-sebastian',
    enabled: true,
    type: 'disaster-relief',
    title: 'Venezuela Earthquake Relief — June 2026',
    emoji: '🇻🇪',
    // EmergencyEvent linkage (shared with SentinelDID in realDeal)
    emergencyEventId: 'VE-2026-06-24-SanSebastian',
    status: 'active', // active | winding-down | closed
    summary:
      'M7.2 foreshock + M7.5 mainshock on the San Sebastián fault (Jun 24, 2026). ' +
      'Severe damage in La Guaira and Caracas. Privacy-preserving, sanctions-clean relief.',
    affectedZones: ['La Guaira', 'Caracas', 'Yaracuy'],
    // Public-by-design transparency fields (mocked in demoLand)
    publicTotalsUsd: 184250,
    donationCount: 1342,
    // Which compliance proofs this campaign type requires:
    policy: {
      sanctionsScreen: true, // donor must prove non-membership in OFAC denylist
      zoneProof: true, // recipient org must prove it operates in an affected zone
      orgVerified: true, // recipient must be a verified relief org
      contributionLimit: false, // only used by the political arm
    },
  },
];

export const enabledCampaigns = () => campaigns.filter((c) => c.enabled);
export const getCampaign = (id) => campaigns.find((c) => c.id === id);
