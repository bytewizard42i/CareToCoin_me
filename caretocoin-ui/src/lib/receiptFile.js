// =============================================================================
// Tax receipt file generation. Turns a receipt object into a saveable file:
//   - a printable, self-contained HTML document (print -> PDF), and
//   - a machine-readable JSON file.
// Pure browser utilities; no chain.
// =============================================================================

const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function receiptToHtml(r) {
  const row = (label, value) =>
    `<tr><td class="l">${esc(label)}</td><td class="v">${esc(value)}</td></tr>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>CareToCoin Tax Receipt ${esc(r.receiptId)}</title>
<style>
  body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;color:#0f172a;max-width:680px;margin:40px auto;padding:0 20px}
  h1{font-size:20px;margin:0}
  .brand{color:#6C3FC5;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:12px}
  .box{border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-top:16px}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  td{padding:6px 4px;vertical-align:top;border-bottom:1px solid #f1f5f9;font-size:14px}
  td.l{color:#64748b;width:42%}
  td.v{color:#0f172a;font-weight:600}
  .amt{font-size:28px;font-weight:800;color:#6C3FC5}
  .stmt{margin-top:12px;font-size:13px;color:#334155}
  .disc{margin-top:16px;font-size:11px;color:#94a3b8}
  @media print{body{margin:0}}
</style></head>
<body>
  <div class="brand">CareToCoin.me</div>
  <h1>Charitable Contribution Receipt</h1>
  <div class="box">
    <div class="amt">$${esc(r.donation.amountUsd)} ${esc(r.donation.currency)}</div>
    <table>
      ${row('Receipt ID', r.receiptId)}
      ${row('Date of contribution', r.donation.date)}
      ${row('Tax year', r.taxYear)}
      ${row('Donee organization', r.donee.name)}
      ${row('Donee website', r.donee.website || '—')}
      ${row('Donee tax ID', r.donee.taxId || '(verify with organization)')}
      ${row('Donor', r.donor.displayName)}
      ${row('Donor wallet', r.donor.walletRef)}
      ${row('Asset', `${r.donation.asset} (crypto)`)}
      ${row('Visibility', r.donation.visibility)}
      ${row('Campaign', r.campaign.title)}
      ${row('On-chain commitment', r.commitment)}
      ${row('Compliance proof', r.proofRef || '—')}
    </table>
    <p class="stmt"><strong>Statement:</strong> ${esc(r.statement)}</p>
    <p class="disc">${esc(r.disclaimer)}</p>
  </div>
</body></html>`;
}

function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadReceiptHtml(r) {
  downloadBlob(`${r.receiptId}.html`, receiptToHtml(r), 'text/html');
}

export function downloadReceiptJson(r) {
  downloadBlob(`${r.receiptId}.json`, JSON.stringify(r, null, 2), 'application/json');
}
