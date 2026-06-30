# Choice Catalogs — How to Add / Remove Options

These four files are the **easy template** for our donation choices. They are plain
data. The UI renders whatever is `enabled: true`, so adding or removing a user
choice is a one-line edit. No component changes needed.

| File | Controls | UI surface |
|---|---|---|
| `reliefOrgs.js` | Which organizations a donor can give to | Org picker |
| `onRamps.js` | How a donor funds the donation | On-ramp picker |
| `offRamps.js` | How the recipient cashes out in Venezuela | Off-ramp picker |
| `campaigns.js` | The relief/political/general/bridge campaigns | Campaign header + policy |

## Add a choice

1. Open the relevant file.
2. Copy an existing entry, give it a unique `id`, fill in the fields.
3. Set `enabled: true`.
4. Save. It appears in the UI immediately (dev server hot-reloads).

## Remove / hide a choice

- Temporary: set `enabled: false` (keeps the entry for later).
- Permanent: delete the entry.

## Rules

- `id` must be unique and stable (providers and the contract key off it).
- Relief orgs are **real**. In demoLand they are choices only and no funds move.
  Keep `verified: false` until WE have confirmed the org's real payout details.
  Never commit a real payout address you have not verified.
- On/off-ramps are **partner services**, never contract logic. demoLand simulates
  them; realDeal wires the real SDK behind the same provider interface.

## How the UI consumes these

```js
import { enabledReliefOrgs } from './config/reliefOrgs';
import { enabledOnRamps }    from './config/onRamps';
import { enabledOffRamps }   from './config/offRamps';
import { enabledCampaigns }  from './config/campaigns';
```

That is the whole contract between config and UI.
