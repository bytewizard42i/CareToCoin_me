// =============================================================================
// Wallet-scoped tax receipt store. In demoLand this persists to localStorage
// keyed by wallet, so each wallet keeps its own set of tax receipts and can
// retrieve/download them later. In realDeal the canonical record is the
// on-chain commitment; this store becomes a local cache/index for the wallet.
// =============================================================================

const keyFor = (walletId) => `c2c.receipts.${walletId}`;

export function listReceipts(walletId) {
  if (!walletId) return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(walletId)) || '[]');
  } catch {
    return [];
  }
}

export function saveReceipt(walletId, receipt) {
  if (!walletId) return;
  const all = listReceipts(walletId);
  // De-dupe by receiptId.
  if (!all.some((r) => r.receiptId === receipt.receiptId)) {
    all.unshift(receipt);
    try {
      localStorage.setItem(keyFor(walletId), JSON.stringify(all));
    } catch {
      /* storage full / unavailable: non-fatal in demo */
    }
  }
}

export function clearReceipts(walletId) {
  if (!walletId) return;
  try {
    localStorage.removeItem(keyFor(walletId));
  } catch {
    /* non-fatal */
  }
}
