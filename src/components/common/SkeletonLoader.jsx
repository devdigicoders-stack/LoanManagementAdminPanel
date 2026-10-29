import React from 'react';

/**
 * Base skeleton element with shimmer wave animation
 */
export const Skeleton = ({ className = '', style = {} }) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200/80 rounded-md before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent ${className}`}
      style={style}
    />
  );
};

/**
 * Skeleton Loader for Metric / KPI stat cards (e.g. Dashboard summary boxes)
 */
export const SkeletonKpiGrid = ({ count = 4, cols = "grid-cols-2 md:grid-cols-4" }) => {
  return (
    <div className={`grid ${cols} gap-4 w-full`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <Skeleton className="h-7 w-32 rounded" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton Loader for data tables (table rows + columns with realistic pill & avatar placeholders)
 */
export const SkeletonTableRows = ({ rows = 5, cols = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-slate-100">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="py-4 px-4">
              {cIdx === 0 ? (
                // Often an ID or Name with Avatar
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-2.5 w-16 rounded" />
                  </div>
                </div>
              ) : cIdx === cols - 1 ? (
                // Action buttons column
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
              ) : cIdx === cols - 2 ? (
                // Status badge column
                <Skeleton className="h-5 w-20 rounded-full" />
              ) : (
                // Normal data cell
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-[75%] rounded" />
                  {cIdx % 2 === 0 && <Skeleton className="h-2.5 w-[45%] rounded" />}
                </div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

/**
 * Skeleton Loader for full card or chart widgets
 */
export const SkeletonCard = ({ height = "h-72", className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-3 w-56 rounded" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <Skeleton className={`w-full ${height} rounded-xl`} />
    </div>
  );
};

/**
 * Full page skeleton for Master / Super Admin / Sales Dashboard
 */
export const SkeletonDashboard = () => {
  return (
    <div className="w-full space-y-7 pb-16 min-h-screen text-slate-800 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-80 rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[18px] border border-slate-100 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-2.5 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonCard height="h-80" />
        </div>
        <div className="lg:col-span-1">
          <SkeletonCard height="h-80" />
        </div>
      </div>

      {/* Lower Cards / Table Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-2.5 w-24 rounded" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
