// =============================================================================
// OFF-RAMP CATALOG  (how a donation becomes spendable money inside Venezuela)
// -----------------------------------------------------------------------------
// TEMPLATE: add/remove an entry to add/remove a user choice. `enabled: true`
// shows it in the UI. The contract proves the donation; the off-ramp is a
// partner SERVICE, not contract logic. See docs/VENEZUELA_OFFRAMP_OPTIONS.md.
// =============================================================================

/**
 * @typedef {Object} OffRamp
 * @property {string}  id
 * @property {boolean} enabled
 * @property {string}  name
 * @property {string}  asset        stablecoin/asset used (display)
 * @property {string}  network      settlement network (display)
 * @property {string}  delivery     what the recipient actually receives
 * @property {string}  bestFor      one-line positioning
 * @property {boolean} auditable    on-chain / open-source transparency
 * @property {string}  website
 * @property {string}  emoji
 */

/** @type {OffRamp[]} */
export const offRamps = [
  {
    id: 'mvga',
    enabled: true,
    name: 'MVGA',
    asset: 'USDC',
    network: 'Solana',
    delivery: 'USD balance, VES via Airtm, or Visa debit card',
    bestFor: 'Transparent rail (on-chain + open source). Best auditability.',
    auditable: true,
    website: 'https://mvga.io',
    emoji: '🟣',
  },
  {
    id: 'coco-wallet',
    enabled: true,
    name: 'Coco Wallet',
    asset: 'USDT / USDC',
    network: 'Polygon',
    delivery: 'Bolívares to bank account or Pago Móvil in minutes',
    bestFor: 'Diaspora-to-bank delivery UX.',
    auditable: false,
    website: 'https://cocowallet.app',
    emoji: '🥥',
  },
  {
    id: 'cryptocash-capital',
    enabled: true,
    name: 'CryptoCash.Capital',
    asset: 'USDT',
    network: 'P2P desk',
    delivery: 'Cash USD delivery + taquilla bank deposits',
    bestFor: 'Last-mile cash where banking is thin (post-disaster).',
    auditable: false,
    website: 'https://cryptocash.capital',
    emoji: '💵',
  },
  {
    id: 'airtm',
    enabled: true,
    name: 'Airtm',
    asset: 'USD / USDC',
    network: 'Cashier network',
    delivery: 'USD wallet or VES via P2P cashiers',
    bestFor: 'Established cashier network; redundancy.',
    auditable: false,
    website: 'https://www.airtm.com',
    emoji: '🔁',
  },
  {
    id: 'exchange-p2p',
    enabled: true,
    name: 'Exchange P2P (Binance / Bitget / Bybit / OKX)',
    asset: 'USDT',
    network: 'P2P / VES',
    delivery: 'VES via Pago Móvil; underlying liquidity layer',
    bestFor: 'Deepest liquidity (USDT in ~90% of bolívar pairs).',
    auditable: false,
    website: 'https://p2p.binance.com',
    emoji: '📈',
  },
];

export const enabledOffRamps = () => offRamps.filter((r) => r.enabled);
export const getOffRamp = (id) => offRamps.find((r) => r.id === id);
