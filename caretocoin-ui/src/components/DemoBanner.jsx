import { AlertTriangle } from 'lucide-react';
import { isDemo } from '../providers';

export default function DemoBanner() {
  if (!isDemo) return null;
  return (
    <div className="flex items-center justify-center gap-2 bg-amber-400/90 text-amber-950 text-sm font-semibold py-2 px-4">
      <AlertTriangle size={16} />
      DEMO MODE — no chain, no real funds move. Orgs are real but mocked; OFAC data is fictional.
    </div>
  );
}
