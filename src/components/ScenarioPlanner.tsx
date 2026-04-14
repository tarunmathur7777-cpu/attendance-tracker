import React, { useState, useMemo } from 'react';
import { Layers, Plus, AlertCircle, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react';
import { useAttendance } from '../store/AttendanceContext';
import type { Status } from '../store/AttendanceContext';
import { addDays, format, startOfToday } from 'date-fns';
import { cn } from '../utils/cn';

export const ScenarioPlanner: React.FC = () => {
  const { scenarioLog, setScenario, getProjectedPercentage, settings, getCurrentPercentage } = useAttendance();
  const [visibleDays, setVisibleDays] = useState<number>(7);
  const today = startOfToday();
  
  // Generate next N days for quick planning
  const upcomingDays = useMemo(() => {
    return Array.from({ length: visibleDays }).map((_, i) => {
      const date = addDays(today, i + 1);
      return {
        date,
        dateStr: format(date, 'yyyy-MM-dd'),
        dayLabel: format(date, 'MMM d'),
        weekdayLabel: format(date, 'EEEE'),
      };
    });
  }, [today, visibleDays]);

  const selectedDates = Object.keys(scenarioLog).filter(d => scenarioLog[d] !== null).sort();
  const hasSelections = selectedDates.length > 0;
  
  const finalProjectedPct = hasSelections 
    ? getProjectedPercentage(new Date(selectedDates[selectedDates.length - 1]))
    : getCurrentPercentage();
  
  const isSafe = finalProjectedPct >= settings.targetAttendance;

  const handleToggle = (dateStr: string, status: Status) => {
    if (scenarioLog[dateStr] === status) {
      setScenario(dateStr, null); // toggle off
    } else {
      setScenario(dateStr, status);
    }
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layers className="text-secondary" size={24} />
          <h4 className="text-xl font-bold text-text-light dark:text-text-dark">Scenario Planner</h4>
        </div>
      </div>
      
      <div className="space-y-3">
        {upcomingDays.map((day) => {
          const status = scenarioLog[day.dateStr];
          const isActive = !!status;
          const projectedForDay = isActive ? getProjectedPercentage(day.date) : null;

          return (
            <div 
              key={day.dateStr}
              className="flex flex-col gap-2 p-3.5 bg-surfaceVariant-light dark:bg-surfaceVariant-dark rounded-xl group hover:bg-surfaceVariant-light/80 transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">{day.dayLabel}</p>
                  <p className="font-bold text-text-light dark:text-text-dark text-sm">{day.weekdayLabel}</p>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleToggle(day.dateStr, 'Present')}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      status === 'Present' 
                        ? "bg-primary text-white shadow-md scale-110" 
                        : "bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark hover:bg-primary/20 hover:text-primary"
                    )}
                  >
                    P
                  </button>
                  <button 
                    onClick={() => handleToggle(day.dateStr, 'Absent')}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      status === 'Absent' 
                        ? "bg-accent text-white shadow-md scale-110" 
                        : "bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark hover:bg-accent/20 hover:text-accent"
                    )}
                  >
                    A
                  </button>
                  <button 
                    onClick={() => handleToggle(day.dateStr, 'Holiday')}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      status === 'Holiday' 
                        ? "bg-secondary text-white shadow-md scale-110" 
                        : "bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark hover:bg-secondary/20 hover:text-secondary"
                    )}
                  >
                    H
                  </button>
                </div>
              </div>

              {isActive && projectedForDay !== null && (
                 <div className="pt-2 mt-1 border-t border-border-light/50 dark:border-border-dark/50 flex items-center gap-2">
                    {projectedForDay >= settings.targetAttendance ? (
                       <TrendingUp className="text-primary w-4 h-4" />
                    ) : (
                       <TrendingDown className="text-accent w-4 h-4" />
                    )}
                    <p className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                      If {status.toLowerCase()}, attendance becomes <span className={projectedForDay >= settings.targetAttendance ? "text-primary font-bold" : "text-accent font-bold"}>{Number(projectedForDay.toFixed(2))}%</span>
                    </p>
                 </div>
              )}
            </div>
          );
        })}
        
        <button 
          onClick={() => setVisibleDays(prev => prev + 1)} 
          className="w-full mt-2 py-3 text-primary font-bold text-sm border-2 border-dashed border-primary/20 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Future Date
        </button>

        {hasSelections && (
          <div className={cn(
            "mt-6 p-5 rounded-2xl border-2 relative overflow-hidden transition-all duration-300",
            isSafe 
              ? "bg-primary/5 border-primary/30" 
              : "bg-accent/5 border-accent/30"
          )}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-2">
                  Final Projected Trajectory
                </p>
                <div className="flex items-baseline gap-2">
                   <h3 className={cn("text-4xl font-black", isSafe ? "text-primary" : "text-accent")}>
                     {Number(finalProjectedPct.toFixed(2))}%
                   </h3>
                   <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                     / {settings.targetAttendance}% min target
                   </span>
                </div>
              </div>
              
              <div className={cn("p-2 rounded-xl", isSafe ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent")}>
                 {isSafe ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
              </div>
            </div>
            
            <p className={cn("mt-4 text-sm font-medium", isSafe ? "text-primary/90" : "text-accent/90")}>
              {isSafe 
                ? "You're safe! Your attendance will remain above your minimum threshold after these planned dates." 
                : "Warning! Your attendance will critically drop below your required threshold if you follow this path."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
