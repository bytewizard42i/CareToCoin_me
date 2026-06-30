// =============================================================================
// DEMO DONORS  (demoLand only)
// -----------------------------------------------------------------------------
// Pretend donor identities the user can "act as" in the demo. One of them
// (Diego) maps to a banned screening key so we can show the sanctions-screen
// FAILING and the reclaim path. In realDeal the donor identity is a private
// witness and never enumerated like this.
// =============================================================================

export const demoDonors = [
  {
    id: 'ana',
    label: 'Ana (diaspora, Madrid)',
    walletId: 'wallet:0xCLEAN_ANA',
    jurisdiction: 'ES',
    note: 'Sanctions-clean. The happy path.',
  },
  {
    id: 'marcus',
    label: 'Marcus (US donor, Miami)',
    walletId: 'wallet:0xCLEAN_MARCUS',
    jurisdiction: 'US',
    note: 'Sanctions-clean. US tax-receipt path.',
  },
  {
    id: 'diego',
    label: 'Diego (FLAGGED — demo)',
    walletId: 'wallet:0xBANNED0001',
    jurisdiction: 'VE',
    note: 'Maps to a fictional banned key. Shows the screen FAILING + reclaim.',
  },
];

export const getDonor = (id) => demoDonors.find((d) => d.id === id);
