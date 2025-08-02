import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { HiRefresh } from 'react-icons/hi';
import TestImport from './TestImport';
import TestStatistics from './TestStatistics';
import TestSuitesList from './TestSuitesList';

const TestDashboard = () => {
  const [testSuites, setTestSuites] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [suitesResponse, statsResponse] = await Promise.all([
        fetch('/tests'),
        fetch('/tests/statistics')
      ]);

      if (suitesResponse.ok) {
        const suitesData = await suitesResponse.json();
        setTestSuites(suitesData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch test data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleImportSuccess = (_newTestSuites) => {
    // Refresh data after successful import
    handleRefresh();
  };

  const handleDelete = (deletedSuiteId) => {
    setTestSuites(prev => prev.filter(suite => suite.id !== deletedSuiteId));
    // Refresh statistics after deletion
    handleRefresh();
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchData();
      setLoading(false);
    };
    
    initializeData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
        <span className="ml-2">Loading test data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Automated Testing Dashboard</h1>
        <Button 
          color="blue" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Spinner size="sm" light={true} className="mr-2" />
              Refreshing...
            </>
          ) : (
            <>
              <HiRefresh className="mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Import Section */}
      <TestImport onImportSuccess={handleImportSuccess} />

      {/* Statistics Section */}
      {statistics && <TestStatistics statistics={statistics} />}

      {/* Test Suites List */}
      <TestSuitesList 
        testSuites={testSuites} 
        onDelete={handleDelete}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default TestDashboard;