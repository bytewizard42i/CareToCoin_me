# OFAC Sanctions Screening Design

*How CareToCoin screens donors and recipients against the OFAC sanctions list while revealing nothing about who is being screened. Shaped to mirror the real OFAC data as closely as is useful.*

**Date**: June 30, 2026
**Companion to**: `MASTER_PLAN.md`, `MIDNIGHT_PARADIGM_2026.md`

---

## 1. What OFAC actually publishes

The US Treasury Office of Foreign Assets Control (OFAC) publishes the **Specially Designated Nationals and Blocked Persons List (SDN)** plus a **Consolidated (non-SDN)** list. These are the lists a US-touching donation rail must screen against. Formats offered:

- **`SDN.xml`** (legacy XML) and **`sdn_advanced.xml`** (advanced, internationally-modeled XML).
- **`SDN.CSV`** (comma-delimited) and **`SDN.FF`** (fixed-width). Plus `ADD`, `ALT`, `COMMENTS` companion files in the legacy set.
- Consolidated equivalents (`consolidated.xml`, `cons_advanced.xml`, `CONS.CSV`).

Every party gets a unique **UID**. The advanced XML is built on an international sanctions data model (DISTINCT PARTY -> PROFILE -> IDENTITY, plus FEATURES, SANCTIONS ENTRIES, LOCATIONS, ID REGISTRATION DOCUMENTS). Aliases are tagged **strong** vs **weak**.

### Legacy SDN record shape (from the published XSD)

A single `sdnEntry` contains:

| Field | Notes |
|---|---|
| `uid` | unique id |
| `firstName` / `lastName` / `title` | individual names |
| `sdnType` | enum: **Individual | Entity | Vessel | Aircraft** |
| `remarks` | free text (often program details, DOB, etc.) |
| `programList` | one or more OFAC program tags (e.g. **VENEZUELA**, **VENEZUELA-EO13850**, SDGT, etc.) |
| `idList` | id/registration documents (passport, tax id, etc.) |
| `akaList` | aliases, each strong/weak, with type |
| `addressList` | addresses |
| `nationalityList` / `citizenshipList` | |
| `dateOfBirthList` / `placeOfBirthList` | |
| `vesselInfo` | vessels/aircraft only |

Sanctions metadata (advanced model): every PROFILE has a **"Block"** sanctions type plus at least one **"Program"** type; program tags map to OFAC programs. The Venezuela-relevant tags are what we filter on for the flagship scenario.

---

## 2. Our mock list shape (mirrors the real thing)

For demoLand we ship a realistic mock; for realDeal we can ingest the real public files later. The mock uses the same field names so the ingestion path is identical.

```jsonc
// data/ofac/sdn-mock.json  (shape mirrors OFAC SDN.CSV / sdn_advanced.xml)
{
  "publishInfo": { "recordCount": 12, "publishDate": "2026-06-20", "source": "MOCK — shaped to match OFAC SDN" },
  "entries": [
    {
      "uid": "90001",
      "sdnType": "Individual",
      "firstName": "Juan",
      "lastName": "Ejemplo Sancionado",
      "title": "(fictional official)",
      "programList": ["VENEZUELA", "VENEZUELA-EO13850"],
      "akaList": [ { "type": "aka", "category": "strong", "lastName": "El Ejemplo" } ],
      "idList": [ { "idType": "Passport", "idNumber": "X0000000", "idCountry": "Venezuela" } ],
      "nationalityList": ["Venezuela"],
      "dateOfBirthList": ["1970-01-01"],
      "addressList": [ { "city": "Caracas", "country": "Venezuela" } ],
      "remarks": "FICTIONAL test entry. Not a real designation.",
      // Derived for on-chain screening:
      "screeningKeys": ["0x<hash of normalized identity>", "0x<hash of passport>", "0x<hash of known wallet>"]
    }
  ]
}
```

Every mock entry is clearly labeled **FICTIONAL** so we never imply a real person is sanctioned.

---

## 3. From an SDN record to an on-chain screening key

OFAC lists name people and entities, not wallet addresses. So screening has two layers:

1. **Identity layer (off-chain attestation)**: a compliance oracle/issuer maps an SDN party to one or more **screening keys**: `hash(normalized_name + dob)`, `hash(passport_no)`, and any **known sanctioned wallet addresses** (chain-analytics feeds and OFAC's own crypto-address designations provide these). This mapping is the same work every regulated exchange already does.
2. **On-chain layer (ZK non-membership)**: all screening keys are leaves in a **Merkle tree**; CareToCoin publishes only the **root** (`denylist_root`). The list itself stays off-chain (the public can reconstruct it from OFAC data; the chain only needs the root).

> Design note from OpenZeppelin's `Allowlist` module: a **public** on-chain set re-exposes the candidate set and **bounds the anonymity set**. So we never put the donor's key in a public set. We keep the *denylist* as a root and have the donor prove **non-membership** privately.

---

## 4. The ZK screening circuit (non-membership)

```
Inputs (private witness):
  donor_key        = hash(donor_wallet | donor_secret)
  exclusion_path   = Merkle path proving donor_key's sorted-leaf neighbors

Public:
  denylist_root

Circuit asserts (zero knowledge):
  1. donor_key is well-formed from the committed donor secret      (ownership)
  2. donor_key is NOT a leaf under denylist_root                   (non-membership)
  3. donation commitment is well-formed                           (integrity)

Chain learns:  "this donor is sanctions-clean for denylist_root@<date>"
Chain does NOT learn:  donor wallet, identity, amount, or recipient
```

Non-membership proof options (decide at implementation, compile-first):

- **Sorted Merkle tree + range/neighbor proof**: prove `donor_key` falls strictly between two adjacent sorted leaves that are themselves in the tree. Standard, no extra crypto.
- **Sparse Merkle tree (key -> present/absent)**: prove the leaf at `donor_key`'s slot is empty. Clean absence proof; needs SMT support.
- (Membership for the *positive* side: recipient org proves membership in `relief_org_root` with the ordinary `merkleTreePathRoot` / `checkRoot` primitives Midnight already exposes.)

The published root is **versioned by date** so a proof says "clean as of the root I screened against," matching how OFAC screening is audited in the real world (screened against the list as published on date X).

---

## 5. Venezuela specifics

- Filter the SDN/Consolidated lists to the **VENEZUELA*** program tags for the flagship denylist, plus any globally-blocking programs (SDGT, narcotics) that also apply.
- The point of the privacy design: a diaspora donor can prove they are **not** funding a sanctioned regime figure and that funds reach a **verified civilian relief org in the affected zone**, without exposing themselves to their bank, the regime, or the public. Compliance is satisfied; surveillance is removed.

---

## 6. Ingestion path (realDeal)

1. Pull the public files (`SDN.CSV` / `sdn_advanced.xml` + consolidated) on a schedule.
2. Normalize to our entry shape (section 2). Derive `screeningKeys`.
3. Build the sorted/sparse Merkle tree; publish `denylist_root` (versioned) to the contract via the compliance-oracle circuit.
4. Donors fetch the current tree (or a light client of it) to build their non-membership path locally before donating.

For demoLand, steps 1-3 are replaced by the static labeled-fictional mock; the donor-side path-building flow is identical so the UI does not change between modes.

---

## 7. Honesty + legal note

- This is a **screening aid**, not legal advice. Real deployment needs a compliance review and likely a licensed money-services partner for any fiat touchpoint.
- We never assert a real individual is sanctioned in demo data; all mock entries are explicitly fictional.
- OFAC publishes the authoritative lists; we mirror their shape, we do not invent designations.

---

## Sources

- OFAC Advanced Sanctions List standard + Explanatory Documentation (sdn_advanced.xml): ofac.treasury.gov.
- OFAC SDN data formats FAQ (XML / CSV / fixed-width, UID): ofac.treasury.gov/faqs/topic/1641.
- Legacy SDN XSD (field shape): community mirror of OFAC `sdn.xsd`.
- Namespace change notice (2024-05-07): ofac.treasury.gov/recent-actions/20240507_44.
- OpenZeppelin `Allowlist` anonymity-set note: OpenZeppelin/compact-contracts.

*Versions/program tags change; re-pull from OFAC at implementation time.*
