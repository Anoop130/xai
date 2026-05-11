import { useState, useMemo } from 'react';

// serializable session shape passed as props from the Astro page
interface Session {
  id: string;
  date: string;
  week: number;
  year: number;
  title: string;
  presenter?: string;
  topic: 'ai' | 'ml' | 'data-science' | 'tooling' | 'guest';
  slidesUrl?: string;
  recordingUrl?: string;
  summary: string;
}

interface Props {
  sessions: Session[];
  base: string;
}

// human readable labels for each topic value
const TOPIC_LABELS: Record<Session['topic'], string> = {
  ai: 'AI',
  ml: 'ML',
  'data-science': 'Data Science',
  tooling: 'Tooling',
  guest: 'Guest',
};

// all topics in a stable order for rendering filter pills
const TOPICS = Object.keys(TOPIC_LABELS) as Session['topic'][];

// client side session filter by year and topic
export default function SessionFilter({ sessions, base }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<Session['topic'] | 'all'>('all');

  // derive unique years from session data, newest first
  const years = useMemo(
    () => [...new Set(sessions.map((s) => s.year))].sort((a, b) => b - a),
    [sessions]
  );

  // apply year and topic filters
  const filtered = useMemo(
    () =>
      sessions.filter((s) => {
        const yearMatch = selectedYear === 'all' || s.year === selectedYear;
        const topicMatch = selectedTopic === 'all' || s.topic === selectedTopic;
        return yearMatch && topicMatch;
      }),
    [sessions, selectedYear, selectedTopic]
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div>
      {/* filter controls row */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 items-center">
        {/* year dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
            Year
          </label>
          <select
            id="year-select"
            value={String(selectedYear)}
            onChange={(e) =>
              setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-[#9a1728]"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* topic filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Topic</span>
          {(['all', ...TOPICS] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTopic === t
                  ? 'bg-[#9a1728] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t === 'all' ? 'All' : TOPIC_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* filtered session list */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">no activities match the selected filters</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((s) => (
            <li key={s.id}>
              <a
                href={`${base}activities/${s.id}/`}
                className="group grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-[#9a1728] hover:shadow-lg md:grid-cols-[280px_1fr]"
              >
                <img
                  src={`${base}images/activity/exlent-flyer.jpg`}
                  alt=""
                  className="h-56 w-full object-cover object-top md:h-full"
                  loading="lazy"
                />
                <div className="p-6 md:p-7">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#fce7ea] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#9a1728]">
                      {TOPIC_LABELS[s.topic]}
                    </span>
                    <span className="text-sm text-gray-500">
                      Week {s.week} ; {formatDate(s.date)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#9a1728]">
                    {s.title}
                  </h3>
                  {s.presenter && (
                    <p className="mt-1 text-sm text-gray-600">Presenter: {s.presenter}</p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{s.summary}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
