# HelixChain Integration (pointer)

**CareToCoin** integrates with **HelixChain**, the ecosystem's
privacy-preserving data plane + AI agent (powered by
**DIDz + AgenticDID + RWAz + HelixChain**).

**This repo primarily writes:** `identities` (donors / beneficiaries / charities)
+ `credentials` (KYC / screening / tax-status as **VC**s) + `agent_grants`
(delegated, capped disbursement agents). Fiat conversion + tax receipts anchor a
`*_hash`; amounts stay bucketed where possible.

**Integration contract (summary):**
- every donor/beneficiary is a 32-byte **commitment**, never a name
- use the identity layer (DIDz ⇄ tID swappable at runtime) — never hard-code a provider
- store **coarse** data only + a `*_hash` anchor
- pick the right class: **DIDz** identity / **VC** credential / **RWAz** asset / **AgenticDID** grant
  (a screening result is a VC; a disbursement authority is an AgenticDID grant)

**Canonical integration schema:** `helixchain/docs/HELIXCHAIN_INTEGRATION.md`
**Alternate-ID (tDIDz) scheme:** `helixchain/docs/IDENTITY_PLACEHOLDER_SCHEME.md`
(local pointer: `docs/TEMP_ID_PLACEHOLDER.md`)
