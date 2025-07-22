import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Table, Spinner } from 'flowbite-react';
import { HiUser, HiMail, HiCalendar, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const Dashboard = ({ currentUser }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/dashboard/stats', {
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const response = await fetch('/users/confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          user: { email: currentUser.email }
        })
      });

      if (response.ok) {
        alert('Confirmation email sent!');
      }
    } catch (error) {
      console.error('Failed to resend confirmation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your personal dashboard
        </p>
      </div>

      {/* Account Status Card */}
      <div className="grid gap-6 mb-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                Account Information
              </h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <HiMail className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {currentUser?.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <HiCalendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Joined {new Date(currentUser?.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  {currentUser?.confirmed_at ? (
                    <>
                      <HiCheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <Badge color="success">Email Confirmed</Badge>
                    </>
                  ) : (
                    <>
                      <HiXCircle className="mr-2 h-4 w-4 text-red-500" />
                      <Badge color="warning">Email Not Confirmed</Badge>
                      <Button size="xs" color="light" onClick={handleResendConfirmation} className="ml-2">
                        Resend
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <HiUser className="h-16 w-16 text-gray-300" />
          </div>
        </Card>

        {/* Quick Stats Card */}
        <Card>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Quick Stats
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                {stats?.totalTests || 0}
              </div>
              <div className="text-sm text-gray-500">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                {stats?.passedTests || 0}
              </div>
              <div className="text-sm text-gray-500">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                {stats?.failedTests || 0}
              </div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                {stats?.pendingTests || 0}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="mb-4">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Recent Test Suites
          </h5>
        </div>
        {stats?.recentTestSuites?.length > 0 ? (
          <Table>
            <Table.Head>
              <Table.HeadCell>Suite Name</Table.HeadCell>
              <Table.HeadCell>Tests</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Last Run</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {stats.recentTestSuites.map((suite, index) => (
                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {suite.name}
                  </Table.Cell>
                  <Table.Cell>{suite.total_tests}</Table.Cell>
                  <Table.Cell>
                    <Badge color={suite.failed_tests > 0 ? 'failure' : 'success'}>
                      {suite.failed_tests > 0 ? 'Failed' : 'Passed'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {suite.executed_at ? new Date(suite.executed_at).toLocaleDateString() : 'Never'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No test suites found</p>
            <Button href="/tests" color="blue" className="mt-4">
              Get Started with Tests
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;