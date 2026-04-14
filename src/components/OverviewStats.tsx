import React from 'react';
import { TrendingUp, BookOpen, CheckCircle, ShieldCheck, AlertCircle, AlertOctagon } from 'lucide-react';
import { useAttendance } from '../store/AttendanceContext';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const OverviewStats: React.FC = () => {
  const { totalClasses, attendedClasses, getCurrentPercentage, getStrategy } = useAttendance();
  const percentage = getCurrentPercentage();
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const { status } = getStrategy();

  const statusConfig = {
    Safe: { color: 'text-green-400', bg: 'bg-green-500/20', icon: ShieldCheck, label: 'Safe Zone' },
    Risk: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: AlertCircle, label: 'At Risk' },
    Critical: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertOctagon, label: 'Critical' }
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-900 to-slate-900 shadow-soft p-8 rounded-2xl text-white relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-6">
              <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Current Attendance</p>
              <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold", statusConfig[status].bg, statusConfig[status].color)}>
                <StatusIcon size={14} />
                {statusConfig[status].label}
              </div>
            </div>
            
            <h3 className="text-5xl lg:text-6xl font-black mb-6">{Number(percentage.toFixed(2))}%</h3>
            
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${clampedPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={cn("h-full rounded-full", status === 'Safe' ? 'bg-green-400' : status === 'Risk' ? 'bg-yellow-400' : 'bg-red-400')}
              />
            </div>
          </div>
          
          <p className="mt-6 text-white/60 text-sm flex items-center gap-2">
            <TrendingUp size={16} /> Strategy engine active. Tracking in real-time.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-soft border border-border-light dark:border-border-dark flex flex-col justify-between"
      >
        <div>
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-bold uppercase tracking-wider mb-1">Total Classes</p>
          <h3 className="text-5xl font-black text-text-light dark:text-text-dark">{totalClasses}</h3>
        </div>
        <div className="flex items-center gap-3 mt-6 text-text-muted-light dark:text-text-muted-dark bg-surfaceVariant-light dark:bg-surfaceVariant-dark w-max px-4 py-2 rounded-xl">
          <BookOpen className="text-secondary" size={20} />
          <span className="text-sm font-bold">Logged & Scheduled</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-soft border border-border-light dark:border-border-dark flex flex-col justify-between"
      >
        <div>
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-bold uppercase tracking-wider mb-1">Attended</p>
          <h3 className="text-5xl font-black text-secondary">{attendedClasses}</h3>
        </div>
        <div className="flex items-center gap-3 mt-6 text-text-muted-light dark:text-text-muted-dark bg-surfaceVariant-light dark:bg-surfaceVariant-dark w-max px-4 py-2 rounded-xl">
          <CheckCircle className="text-primary" size={20} />
          <span className="text-sm font-bold">Verified Presence</span>
        </div>
      </motion.div>
    </section>
  );
};
