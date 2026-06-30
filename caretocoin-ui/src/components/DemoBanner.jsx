import { AlertTriangle } from 'lucide-react';
import { isDemo } from '../providers';

export default function DemoBanner() {
  if (!isDemo) return null;
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-400/95 text-amber-950 text-sm font-semibold py-2 px-4 shadow-sm backdrop-blur">
      <AlertTriangle size={16} />
      DEMO MODE — no chain, no real funds move. Orgs are real but mocked; OFAC data is fictional.
    </div>
  );
}
