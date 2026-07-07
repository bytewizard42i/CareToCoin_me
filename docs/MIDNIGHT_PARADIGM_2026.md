# CareToCoin, Midnight Paradigm (2026 Rebuild)

*The north-star document for rebuilding CareToCoin natively on Midnight. This revisits the whole paradigm with a modern lens and anchors the protocol to a real, current flagship scenario: privacy-preserving disaster relief for the June 2026 Venezuela earthquakes.*

**Date**: June 30, 2026
**Status**: Paradigm revisit. Supersedes the lens of `MIDNIGHT_MIGRATION_ROADMAP.md` (March 2026), which remains valid as a contract-architecture sketch but predates this rethink.
**Author**: Penny 🎀 with John

> Sources of truth for this rebuild: the DIDzMonolith Midnight KB (`monolith-docs/midnight/`), the midnight-expert and midnight-manual repos, the Idris Midnight MCP, and the official docs at docs.midnight.network. Compiler and SDK version numbers are deliberately **not** pinned here; they get discovered from the support matrix at scaffold time.

---

## 1. The goal, restated

The old framing was "a compliant crypto donation app with ZK tax receipts for US donors." That is too small and too comfortable. It describes a feature, not a reason to exist.

The real goal:

> **Move money to people who need it, in places where being seen giving or receiving is itself dangerous, without breaking the law of the donor's jurisdiction.**

Charitable giving lives on a knife's edge between two demands that normally cannot both be satisfied:

- **Transparency**, because regulators, tax authorities, and sanctions regimes demand it.
- **Privacy**, because donors, recipients, and relief workers can be surveilled, retaliated against, extorted, or cut off if exposed.

Every existing rail (banks, card processors, public-ledger crypto, even most "charity dApps") picks one side and sacrifices the other. Midnight is the first platform where you do not have to choose: you prove the compliance facts in zero knowledge and disclose nothing else. That is the entire reason to rebuild CareToCoin here.

---

## 2. Flagship use case: Venezuela earthquake relief (June 2026)

We will design and demo the protocol against a concrete, current catastrophe, not a toy.

### What happened (grounded)

- **June 24, 2026, 18:04 VET**: an Mw 7.2 foreshock struck near Veroes (Yaracuy), followed 39 seconds later by an **Mw 7.5 mainshock** on the San Sebastián fault system.
- Widespread destruction in **La Guaira** and **Caracas**. Maximum intensity **MMI IX (Violent)**. The strongest Venezuelan earthquake since the 1900 San Narciso event.
- Confirmed toll so far: **1,719+ dead, 5,034+ injured, 43,251+ missing**, 130+ aftershocks. The USGS PAGER system warns the eventual death toll could exceed 100,000.
- Estimated damage: **US$4.7–8.7 billion**.
- This follows the September 2025 Zulia doublet (Mw 6.2 / 6.3 near Mene Grande), so the region is in an active, compounding crisis.

This is real, it is six days old as of this writing, and aid is trying to flow into the country right now.

### Why this breaks every existing donation rail

Venezuela is the textbook case for why privacy-plus-compliance is not optional:

- **Sanctions exposure.** Wide-ranging US/OFAC sanctions target the regime, PDVSA, and specific officials. A donor or aid org must be able to prove their funds did **not** reach a sanctioned entity, or they face legal jeopardy. But the screening itself usually requires handing over donor and recipient identities to an intermediary.
- **Regime surveillance and aid capture.** Aid into Venezuela has historically been politicized, blocked, or seized, and recipients of "foreign" aid can be flagged. Naming a recipient on a public ledger can put them in danger.
- **Donor retaliation risk.** Diaspora donors sending money home may fear regime retaliation against their families, or fear being flagged by their own banks for "transactions with Venezuela."
- **Collapsed banking and hyperinflation.** Traditional rails are slow, expensive, and untrusted. Crypto is already a lifeline for Venezuelan remittances, but public-ledger crypto exposes everyone.

### The privacy filter test (Lauren Lee's judging signal)

> *"If you removed the privacy feature, would this product still make sense?"*

Remove privacy from Venezuela relief and it collapses:

- Donors stop giving (exposure and retaliation fear).
- Recipients are endangered (named on a public ledger in a surveilled state).
- And yet sanctions screening **still legally must happen**.

That is the sweet spot. The compliance requirement does not go away when you add privacy; only the surveillance does. CareToCoin proves "this donation is sanctions-clean and reached a verified civilian relief effort in the affected zone" while revealing **no** donor identity, **no** recipient identity, and **no** amount to the public.

---

## 3. The modern Midnight lens (what changed since March 2026)

The March roadmap was written before several things matured. Updating the mental model:

- **Compact is a circuit language, not Solidity.** A circuit compiles to a mathematical constraint; the chain verifies a proof against that constraint and never re-executes the function. Proof generation happens off-chain (donor's browser / proof server). Design circuits around "what fact am I proving," not "what code am I running."
- **Dual-resource model, stated correctly.** **NIGHT** is the native token (transparent, value/governance). **DUST** is the shielded, non-transferable **gas/fee resource** generated by registered NIGHT; it is **not** a token. Never call this a "two-token model." The split exists so that paying gas in public DUST does not leak your shielded NIGHT balance. For CareToCoin this matters: the act of paying fees must not deanonymize a donor.
- **Shielded vs unshielded state is a deliberate design axis.** We choose, per field, what is public (charity exists, total raised, compliance status) and what is shielded (donor identity, individual amounts, recipient identity, donor-recipient link).
- **We no longer hand-roll everything.** OpenZeppelin now ships audited `compact-contracts` modules (e.g. an `Allowlist` security module). We compose these instead of reinventing allow/deny logic. Important nuance surfaced directly from their source: a **public** allowlist re-exposes the candidate set and **bounds the anonymity set**, so for donor screening we want the **shielded** posture (prove non-membership against a published denylist root without revealing the candidate).
- **Sanctions screening is a ZK set-membership problem.** Midnight's ledger ADTs (`Set`, `Map`, `MerkleTree`) plus `merkleTreePathRoot` / `checkRoot` give us exactly the primitive: publish the OFAC denylist as a Merkle root, let the donor prove **non-membership** in zero knowledge. The donor proves "I am not on the list" without revealing who they are.
- **Selective disclosure is the product.** The `disclose()` boundary is not a chore, it is the feature. Every value crossing from private witness to public ledger is an explicit, auditable decision. The donor → IRS proof, the org → auditor proof, and the org → regulator proof are all different selective disclosures of the same underlying private donation.
- **Starstream is on the horizon.** When zkVM coroutines and proof folding land, the multi-step donation lifecycle (screen → verify zone → commit → receipt → disburse) folds into one pausable workflow with a single proof. We design the circuits now so they can later be composed into a coroutine (see `STARSTREAM_DONATION_FLOW.md`), but we do not block on it.

---

## 4. Reframed architecture

### Three actors

1. **Donor** (often diaspora). Wants to give, prove they are sanctions-clean, get a tax receipt in their own jurisdiction, and reveal nothing else. Identity stays a hiding commitment.
2. **Relief Org** (verified civilian aid effort). Holds a DIDz-verified, KYCz-screened identity proving it is a legitimate, non-sanctioned civilian organization operating in the affected zone. Can later prove "we received $X total from N donors and deployed it to relief" without naming any donor.
3. **Compliance / Oracle layer.** Maintains the published sanctions denylist root and the set of verified relief orgs. Does **not** see donor identities. Issues nothing it cannot prove.

### Public vs private state (updated for the Venezuela lens)

| Public (unshielded) | Private (shielded) |
|---|---|
| A relief org exists and is verified | Donor identity / wallet |
| Total raised per relief effort | Individual donation amounts |
| Donation count | Donor location (only zone-eligibility is proven) |
| Sanctions denylist **root** (hashed) | Recipient identity |
| Compliance status of each donation (clean / flagged) | Donor ↔ recipient link |
| Verified relief-org registry root | Tax-receipt contents |

### The key insight: sanctions screening without surveillance

```
Compliance layer publishes:  denylist_root = MerkleRoot(hash(sanctioned_wallet_i))

Donor proves, in zero knowledge:
  - "hash(my_wallet) is NOT a leaf under denylist_root"   (non-membership)
  - "I control the committed donor secret"                (ownership)
  - "my donation commitment is well-formed"               (integrity)

Chain learns:  this donation is sanctions-clean.
Chain does NOT learn:  who the donor is, the amount, or the recipient.
```

This is the inversion of how sanctions screening normally works. Today you prove cleanliness by **surrendering** your identity to a screener. Here you prove cleanliness by **withholding** it and proving a mathematical fact instead.

### Selective disclosure flows (all from one private donation)

- **Donor → tax authority**: "I donated to a registered relief effort in tax year 2026, amount $X." Proves: amount, eligibility, year. Hides: wallet, other donations, recipient.
- **Relief org → auditor / regulator**: "We received $Y total from N donors and all donations were sanctions-clean." Proves: total, count, compliance. Hides: every individual donor and amount.
- **Donor → relief org**: "I am the donor behind commitment #ABC" (for follow-up / impact updates). Proves: ownership. Hides: wallet, identity, other giving.

### DIDzMonolith integrations, re-pointed at disaster relief

| Product | Role in the Venezuela scenario |
|---|---|
| **DIDz.io** | Verified, persistent identity for relief orgs (survives staff/leadership turnover). |
| **KYCz** | Screens relief orgs as legitimate non-sanctioned civilian entities; screens high-value donors for their own jurisdiction's compliance, without exposing them to the org. |
| **GeoZ** | Proves a relief effort / recipient is **inside the affected zone** (La Guaira / Caracas / Yaracuy) without revealing an exact address. |
| **SentinelDID** | Emergency responder and field-worker credentials for fast-track verified relief during the active crisis. |
| **SelectConnect** | Privacy-preserving donor ↔ org contact (progressive reveal) for impact follow-up. |

---

## 5. demoLand / realDeal schema

Same pattern the rest of the ecosystem uses (ProMingle, ProofOrBluff, DiscoveryManagement): **one repo, two runtime modes** selected by env, never two repos.

- **demoLand**: mock providers, scripted Venezuela-relief scenario, seeded demo donors and a sample verified relief org, **no chain, no proof server**. Runs anywhere instantly. This is what we show judges, partners, and Chaya. The amber "DEMO MODE" banner pattern applies.
- **realDeal**: real Midnight providers (proof server, indexer, Lace wallet, deployed Compact contract). Network ladder per our standing rule: **local first, then pre-prod, skip preview.**

Concretely:

- `caretocoin-ui/.env.demoland` and `.env.realdeal`
- a `providers/` factory keyed on `NEXT_PUBLIC_C2C_MODE` (or equivalent) exposing the same interfaces (`IDonationProvider`, `IComplianceProvider`, `IReliefOrgProvider`, `IReceiptProvider`) so the UI is identical across modes.

---

## 6. Repo decision: silo in the existing repo

**Build inside the existing `CareToCoin` repo. Do not create a new repo.**

- It is already framed and badged as a Midnight migration, with a full roadmap.
- The Cardano/Aiken original is already cleanly siloed in `coin_to_care_main/` (valuable as provenance: the Emurgo capstone origin story).
- It is already a DIDzMonolith submodule (`bytewizard42i/CareToCoin_me`); a second repo would fracture the product identity and add pointer-management overhead.
- demoLand/realDeal is an intra-repo pattern, so the schema we want actively argues against a repo split.

Proposed layout added alongside the legacy silo:

```
CareToCoin/
├── coin_to_care_main/     # LEGACY Cardano/Aiken, untouched
├── contracts/             # NEW Compact: caretocoin.compact + witnesses
├── caretocoin-api/        # NEW shared types + donation/compliance logic + config
├── caretocoin-ui/         # NEW React + Vite UI (demoLand/realDeal)
│   └── providers/         # provider factory + demoland/ + realdeal/
└── docs/                  # this file + roadmap + Starstream + integrations
```

---

## 7. Open questions for John

1. **Scope of the first build**: full demoLand walkthrough of the Venezuela scenario first (no chain), or contract-first (`caretocoin.compact` compiling clean) first? My lean: **demoLand Venezuela demo first** so we have something moving and tellable, with the contract developed in parallel under the compile-first rule.
2. **Sanctions data**: for the demo, do we mock an OFAC-style denylist, or do you want me to research the real OFAC SDN data shape so realDeal can ingest it later?
3. **Off-ramp**: the contract proves the donation; fiat conversion / local cash-out in Venezuela is a separate partner service. Do you have a specific Venezuela-capable off-ramp or stablecoin path in mind, or is that a later phase?
4. **Branding**: you wrote both "CoinToCarre" and "CareToCoin." The product is **CareToCoin** (domain CareToCoin.me); the legacy Aiken folder is `coin_to_care`. Confirm we keep **CareToCoin** as the product name.
5. **Demo target**: is this aimed at a specific hackathon / grant / partner pitch, or is the Venezuela scenario purely our reference design?

---

## Sources

- 2026 Venezuela earthquakes (M7.2 + M7.5, San Sebastián fault, June 24 2026): en.wikipedia.org/wiki/2026_Venezuela_earthquakes; USGS event us6000t7zp.
- 2025 Zulia earthquakes (M6.2 / M6.3 doublet, Sept 24 2025): en.wikipedia.org/wiki/2025_Zulia_earthquakes.
- Midnight Compact ledger ADTs + Merkle membership: midnightntwrk/compact-export `examples/.../ledger.compact`; midnightntwrk/midnight-ledger `dust.compact` (via Idris MCP).
- OpenZeppelin `Allowlist` security module + public-vs-shielded anonymity-set note: OpenZeppelin/compact-contracts `contracts/src/security/Allowlist.compact`.
- Companion docs in this repo: `MIDNIGHT_MIGRATION_ROADMAP.md`, `STARSTREAM_DONATION_FLOW.md`, `SHAREDSCIENCE_RESEARCH_FUNDING.md`.
- DIDzMonolith Midnight KB: `monolith-docs/midnight/` (version discovery, environments, quirks).

*Versions intentionally unpinned. Discover current compactc / language / SDK from docs.midnight.network/relnotes/support-matrix at scaffold time.*
