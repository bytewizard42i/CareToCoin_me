import { useState } from 'react';
import { Check, Info } from 'lucide-react';
import ResearchPanel from './ResearchPanel';

// Reusable picker for relief orgs, on-ramps, and off-ramps.
// props:
//   title       section heading
//   items       catalog entries (must have id, name/shortName, emoji)
//   kind        'org' | 'onramp' | 'offramp' (for the research panel)
//   selectedId  currently selected id
//   onSelect    (id) => void
//   renderMeta  optional (item) => node, shown under the name
export default function ChoiceGrid({ title, items, kind, selectedId, onSelect, renderMeta }) {
  const [researchId, setResearchId] = useState(null);

  return (
    <section className="mt-6">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const selected = item.id === selectedId;
          const open = researchId === item.id;
          return (
            <div key={item.id}
                 className={`rounded-xl border p-3 transition ${
                   selected ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-300' : 'border-slate-200 bg-white hover:border-slate-300'
                 }`}>
              <div className="flex items-start gap-3">
                <button onClick={() => onSelect(item.id)} className="flex flex-1 items-start gap-3 text-left">
                  <span className="text-2xl leading-none">{item.emoji || '•'}</span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-medium text-slate-800">
                      {item.shortName || item.name}
                      {selected && <Check size={16} className="text-indigo-600" />}
                    </span>
                    {renderMeta && <span className="mt-0.5 block text-xs text-slate-500">{renderMeta(item)}</span>}
                  </span>
                </button>
                <button
                  onClick={() => setResearchId(open ? null : item.id)}
                  title="Research this option"
                  className={`rounded-md p-1.5 ${open ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-100'}`}>
                  <Info size={16} />
                </button>
              </div>
              {open && <ResearchPanel entity={item} kind={kind} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
