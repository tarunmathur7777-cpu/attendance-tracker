import { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './views/DashboardView';
import { PlannerView } from './views/PlannerView';
import { LogsView } from './views/LogsView';
import { SettingsView } from './views/SettingsView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'planner': return <PlannerView />;
      case 'logs': return <LogsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderView()}
    </Layout>
  )
}

export default App
