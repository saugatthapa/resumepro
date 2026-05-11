import type { ATSResult } from "@/lib/ats";

export function ATSScoreCard({ result, advanced }: { result: ATSResult; advanced: boolean }) {
  const scoreColor =
    result.totalScore >= 80 ? "text-emerald-600" : result.totalScore >= 60 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">ATS score</p>
          <p className={`mt-2 text-6xl font-black ${scoreColor}`}>{result.totalScore}</p>
          <p className="text-sm font-medium text-slate-500">out of 100</p>
        </div>
        <div className="grid min-w-64 flex-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <span>Keywords: {result.keywordScore}/35</span>
          <span>Skills: {result.skillsScore}/25</span>
          <span>Sections: {result.sectionScore}/20</span>
          <span>Readability: {result.readabilityScore}/10</span>
          <span>Contact: {result.contactScore}/10</span>
        </div>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="font-bold text-slate-950">Top missing keywords</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(advanced ? result.missingKeywords : result.missingKeywords.slice(0, 5)).map((keyword) => (
              <span key={keyword} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-950">Suggestions</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {(advanced ? result.suggestions : result.suggestions.slice(0, 3)).map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
      {advanced ? (
        <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-3">
          <div>
            <p className="font-bold text-slate-950">Missing hard skills</p>
            <p className="mt-2">{result.missingHardSkills.join(", ") || "None detected"}</p>
          </div>
          <div>
            <p className="font-bold text-slate-950">Missing soft skills</p>
            <p className="mt-2">{result.missingSoftSkills.join(", ") || "None detected"}</p>
          </div>
          <div>
            <p className="font-bold text-slate-950">Section problems</p>
            <p className="mt-2">{result.sectionProblems.join(" ") || "Core sections look complete."}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
