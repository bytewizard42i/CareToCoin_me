import { useMemo } from 'react';
import { FileText, Download, FileJson, Trash2 } from 'lucide-react';
import { listReceipts, clearReceipts } from '../lib/receiptStore';
import { downloadReceiptHtml, downloadReceiptJson } from '../lib/receiptFile';

// Wallet-scoped list of saved tax receipts.
// props: walletId, version (bump to force a re-read after a new save), onChange
export default function MyReceipts({ walletId, version, onChange }) {
  // version is referenced so the memo re-runs after each new receipt is saved.
  const receipts = useMemo(() => listReceipts(walletId), [walletId, version]);
  if (!receipts.length) return null;

  return (
    <section className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <FileText size={16} /> Your saved tax receipts ({receipts.length})
        </h3>
        <button
          onClick={() => { clearReceipts(walletId); onChange?.(); }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600">
          <Trash2 size={14} /> Clear
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-400">Stored for this wallet ({walletId}). Download anytime for tax filing.</p>

      <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-700">
        {receipts.map((r) => (
          <li key={r.receiptId} className="flex items-center justify-between py-2">
            <div className="text-sm">
              <div className="font-medium text-slate-800 dark:text-slate-100">${r.donation.amountUsd} · {r.donee.name}</div>
              <div className="text-xs text-slate-400">{r.receiptId} · {r.donation.date} · {r.donation.visibility}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => downloadReceiptHtml(r)}
                className="flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                <Download size={14} /> HTML
              </button>
              <button onClick={() => downloadReceiptJson(r)}
                className="flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                <FileJson size={14} /> JSON
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
