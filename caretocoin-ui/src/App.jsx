import { Users, HandCoins } from 'lucide-react';
import DemoBanner from './components/DemoBanner';
import DonationFlow from './components/DonationFlow';
import { enabledCampaigns } from './config/campaigns';

export default function App() {
  const campaign = enabledCampaigns()[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <DemoBanner />

      {/* Header */}
      <header className="bg-gradient-to-br from-[#2A1A4A] to-[#6C3FC5] text-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="text-sm font-semibold uppercase tracking-widest text-indigo-200">CareToCoin.me</div>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold">
            <span>{campaign.emoji}</span> {campaign.title}
          </h1>
          <p className="mt-3 max-w-2xl text-indigo-100">{campaign.summary}</p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <HandCoins size={18} className="text-indigo-200" />
              <span className="font-semibold">${campaign.publicTotalsUsd.toLocaleString()}</span>
              <span className="text-indigo-200">raised (public)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-indigo-200" />
              <span className="font-semibold">{campaign.donationCount.toLocaleString()}</span>
              <span className="text-indigo-200">donations (donors private)</span>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-indigo-100">
              Status: {campaign.status}
            </div>
          </div>
        </div>
      </header>

      <main>
        <DonationFlow campaign={campaign} />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        CareToCoin — privacy-preserving, sanctions-clean donations on Midnight.
        Prove the compliance facts; disclose nothing else.
      </footer>
    </div>
  );
}
