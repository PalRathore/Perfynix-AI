import { Search, X, Filter } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function FindingFilters({
  searchTerm,
  setSearchTerm,
  selectedSeverity,
  setSelectedSeverity,
  selectedCategory,
  setSelectedCategory,
  onClearFilters,
  totalCount,
  filteredCount,
}) {
  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const categories = ['All Categories', 'Headers', 'SSL/TLS', 'Lighthouse', 'OWASP ZAP'];

  const hasActiveFilters =
    searchTerm !== '' || selectedSeverity !== 'All' || selectedCategory !== 'All Categories';

  return (
    <GlassCard variant="subtle" className="p-4 sm:p-5 w-full min-w-0 space-y-3.5">
      {/* 1. Top Search Bar */}
      <div className="relative w-full min-w-0">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search vulnerabilities by title, CWE ID (e.g. CWE-89), category, or keyword..."
          style={{ paddingLeft: '2.6rem' }}
          className="w-full pr-10 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all shadow-inner"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 2. Bottom Control Bar: Severity Pills & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter size={13} className="text-cyan-500" />
            Severity:
          </span>
          {severities.map((sev) => {
            const isActive = selectedSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 via-cyan-500 to-accent-600 text-white shadow-md'
                    : 'bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/50'
                }`}
              >
                {sev}
              </button>
            );
          })}
        </div>

        {/* Category Dropdown & Clear Action */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-200/50 dark:border-slate-800/60 pt-2 sm:pt-0">
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-1"
              >
                <X size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="text-xs font-mono-tech font-bold text-slate-500 dark:text-slate-400 shrink-0 bg-slate-100/90 dark:bg-slate-800/90 px-3 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {filteredCount} / {totalCount} findings
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
