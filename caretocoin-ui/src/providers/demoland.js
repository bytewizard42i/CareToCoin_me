// =============================================================================
// demoLand providers — simulated, no chain, no proof server.
// Same interface shape as realDeal so the UI is identical across modes.
// =============================================================================
import { bannedScreeningKeys } from '../data/ofacSdnMock';
import { getReliefOrg } from '../config/reliefOrgs';
import { getOffRamp } from '../config/offRamps';
import { getOnRamp } from '../config/onRamps';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Mask a wallet id for display on receipts (keep ends, hide the middle).
const maskWallet = (w) => {
  const s = String(w || '');
  return s.length > 12 ? `${s.slice(0, 9)}…${s.slice(-3)}` : s;
};

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
  async makeDonation({ donor, orgId, amountUsd, campaign, screenProof, zoneProof, visibility = 'private', displayName, dedication }) {
    await wait(600);
    const nonce = Math.random().toString(36).slice(2);
    const commitment = demoHash(`${donor.walletId}|${orgId}|${amountUsd}|${nonce}`);
    const isPublic = visibility === 'public';
    return {
      commitment,
      visibility,
      // Public-by-design fields the chain would learn. In PUBLIC mode the donor
      // chooses to also disclose a display name, amount, and a (moderated) dedication.
      public: {
        campaignId: campaign.id,
        orgId,
        compliant: true,
        ...(isPublic ? { donorName: displayName || 'Anonymous', amountUsd, dedication: dedication || null } : {}),
      },
      // Private fields kept off the public ledger (shown for teaching only):
      private: isPublic
        ? { realDonor: donor.label, jurisdiction: donor.jurisdiction }
        : { donor: donor.label, amountUsd, jurisdiction: donor.jurisdiction, dedication: dedication || null },
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

// --- Ai moderation: screen a public dedication for illicit/unsuitable content.
// demoLand uses a transparent heuristic classifier. realDeal calls a real
// moderation model/API behind the same interface. This is a SAFETY gate: a
// public dedication is published, so it must be screened before it goes on-chain.
const DEDICATION_RULES = [
  { category: 'violence / threats', rx: /\b(kill|murder|bomb|behead|shoot|massacre|terror)\w*/i },
  { category: 'hate speech', rx: /\b(n[i1]gger|f[a@]gg?ot|k[i1]ke|sp[i1]c|retard)\w*/i },
  { category: 'illicit finance', rx: /\b(launder|money[\s-]*launder|evade\s*sanctions|bypass\s*ofac|hawala\s*for)\w*/i },
  { category: 'drugs / weapons', rx: /\b(heroin|fentanyl|cocaine|meth|buy\s*guns|arms\s*deal)\w*/i },
  { category: 'sanctioned-entity promotion', rx: /\b(long\s*live\s*the\s*regime|fund\s*the\s*cartel|viva\s*el\s*r[eé]gimen)\w*/i },
  { category: 'spam / links', rx: /(https?:\/\/|t\.me\/|telegram\.me|whatsapp\s*\+?\d|\bbuy\s*now\b)/i },
  { category: 'personal data (doxxing)', rx: /\b(\d{3}-\d{2}-\d{4}|passport\s*no|\bcedula\b\s*\d)/i },
];

export const moderationProvider = {
  async screenDedication(text) {
    await wait(550); // pretend model inference
    const value = (text || '').trim();
    if (!value) return { allowed: true, empty: true };
    if (value.length > 280) {
      return { allowed: false, categories: ['too long'], reason: 'Dedication exceeds 280 characters.' };
    }
    const hits = DEDICATION_RULES.filter((r) => r.rx.test(value)).map((r) => r.category);
    if (hits.length) {
      return {
        allowed: false,
        categories: hits,
        reason: `Flagged as ${hits.join(', ')}. Please revise your dedication.`,
      };
    }
    return { allowed: true, categories: [], reason: 'Dedication passed Ai moderation.' };
  },
};

// --- Tax receipts: issue a donor-side tax receipt for a donation. This is the
// donor -> tax-authority selective disclosure rendered as a saveable document.
// Issued for BOTH private and public donations (the donor always needs their
// own record). In realDeal it is derived from the on-chain commitment + proof.
export const taxReceiptProvider = {
  async issue(donationResult, { donor, org, campaign, displayName }) {
    await wait(300);
    const now = new Date();
    const amountUsd =
      donationResult.visibility === 'public'
        ? donationResult.public.amountUsd
        : donationResult.private.amountUsd;
    return {
      receiptId: `C2C-${donationResult.commitment.slice(2, 10)}`.toUpperCase(),
      issuedAt: now.toISOString(),
      taxYear: now.getUTCFullYear(),
      donee: {
        name: org?.name || 'Relief organization',
        website: org?.website || null,
        taxId: org?.taxId || null, // unknown in demo; verify before real use
        country: org?.country || null,
      },
      donor: {
        walletRef: maskWallet(donor.walletId),
        displayName: displayName || (donationResult.visibility === 'public' ? 'Public donor' : 'Anonymous'),
        jurisdiction: donor.jurisdiction,
      },
      donation: {
        amountUsd,
        currency: 'USD',
        asset: 'USDC',
        kind: 'crypto',
        visibility: donationResult.visibility,
        date: now.toISOString().slice(0, 10),
      },
      commitment: donationResult.commitment,
      proofRef: donationResult.screenProof || null,
      campaign: { id: campaign.id, title: campaign.title },
      statement: 'No goods or services were provided in exchange for this contribution.',
      disclaimer:
        'demoLand sample receipt — not tax advice. In realDeal this is derived from an ' +
        'on-chain commitment and a selective-disclosure proof, and the donee tax ID is verified.',
    };
  },
};
