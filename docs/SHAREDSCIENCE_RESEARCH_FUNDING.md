# CareToCoin × SharedScience.me — Research Funding Integration

**Date**: March 23, 2026
**Authors**: Cassie + John

---

## The Connection

CareToCoin is a privacy-preserving donation platform. SharedScience.me is a privacy-preserving scientific discovery and collaboration marketplace. Together, they solve the **research funding problem** that Unbound Science (https://unboundscience.com/) identified but hasn't built infrastructure for:

> Scientists need funding. Donors want impact. Neither wants to be fully exposed.

CareToCoin already handles the donation flow — donor privacy, tax compliance, jurisdictional verification, charity verification. SharedScience already handles capability matching, progressive disclosure, and collaboration agreements. The integration is natural: **CareToCoin becomes the funding layer for SharedScience research collaborations.**

---

## How It Works

```
Donor                      CareToCoin                    SharedScience.me
  │                            │                               │
  │  "I want to fund           │                               │
  │   cryogenics research"     │                               │
  │ ──────────────────────────▶│                               │
  │                            │  Query domain-specific         │
  │                            │  research pool                 │
  │                            │ ─────────────────────────────▶│
  │                            │                               │
  │                            │  Return matching capability    │
  │                            │  proofs (anonymized)           │
  │                            │ ◀─────────────────────────────│
  │                            │                               │
  │  ZK donation commitment    │                               │
  │  (amount private, domain   │                               │
  │   public, tax receipt      │                               │
  │   generated)               │                               │
  │ ──────────────────────────▶│                               │
  │                            │  Fund allocated to domain      │
  │                            │  pool, linked to milestone     │
  │                            │  tracking                      │
  │                            │ ─────────────────────────────▶│
  │                            │                               │
  │                            │  Researcher claims funding     │
  │                            │  after milestone completion    │
  │                            │  (verified via collaboration   │
  │                            │   agreement contract)          │
  │                            │ ◀─────────────────────────────│
  │                            │                               │
  │  Impact proof delivered    │  Disbursement to researcher   │
  │  (ZK: "Your donation       │  (ZK: proves milestone met    │
  │   contributed to 3          │   without revealing methods)  │
  │   completed milestones")   │                               │
  │ ◀──────────────────────────│                               │
```

---

## What CareToCoin Provides to SharedScience

| Feature | How It Helps |
|---------|-------------|
| **Privacy-preserving donations** | Donors fund research domains without revealing identity, amounts, or wallet addresses |
| **Tax compliance infrastructure** | ZK tax receipts for research donations — prove to IRS without public disclosure |
| **Jurisdictional verification** (via GeoZ) | Ensure research funding meets local regulations |
| **Charity/org verification** (via DIDz/KYCz) | Verify that research organizations receiving funds are legitimate |
| **Milestone-linked disbursement** | Funds released as collaboration agreement milestones are completed |
| **Impact proofs** | Donors receive ZK-verified impact reports without seeing proprietary research details |
| **Banned wallet screening** | Prevent sanctioned entities from funding research (compliance requirement) |

## What SharedScience Provides to CareToCoin

| Feature | How It Helps |
|---------|-------------|
| **Domain taxonomy** | Structured classification of research areas — donors pick domains, not researchers |
| **Capability registry** | ZK-verified proof that funded researchers actually have the claimed expertise |
| **Collaboration agreements** | On-chain milestone tracking that triggers CareToCoin disbursements |
| **Reputation system** | Anonymous researcher reputation scores help donors assess track record |
| **Progressive disclosure** | Donors who want deeper involvement can progressively learn about the research (via SelectConnect) |

---

## Funding Pool Architecture

Instead of building a standalone `funding-pool.compact`, SharedScience delegates funding to CareToCoin:

```
CareToCoin Contract (Funding Layer)
├── registerResearchPool()     — Create domain-specific research pool
├── donateToPool()             — Privacy-preserving donation to a domain
├── linkMilestones()           — Connect pool to SharedScience milestones
├── disburseFunding()          — Release funds on milestone completion
├── generateImpactProof()      — ZK proof of research impact for donor
└── generateTaxReceipt()       — Tax-compliant receipt for research donations

SharedScience Contract (Research Layer)
├── capability-registry        — What researchers CAN do
├── collaboration-agreement    — Milestone definitions and tracking
├── reputation-tracker         — Who delivers results
└── domain-taxonomy            — What domains are funded
```

---

## Unbound Science Alignment

Unbound Science identified the same pattern — subject-specific funding pools for research. Their model:
- Energy, Air/Water/Soil, Pollution/Waste, Quantum funding pools
- Tax-incentivized public donations
- Recurring revenue through licensing

CareToCoin + SharedScience delivers this with **actual privacy infrastructure**:
- ZK-verified donations (Unbound has no privacy mechanism)
- Tax receipts via ZK proofs (Unbound describes but hasn't built)
- Milestone-linked disbursement (Unbound has no on-chain accountability)
- HIPAA-compliant health research funding (Unbound can't touch regulated data)

---

## Cross-Repo Health Data Funding

The most powerful use case: **funding health research across safeHealthData, equineProData, and petProData**.

Example: A donor wants to fund "One Health" zoonotic disease research.

1. Donor contributes to "One Health" domain pool via CareToCoin (privacy-preserving, tax-deductible)
2. SharedScience matches the funded domain to researchers with relevant capabilities
3. Researchers discover that safeHealthData, equineProData, AND petProData have relevant cohort data
4. Consent aggregator (SharedScience) verifies all data subjects opted in
5. Collaboration agreement defines milestones; CareToCoin disburses on completion
6. Data subjects receive micropayments (through their respective health data platforms)
7. Donor receives ZK impact proof: "Your donation contributed to a multi-species zoonotic study with N subjects"

Nobody sees what they shouldn't. Everyone gets paid. Research happens. Compliance is maintained.

---

*Cross-pollinated from SharedScience.me — Cassie + John, March 23, 2026*
