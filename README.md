# CareToCoin — Privacy-Preserving Charitable Donations

> **Giving, without the paperwork. Compliance, without the friction.**

[![Built on Midnight](https://img.shields.io/badge/Migrating_to-Midnight_Network-6C3FC5?style=for-the-badge)](https://midnight.network)
[![Powered by DIDz](https://img.shields.io/badge/Powered_by-DIDz.io-3B82F6?style=for-the-badge)]()
[![Domain](https://img.shields.io/badge/Domain-CareToCoin.me-10B981?style=for-the-badge)]()

Part of the **[DIDz ecosystem](https://github.com/bytewizard42i/DIDzMonolith)**.

---

## What Is CareToCoin?

CareToCoin is a decentralized donation platform that makes charitable giving seamless, compliant, and private. Donors contribute with cryptocurrency. The DApp handles everything else — fiat conversion, direct bank deposit, tax receipt generation, jurisdictional compliance, and banned wallet screening — automatically.

### How It Works

1. **Donor contributes** crypto to a charity or cause
2. **Auto-conversion** — donation converts to fiat and deposits directly into the recipient's bank account
3. **Tax receipts** — generated instantly for both donor and recipient via ZK-verified proofs
4. **Compliance check** — jurisdictional rules enforced on-chain
5. **Banned wallet screening** — automatic screening against known watchlists
6. **Ineligible donations** — donor is prompted to reclaim within 24 hours; unclaimed funds route to compliance

### Why Zero-Knowledge Proofs?

Traditional donation platforms expose donor identity to charities, payment processors, and regulators. CareToCoin proves:
- **Tax eligibility** without revealing income
- **Jurisdictional compliance** without revealing address
- **Donation amount verification** without revealing wallet balance
- **Wallet legitimacy** without revealing transaction history

---

## Migration: Cardano/Aiken → Midnight

CareToCoin was originally built on **Cardano using Aiken** smart contracts as part of the Emurgo Academy Developer Program. It is now being migrated to the **Midnight Network** for full zero-knowledge proof support and privacy-preserving compliance.

| Aspect | Original (Cardano/Aiken) | Target (Midnight/Compact) |
|--------|--------------------------|---------------------------|
| **Smart Contracts** | Aiken validators | Compact circuits + witnesses |
| **Privacy** | Public ledger | ZK-shielded state |
| **Tax Receipts** | Off-chain generation | ZK-verified on-chain proofs |
| **Compliance** | Basic checks | Jurisdiction-aware ZK proofs |
| **Identity** | Wallet-based | DIDz decentralized identity |

---

## Architecture

```
CareToCoin
├── Donor Layer
│   ├── Wallet connection (Lace → Midnight)
│   ├── DIDz identity (optional, for recurring donors)
│   └── Donation intent + amount
├── Compliance Layer
│   ├── Jurisdictional rule engine (on-chain)
│   ├── Banned wallet screening (ZK proof of non-membership)
│   └── Tax eligibility verification (ZK proof)
├── Execution Layer
│   ├── Crypto → fiat conversion
│   ├── Direct bank deposit
│   └── Tax receipt generation (ZK-verified)
└── Audit Layer
    ├── On-chain donation proofs (privacy-preserving)
    ├── Compliance attestations
    └── Reclaim/redirect logic for ineligible funds
```

---

## Ecosystem Integration

| Product | Integration |
|---------|------------|
| **[DIDz.io](https://github.com/bytewizard42i/didz-dapp-system)** | Donor and charity identity verification |
| **[KYCz](https://github.com/bytewizard42i/KYCz_us_app)** | Donor KYC for high-value donations (ZK-verified) |
| **[SilentLedger](https://github.com/bytewizard42i/SilentLedger)** | Charity financial record-keeping with selective disclosure |
| **[DIDzMonolith](https://github.com/bytewizard42i/DIDzMonolith)** | Master orchestration repo for the full ecosystem |

---

## History & Supporting Documentation

CareToCoin originated as a capstone project for the **Emurgo Academy Aiken Developer Program**, demonstrating smart contract-based donation compliance on Cardano. The core concept and business model are being carried forward into the Midnight migration.

- **Business Plan**: [Google Doc](https://docs.google.com/document/d/1qxHz34FJJQln4uGpm3e1gvttoTH0oFGN/edit?usp=sharing&ouid=108492258928725643154&rtpof=true&sd=true)
- **Smart Contract Whiteboard**: [Miro Board](https://miro.com/app/board/uXjVLU95jwM=/?share_link_id=453967143693)
- **Funding Acquisition Plan**: [Google Doc](https://docs.google.com/document/d/1Ggd2nAfjtN0YvZp2Fnilu5GU38KUm3UJBgtubdNOP6o/edit?usp=sharing)

---

**Built by**: [EnterpriseZK Labs LLC](https://enterprisezk.com) · John Santi
