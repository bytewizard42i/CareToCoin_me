import { Eye, EyeOff, FileCheck } from 'lucide-react';

// Renders one selective-disclosure receipt (same donation, different audience).
export default function ReceiptCard({ receipt }) {
  if (!receipt) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 font-semibold text-slate-800">
        <FileCheck size={16} className="text-emerald-600" /> {receipt.title}
      </div>
      <div className="mt-1 text-xs text-slate-400">Receipt {receipt.receiptId} · commitment {receipt.commitment}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-1 text-xs font-semibold uppercase text-emerald-600">
            <Eye size={14} /> Discloses
          </div>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
            {receipt.discloses.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs font-semibold uppercase text-rose-500">
            <EyeOff size={14} /> Hides
          </div>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
            {receipt.hides.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
