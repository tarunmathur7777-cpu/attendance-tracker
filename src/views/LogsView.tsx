import React, { useState } from 'react';
import { useAttendance } from '../store/AttendanceContext';
import type { LogType } from '../store/AttendanceContext';
import { Download, Filter, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const LogsView: React.FC = () => {
  const { logs, clearLogs } = useAttendance();
  const [filter, setFilter] = useState<LogType | 'ALL'>('ALL');

  const filteredLogs = logs.filter(l => filter === 'ALL' || l.type === filter);

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Action', 'Resulting Percentage'];
    const rows = filteredLogs.map(l => [
      format(new Date(l.date), 'yyyy-MM-dd HH:mm:ss'),
      l.type,
      l.action,
      Number(l.resultingPct.toFixed(2)) + '%'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(item => `"${item}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `smart_tracker_logs_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-border-light dark:border-border-dark min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-xl font-bold text-text-light dark:text-text-dark">System Action Logs</h4>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">A full history of modifications and simulations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as LogType | 'ALL')}
              className="bg-surfaceVariant-light dark:bg-surfaceVariant-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark text-sm rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 appearance-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="SETTINGS">Settings</option>
              <option value="SYSTEM">System Automations</option>
            </select>
          </div>
          
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
          
          <button 
            onClick={clearLogs}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold py-2 px-4 rounded-xl transition-colors"
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border-light dark:border-border-dark">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceVariant-light dark:bg-surfaceVariant-dark text-xs uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark border-b border-border-light dark:border-border-dark">
              <th className="p-4 font-bold">Date & Time</th>
              <th className="p-4 font-bold">Type</th>
              <th className="p-4 font-bold">Action Taken</th>
              <th className="p-4 font-bold text-right">Resulting %</th>
            </tr>
          </thead>
          <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted-light dark:text-text-muted-dark">
                  No logs found matching criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-surfaceVariant-light/50 dark:hover:bg-surfaceVariant-dark/50 transition-colors group">
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                    {format(new Date(log.date), 'MMM dd, yyyy - HH:mm')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider
                      ${log.type === 'ATTENDANCE' ? 'bg-primary/10 text-primary' : ''}
                      ${log.type === 'SETTINGS' ? 'bg-secondary/10 text-secondary' : ''}
                      ${log.type === 'SYSTEM' ? 'bg-accent/10 text-accent' : ''}
                    `}>
                      {log.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-text-light dark:text-text-dark">
                    {log.action}
                  </td>
                  <td className="p-4 text-sm font-bold text-right whitespace-nowrap">
                    {Number(log.resultingPct.toFixed(2))}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
