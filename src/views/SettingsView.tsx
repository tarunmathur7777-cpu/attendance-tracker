import React from 'react';
import { useAttendance } from '../store/AttendanceContext';
import { Settings2, Target, Moon, Sun, Bell, BellOff } from 'lucide-react';
import { cn } from '../utils/cn';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useAttendance();

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 lg:p-8 shadow-soft border border-border-light dark:border-border-dark max-w-3xl">
      <div className="mb-8 border-b border-border-light dark:border-border-dark pb-6">
        <h4 className="text-xl font-bold text-text-light dark:text-text-dark">Application Preferences</h4>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Manage your global settings and configurations.</p>
      </div>

      <div className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings2 size={18} className="text-secondary" />
              <label className="font-bold text-text-light dark:text-text-dark">Base Classes Per Day</label>
            </div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4">
              The average number of classes conducted in a typical college day. Used for calculating future impacts.
            </p>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={settings.classesPerDay}
                onChange={(e) => updateSettings({ classesPerDay: parseInt(e.target.value) })}
                className="w-full accent-primary h-2 bg-surfaceVariant-light dark:bg-surfaceVariant-dark rounded-lg appearance-none cursor-pointer" 
              />
              <span className="font-black text-xl text-primary bg-primary/10 px-4 py-2 rounded-xl">{settings.classesPerDay}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
               <Target size={18} className="text-accent" />
               <label className="font-bold text-text-light dark:text-text-dark">Target Attendance (%)</label>
            </div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4">
              Set the minimum percentage you wish to maintain. The AI Strategy will optimize against this threshold.
            </p>
            <div className="flex items-center gap-4">
                <input 
                  type="number"
                  min="0"
                  max="100"
                  value={settings.targetAttendance === 0 ? '' : settings.targetAttendance}
                  onChange={(e) => updateSettings({ targetAttendance: parseInt(e.target.value) || 0 })}
                  className="bg-surfaceVariant-light dark:bg-surfaceVariant-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark font-black text-xl rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary w-24 text-center transition-all"
                />
                <span className="text-2xl font-bold text-text-muted-light dark:text-text-muted-dark">%</span>
            </div>
          </div>
        </div>

        <hr className="border-border-light dark:border-border-dark" />

        <div>
          <h5 className="font-bold text-text-light dark:text-text-dark mb-4">Display & Alerts</h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all",
                settings.darkMode 
                  ? "bg-surfaceVariant-dark border-primary text-text-dark" 
                  : "bg-surfaceVariant-light border-border-light hover:border-primary text-text-light"
              )}
            >
              <div className="flex items-center gap-3">
                {settings.darkMode ? <Moon size={20} className="text-primary"/> : <Sun size={20} className="text-secondary" />}
                <span className="font-bold text-sm">Dark Mode</span>
              </div>
              <div className={cn("w-10 h-6 rounded-full flex items-center p-1 transition-colors", settings.darkMode ? "bg-primary" : "bg-border-light dark:bg-border-dark")}>
                <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", settings.darkMode ? "translate-x-4" : "")}></div>
              </div>
            </button>

            <button 
              onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all",
                settings.notificationsEnabled 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-surfaceVariant-light dark:bg-surfaceVariant-dark border-border-light dark:border-border-dark hover:border-border-light text-text-muted-light dark:text-text-muted-dark"
              )}
            >
              <div className="flex items-center gap-3">
                {settings.notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                <span className="font-bold text-sm text-text-light dark:text-text-dark">System Alerts</span>
              </div>
              <div className={cn("w-10 h-6 rounded-full flex items-center p-1 transition-colors", settings.notificationsEnabled ? "bg-primary" : "bg-border-light dark:bg-border-dark")}>
                <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", settings.notificationsEnabled ? "translate-x-4" : "")}></div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
