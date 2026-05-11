import { useState } from 'react';

// serializable cohort shape passed as props from the Astro page
interface Cohort {
  year: number;
  description: string;
  startDate: string;
  endDate?: string;
  studentCount: number;
}

// serializable student shape for card rendering
interface StudentCard {
  id: string;
  name: string;
  school?: string;
  major?: string;
  cohortYear: number;
}

interface Props {
  cohorts: Cohort[];
  students: StudentCard[];
  base: string;
}

// svg person silhouette used as avatar placeholder
function AvatarSVG() {
  return (
    <svg viewBox="0 0 72 72" className="w-full h-full" aria-hidden="true">
      <rect width="72" height="72" fill="#fce7ea" />
      <ellipse cx="36" cy="28" rx="12" ry="13" fill="#9a1728" />
      <ellipse cx="36" cy="62" rx="23" ry="17" fill="#9a1728" />
    </svg>
  );
}

// tab based year switcher with student cards for the cohorts index page
export default function CohortYearSwitcher({ cohorts, students, base }: Props) {
  // default to the most recent cohort (first in the sorted list)
  const [activeYear, setActiveYear] = useState<number>(cohorts[0]?.year ?? 0);

  // find the currently displayed cohort data
  const active = cohorts.find((c) => c.year === activeYear);
  // filter students for the active year
  const activeStudents = students.filter((s) => s.cohortYear === activeYear);

  if (cohorts.length === 0) {
    return <p className="text-gray-500">no cohorts available yet</p>;
  }

  return (
    <div>
      {/* year tab strip */}
      <div
        className="flex gap-1 border-b border-gray-200 mb-6"
        role="tablist"
        aria-label="Cohort year"
      >
        {cohorts.map((c) => (
          <button
            key={c.year}
            role="tab"
            aria-selected={c.year === activeYear}
            aria-controls={`panel-${c.year}`}
            onClick={() => setActiveYear(c.year)}
            className={`px-5 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              c.year === activeYear
                ? 'border-[#9a1728] text-[#9a1728]'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            {c.year}
          </button>
        ))}
      </div>

      {/* active cohort detail panel */}
      {active && (
        <div
          id={`panel-${active.year}`}
          role="tabpanel"
          aria-label={`Cohort ${active.year}`}
        >
          <p className="text-gray-700 leading-relaxed mb-1">{active.description}</p>
          {/* cohort metadata row */}
          <p className="text-sm text-gray-500 mb-6">
            {active.studentCount} student{active.studentCount !== 1 ? 's' : ''} &middot;{' '}
            {active.startDate}
            {active.endDate ? ` to ${active.endDate}` : ' (ongoing)'}
          </p>

          {/* student cards grid */}
          {activeStudents.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {activeStudents.map((student) => (
                <a
                  key={student.id}
                  href={`${base}cohorts/${student.cohortYear}/${student.id}/`}
                  className="group flex flex-col items-center text-center rounded-xl border border-gray-200 hover:border-[#f2a0ac] hover:shadow-md transition-all p-4 bg-white"
                >
                  {/* svg avatar placeholder */}
                  <div className="w-[64px] h-[64px] rounded-full overflow-hidden mb-3 ring-2 ring-[#f2a0ac]">
                    <AvatarSVG />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#9a1728] mb-1 leading-tight">
                    {student.name}
                  </p>
                  {student.school && (
                    <p className="text-xs text-gray-500 mb-1.5 line-clamp-1">{student.school}</p>
                  )}
                  {student.major && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {student.major}
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}

          <a
            href={`${base}cohorts/${active.year}/`}
            className="inline-block px-4 py-2 bg-[#9a1728] text-white rounded-lg text-sm font-medium hover:bg-[#7d1222] transition-colors"
          >
            View full cohort
          </a>
        </div>
      )}
    </div>
  );
}
