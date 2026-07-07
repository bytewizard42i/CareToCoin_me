# CareToCoin UI (demoLand + realDeal)

Privacy-preserving, sanctions-clean donations on Midnight. Flagship scenario:
the June 2026 Venezuela earthquake relief campaign.

## Run

```bash
cd caretocoin-ui
npm install
npm run dev          # demoLand (mock, no chain) -> http://localhost:5180
npm run dev:realdeal # realDeal (Midnight stubs; not wired yet)
```

## Modes

The UI imports providers only from `src/providers/index.js`, which selects
demoLand vs realDeal from `VITE_C2C_MODE` (`.env.demoland` / `.env.realdeal`).
Components are identical across modes.

## Add / remove user choices (the easy template)

Edit the catalogs in `src/config/`, see `src/config/README.md`:

- `reliefOrgs.js`, organizations a donor can give to
- `onRamps.js`, how a donor funds the donation
- `offRamps.js`, how the recipient cashes out in Venezuela
- `campaigns.js`, the campaigns + compliance policy

Set `enabled: true` and it appears in the UI. No component changes needed.

## Research panels (informed decisions)

Every entity (org / on-ramp / off-ramp) has a research panel (the `i` button on
each card) showing contact URL, email, reputation/ranking lookups, and a live
news search, so donors can vet a choice before committing. Defaults are derived
from the catalog entry; enrich any entity with an optional `research: {}` block
(see `src/config/research.js`).

## The demo flow

1. Pick a donor (one is intentionally flagged to show screening failing).
2. Choose org, on-ramp, amount, off-ramp.
3. "Donate privately" runs: ZK sanctions non-membership screen -> zone/org
   proof -> private commitment -> selective-disclosure receipts -> off-ramp
   delivery estimate.

All proofs are simulated in demoLand. realDeal wires the real Compact contract
(see `../docs/MASTER_PLAN.md`).
