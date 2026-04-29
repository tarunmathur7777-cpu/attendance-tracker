import React, { useState } from 'react';
import { OverviewStats } from '../components/OverviewStats';
import { useAttendance } from '../store/AttendanceContext';
import { BrainCircuit, Link2, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export const DashboardView: React.FC = () => {
  const { getStrategy, importFromPortal } = useAttendance();
  const { safeSkips, requiredStreak } = getStrategy();
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsScanning(true);
    setScanSuccess(false);
    
    // Simulate API fetch delay
    setTimeout(() => {
      importFromPortal();
      setIsScanning(false);
      setScanSuccess(true);
      setTimeout(() => setScanSuccess(false), 3000);
      setUrl('');
    }, 2000);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <OverviewStats />

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

        {/* College Portal Integrator Mock */}
        <div className="bg-surfaceVariant-light dark:bg-surfaceVariant-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link2 className="text-primary" size={24} />
              <h4 className="text-xl font-bold text-text-light dark:text-text-dark">College Portal Sync</h4>
            </div>
          </div>
          
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
            Automatically extract and sync your total and attended classes directly from your university portal.
          </p>

          <form onSubmit={handleScan} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted-light dark:text-text-muted-dark mb-2 tracking-wide uppercase">Portal URL</label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://portal.university.edu/attendance"
                className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 text-text-light dark:text-text-dark font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-text-muted-light/50" 
              />
            </div>
            
            <button 
              disabled={isScanning || !url.trim()}
              type="submit"
              className={cn(
                "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                isScanning 
                  ? "bg-primary/50 cursor-wait text-white" 
                  : scanSuccess 
                    ? "bg-green-500 text-white" 
                    : "bg-primary hover:bg-primary-hover text-white disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isScanning ? (
                <><RefreshCw size={18} className="animate-spin" /> Scanning Portal...</>
              ) : scanSuccess ? (
                <><CheckCircle2 size={18} /> Sync Complete!</>
              ) : (
                'Extract Attendance Data'
              )}
            </button>
          </form>
          
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs leading-relaxed font-medium">
            <strong>Note:</strong> Integrations are simulated in this environment. Submitting any URL will trigger a successful mock data extraction.
          </div>
        </div>
      </div>
    </div>
  );
};
