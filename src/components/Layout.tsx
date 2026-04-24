import React, { useState } from 'react';
import { LayoutDashboard, CalendarCheck, FileText, Settings, Moon, Sun, Bell, Edit3 } from 'lucide-react';
import { useAttendance } from '../store/AttendanceContext';
import { cn } from '../utils/cn';
import { formatDistanceToNow } from 'date-fns';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { settings, toggleDarkMode, notifications, markNotificationRead, markAllNotificationsRead } = useAttendance();
  const [showNotif, setShowNotif] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'manual', icon: Edit3, label: 'Manual Data' },
    { id: 'planner', icon: CalendarCheck, label: 'AI Planner' },
    { id: 'logs', icon: FileText, label: 'System Logs' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between bg-surfaceVariant-light dark:bg-surfaceVariant-dark rounded-r-[3rem] py-8 z-40 transition-colors">
        <div className="px-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-soft">
              <CalendarCheck size={20} />
            </div>
            <h1 className="text-xl font-black text-primary hover:text-primary-hover transition-colors cursor-pointer">
              SmartTrack AI
            </h1>
          </div>
          
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium w-full text-left",
                    active 
                      ? "text-primary border-r-4 border-primary bg-surface-light dark:bg-surface-dark shadow-sm" 
                      : "text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 hover:translate-x-1"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-8 flex flex-col gap-6">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center font-bold text-primary">
                AI
              </div>
              <div>
                <p className="text-sm font-bold text-text-light dark:text-text-dark">Student AI Core</p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Pro User</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative">
        <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl flex justify-between items-center px-6 lg:px-10 py-5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">{activeTab}</span>
            <p className="text-lg lg:text-xl font-bold tracking-tight text-text-light dark:text-text-dark capitalize">
              {activeTab === 'dashboard' ? 'Overview & Strategy' : activeTab}
            </p>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="hidden md:flex items-center bg-surfaceVariant-light dark:bg-surfaceVariant-dark px-4 py-2 rounded-full">
              <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-surfaceVariant-light dark:hover:bg-surfaceVariant-dark transition-colors"
            >
              {settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="p-2.5 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-surfaceVariant-light dark:hover:bg-surfaceVariant-dark transition-colors relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-ping"></span>
                )}
                {unreadCount > 0 && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-96">
                  <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-surfaceVariant-light dark:bg-surfaceVariant-dark">
                    <h3 className="font-bold text-sm text-text-light dark:text-text-dark">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="overflow-y-auto flex-1 p-2">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-text-muted-light dark:text-text-muted-dark">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} onClick={() => markNotificationRead(n.id)} className={cn("p-3 rounded-xl mb-1 cursor-pointer transition-colors text-sm", n.read ? "opacity-60 hover:bg-surfaceVariant-light dark:hover:bg-surfaceVariant-dark" : "bg-primary/5 hover:bg-primary/10")}>
                           <div className="flex gap-3 justify-between items-start">
                             <p className={cn("text-text-light dark:text-text-dark flex-1", !n.read && "font-bold")}>{n.message}</p>
                             {!n.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></div>}
                           </div>
                           <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-2">{formatDistanceToNow(new Date(n.timestamp))} ago</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <div className="px-6 lg:px-10 pb-24 lg:pb-12 max-w-[1600px] w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-xl py-3 px-6 flex justify-around items-center border-t border-border-light dark:border-border-dark lg:hidden z-50 transition-colors">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                active ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark"
              )}
            >
              <item.icon size={20} className={active ? "fill-primary/20" : ""} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          )
        })}
      </nav>

    </div>
  );
};
