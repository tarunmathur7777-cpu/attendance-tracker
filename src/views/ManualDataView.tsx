import React, { useState } from 'react';
import { OverviewStats } from '../components/OverviewStats';
import { ProjectedChart } from '../components/ProjectedChart';
import { ScenarioPlanner } from '../components/ScenarioPlanner';
import type { Status } from '../store/AttendanceContext';
import { useAttendance } from '../store/AttendanceContext';
import { BrainCircuit, Edit3, CheckCircle2, ArrowRight, Save } from 'lucide-react';
import { cn } from '../utils/cn';

export const ManualDataView: React.FC = () => {
  const { totalClasses, attendedClasses, getStrategy } = useAttendance();
  
  // Isolated sandbox state initialized from global context on first load
  const [localTotal, setLocalTotal] = useState<number>(totalClasses);
  const [localAttended, setLocalAttended] = useState<number>(attendedClasses);
  const [localScenarioLog, setLocalScenarioLog] = useState<Record<string, Status>>({});

  const [formTotal, setFormTotal] = useState<number | ''>(localTotal);
  const [formAttended, setFormAttended] = useState<number | ''>(localAttended);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Strategy engine pulls from local sandbox instead of global store
  const { safeSkips, requiredStreak } = getStrategy(localTotal, localAttended);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formTotal === '' || formAttended === '') return;
    
    setIsSaving(true);
    setSaveSuccess(false);

    // Minor delay for UI feedback
    setTimeout(() => {
      // ONLY update the local sandbox state, do not touch global context
      setLocalTotal(Number(formTotal));
      setLocalAttended(Number(formAttended));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 400);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Pass the sandbox state to OverviewStats to detach it from global store */}
      <OverviewStats customTotal={localTotal} customAttended={localAttended} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
            {safeSkips > 0 ? (
              <div className="bg-green-500/10 dark:bg-green-500/20 p-5 lg:p-6 rounded-xl border border-green-500/20 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 text-green-500">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-green-600 dark:text-green-400 mb-1">Strategic Reserve Available</h5>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    You can safely skip <span className="font-bold text-text-light dark:text-text-dark">{safeSkips} upcoming days</span> without dropping below your target percentage. Keep up the good work!
                  </p>
                </div>
              </div>
            ) : requiredStreak > 0 && requiredStreak !== Infinity ? (
              <div className="bg-yellow-500/10 dark:bg-yellow-500/20 p-5 lg:p-6 rounded-xl border border-yellow-500/20 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-600 dark:text-yellow-400">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-yellow-600 dark:text-yellow-400 mb-1">Required Continuity</h5>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    To reach your exact target, you must attend the next <span className="font-bold text-text-light dark:text-text-dark">{requiredStreak} consecutive days</span>. Plan accordingly.
                  </p>
                </div>
              </div>
            ) : requiredStreak === Infinity ? (
              <div className="bg-red-500/10 dark:bg-red-500/20 p-5 lg:p-6 rounded-xl border border-red-500/20 flex gap-4 items-start">
                 <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 text-red-500">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-red-600 dark:text-red-400 mb-1">Mathematical Impossibility</h5>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    You cannot hit your target by the end of the year. Please adjust your target settings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-500/10 dark:bg-blue-500/20 p-5 lg:p-6 rounded-xl border border-blue-500/20 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-500">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-blue-600 dark:text-blue-400 mb-1">On Track - No Margin</h5>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    You are exactly on track! However, skipping any upcoming classes will drop you below your target. Maintain your attendance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Manual Data Entry Form */}
        <div className="bg-surfaceVariant-light dark:bg-surfaceVariant-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Edit3 className="text-primary" size={24} />
              <h4 className="text-xl font-bold text-text-light dark:text-text-dark">Manual Override</h4>
            </div>
          </div>
          
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
            Update your attendance manually. Submitting will immediately recalibrate your stats and AI strategy.
          </p>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted-light dark:text-text-muted-dark mb-2 tracking-wide uppercase">Total Classes Conducted</label>
              <input 
                type="number"
                min="0"
                step="1"
                value={formTotal}
                onChange={(e) => setFormTotal(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="e.g. 100"
                className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 text-text-light dark:text-text-dark font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted-light dark:text-text-muted-dark mb-2 tracking-wide uppercase">Total Classes Attended</label>
              <input 
                type="number" 
                min="0"
                step="1"
                max={formTotal !== '' ? formTotal : undefined}
                value={formAttended}
                onChange={(e) => setFormAttended(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="e.g. 78"
                className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 text-text-light dark:text-text-dark font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
              />
            </div>
            
            <button 
              disabled={isSaving || formTotal === '' || formAttended === ''}
              type="submit"
              className={cn(
                "w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                isSaving 
                  ? "bg-primary/50 cursor-wait text-white" 
                  : saveSuccess 
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30" 
                    : "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              )}
            >
              {isSaving ? (
                <><Save size={18} className="animate-spin" /> Updating...</>
              ) : saveSuccess ? (
                <><CheckCircle2 size={18} /> Data Saved!</>
              ) : (
                'Save Manual Data'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-2">
        <div className="lg:col-span-2">
          <ProjectedChart customTotal={localTotal} customAttended={localAttended} customLog={localScenarioLog} />
        </div>
        <div className="lg:col-span-1">
          <ScenarioPlanner 
            customTotal={localTotal} 
            customAttended={localAttended} 
            customLog={localScenarioLog} 
            onToggle={(date, status) => {
              setLocalScenarioLog(prev => {
                const next = { ...prev };
                if (status === null) delete next[date]; else next[date] = status;
                return next;
              });
            }} 
          />
        </div>
      </div>
    </div>
  );
};
