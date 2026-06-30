// =============================================================================
// realDeal providers — wire to Midnight (proof server, indexer, Lace) + the
// deployed CareToCoin Compact contract. STUBS for now; built asynchronously in
// parallel with demoLand (see docs/MASTER_PLAN.md s.3).
//
// Each function mirrors the demoLand signature so the UI never changes.
// =============================================================================

const notWired = (name) => {
  throw new Error(
    `[realDeal] ${name} not wired yet. Run demoLand (VITE_C2C_MODE=demoland) ` +
      `or implement against the deployed contract + Midnight providers.`,
  );
};

export const complianceProvider = {
  // TODO: ZK non-membership proof against the published OFAC denylist Merkle root.
  async screenDonor() { notWired('complianceProvider.screenDonor'); },
};

export const reliefOrgProvider = {
  // TODO: ZK zone-membership proof (GeoZ region_root) + org registry membership.
  async verifyZone() { notWired('reliefOrgProvider.verifyZone'); },
};

export const onRampProvider = {
  // TODO: real on-ramp widget/SDK (card/bank/wallet) -> donation asset.
  async fund() { notWired('onRampProvider.fund'); },
};

export const donationProvider = {
  // TODO: submit donation circuit; build commitment + nullifier.
  async makeDonation() { notWired('donationProvider.makeDonation'); },
  // TODO: selective-disclosure receipt circuits.
  async generateReceipt() { notWired('donationProvider.generateReceipt'); },
  // TODO: reclaim circuit (24h window).
  async reclaim() { notWired('donationProvider.reclaim'); },
};

export const offRampProvider = {
  // TODO: integrate chosen partner (MVGA/Coco/CryptoCash) payout API.
  async estimate() { notWired('offRampProvider.estimate'); },
};
