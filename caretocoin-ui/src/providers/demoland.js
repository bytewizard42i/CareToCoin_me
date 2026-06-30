// =============================================================================
// demoLand providers — simulated, no chain, no proof server.
// Same interface shape as realDeal so the UI is identical across modes.
// =============================================================================
import { bannedScreeningKeys } from '../data/ofacSdnMock';
import { getReliefOrg } from '../config/reliefOrgs';
import { getOffRamp } from '../config/offRamps';
import { getOnRamp } from '../config/onRamps';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Tiny non-crypto hash, for demo commitment/receipt ids only.
function demoHash(input) {
  let h = 0x811c9dc5;
  const s = String(input);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return '0x' + (h >>> 0).toString(16).padStart(8, '0');
}

// --- Compliance: simulate a ZK non-membership proof against the denylist root.
export const complianceProvider = {
  async screenDonor(donor) {
    await wait(700); // pretend proof generation
    const isBanned = bannedScreeningKeys.has(donor.walletId);
    return {
      clean: !isBanned,
      // In realDeal this is an actual ZK non-membership proof; here it is a label.
      proof: isBanned ? null : `zk-nonmembership:${demoHash(donor.walletId)}`,
      denylistRootDate: '2026-06-20',
      explanation: isBanned
        ? 'Donor key matches a fictional denylist entry. Donation blocked; reclaim offered.'
        : 'Proved donor is NOT in the OFAC denylist without revealing the donor identity.',
    };
  },
};

// --- Relief orgs: verify the chosen org operates in an affected zone.
export const reliefOrgProvider = {
  async verifyZone(orgId, campaign) {
    await wait(450);
    const org = getReliefOrg(orgId);
    // demoLand: any catalog org is treated as zone-eligible for the campaign.
    return {
      eligible: !!org,
      // realDeal: ZK proof of membership in the campaign's region_root (GeoZ).
      proof: org ? `zk-zone:${demoHash(orgId + campaign.emergencyEventId)}` : null,
      zones: campaign.affectedZones,
      explanation: org
        ? `Proved ${org.shortName} operates in an affected zone without revealing its exact address.`
        : 'Org not found.',
    };
  },
};

// --- On-ramp: simulate acquiring the donation asset.
export const onRampProvider = {
  async fund(onRampId, amountUsd) {
    await wait(500);
    const ramp = getOnRamp(onRampId);
    const feePct = ramp?.method === 'card' ? 0.029 : ramp?.method === 'bank' ? 0.005 : 0;
    const fee = +(amountUsd * feePct).toFixed(2);
    return { funded: !!ramp, asset: ramp?.asset, fee, net: +(amountUsd - fee).toFixed(2) };
  },
};

// --- Donation core: create a private commitment, then a selective-disclosure receipt.
export const donationProvider = {
  async makeDonation({ donor, orgId, amountUsd, campaign, screenProof, zoneProof }) {
    await wait(600);
    const nonce = Math.random().toString(36).slice(2);
    const commitment = demoHash(`${donor.walletId}|${orgId}|${amountUsd}|${nonce}`);
    return {
      commitment,
      // Public-by-design fields the chain would learn:
      public: { campaignId: campaign.id, orgId, compliant: true },
      // Private fields kept off the public ledger (shown for teaching only):
      private: { donor: donor.label, amountUsd, jurisdiction: donor.jurisdiction },
      screenProof,
      zoneProof,
      createdAt: new Date().toISOString(),
    };
  },

  async generateReceipt(donation, target) {
    await wait(400);
    // Each target is a different selective disclosure of the SAME donation.
    const base = { commitment: donation.commitment, receiptId: demoHash(donation.commitment + target) };
    if (target === 'tax-authority') {
      return {
        ...base,
        title: 'Donor → Tax Authority',
        discloses: ['amount', 'campaign eligibility', 'tax year 2026'],
        hides: ['wallet', 'other donations', 'recipient identity'],
      };
    }
    if (target === 'auditor') {
      return {
        ...base,
        title: 'Relief Org → Auditor',
        discloses: ['total received', 'donor count', 'all donations sanctions-clean'],
        hides: ['individual donors', 'individual amounts'],
      };
    }
    return {
      ...base,
      title: 'Donor → Relief Org',
      discloses: ['ownership of this commitment'],
      hides: ['wallet', 'identity', 'other giving'],
    };
  },

  async reclaim(donation) {
    await wait(400);
    return { reclaimed: true, window: '24h', note: 'Blocked donation returned to donor.' };
  },
};

// --- Off-ramp: simulate last-mile delivery to the recipient.
export const offRampProvider = {
  async estimate(offRampId, amountUsd) {
    await wait(400);
    const r = getOffRamp(offRampId);
    if (!r) return { ok: false };
    return {
      ok: true,
      partner: r.name,
      asset: r.asset,
      network: r.network,
      delivery: r.delivery,
      etaMinutes: r.id === 'mvga' ? 1 : r.id === 'coco-wallet' ? 5 : 30,
      amountUsd,
    };
  },
};
