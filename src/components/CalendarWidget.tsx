import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAttendance } from '../store/AttendanceContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, getDay } from 'date-fns';
import { cn } from '../utils/cn';

export const CalendarWidget: React.FC = () => {
  const { scenarioLog } = useAttendance();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate empty starting slots
  const startDay = getDay(monthStart);
  const emptyDays = Array.from({ length: startDay });

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-border-light dark:border-border-dark col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CalendarIcon className="text-secondary" size={24} />
          <div>
            <h4 className="text-xl font-bold text-text-light dark:text-text-dark">{format(currentDate, 'MMMM yyyy')}</h4>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark tracking-wide uppercase font-semibold">Attendance Log</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-surfaceVariant-light dark:hover:bg-surfaceVariant-dark transition-colors text-text-muted-light dark:text-text-muted-dark">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-surfaceVariant-light dark:hover:bg-surfaceVariant-dark transition-colors text-text-muted-light dark:text-text-muted-dark">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 pt-4 border-t border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></span>
          <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent/20 border border-accent"></span>
          <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-secondary/20 border border-secondary"></span>
          <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase">Holiday</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 lg:gap-y-6 text-center">
        {weekDays.map(day => (
          <span key={day} className="text-xs font-black text-text-muted-light/60 dark:text-text-muted-dark/50 uppercase tracking-wider">
            {day}
          </span>
        ))}
        
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="py-2 lg:py-3"></div>
        ))}

        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const status = scenarioLog[dateStr];
          const isCurrentMonth = isSameMonth(day, monthStart);
          const activeToday = isToday(day);

          let statusClass = "bg-transparent hover:bg-surfaceVariant-light dark:hover:bg-surfaceVariant-dark";
          if (status === 'Present') statusClass = "bg-primary/10 text-primary font-black border border-primary/20";
          if (status === 'Absent') statusClass = "bg-accent/10 text-accent font-black border border-accent/20";
          if (status === 'Holiday') statusClass = "bg-secondary/10 text-secondary font-black border border-secondary/20";

          return (
            <div key={dateStr} className="flex justify-center">
              <div 
                className={cn(
                  "w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl cursor-default transition-all",
                  statusClass,
                  activeToday && !status ? "ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark text-text-light dark:text-text-dark font-black" : "",
                  !isCurrentMonth ? "opacity-30" : "",
                  !status && !activeToday ? "text-text-light dark:text-text-dark font-medium" : ""
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
