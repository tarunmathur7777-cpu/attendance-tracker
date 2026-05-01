import React from 'react';
import { OverviewStats } from '../components/OverviewStats';
import { useAttendance } from '../store/AttendanceContext';
import { BrainCircuit, CheckCircle2, ArrowRight } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { getStrategy } = useAttendance();
  const { safeSkips, safeSkipsClasses, requiredStreak } = getStrategy();

  return (
    <div className="space-y-6 lg:space-y-8">
      <OverviewStats />

      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* Auto Strategy Generator Panel */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-border-light dark:border-border-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BrainCircuit className="text-secondary" size={24} />
              <h4 className="text-xl font-bold text-text-light dark:text-text-dark">AI Strategy Generator</h4>
            </div>
            
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
              Based on your current attendance and target settings, the AI recommends the following optimal path.
            </p>
          </div>

          <div className="space-y-4">
            {safeSkipsClasses > 0 ? (
              <div className="bg-green-500/10 dark:bg-green-500/20 p-5 lg:p-6 rounded-xl border border-green-500/20 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 text-green-500">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-green-600 dark:text-green-400 mb-1">Leave Status: Eligible</h5>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    You can safely skip <span className="font-bold text-text-light dark:text-text-dark">{safeSkipsClasses} total classes</span> (approx. {safeSkips} days) without dropping below your target percentage. Keep up the good work!
                  </p>
                </div>
              </div>
            ) : requiredStreak > 0 && requiredStreak !== Infinity ? (
              <div className="bg-yellow-500/10 dark:bg-yellow-500/20 p-5 lg:p-6 rounded-xl border border-yellow-500/20 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-600 dark:text-yellow-400">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-yellow-600 dark:text-yellow-400 mb-1">Leave Status: Not Eligible (Required Continuity)</h5>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    You cannot take leave right now. To reach your exact target, you must attend the next <span className="font-bold text-text-light dark:text-text-dark">{requiredStreak} consecutive days</span>. Plan accordingly.
                  </p>
                </div>
              </div>
            ) : requiredStreak === Infinity ? (
              <div className="bg-red-500/10 dark:bg-red-500/20 p-5 lg:p-6 rounded-xl border border-red-500/20 flex gap-4 items-start">
                 <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 text-red-500">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-red-600 dark:text-red-400 mb-1">Leave Status: Not Eligible (Mathematical Impossibility)</h5>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    You cannot take leave. In fact, you cannot hit your target by the end of the year. Please adjust your target settings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-500/10 dark:bg-blue-500/20 p-5 lg:p-6 rounded-xl border border-blue-500/20 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-500">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-blue-600 dark:text-blue-400 mb-1">Leave Status: Not Eligible (On Track - No Margin)</h5>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    You are exactly on track, but you cannot take leave! Skipping any upcoming classes will drop you below your target. Maintain your attendance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

