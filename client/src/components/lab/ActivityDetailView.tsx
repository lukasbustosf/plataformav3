'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PedagogicalSheet from './PedagogicalSheet'; // Import the new component
import GuideStepsMarkdown from './GuideStepsMarkdown';

// Defines the structure for each tab
interface TabContent {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

// Props for the new, more detailed view
interface ActivityDetailViewProps {
  title: string;
  coverImage: string;
  description: string;
  stepsMarkdown?: string;
  objectivesMarkdown?: string;
  indicatorsMarkdown?: string;
  metadataChips: React.ReactNode;
  tabs: TabContent[];
  actionButtons?: React.ReactNode;
}

const ActivityDetailView: React.FC<ActivityDetailViewProps> = ({
  title,
  coverImage,
  description,
  stepsMarkdown,
  objectivesMarkdown,
  indicatorsMarkdown,
  metadataChips,
  tabs,
  actionButtons,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-white shadow-md pb-12">
        <img src={coverImage} alt={title} className="w-full h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
          <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">{title}</h1>
          <div className="flex flex-wrap gap-3">
            {metadataChips}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Main Guide */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Guía Docente</h2>
            <p className="text-gray-600 mb-6">{description}</p>
            <GuideStepsMarkdown markdown={stepsMarkdown || ''} />
          </div>

          {/* Tabs for secondary content */}
          <div className="bg-white rounded-lg shadow-lg">
            <nav className="border-b border-gray-200">
              <div className="flex space-x-4 px-6">
                {tabs.map((tab) => (
                  <Tab key={tab.id} id={tab.id} activeTab={activeTab} setActiveTab={setActiveTab}>
                    {tab.label}
                  </Tab>
                ))}
              </div>
            </nav>
            <main className="p-6 min-h-[300px]">
              {tabs.find((tab) => tab.id === activeTab)?.content}
            </main>
          </div>
        </div>

        {/* Right Column: Pedagogical Sheet */}
        <aside className="lg:col-span-1 sticky top-8">
          <PedagogicalSheet 
            objectivesMarkdown={objectivesMarkdown}
            indicatorsMarkdown={indicatorsMarkdown}
          />
        </aside>
      </div>

      {/* Sticky Actions Footer */}
      <footer className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-xl z-20">
        <div className="max-w-screen-xl mx-auto flex justify-end gap-4">
          {actionButtons}
        </div>
      </footer>
    </div>
  );
};

// Tab component
interface TabProps {
  id: string;
  activeTab: string;
  setActiveTab: (id: string) => void;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ id, activeTab, setActiveTab, children }) => (
  <button
    className={`-mb-px py-4 px-2 text-sm font-semibold flex items-center gap-2 ${
      activeTab === id
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
    }`}
    onClick={() => setActiveTab(id)}
  >
    {children}
  </button>
);

export default ActivityDetailView;