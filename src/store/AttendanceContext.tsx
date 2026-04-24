import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { isBefore, startOfDay, format } from 'date-fns';

export type Status = 'Present' | 'Absent' | 'Holiday';
export type LogType = 'ATTENDANCE' | 'SYSTEM' | 'SETTINGS';

export interface ActionLog {
  id: string;
  date: string;
  action: string;
  resultingPct: number;
  type: LogType;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: string;
}

interface AttendanceState {
  totalClasses: number;
  attendedClasses: number;
  scenarioLog: Record<string, Status>;
  settings: {
    classesPerDay: number;
    targetAttendance: number;
    darkMode: boolean;
    notificationsEnabled: boolean;
  };
  logs: ActionLog[];
  notifications: Notification[];
}

interface AttendanceContextType extends AttendanceState {
  setTotalClasses: (n: number) => void;
  setAttendedClasses: (n: number) => void;
  setScenario: (dateStr: string, status: Status | null) => void;
  
  updateSettings: (newSettings: Partial<AttendanceState['settings']>) => void;
  toggleDarkMode: () => void;
  
  addLog: (action: string, type: LogType, currentPct?: number) => void;
  pushNotification: (message: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearLogs: () => void;
  
  // Analytics
  getCurrentPercentage: (customTotal?: number, customAttended?: number) => number;
  getProjectedPercentage: (targetDate: Date, customTotal?: number, customAttended?: number, customLog?: Record<string, Status>) => number;
  getStrategy: (customTotal?: number, customAttended?: number) => { 
    safeSkips: number; 
    requiredStreak: number; 
    status: 'Safe' | 'Risk' | 'Critical';
  };
  
  // Mock Portal Integration
  importFromPortal: () => void;
}

const defaultState: AttendanceState = {
  totalClasses: 100,
  attendedClasses: 78,
  scenarioLog: {},
  settings: {
    classesPerDay: 7,
    targetAttendance: 85,
    darkMode: true,
    notificationsEnabled: true
  },
  logs: [],
  notifications: []
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AttendanceState>(() => {
    try {
      const saved = localStorage.getItem('smart_attendance_v2');
      if (saved) return { ...defaultState, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('smart_attendance_v2', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.settings.darkMode]);

  // Listen for manual sync from the popup writing to localStorage
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'smart_attendance_v2' && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          setState(prev => {
            if (prev.attendedClasses === newState.attendedClasses && prev.totalClasses === newState.totalClasses) {
              return prev;
            }
            
            const newPct = newState.totalClasses === 0 ? 0 : (newState.attendedClasses / newState.totalClasses) * 100;
            const logEntry: ActionLog = {
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(),
              action: `Manually synced from College Portal`,
              resultingPct: newPct,
              type: 'SYSTEM'
            };

            const notifs = [...prev.notifications];
            if (prev.settings.notificationsEnabled) {
              notifs.unshift({
                id: Math.random().toString(36).substr(2, 9),
                message: 'College Portal Sync Successful!',
                read: false,
                timestamp: new Date().toISOString()
              });
            }

            return {
              ...prev,
              totalClasses: newState.totalClasses,
              attendedClasses: newState.attendedClasses,
              logs: [logEntry, ...prev.logs],
              notifications: notifs
            };
          });
        } catch (err) {
          console.error(err);
        }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const getCurrentPct = (t = state.totalClasses, a = state.attendedClasses) => {
    return t === 0 ? 0 : (a / t) * 100;
  };

  const addLog = (action: string, type: LogType, providedPct?: number) => {
    const pct = providedPct !== undefined ? providedPct : getCurrentPct();
    const newLog: ActionLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      action,
      resultingPct: pct,
      type
    };
    setState(prev => ({ ...prev, logs: [newLog, ...prev.logs] }));
  };

  const pushNotification = (message: string) => {
    if (!state.settings.notificationsEnabled) return;
    const notif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      read: false,
      timestamp: new Date().toISOString()
    };
    setState(prev => ({ ...prev, notifications: [notif, ...prev.notifications] }));
  };

  // State mutators with automatic logging & checks
  const setTotalClasses = (n: number) => {
    const safeN = Math.max(0, n);
    const pct = getCurrentPct(safeN, state.attendedClasses);
    setState(prev => ({ ...prev, totalClasses: safeN }));
    addLog(`Changed Total Classes to ${safeN}`, 'ATTENDANCE', pct);
    checkThresholdTriggers(pct);
  };

  const setAttendedClasses = (n: number) => {
    const safeN = Math.max(0, Math.min(n, state.totalClasses));
    const pct = getCurrentPct(state.totalClasses, safeN);
    setState(prev => ({ ...prev, attendedClasses: safeN }));
    addLog(`Changed Attended Classes to ${safeN}`, 'ATTENDANCE', pct);
    checkThresholdTriggers(pct);
  };

  const setScenario = (dateStr: string, status: Status | null) => {
    setState(prev => {
      const lg = { ...prev.scenarioLog };
      if (status === null) delete lg[dateStr];
      else lg[dateStr] = status;
      return { ...prev, scenarioLog: lg };
    });
    addLog(status ? `Planned ${status} on ${format(new Date(dateStr), 'MMM d')}` : `Cleared plan on ${format(new Date(dateStr), 'MMM d')}`, 'ATTENDANCE');
  };

  const updateSettings = (updates: Partial<AttendanceState['settings']>) => {
    setState(prev => {
      const merged = { ...prev.settings, ...updates };
      return { ...prev, settings: merged };
    });
    addLog(`Updated application settings`, 'SETTINGS');
  };

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !state.settings.darkMode });
  };

  const markNotificationRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const markAllNotificationsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  const clearLogs = () => {
    setState(prev => ({ ...prev, logs: [] }));
    pushNotification("Action history cleared.");
  };

  const checkThresholdTriggers = (pct: number) => {
    const target = state.settings.targetAttendance;
    if (pct < target - 5) pushNotification(`Critical Drop: Attendance is at ${Number(pct.toFixed(2))}%, well below limits.`);
    else if (pct < target) pushNotification(`Warning: Attendance dropped to ${Number(pct.toFixed(2))}% (Below ${target}% target).`);
  };

  // Complex Analytics
  const getCurrentPercentage = (customTotal?: number, customAttended?: number) => {
    const t = customTotal !== undefined ? customTotal : state.totalClasses;
    const a = customAttended !== undefined ? customAttended : state.attendedClasses;
    return getCurrentPct(t, a);
  };
  
  const getProjectedPercentage = (targetDate: Date, customTotal?: number, customAttended?: number, customLog?: Record<string, Status>) => {
    let t = customTotal !== undefined ? customTotal : state.totalClasses;
    let a = customAttended !== undefined ? customAttended : state.attendedClasses;
    const log = customLog !== undefined ? customLog : state.scenarioLog;
    const target = startOfDay(targetDate);
    const dates = Object.keys(log).sort();
    
    for (const dStr of dates) {
      const dObj = startOfDay(new Date(dStr));
      if (isBefore(dObj, target) || dObj.getTime() === target.getTime()) {
        const s = log[dStr];
        if (s === 'Present') { t += state.settings.classesPerDay; a += state.settings.classesPerDay; }
        else if (s === 'Absent') { t += state.settings.classesPerDay; }
      }
    }
    return t === 0 ? 0 : (a / t) * 100;
  };

  const getStrategy = (customTotal?: number, customAttended?: number) => {
    const pct = getCurrentPercentage(customTotal, customAttended);
    const T = state.settings.targetAttendance;
    const tClasses = customTotal !== undefined ? customTotal : state.totalClasses;
    const aClasses = customAttended !== undefined ? customAttended : state.attendedClasses;

    let safeSkips = 0;
    let requiredStreak = 0;
    let status: 'Safe' | 'Risk' | 'Critical' = 'Critical';

    if (pct >= T + 2) status = 'Safe';
    else if (pct >= T - 4 && pct < T + 2) status = 'Risk';

    if (pct >= T) {
      // Calculate how many you can skip safely
      const maxSkipsClasses = Math.floor((100 * aClasses - T * tClasses) / T);
      safeSkips = Math.max(0, Math.floor(maxSkipsClasses / state.settings.classesPerDay));
    } else {
      // Calculate consecutive days needed
      if (T < 100) {
        const reqClasses = Math.ceil((T * tClasses - 100 * aClasses) / (100 - T));
        requiredStreak = Math.max(0, Math.ceil(reqClasses / state.settings.classesPerDay));
      } else {
        requiredStreak = Infinity;
      }
    }

    return { safeSkips, requiredStreak, status };
  };

  const importFromPortal = () => {
    pushNotification('Please open the Chrome Extension to sync.');
    alert("Manual Sync Required: Please open the 'Smart Extractor' extension popup and click 'Extract & Send Data'.");
  };

  return (
    <AttendanceContext.Provider value={{
      ...state,
      setTotalClasses, setAttendedClasses, setScenario,
      updateSettings, toggleDarkMode, addLog, pushNotification, 
      markNotificationRead, markAllNotificationsRead, clearLogs,
      getCurrentPercentage, getProjectedPercentage, getStrategy, importFromPortal
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) throw new Error('useAttendance must be used within Provider');
  return context;
};
