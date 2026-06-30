// =============================================================================
// ON-RAMP CATALOG  (how a donor funds the donation)
// -----------------------------------------------------------------------------
// TEMPLATE: add/remove an entry to add/remove a user choice. `enabled: true`
// shows it in the UI. demoLand simulates all of these; realDeal wires the real
// SDK/widget behind the same IOnRampProvider interface.
// =============================================================================

/**
 * @typedef {Object} OnRamp
 * @property {string}  id
 * @property {boolean} enabled
 * @property {string}  name
 * @property {string}  method       "card" | "bank" | "wallet" | "exchange"
 * @property {string}  asset        what the donor ends up holding to donate
 * @property {string}  blurb
 * @property {string}  emoji
 */

/** @type {OnRamp[]} */
export const onRamps = [
  {
    id: 'card-ramp',
    enabled: true,
    name: 'Credit / Debit Card',
    method: 'card',
    asset: 'USDC',
    blurb: 'Buy USDC instantly with a card (Ramp / MoonPay / Transak class widget).',
    emoji: '💳',
  },
  {
    id: 'bank-ach',
    enabled: true,
    name: 'Bank Transfer (ACH / SEPA)',
    method: 'bank',
    asset: 'USDC',
    blurb: 'Lower fees, slower settlement. Good for larger gifts.',
    emoji: '🏦',
  },
  {
    id: 'existing-wallet',
    enabled: true,
    name: 'Connect Existing Wallet',
    method: 'wallet',
    asset: 'USDC / USDT / NIGHT',
    blurb: 'Donate from crypto you already hold (self-custody).',
    emoji: '👛',
  },
  {
    id: 'midnight-wallet',
    enabled: true,
    name: 'Midnight Wallet (Lace)',
    method: 'wallet',
    asset: 'NIGHT',
    blurb: 'Native Midnight wallet for the shielded donation path.',
    emoji: '🌙',
  },
  {
    id: 'exchange-withdraw',
    enabled: false,
    name: 'Exchange Withdrawal',
    method: 'exchange',
    asset: 'USDT',
    blurb: 'Withdraw USDT from an exchange to donate. (Disabled by default.)',
    emoji: '📤',
  },
];

export const enabledOnRamps = () => onRamps.filter((r) => r.enabled);
export const getOnRamp = (id) => onRamps.find((r) => r.id === id);
