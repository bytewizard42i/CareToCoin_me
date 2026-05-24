# DIF Relevance for CareToCoin

> **Canonical source**: [`/home/js/DIDzMonolith/monolith-docs/DIF_KNOWLEDGE_BASE.md`](/home/js/DIDzMonolith/monolith-docs/DIF_KNOWLEDGE_BASE.md)
>
> This file is a short pointer. The deep content (specs, ecosystem, integration patterns, anti-patterns) lives in the canonical knowledge base. Refresh this file only when CareToCoin's DIF needs materially change.

## Why DIF matters for CareToCoin

CareToCoin donor-receipt and impact-attestation flows fit the Claims and Credentials WG output (verifiable receipts) and Creator Assertions (verified provenance of impact reports and beneficiary acknowledgments).

## DIF specs to adopt

- **Claims and Credentials WG**: donor receipts as verifiable credentials, impact attestations
- **Creator Assertions WG**: provenance for impact reports, beneficiary acknowledgments, photo and video evidence
- **Presentation Exchange**: donor-side credential checks (matching grant, employer-sponsored donation)
- **BBS+ Signatures**: selective disclosure of donor or beneficiary attributes
- **DIDComm v2**: secure donor-to-organization messaging

## Integration patterns from the canonical doc

- Pattern B (Presentation Exchange for credential proofs)
- Pattern E (BBS+ for selective disclosure)

## Concrete next steps

1. Issue donor receipts as W3C Verifiable Credentials signed with BBS+.
2. Use Creator Assertions for impact-report and beneficiary-evidence provenance.
3. Adopt Presentation Exchange for matching-grant and employer-sponsored donation flows.

## Last refreshed

May 24, 2026 from DIF homepage and GitHub org listing.
