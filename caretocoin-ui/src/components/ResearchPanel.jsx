import { ExternalLink, Mail, Newspaper, Star, ShieldCheck, ShieldAlert } from 'lucide-react';
import { buildResearch } from '../config/research';

// Research panel so users can make informed decisions about each entity.
// props: entity, kind ('org' | 'onramp' | 'offramp')
export default function ResearchPanel({ entity, kind }) {
  const r = buildResearch(entity, kind);
  if (!r) return null;

  return (
    <div className="mt-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 text-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Research: {r.name}</h4>
        {r.verified === false && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-700">
            <ShieldAlert size={14} /> Unverified payout (demo)
          </span>
        )}
        {r.verified === true && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
            <ShieldCheck size={14} /> Verified
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Vet this choice before you commit.</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {/* Contact + site */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</div>
          {r.url && (
            <a href={r.url} target="_blank" rel="noreferrer"
               className="mt-1 flex items-center gap-1 text-indigo-600 hover:underline">
              <ExternalLink size={14} /> {r.url.replace(/^https?:\/\//, '')}
            </a>
          )}
          {r.email ? (
            <a href={`mailto:${r.email}`} className="mt-1 flex items-center gap-1 text-indigo-600 hover:underline">
              <Mail size={14} /> {r.email}
            </a>
          ) : (
            <div className="mt-1 flex items-center gap-1 text-slate-400">
              <Mail size={14} /> See contact page
            </div>
          )}
        </div>

        {/* Rankings / reputation */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reputation</div>
          <ul className="mt-1 space-y-1">
            {r.rankings.map((rk) => (
              <li key={rk.service}>
                <a href={rk.url} target="_blank" rel="noreferrer"
                   className="flex items-center gap-1 text-indigo-600 hover:underline">
                  <Star size={14} /> {rk.service}
                  <span className="text-slate-400">— {rk.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* News */}
      <div className="mt-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Related news</div>
        <a href={r.newsSearchUrl} target="_blank" rel="noreferrer"
           className="mt-1 inline-flex items-center gap-1 text-indigo-600 hover:underline">
          <Newspaper size={14} /> Latest news search
        </a>
        {r.news.length > 0 && (
          <ul className="mt-1 space-y-1">
            {r.news.map((n) => (
              <li key={n.url}>
                <a href={n.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                  {n.title}
                </a>
                <span className="text-slate-400"> — {n.source} {n.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {r.verifyNote && (
        <p className="mt-3 rounded bg-amber-50 dark:bg-amber-950/40 px-2 py-1 text-xs text-amber-800 dark:text-amber-200">
          Note: {r.verifyNote}
        </p>
      )}
    </div>
  );
}
