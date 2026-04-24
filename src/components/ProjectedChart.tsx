import React, { useMemo, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useAttendance } from '../store/AttendanceContext';
import { addDays, startOfToday, format } from 'date-fns';
import { Activity, BarChart2 } from 'lucide-react';
import { cn } from '../utils/cn';

import type { Status } from '../store/AttendanceContext';

interface ProjectedChartProps {
  customTotal?: number;
  customAttended?: number;
  customLog?: Record<string, Status>;
}

export const ProjectedChart: React.FC<ProjectedChartProps> = ({ customTotal, customAttended, customLog }) => {
  const { totalClasses: globalTotal, attendedClasses: globalAttended, scenarioLog: globalLog, settings } = useAttendance();
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const today = startOfToday();

  const totalClasses = customTotal !== undefined ? customTotal : globalTotal;
  const attendedClasses = customAttended !== undefined ? customAttended : globalAttended;
  const scenarioLog = customLog !== undefined ? customLog : globalLog;

  const data = useMemo(() => {
    let t = totalClasses;
    let a = attendedClasses;
    const chartData = [];

    chartData.push({
      date: format(today, 'MMM dd'),
      percentage: t === 0 ? 0 : Number(((a / t) * 100).toFixed(2)),
      presentCount: a,
      absentCount: t - a
    });

    // Use Object.keys(scenarioLog) directly if we need dates
    for (let i = 1; i <= 14; i++) {
        const nextDate = addDays(today, i);
        const dateStr = format(nextDate, 'yyyy-MM-dd');
        
        const status = scenarioLog[dateStr];
        if (status === 'Present') {
            t += settings.classesPerDay;
            a += settings.classesPerDay;
        } else if (status === 'Absent') {
            t += settings.classesPerDay;
        }

        chartData.push({
            date: format(nextDate, 'MMM dd'),
            percentage: t === 0 ? 0 : Number(((a / t) * 100).toFixed(2)),
            presentCount: a,
            absentCount: t - a
        });
    }

    return chartData;
  }, [totalClasses, attendedClasses, settings.classesPerDay, scenarioLog, today]);

  const yMin = Math.max(0, Math.min(...data.map(d => d.percentage)) - 5);
  const yMax = Math.min(100, Math.max(...data.map(d => d.percentage), settings.targetAttendance) + 5);

  const isDark = settings.darkMode;
  const colors = {
      primary: isDark ? '#818cf8' : '#6366f1',
      secondary: isDark ? '#f43f5e' : '#e11d48',
      grid: isDark ? '#334155' : '#e2e8f0',
      text: isDark ? '#94a3b8' : '#64748b',
      bg: isDark ? '#1e293b' : '#ffffff',
      fg: isDark ? '#f8fafc' : '#0f172a'
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-border-light dark:border-border-dark col-span-1 lg:col-span-2 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="text-secondary" size={24} />
          <h4 className="text-xl font-bold text-text-light dark:text-text-dark">Forecast Trajectory</h4>
        </div>
        <div className="flex bg-surfaceVariant-light dark:bg-surfaceVariant-dark rounded-lg p-1">
          <button 
            onClick={() => setChartType('line')} 
            className={cn("p-1.5 rounded-md transition-colors", chartType === 'line' ? "bg-surface-light dark:bg-surface-dark shadow-sm text-primary" : "text-text-muted-light dark:text-text-muted-dark")}
          >
            <Activity size={16} />
          </button>
          <button 
            onClick={() => setChartType('bar')} 
            className={cn("p-1.5 rounded-md transition-colors", chartType === 'bar' ? "bg-surface-light dark:bg-surface-dark shadow-sm text-primary" : "text-text-muted-light dark:text-text-muted-dark")}
          >
            <BarChart2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 12 }} tickMargin={10}/>
              <YAxis domain={[Math.floor(yMin), Math.ceil(yMax)]} axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 12 }} tickFormatter={(val) => `${val}%`}/>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)', backgroundColor: colors.bg, color: colors.fg }}/>
              <ReferenceLine y={settings.targetAttendance} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'top', value: 'Target Goal', fill: '#f43f5e', fontSize: 12 }} />
              <Area type="monotone" dataKey="percentage" stroke={colors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorPct)" activeDot={{ r: 6, strokeWidth: 0 }}/>
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 12 }} tickMargin={10}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)', backgroundColor: colors.bg, color: colors.fg }} />
              <Bar dataKey="presentCount" name="Attended" stackId="a" fill={colors.primary} radius={[0, 0, 4, 4]} />
              <Bar dataKey="absentCount" name="Missed" stackId="a" fill={colors.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
