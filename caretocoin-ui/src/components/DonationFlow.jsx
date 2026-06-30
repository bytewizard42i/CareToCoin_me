import { useState } from 'react';
import { ShieldCheck, ShieldX, MapPin, Loader2, RotateCcw, Globe, Lock, MessageSquare, Sparkles, AlertTriangle } from 'lucide-react';
import { enabledReliefOrgs } from '../config/reliefOrgs';
import { enabledOnRamps } from '../config/onRamps';
import { enabledOffRamps } from '../config/offRamps';
import { demoDonors } from '../data/donors';
import { compliance, reliefOrgs as orgProvider, onRamp, donation, offRamp, moderation } from '../providers';
import ChoiceGrid from './ChoiceGrid';
import ReceiptCard from './ReceiptCard';

export default function DonationFlow({ campaign }) {
  const [donorId, setDonorId] = useState(demoDonors[0].id);
  const [orgId, setOrgId] = useState(enabledReliefOrgs()[0]?.id);
  const [onRampId, setOnRampId] = useState(enabledOnRamps()[0]?.id);
  const [offRampId, setOffRampId] = useState(enabledOffRamps()[0]?.id);
  const [amount, setAmount] = useState(100);
  const [visibility, setVisibility] = useState('private');
  const [displayName, setDisplayName] = useState('');
  const [dedication, setDedication] = useState('');
  const [moderationResult, setModerationResult] = useState(null);

  const [busy, setBusy] = useState(false);
  const [screen, setScreen] = useState(null);
  const [zone, setZone] = useState(null);
  const [donationResult, setDonationResult] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [payout, setPayout] = useState(null);
  const [reclaimed, setReclaimed] = useState(null);

  const donor = demoDonors.find((d) => d.id === donorId);

  const reset = () => {
    setScreen(null); setZone(null); setDonationResult(null);
    setReceipts([]); setPayout(null); setReclaimed(null); setModerationResult(null);
  };

  async function run(mode) {
    reset();
    setVisibility(mode);
    setBusy(true);
    try {
      // 0. Ai moderation of the dedication (gate: a dedication must pass before anything else).
      if (dedication.trim()) {
        const m = await moderation.screenDedication(dedication);
        setModerationResult(m);
        if (!m.allowed) return;
      }
      // 1. Sanctions screening (ZK non-membership)
      const s = await compliance.screenDonor(donor);
      setScreen(s);
      if (!s.clean) {
        const rc = await donation.reclaim({ commitment: 'n/a' });
        setReclaimed(rc);
        return;
      }
      // 2. Zone + org verification
      const z = await orgProvider.verifyZone(orgId, campaign);
      setZone(z);
      // 3. Fund via chosen on-ramp
      await onRamp.fund(onRampId, Number(amount));
      // 4. Commit the private donation
      const d = await donation.makeDonation({
        donor, orgId, amountUsd: Number(amount), campaign, screenProof: s.proof, zoneProof: z.proof,
        visibility: mode, displayName, dedication: dedication.trim() || null,
      });
      setDonationResult(d);
      // 5. Selective-disclosure receipts
      const targets = ['tax-authority', 'auditor', 'relief-org'];
      const rs = [];
      for (const t of targets) rs.push(await donation.generateReceipt(d, t));
      setReceipts(rs);
      // 6. Off-ramp delivery estimate
      setPayout(await offRamp.estimate(offRampId, Number(amount)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      {/* Donor (act as) */}
      <section className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Donate as (demo)</h3>
        <div className="flex flex-wrap gap-2">
          {demoDonors.map((d) => (
            <button key={d.id} onClick={() => setDonorId(d.id)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                d.id === donorId ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'
              }`}>
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-400">{donor.note}</p>
      </section>

      <ChoiceGrid title="Choose a relief organization" items={enabledReliefOrgs()} kind="org"
        selectedId={orgId} onSelect={setOrgId} renderMeta={(o) => o.blurb} />

      <ChoiceGrid title="Fund your donation (on-ramp)" items={enabledOnRamps()} kind="onramp"
        selectedId={onRampId} onSelect={setOnRampId} renderMeta={(o) => o.blurb} />

      {/* Amount */}
      <section className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Amount (USD)</h3>
        <div className="flex items-center gap-2">
          {[25, 100, 500, 1000].map((v) => (
            <button key={v} onClick={() => setAmount(v)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                amount === v ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white'
              }`}>${v}</button>
          ))}
          <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-28 rounded-lg border border-slate-200 px-3 py-1.5 text-sm" />
        </div>
      </section>

      <ChoiceGrid title="Recipient cash-out (off-ramp)" items={enabledOffRamps()} kind="offramp"
        selectedId={offRampId} onSelect={setOffRampId} renderMeta={(o) => `${o.delivery} · ${o.bestFor}`} />

      {/* Dedication (optional, Ai-moderated; published only if you donate publicly) */}
      <section className="mt-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <MessageSquare size={14} /> Dedication (optional)
        </h3>
        <textarea value={dedication} onChange={(e) => setDedication(e.target.value)} maxLength={400} rows={2}
          placeholder='e.g. "In memory of those lost in La Guaira. Stay strong, Venezuela."'
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1"><Sparkles size={12} /> Screened by Ai moderation before publishing.</span>
          <span>{dedication.length}/280</span>
        </div>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Public display name (optional, used only for public donations)"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {/* Ai moderation feedback */}
      {moderationResult && !moderationResult.allowed && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <div className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} /> Dedication blocked by Ai moderation</div>
          <p className="mt-1">{moderationResult.reason}</p>
        </div>
      )}
      {moderationResult && moderationResult.allowed && !moderationResult.empty && (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <Sparkles size={12} className="mr-1 inline" /> {moderationResult.reason}
        </div>
      )}

      {/* Actions: private vs public */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button onClick={() => run('private')} disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {busy && visibility === 'private' ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
          Donate privately
        </button>
        <button onClick={() => run('public')} disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-indigo-600 bg-white py-3 font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-60">
          {busy && visibility === 'public' ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
          Donate publicly
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Private hides your identity, amount, and dedication. Public publishes your display name, amount, and dedication on the campaign wall. Sanctions screening runs either way.
      </p>

      {/* Results */}
      {screen && (
        <div className={`mt-6 rounded-xl border p-4 ${screen.clean ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
          <div className="flex items-center gap-2 font-semibold">
            {screen.clean ? <ShieldCheck size={18} className="text-emerald-600" /> : <ShieldX size={18} className="text-rose-600" />}
            Sanctions screening (ZK non-membership)
          </div>
          <p className="mt-1 text-sm text-slate-700">{screen.explanation}</p>
          <p className="mt-1 text-xs text-slate-400">Denylist root as of {screen.denylistRootDate}{screen.proof ? ` · ${screen.proof}` : ''}</p>
        </div>
      )}

      {reclaimed && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <RotateCcw size={16} className="mr-1 inline" />
          Donation blocked and reclaimable within {reclaimed.window}. {reclaimed.note}
        </div>
      )}

      {zone && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 font-semibold"><MapPin size={18} className="text-emerald-600" /> Zone + org verification</div>
          <p className="mt-1 text-sm text-slate-700">{zone.explanation}</p>
          <p className="mt-1 text-xs text-slate-400">Affected zones: {zone.zones.join(', ')}</p>
        </div>
      )}

      {donationResult && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            {donationResult.visibility === 'public' ? <Globe size={16} className="text-indigo-600" /> : <Lock size={16} className="text-indigo-600" />}
            {donationResult.visibility === 'public' ? 'Public donation committed' : 'Private donation committed'}
          </div>
          <div className="mt-1 text-xs text-slate-400">Commitment {donationResult.commitment}</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-xs font-semibold uppercase text-emerald-600">Public on-chain</div>
              {donationResult.visibility === 'public' ? (
                <div className="text-slate-700">
                  {donationResult.public.donorName} gave ${donationResult.public.amountUsd}
                  {donationResult.public.dedication && (
                    <p className="mt-1 italic text-slate-600">“{donationResult.public.dedication}”</p>
                  )}
                </div>
              ) : (
                <div className="text-slate-700">Campaign, recipient org, compliant=true</div>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-rose-500">Private (off-ledger)</div>
              <div className="text-slate-700">
                {donationResult.visibility === 'public'
                  ? 'Real wallet identity stays shielded; only your chosen name is public.'
                  : `Donor, amount ($${donationResult.private.amountUsd}), location, dedication`}
              </div>
            </div>
          </div>
        </div>
      )}

      {payout && payout.ok && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div className="font-semibold text-slate-800">Off-ramp delivery (estimate)</div>
          <p className="mt-1 text-slate-700">{payout.partner}: {payout.delivery} · ~{payout.etaMinutes} min · {payout.asset} on {payout.network}</p>
        </div>
      )}

      {receipts.length > 0 && (
        <section className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Selective-disclosure receipts</h3>
          {receipts.map((r) => <ReceiptCard key={r.receiptId} receipt={r} />)}
        </section>
      )}
    </div>
  );
}
