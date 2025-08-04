import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Badge, 
  Button,
  Alert
} from 'flowbite-react';
import { 
  HiClipboardList, 
  HiPlay, 
  HiChartBar, 
  HiCog,
  HiDocumentText,
  HiUsers,
  HiTrendingUp
} from 'react-icons/hi';

import ManualTestCaseManager from './ManualTestCaseManager';
import TestExecutionKanban from './TestExecutionKanban';
import TestReporting from './TestReporting';

const ManualTestingDashboard = () => {
  const [activeTab, setActiveTab] = useState('test-cases');
  const [stats, setStats] = useState({
    totalTestCases: 145,
    pendingExecutions: 23,
    inProgress: 8,
    completedToday: 15,
    passRate: 87.5,
    activeTesters: 6
  });

  const tabsConfig = [
    {
      id: 'test-cases',
      title: 'Test Cases',
      icon: HiClipboardList,
      component: ManualTestCaseManager,
      description: 'Create and manage manual test cases'
    },
    {
      id: 'execution',
      title: 'Test Execution',
      icon: HiPlay,
      component: TestExecutionKanban,
      description: 'Execute tests using Kanban board'
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: HiChartBar,
      component: TestReporting,
      description: 'View comprehensive test reports'
    }
  ];

  const renderTabContent = () => {
    const activeTabConfig = tabsConfig.find(tab => tab.id === activeTab);
    if (activeTabConfig) {
      const Component = activeTabConfig.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Manual Testing Platform
              </h1>
              <p className="text-lg text-gray-600">
                Professional QA testing platform with comprehensive manual testing capabilities
              </p>
            </div>
            <div className="flex gap-2">
              <Button color="gray" size="sm">
                <HiCog className="mr-2" />
                Settings
              </Button>
              <Button color="blue" size="sm">
                <HiUsers className="mr-2" />
                Team
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalTestCases}
                </div>
                <div className="text-xs text-gray-600">Test Cases</div>
              </div>
            </Card>

            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingExecutions}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </Card>

            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.inProgress}
                </div>
                <div className="text-xs text-gray-600">In Progress</div>
              </div>
            </Card>

            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completedToday}
                </div>
                <div className="text-xs text-gray-600">Completed Today</div>
              </div>
            </Card>

            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.passRate}%
                </div>
                <div className="text-xs text-gray-600">Pass Rate</div>
              </div>
            </Card>

            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.activeTesters}
                </div>
                <div className="text-xs text-gray-600">Active Testers</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {tabsConfig.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                        ${isActive 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon className="mr-2 h-5 w-5" />
                      {tab.title}
                      {tab.id === 'execution' && stats.inProgress > 0 && (
                        <Badge color="warning" size="sm" className="ml-2">
                          {stats.inProgress}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Description */}
            <div className="mt-4">
              <p className="text-gray-600">
                {tabsConfig.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>

        {/* Quick Actions Float */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2">
          <Button
            color="blue"
            pill
            size="lg"
            className="shadow-lg"
            onClick={() => setActiveTab('test-cases')}
          >
            <HiDocumentText className="h-5 w-5" />
          </Button>
          <Button
            color="green"
            pill
            size="lg"
            className="shadow-lg"
            onClick={() => setActiveTab('execution')}
          >
            <HiPlay className="h-5 w-5" />
          </Button>
          <Button
            color="purple"
            pill
            size="lg"
            className="shadow-lg"
            onClick={() => setActiveTab('reports')}
          >
            <HiTrendingUp className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        .tab-content {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fixed button:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ManualTestingDashboard;