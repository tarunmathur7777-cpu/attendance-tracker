import React from 'react';
import { CalendarWidget } from '../components/CalendarWidget';
import { ScenarioPlanner } from '../components/ScenarioPlanner';
import { ProjectedChart } from '../components/ProjectedChart';

export const PlannerView: React.FC = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <ProjectedChart />
        </div>
        <div className="lg:col-span-1">
          <ScenarioPlanner />
        </div>
      </div>

      <div className="grid grid-cols-1">
        <CalendarWidget />
      </div>
    </div>
  );
};
