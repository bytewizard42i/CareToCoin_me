# CareToCoin — Midnight Migration Roadmap

*Porting CareToCoin from Cardano/Aiken to Midnight Network with selective privacy.*

**Date**: March 22, 2026

---

## Current State (Cardano/Aiken)

CareToCoin is a decentralized donation platform originally built as an Emurgo Aiken Developer course final project. It currently runs on Cardano with Plutus v3 validators written in Aiken.

### Existing Components

| Component | File | What It Does |
|-----------|------|-------------|
| `check_donor_and_where` | `validators/check_donor_and_where.ak` | Validates donor identity, checks banned wallet list, routes non-compliant donations to IRS wallet |
| `check_redeemer_msg` | `validators/check_redeemer_msg.ak` | Validates redeemer message input |
| `My_datum` | `lib/datum_custom_types.ak` | Datum type: owner hash, signer, counter |
| `My_redeemer` | `lib/redeemer_custom_types.ak` | Redeemer type: message ByteArray |
| `banned_wallets` | `lib/banned_wallets_list.ak` | Hardcoded list of banned wallet addresses |

### Current Limitations

- **No privacy** — All donation amounts, donor identities, and recipient info are fully public on Cardano L1
- **Hardcoded banned wallets** — Static list, no dynamic updates
- **Placeholder geo-location** — `is_us_based: True` is hardcoded, no actual jurisdictional checking
- **No tax form generation** — Described in README but not implemented
- **No fiat conversion** — Described in README but not implemented
- **IRS wallet is a placeholder** — `#"1234..."` dummy address

---

## Why Midnight?

Midnight solves CareToCoin's core tension: **charitable donations need transparency for tax compliance but privacy for donor protection.**

| Requirement | Cardano (Current) | Midnight (Target) |
|-------------|-------------------|-------------------|
| Donor privacy | Fully public | ZK-shielded — prove donation without revealing identity |
| Tax compliance | Not implemented | ZK proofs: "I donated $X to charity Y in tax year Z" without revealing amount to public |
| Jurisdictional compliance | Hardcoded placeholder | GeoZ integration for privacy-preserving location verification |
| Banned wallet screening | Static list | Dynamic on-chain set with ZK-verified screening |
| Donation receipts | Not implemented | On-chain ZK-verified receipts (prove to IRS without public disclosure) |
| Charity verification | Not implemented | DIDz-verified charity identity with selective credential disclosure |

---

## Midnight Architecture

### Core Compact Contract: `caretocoin.compact`

```
CareToCoin Contract
│
├── LEDGER STATE
│   ├── charities: Map<Bytes<32>, CharityState>     — Registered charities
│   ├── donations: Set<Bytes<32>>                     — Donation commitment set
│   ├── donation_meta: Map<Bytes<32>, DonationMeta>  — Donation metadata (sealed)
│   ├── tax_receipts: Map<Bytes<32>, ReceiptCommit>  — ZK tax receipt commitments
│   ├── banned_wallets: Set<Bytes<32>>                — Dynamic banned wallet hashes
│   ├── compliance_proofs: Map<Bytes<32>, Bytes<32>> — Jurisdictional compliance proofs
│   └── total_donated: Map<Bytes<32>, Uint<64>>       — Per-charity totals (public for transparency)
│
├── CIRCUITS — Charity Management
│   ├── registerCharity()      — Register with KYCz-verified identity
│   ├── verifyCharity()        — ZK proof of 501(c)(3) or equivalent status
│   ├── updateCharityInfo()    — Update charity details (admin only)
│   └── suspendCharity()       — Compliance suspension
│
├── CIRCUITS — Donation Flow
│   ├── makeDonation()         — Privacy-preserving donation with compliance check
│   ├── verifyJurisdiction()   — ZK proof of donor jurisdiction (via GeoZ)
│   ├── screenWallet()         — Check donor against banned wallet set
│   ├── generateReceipt()      — ZK tax receipt (proves donation without revealing amount publicly)
│   └── reclaimDonation()      — Reclaim non-compliant donation within 24h window
│
├── CIRCUITS — Compliance
│   ├── addBannedWallet()      — Add wallet to banned set (admin/oracle)
│   ├── removeBannedWallet()   — Remove wallet from banned set
│   ├── proveCompliance()      — ZK proof: "This donation meets all jurisdictional requirements"
│   └── reportToAuthority()    — Generate compliance report (selective disclosure to IRS/tax authority)
│
└── CIRCUITS — Tax & Reporting
    ├── generateTaxForm()      — ZK-verified tax deduction proof
    ├── proveDonationTotal()   — Prove total donated in a tax year without revealing individual donations
    ├── charityAuditProof()    — Charity proves total received without revealing individual donors
    └── annualSummary()        — Generate annual giving summary (private to donor)
```

### Privacy Model

```
┌──────────────────────────────────────────────────────────┐
│  WHAT'S PUBLIC                   WHAT'S PRIVATE          │
│                                                          │
│  ✓ Charity exists & is verified  ✗ Donor identity        │
│  ✓ Total donated per charity     ✗ Individual amounts    │
│  ✓ Donation count                ✗ Donor wallet address  │
│  ✓ Compliance status             ✗ Donor location        │
│  ✓ Banned wallet set (hashed)    ✗ Tax receipt details   │
│                                  ✗ Donor-charity link    │
└──────────────────────────────────────────────────────────┘

SELECTIVE DISCLOSURE (ZK Proofs):
• Donor → IRS: "I donated $X to registered 501(c)(3) Y in 2026"
  (Proves: amount, charity status, tax year. Hides: wallet, other donations)

• Charity → Auditor: "We received $Y total from N donors in 2026"
  (Proves: total, count. Hides: individual donors, individual amounts)

• Donor → Charity: "I am the donor of commitment #ABC"
  (Proves: ownership. Hides: wallet, other donations, personal info)
```

---

## DIDzMonolith Integration Points

### Direct Integrations

| DIDz Product | Integration | Value |
|-------------|-------------|-------|
| **DIDz-io** | Donor and charity DID issuance | Persistent identity for repeat donors, verified charity registry |
| **KYCz** | Donor KYC for tax compliance | Prove identity to IRS without revealing to charity or public |
| **GeoZ** | Jurisdictional compliance | ZK-verified location for tax jurisdiction without revealing address |
| **SentinelDID** | Emergency disaster relief donations | Fast-track verified donations during emergencies with SentinelDID workforce coordination |
| **safeHealthData** | Medical charity donations | Privacy-preserving donations to health charities with verifiable impact |
| **selectConnect** | Donor-charity communication | Privacy-preserving contact between donors and charities (progressive reveal) |
| **EnterpriseZK** | Corporate donation compliance | Enterprise-grade donation auditing with ZK proofs |
| **SharedScience** | Research funding | Privacy-preserving research grant donations with milestone tracking |

### Cross-Pollination Opportunities

**CareToCoin → Roots & Wings Foundation**: Judy Faulkner's pledge to donate 99% of wealth. CareToCoin could be the privacy-preserving infrastructure for high-net-worth charitable giving — proving compliance without revealing the full extent of assets.

**CareToCoin → SentinelDID Emergency Relief**: During disasters, SentinelDID coordinates the workforce. CareToCoin handles the donation flow — donors can give to verified emergency relief efforts with ZK-proven compliance, and charities can prove funds were deployed appropriately.

**CareToCoin → petProData / equineProData**: Animal welfare donations — donors fund specific animal rescue operations or veterinary care with ZK-verified proof of impact. The animal's DID links to the donation receipt.

---

## Migration Phases

### Phase 1: Core Contract (Weeks 1-2)
- Port `check_donor_and_where` logic to Compact
- Implement charity registry with DIDz identity
- Basic donation flow with privacy-preserving commitments
- Dynamic banned wallet screening

### Phase 2: Tax Compliance (Weeks 3-4)
- ZK tax receipt generation
- Jurisdictional compliance via GeoZ integration
- Annual summary circuits
- IRS reporting with selective disclosure

### Phase 3: Integrations (Weeks 5-6)
- KYCz donor verification
- SelectConnect donor-charity communication
- SentinelDID emergency relief flow
- Enterprise compliance (EnterpriseZK)

### Phase 4: Advanced Features (Weeks 7-8)
- Recurring donation commitments
- Matching fund verification (employer match proofs)
- Impact tracking (charity proves fund deployment)
- Cross-charity donation proofs (prove total giving without revealing distribution)

---

## Key Design Decisions

1. **No fiat conversion on-chain** — Fiat off-ramp handled by partner integrations (banking APIs), not smart contract logic. The contract proves the donation; the off-ramp is a separate service.

2. **Banned wallet screening uses hashes** — Wallet addresses are hashed before comparison. The banned list is public (hashed), but screening happens via ZK proof — the donor proves their wallet is NOT in the banned set without revealing their wallet.

3. **Tax receipts are commitments** — The receipt is a ZK commitment. The donor can selectively disclose to the IRS. The charity never sees the donor's tax situation.

4. **Charity totals are public** — For transparency and trust. Individual donation amounts and donor identities remain private.

---

*Last updated: March 22, 2026*
*Migration planning by: Penny 🎀*
