# CareToCoin, Master Plan

*The single reference for the Midnight rebuild. Everything John asked for lives here or is linked from here. If it is not in this doc, it is not in the plan. Keep this verbose and up to date.*

**Date started**: June 30, 2026
**Owner**: Penny 🎀 with John
**Product name (canonical)**: **CareToCoin** (domain CareToCoin.me). John sometimes types it differently (CoinToCarre, coin_to_care, etc.); all of those mean **CareToCoin**. The legacy Aiken folder `coin_to_care/` keeps its original name for provenance only.

> Companion docs: `MIDNIGHT_PARADIGM_2026.md` (the why + Venezuela anchor), `OFAC_SCREENING_DESIGN.md` (sanctions screening), `VENEZUELA_OFFRAMP_OPTIONS.md` (cash-out partners + contacts), `MIDNIGHT_MIGRATION_ROADMAP.md` (March 2026 contract sketch), `STARSTREAM_DONATION_FLOW.md` (future coroutine folding).

---

## 0. Locked decisions

- **Build in the existing `CareToCoin` repo**, siloed. No new repo. (Rationale in the paradigm doc.)
- **demoLand first**, with **realDeal built asynchronously in parallel** (yes, "asynchronously" / "in parallel" is the right term: the two tracks do not block each other, they converge later behind the same provider interfaces).
- **Flagship scenario**: privacy-preserving relief for the **June 24, 2026 Venezuela earthquakes** (M7.2 + M7.5, San Sebastián fault, 1,700+ dead, 43,000+ missing, ~$5-9B damage).
- **OFAC denylist is shaped as close to the real SDN data as possible** (see `OFAC_SCREENING_DESIGN.md`).
- **Compiler/SDK versions are NOT pinned in docs.** Discover from docs.midnight.network/relnotes/support-matrix at scaffold time.
- **Network ladder**: local first, then pre-prod, skip preview.

---

## 1. The protocol is one trunk with several arms

Venezuela earthquake relief is the **most practical first pattern**, but it is one arm of a general donation protocol. The trunk is always the same: *prove the compliance facts in zero knowledge, disclose nothing else.* The arms differ only in **which** facts must be proven.

| Arm | What must be proven (the compliance facts) | What stays private |
|---|---|---|
| **Disaster relief** (Venezuela flagship) | Donor is sanctions-clean; recipient is a verified civilian relief org inside the affected zone | Donor + recipient identity, amount, link |
| **Political donations** | Donor is an eligible citizen/PR; under the legal contribution limit; not a prohibited source (foreign national, federal contractor); jurisdiction matches | Donor identity, exact amount (only "under limit" is proven), other giving |
| **General charitable giving** | Recipient is a registered charity (501(c)(3) or local equivalent); donor sanctions-clean; tax-year + amount for receipt | Donor identity, amount to public, donor-charity link |
| **External bridge (GoFundMe etc.)** | The off-platform campaign is verified/attested; donor sanctions-clean; funds routed to the attested payout target | Donor identity, amount, the donor's participation |

### Design implication: the `Campaign` abstraction

The contract is organized around a generic **Campaign**, not a hardcoded "charity." A campaign carries a `CampaignType` (DisasterRelief | Political | General | ExternalBridge) and a **compliance policy** that selects which proofs are required. Adding a new arm = adding a policy, not rewriting the core.

### GoFundMe (and similar) integration angle

Two viable models, to decide later:

- **Bridge / attestation model (lighter, do first)**: CareToCoin does not replace GoFundMe; it sits in front as the *private, compliant donation rail*. An oracle/attestor verifies the external campaign exists and is legitimate, publishes a campaign attestation on Midnight, and donors give privately through CareToCoin with funds settling to the campaign's payout target. GoFundMe keeps doing fulfillment; we add privacy + sanctions screening.
- **Full native campaigns (heavier, later)**: CareToCoin hosts the campaign end to end (a private, compliant GoFundMe alternative). Bigger product surface, bigger trust + off-ramp burden.

Recommendation: ship the **bridge model** as the GoFundMe arm; revisit native campaigns once the relief and political arms are proven.

### Public vs private donations + dedications

Every donation can be made **privately** (shielded: donor identity, amount, and dedication stay off the public ledger) or **publicly** (transparent: a donor-chosen display name, amount, and dedication are published to the campaign wall). Sanctions screening runs **either way**; only the disclosure differs. This maps directly to Midnight's shielded/unshielded axis.

Donors may attach an optional **dedication** ("In memory of...", a message of support). Because a public dedication is published on-chain, it passes an **Ai moderation gate** first (screening for violence/threats, hate speech, illicit-finance/sanctions-evasion language, drugs/weapons, sanctioned-entity promotion, spam/links, and doxxing). demoLand uses a transparent heuristic classifier (`moderationProvider.screenDedication`); realDeal calls a real moderation model behind the same interface. A blocked dedication halts the donation before any commitment is made.

### Tax receipts (wallet-scoped)

Every successful donation (private or public) issues a **tax receipt** for the donor and saves it **per wallet**. The receipt is the donor -> tax-authority selective disclosure rendered as a saveable file (printable HTML + machine-readable JSON), including donee, amount, date, tax year, on-chain commitment, compliance-proof reference, and the "no goods or services provided" statement. demoLand persists receipts to `localStorage` keyed by wallet (`taxReceiptProvider.issue` + `lib/receiptStore`); realDeal derives the receipt from the on-chain commitment + proof, with a verified donee tax ID. Donors can re-download any past receipt from the "Your saved tax receipts" panel.

---

## 2. SentinelDID coordination layer

SentinelDID is the emergency identity/credential system; CareToCoin is the emergency *funding* system. In a disaster they are two halves of one response, so they share a thin coordination layer rather than duplicating logic.

### The shared object: `EmergencyEvent`

A single on-chain (public) record, writable by an authorized emergency oracle, that both systems read:

```
EmergencyEvent {
  event_id        : Bytes<32>     // e.g. hash("VE-2026-06-24-SanSebastian")
  region_root     : MerkleRoot    // GeoZ-style root of affected zones (La Guaira, Caracas, Yaracuy...)
  declared_at     : Timestamp
  status          : Active | WindingDown | Closed
  responder_root  : MerkleRoot    // SentinelDID-issued field-responder credential commitments
  relief_org_root : MerkleRoot    // verified relief orgs cleared for this event
}
```

### How the two systems use it

- **SentinelDID writes**: when an emergency is declared and verified, SentinelDID populates `responder_root` (who is a credentialed field responder) and contributes to `region_root` (where the emergency is).
- **CareToCoin reads**: a relief campaign tied to `event_id` can only be created/funded while `status == Active`, recipients must prove membership in `relief_org_root`, and **fast-track disbursement** to field responders requires a SentinelDID responder-credential proof against `responder_root`.
- **Result**: donations cannot be raised for a fake or expired emergency, funds can only reach orgs/responders SentinelDID has vouched for, and neither system has to trust the other's internal state, only the published roots.

### Build note

This layer is a **separate small contract / shared module** (`EmergencyCoordination`) that both repos import or reference by address. Design it now; implement after the core CareToCoin donation flow compiles. Cross-pollinate the doc into the SentinelDID repo too (`docs/CARETOCOIN_COORDINATION.md`) so both sides stay in sync.

---

## 3. realDeal Compact contract structure (build async)

Modular, composing OpenZeppelin `compact-contracts` where possible. Proposed modules under `contracts/`:

| Module | Responsibility | Key primitives |
|---|---|---|
| `caretocoin.compact` | Top-level: wires modules, exposes circuits | imports below |
| `CampaignRegistry` | Create/verify campaigns; holds `CampaignType` + compliance policy; public totals + counts | `Map`, `Counter` |
| `ComplianceScreening` | Sanctions non-membership proof against published denylist root; jurisdiction checks | `MerkleTree`, `checkRoot`, `merkleTreePathRoot`, `disclose()` |
| `ReliefOrgRegistry` | DIDz/KYCz-verified org commitments; GeoZ zone-membership proof | `Set<Bytes<32>>`, `MerkleTree` |
| `DonationCore` | Private donation commitments; ownership; integrity; per-donation replay nullifier | `Set`, `persistentCommit`, `transientHash` |
| `Receipts` | Selective-disclosure tax/audit receipts (donor->authority, org->auditor) | commitments + `disclose()` |
| `EmergencyCoordination` | Shared `EmergencyEvent` roots with SentinelDID (section 2) | `MerkleTree`, roots |

Witness state (`witnesses.ts`): donor secret, wallet preimage, amount, jurisdiction, campaign nonce, Merkle paths for non-membership/membership proofs.

Compile-first rule: every module validated in the hosted compiler (`skipZk`) before saving to file. Honor the validated Compact quirks (no module-level `const`, `let` reserved so use `const`, inline `pad(32, ...)`, two-step Uint->Bytes cast, aggressive `disclose()` tracking, inline admin auth, no tuple returns from exported circuits).

---

## 4. Off-ramp (cash-out in Venezuela)

Full options + contacts in `VENEZUELA_OFFRAMP_OPTIONS.md`. Headline: the contract proves the donation; **fiat/stablecoin last-mile is a partner service, not contract logic.** Leading candidates: **MVGA** (USDC on Solana, on-chain + open source = best auditability), **Coco Wallet** (USDT/USDC on Polygon, direct bank/Pago Móvil payout), and **CryptoCash.Capital** (P2P cash delivery last-mile). Decision pending John's pick.

---

## 5. OFAC screening

Full design in `OFAC_SCREENING_DESIGN.md`. Headline: mirror the real OFAC **SDN** record shape (UID, sdnType, names/aliases, programs, IDs, addresses, nationality, DOB/POB), reduce each sanctioned party to a screening key, publish the set as a **Merkle root**, and have donors prove **non-membership** in zero knowledge. The donor proves "I am not on the list" without revealing who they are.

---

## 6. Phased plan

**Phase 0 (now)**: paradigm + master plan + research docs (this batch). Fix Mars emoji. [in progress]

**Phase 1, demoLand Venezuela walkthrough (no chain)**:
- Scaffold `caretocoin-ui/` (React + Vite) + `providers/` factory (demoland/realdeal) + `.env.demoland` / `.env.realdeal`.
- Seed the Venezuela scenario: 1 verified relief org, a GeoZ affected-zone, a mock OFAC denylist, several demo donors (incl. one flagged), scripted donate -> screen -> zone-verify -> commit -> receipt flow.
- DEMO MODE banner. Tellable end to end without a proof server.

**Phase 2, realDeal contracts (async, parallel to Phase 1)**:
- Author + compile the modules in section 3 (compile-first).
- `caretocoin-api/` shared types + logic + config.
- Wire realDeal providers to deployed contract on local stack, then pre-prod.

**Phase 3, coordination + arms**:
- `EmergencyCoordination` shared with SentinelDID.
- Political-donation policy; general-charity policy; GoFundMe bridge attestation.

**Phase 4, off-ramp + pilots**:
- Integrate chosen off-ramp partner.
- Starstream coroutine refactor when it lands.

---

## 7. Open items for John (decisions I need)

1. **Off-ramp pick** (MVGA / Coco / CryptoCash / multi) so realDeal can target it. See offramp doc.
2. **OFAC data**: ingest the real public SDN list for realDeal, or keep a realistic mock indefinitely? (Mock for demoLand either way.)
3. **GoFundMe arm**: bridge model first (my rec) vs native campaigns?
4. **Demo target**: hackathon / grant / partner pitch, or pure reference design? (Shapes polish + deadline.)
5. **Relief org for the demo**: use a real, named Venezuelan relief org (e.g. Cruz Roja Venezolana, Cáritas) for realism, or a fictional placeholder? (Real names need a verification note.)

---

## 8. Status checklist (mirror of the live todo list)

- [x] Mars Portal book emoji fixed (`DIDzMonolith.code-workspace`)
- [~] Master plan (this doc)
- [~] OFAC screening design doc
- [~] Venezuela off-ramp options doc
- [ ] Generalized vision (captured here in section 1)
- [ ] SentinelDID coordination layer (captured here in section 2)
- [ ] realDeal contract structure (captured here in section 3; implementation pending)
- [ ] demoLand scaffold
- [ ] Error review pass across all docs

*Last updated: June 30, 2026.*
