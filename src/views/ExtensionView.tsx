import React from 'react';
import { Download, Globe, Settings, CheckCircle2, FileArchive, Puzzle } from 'lucide-react';

export const ExtensionView: React.FC = () => {
  const steps = [
    {
      icon: Download,
      title: 'Download the Extension',
      desc: 'Click the download button below to visit our GitHub Releases page and download the smart-track-extension.zip file.'
    },
    {
      icon: FileArchive,
      title: 'Extract the ZIP File',
      desc: 'Locate the downloaded .zip file on your computer and extract (unzip) it to a folder you can easily find.'
    },
    {
      icon: Globe,
      title: 'Open Extension Settings',
      desc: 'Open Google Chrome, click the three dots in the top right corner, and go to Extensions > Manage Extensions (or type chrome://extensions/ in the URL bar).'
    },
    {
      icon: Settings,
      title: 'Enable Developer Mode',
      desc: 'In the top right corner of the Extensions page, toggle the "Developer mode" switch to ON.'
    },
    {
      icon: Puzzle,
      title: 'Load the Extension',
      desc: 'Click the "Load unpacked" button that appears in the top left, and select the folder you extracted in Step 2.'
    },
    {
      icon: CheckCircle2,
      title: 'Sync Your Data',
      desc: 'Log in to your college attendance portal. Click the new puzzle piece icon in your Chrome toolbar, open SmartTrack, and click "Extract Data".'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 lg:p-12 shadow-soft border border-border-light dark:border-border-dark text-center flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
        
        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 relative z-10 transform rotate-3">
          <Globe size={40} />
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-black text-text-light dark:text-text-dark mb-4 relative z-10">
          SmartTrack Extension
        </h2>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mb-10 relative z-10">
          Automatically extract your college attendance data and sync it instantly with this dashboard. No more manual entry required. Compatible with various university portals!
        </p>
        
        <a 
          href="https://github.com/tarunmathur7777-cpu/attendance-tracker/releases/latest" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 z-10"
        >
          <Download size={24} className="group-hover:-translate-y-1 transition-transform" />
          Download Extension (ZIP)
        </a>
      </div>

      {/* Instructions Section */}
      <div className="bg-surfaceVariant-light dark:bg-surfaceVariant-dark rounded-3xl p-8 lg:p-12 shadow-soft border border-border-light dark:border-border-dark">
        <div className="mb-10 text-center">
          <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">How to Install & Use</h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-2">Follow these simple steps to set up the SmartTrack extension.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark relative group transition-all hover:shadow-md hover:border-primary/30">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shadow-md border-4 border-surfaceVariant-light dark:border-surfaceVariant-dark z-10">
                {idx + 1}
              </div>
              
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <step.icon size={24} />
              </div>
              
              <h4 className="font-bold text-text-light dark:text-text-dark mb-2">{step.title}</h4>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};
