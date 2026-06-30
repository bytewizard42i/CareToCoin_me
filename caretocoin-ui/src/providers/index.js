// =============================================================================
// Provider factory. Selects demoLand vs realDeal from the build mode.
//   VITE_C2C_MODE = "demoland" (default) | "realdeal"
// The UI imports ONLY from here, so swapping modes never touches components.
// =============================================================================
import * as demoland from './demoland';
import * as realdeal from './realdeal';

export const C2C_MODE = import.meta.env.VITE_C2C_MODE || 'demoland';

const impl = C2C_MODE === 'realdeal' ? realdeal : demoland;

export const compliance = impl.complianceProvider;
export const reliefOrgs = impl.reliefOrgProvider;
export const onRamp = impl.onRampProvider;
export const donation = impl.donationProvider;
export const offRamp = impl.offRampProvider;
export const moderation = impl.moderationProvider;
export const taxReceipt = impl.taxReceiptProvider;

export const isDemo = C2C_MODE !== 'realdeal';
