# CareToCoin × Starstream Donation Flow

**Date**: March 24, 2026
**Authors**: Cassie + John
**Reference**: Sebastien Guillemot (CTO, Midnight Foundation) — Starstream zkVM

---

## Why Starstream Matters for CareToCoin

CareToCoin's donation lifecycle is inherently multi-step: donate → verify jurisdiction → screen wallet → generate receipt → disburse → generate tax form. Each step currently requires a separate proof. Starstream's **coroutines** and **proof folding** collapse this into a single pausable workflow with one compact proof.

---

## Donation Flow as a Coroutine

```
Coroutine: PrivateDonation
├── PAUSE: Donor initiates donation
├── RESUME: screenWallet() — prove wallet NOT in banned set
├── PAUSE: verifyJurisdiction() — GeoZ location proof
├── RESUME: makeDonation() — commit donation amount (private)
├── PAUSE: generateReceipt() — ZK tax receipt
├── RESUME: Charity acknowledges receipt
└── FOLD: Single proof covers: wallet clean + jurisdiction valid +
          donation committed + receipt generated

Donor's browser generates entire proof chain (~16 KB)
```

### Research Funding Extension (SharedScience + CareToCoin)

When donations fund research via SharedScience, the coroutine extends:

```
Coroutine: ResearchFundingDonation (extends PrivateDonation)
├── [PrivateDonation coroutine steps above]
├── PAUSE: Link to SharedScience domain pool
├── LOOP for each milestone:
│   ├── PAUSE: Wait for milestone completion (from SharedScience)
│   ├── RESUME: disburseFunding() — release tranche to researcher
│   └── RESUME: generateImpactProof() — ZK impact report to donor
└── FOLD: Single proof covers entire donation → research → impact lifecycle
```

---

## Key Benefits

| Feature | Current | Starstream |
|---------|---------|-----------|
| Proofs per donation | 4-6 separate | 1 folded |
| Tax receipt generation | Separate circuit | Embedded in coroutine |
| Milestone disbursement | Separate contract calls | Loop within coroutine |
| Browser compatibility | Needs proof server | Native browser WASM |
| Audit trail | Multiple on-chain txns | Single folded proof, fully auditable |
| Donor experience | Multiple confirmations | One smooth flow |

---

## Compliance Advantage

Proof folding is especially valuable for **tax compliance**:

- The folded proof contains: donation amount + charity verification + jurisdiction check + receipt
- The donor can selectively disclose the **entire folded proof to the IRS** — proving everything in one artifact
- The IRS verifies one proof instead of chasing multiple on-chain transactions
- The charity's audit proof (total received from N donors) also folds across all donor coroutines

---

## Migration Path

1. **Now**: Current Midnight migration roadmap (Compact v0.29.0) proceeds as planned
2. **When Starstream lands**: Refactor donation flow into coroutine
3. **Research funding**: Extend coroutine to include SharedScience milestone loop
4. **Browser proofs**: Eliminate proof server, donations work from any browser

---

*Cross-pollinated with SharedScience and health data repos — Cassie + John, March 24, 2026*
