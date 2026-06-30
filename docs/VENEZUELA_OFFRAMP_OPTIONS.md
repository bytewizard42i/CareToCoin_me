# Venezuela Off-Ramp Options (Cash-Out Partners)

*Research for the last-mile: how a CareToCoin donation actually becomes spendable money for a recipient inside Venezuela. The contract proves the donation; the off-ramp is a partner service, not contract logic.*

**Date**: June 30, 2026
**Owner**: Penny 🎀 for John
**Status**: Research + options. John to pick a primary partner so realDeal can target it.

> Honesty note on "contact numbers": these are app/web fintech services and P2P desks. Most do **not** publish a public phone line; the real contact path is their site, in-app support, and (for the P2P desks) their verified exchange merchant profiles. I have given the verifiable channels below and flagged where a phone/number genuinely exists. Tell me which one(s) you want to pursue and I will dig out the specific support/partnership contact and, where it exists, a phone number.

---

## Macro context (why this is viable)

- The bolívar has lost 99.99%+ of value since 2013; **USDT is the de-facto unit of account** for millions of Venezuelans.
- By Q1 2026 Venezuela was the ~**17th largest crypto market globally**, ~**$17.9B** retail volume, with **USDT in ~90%** of bolívar P2P listings.
- Stablecoin remittance into Venezuela is a mature, everyday flow. We are plugging into existing rails, not inventing one.

---

## Option A — MVGA (mvga.io) — *recommended for auditability*

- **What**: "Digital dollars for Venezuela." USDC balance, **Solana** settlement (<1s, <$0.01), built-in P2P (Zelle/PayPal/Venmo/Pago Móvil), Visa debit card, cash-out to any Venezuelan bank, phone top-ups, up to ~8% APY.
- **Why it fits us best**: **on-chain and open source**, "every transaction verifiable on Solana Explorer, no internal ledgers." That auditability is exactly what a compliant donation rail wants. Self-custody ("your keys"). On-chain P2P escrow. Cash-out to VES via Airtm.
- **Backing**: USDC by Circle (1:1 USD, regulated reserves).
- **Contact channel**: https://mvga.io/en (site has app links + support). No public phone found.
- **Fit**: strong primary candidate for the transparent/auditable arm.

## Option B — Coco Wallet / Coco Pago (cocowallet.app) — *recommended for reach*

- **What**: Venezuela-focused wallet, **USDT/USDC on Polygon**, sender funds in stablecoin, **family receives bolívares directly to bank account or Pago Móvil in minutes**.
- **Backing/credibility**: company **Coco Mercado**, Y Combinator **S'19**; founders **Victor A. Charles, Kevin Charles, Francisco Martin**. Largest sender cohort is **Europe** (integrated **Ramp Network** for EU top-ups in 2024). Android `com.cocomercado.cocowallet`; iOS App Store listing.
- **Contact channel**: https://cocowallet.app (and partner-integration writeups via openfinance-lab.com). App-based support. No public phone found.
- **Fit**: best for **donor-to-recipient bank delivery** UX; good for diaspora donors.

## Option C — CryptoCash.Capital (cryptocash.capital) — *last-mile cash delivery*

- **What**: USDT-to-cash in Venezuela. **Cash USD delivery**, taquilla deposits to any Venezuelan bank, Pago Móvil, remittances. Free delivery within **San Cristóbal, Táchira**.
- **Credibility**: self-described **verified P2P merchants** active on **Binance P2P, Bitget P2P, Bybit P2P, OKX P2P** with confirmation-before-transfer flow.
- **Contact channel**: https://cryptocash.capital (coordination/confirmation flow on site). A P2P desk like this typically has a WhatsApp/Telegram contact; I can pull it on request.
- **Fit**: useful for **physical cash in regions where banking is thin**, especially post-quake.

## Option D — Airtm (airtm.com) — *established aid rail*

- **What**: USD digital wallet + large P2P cashier network across Latin America; widely used for Venezuela payouts (MVGA uses Airtm for VES cash-out).
- **Precedent worth verifying**: USDC-based humanitarian disbursement programs into Venezuela have used Circle + Airtm-type rails before (2020-2021 health-worker aid). **Verify before citing publicly** — I flagged this as a lead, not a confirmed fact.
- **Contact channel**: https://www.airtm.com (business/partnerships page). 
- **Fit**: proven cashier network; good redundancy behind MVGA/Coco.

## Option E — Exchange P2P rails (Binance / Bitget / Bybit / OKX)

- **What**: the underlying liquidity. **USDT/VES** with USDT in ~90% of bolívar pairs; Pago Móvil native; spot fee ~0.1%, P2P 0% platform fee + 3-5% volatility spread.
- **Fit**: this is what every option above ultimately settles against. For realDeal automation we may integrate an exchange API directly, but KYC + ToS for programmatic payouts need review.
- **Note**: SUNACRIP/SUDEBAN reportedly permit individual crypto activity; the practical risks are operational (scams, security), per local guides. Verify current regulatory posture before launch.

## Adjacent dollar-wallets (context, not primary)

Zinli, Meru, Reserve, Wally, Valiu, Trust Wallet, MetaMask. Mostly custodial dollar wallets or generic self-custody. Listed for completeness.

---

## Comparison

| | MVGA | Coco Wallet | CryptoCash.Capital | Airtm |
|---|---|---|---|---|
| Asset | USDC (Solana) | USDT/USDC (Polygon) | USDT | USD/USDC |
| Recipient gets | USD / VES / card | **VES to bank/Pago Móvil** | **Cash USD** / bank | USD / VES |
| Auditability | **On-chain, open source** | App/custodial-ish | P2P desk | Custodial |
| Self-custody | Yes | Partial | N/A (desk) | No |
| Best for | Transparent rail | Diaspora bank delivery | Last-mile cash | Cashier redundancy |
| Public phone? | No | No | Likely WhatsApp/TG | Business page |

---

## Recommendation

- **Primary**: **MVGA** for the auditable, on-chain transparent rail (aligns with our ZK + selective-disclosure story).
- **Delivery partner**: **Coco Wallet** for diaspora-to-bank UX.
- **Last-mile cash**: **CryptoCash.Capital** for hard-to-bank, post-disaster regions.
- **Redundancy**: **Airtm** cashier network.
- demoLand mocks all of these behind one `IOffRampProvider` interface, so swapping the real partner later is a config change.

---

## What I need from John

1. Pick a **primary** off-ramp (or approve the MVGA + Coco + CryptoCash combo).
2. Confirm whether you want me to **reach out / pull direct partnership + phone/WhatsApp contacts** for the chosen one(s). I can fetch their contact pages and P2P merchant handles next.

---

## Sources

- MVGA: mvga.io/en.
- Coco Wallet: cocowallet.app; integration profile openfinance-lab.com (founders, YC S'19, Polygon, Ramp).
- CryptoCash.Capital: cryptocash.capital.
- USDT-in-Venezuela 2026 guide (market size, P2P spreads, regulatory note): latinamericacryptoguide.com.
- Airtm: airtm.com (precedent claim flagged for verification).

*Fintech availability and regulatory posture change fast. Re-verify any chosen partner before integration.*
