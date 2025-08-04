import React, { useState } from 'react';

const ManualTestingDemo = () => {
  const [activeDemo, setActiveDemo] = useState('overview');

  const demoSections = {
    overview: {
      title: 'Manual Testing Platform Overview',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-900">🎯 World-Class QA Platform Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold text-blue-800">📝 Test Case Management</h4>
                <p className="text-sm text-gray-600">Full CRUD operations with rich text editor, priorities, and categories</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold text-green-800">🎯 Kanban Execution</h4>
                <p className="text-sm text-gray-600">Drag & drop test execution workflow with real-time status tracking</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold text-purple-800">📊 Professional Reports</h4>
                <p className="text-sm text-gray-600">Advanced analytics with Chart.js visualizations and PDF/CSV export</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold text-orange-800">🏢 Multi-Tenant</h4>
                <p className="text-sm text-gray-600">Organization-based isolation with role-based access control</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Technical Implementation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800">Backend</h4>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• Rails 8.0.2 with PostgreSQL</li>
                  <li>• 3 new models with associations</li>
                  <li>• RESTful API controllers</li>
                  <li>• Multi-tenant architecture</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Frontend</h4>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• React 19 with TypeScript</li>
                  <li>• Tailwind CSS + Flowbite</li>
                  <li>• Chart.js for visualizations</li>
                  <li>• Drag & drop with react-beautiful-dnd</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Testing</h4>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• RSpec for backend testing</li>
                  <li>• Jest for frontend testing</li>
                  <li>• Factory Bot for test data</li>
                  <li>• Comprehensive test coverage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    testCases: {
      title: 'Test Case Management Demo',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">✨ Rich Text Test Case Editor</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex space-x-2 mb-3 pb-2 border-b">
                <button className="px-2 py-1 bg-gray-200 rounded text-sm font-bold">B</button>
                <button className="px-2 py-1 bg-gray-200 rounded text-sm italic">I</button>
                <button className="px-2 py-1 bg-gray-200 rounded text-sm underline">U</button>
                <button className="px-2 py-1 bg-gray-200 rounded text-sm">🔗</button>
                <button className="px-2 py-1 bg-gray-200 rounded text-sm">📝</button>
                <button className="px-2 py-1 bg-gray-200 rounded text-sm">👁️</button>
              </div>
              <div className="min-h-32 p-3 bg-white border rounded">
                <div className="text-gray-500 italic">Rich text editor with formatting toolbar...</div>
                <div className="mt-2">
                  <strong>Test Steps:</strong>
                  <ol className="list-decimal list-inside mt-1 ml-4">
                    <li>Navigate to the login page</li>
                    <li>Enter valid credentials</li>
                    <li>Click the <code className="bg-gray-100 px-1 rounded">Submit</code> button</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🔍 Advanced Filtering & Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Search test cases..." 
                className="border rounded px-3 py-2"
              />
              <select className="border rounded px-3 py-2">
                <option>All Statuses</option>
                <option>Draft</option>
                <option>Approved</option>
                <option>Review</option>
              </select>
              <select className="border rounded px-3 py-2">
                <option>All Priorities</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Title</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-left">Priority</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">User Login Validation</td>
                    <td className="border p-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Authentication</span></td>
                    <td className="border p-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">High</span></td>
                    <td className="border p-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span></td>
                    <td className="border p-2">
                      <div className="flex space-x-1">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">View</button>
                        <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                        <button className="bg-purple-500 text-white px-2 py-1 rounded text-xs">Execute</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2">Dashboard Navigation</td>
                    <td className="border p-2"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">UI/UX</span></td>
                    <td className="border p-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Medium</span></td>
                    <td className="border p-2"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Draft</span></td>
                    <td className="border p-2">
                      <div className="flex space-x-1">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">View</button>
                        <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    
    kanban: {
      title: 'Kanban Test Execution Demo',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🎯 Drag & Drop Execution Board</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['To Do', 'In Progress', 'Blocked', 'Passed', 'Failed'].map((column, index) => (
                <div key={column} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">{column}</h4>
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {index === 0 ? '3' : index === 1 ? '2' : index === 2 ? '1' : index === 3 ? '5' : '2'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {(index === 0 ? [
                      { title: 'Login Test', priority: 'High', time: '15m' },
                      { title: 'Form Validation', priority: 'Medium', time: '10m' },
                      { title: 'Data Export', priority: 'Low', time: '20m' }
                    ] : index === 1 ? [
                      { title: 'Navigation Test', priority: 'High', time: '12m' },
                      { title: 'Search Function', priority: 'Medium', time: '8m' }
                    ] : index === 2 ? [
                      { title: 'Payment Gateway', priority: 'Critical', time: '25m' }
                    ] : index === 3 ? [
                      { title: 'User Registration', priority: 'High', time: '18m' },
                      { title: 'Password Reset', priority: 'Medium', time: '14m' },
                      { title: 'Profile Update', priority: 'Medium', time: '16m' },
                      { title: 'Email Verification', priority: 'Low', time: '12m' },
                      { title: 'Logout Function', priority: 'Low', time: '5m' }
                    ] : [
                      { title: 'File Upload', priority: 'High', time: '22m' },
                      { title: 'Database Connection', priority: 'Critical', time: '30m' }
                    ]).map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded shadow-sm border cursor-move">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-sm">{item.title}</h5>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                            item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>⏱️ {item.time}</span>
                          <span>👤 tester@qa.com</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📋 Test Execution Modal</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-4">
                <h4 className="font-semibold text-blue-900">Execute Test Case: User Login Validation</h4>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">Test Details</h5>
                  <div className="bg-white p-3 rounded border text-sm">
                    <p><strong>Category:</strong> Authentication</p>
                    <p><strong>Priority:</strong> High</p>
                    <p><strong>Estimated Time:</strong> 15 minutes</p>
                  </div>
                  
                  <h5 className="font-semibold mb-2 mt-4">Test Steps</h5>
                  <div className="bg-white p-3 rounded border text-sm">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Navigate to login page</li>
                      <li>Enter valid credentials</li>
                      <li>Click submit button</li>
                      <li>Verify redirect to dashboard</li>
                    </ol>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Execution Results</h5>
                  <select className="w-full border rounded px-3 py-2 mb-3">
                    <option>Passed</option>
                    <option>Failed</option>
                    <option>Blocked</option>
                  </select>
                  
                  <textarea 
                    placeholder="Actual result..." 
                    className="w-full border rounded px-3 py-2 mb-3"
                    rows="3"
                  />
                  
                  <textarea 
                    placeholder="Notes and observations..." 
                    className="w-full border rounded px-3 py-2 mb-3"
                    rows="2"
                  />
                  
                  <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Save Execution
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    reports: {
      title: 'Professional Reporting Demo',
      content: (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📊 Executive Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-3xl font-bold text-blue-600">145</div>
                <div className="text-sm text-gray-600">Total Test Cases</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-3xl font-bold text-green-600">87.5%</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-3xl font-bold text-purple-600">12.5m</div>
                <div className="text-sm text-gray-600">Avg Execution Time</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className="text-3xl font-bold text-orange-600">23</div>
                <div className="text-sm text-gray-600">Defects Found</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">📈 Execution Trends</h4>
                <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-lg">📊</div>
                    <div>Bar Chart - Weekly Execution Trends</div>
                    <div className="text-sm mt-2">Passed: 310 | Failed: 35 | Blocked: 10</div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">🎯 Status Distribution</h4>
                <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-lg">🍩</div>
                    <div>Doughnut Chart - Test Status</div>
                    <div className="text-sm mt-2">Passed: 84% | Failed: 12% | Blocked: 4%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📑 Export & Reporting</h3>
            <div className="flex space-x-4 mb-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
                📄 Export PDF
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center">
                📊 Export CSV
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded flex items-center">
                🖨️ Print Report
              </button>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Top Failed Test Cases</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Test Case</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Failure Rate</th>
                      <th className="p-2">Last Failed</th>
                      <th className="p-2">Defect ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">Login with invalid credentials</td>
                      <td className="p-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Auth</span></td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '85.5%'}}></div>
                          </div>
                          <span className="text-red-600 font-medium">85.5%</span>
                        </div>
                      </td>
                      <td className="p-2">1/15/2025</td>
                      <td className="p-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">BUG-123</span></td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">Form validation edge cases</td>
                      <td className="p-2"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Validation</span></td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '72.3%'}}></div>
                          </div>
                          <span className="text-red-600 font-medium">72.3%</span>
                        </div>
                      </td>
                      <td className="p-2">1/14/2025</td>
                      <td className="p-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">BUG-124</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Manual Testing Platform Demo
          </h1>
          <p className="text-lg text-gray-600">
            World-class QA platform with comprehensive manual testing capabilities
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow p-1">
            {Object.entries(demoSections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveDemo(key)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeDemo === key 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {demoSections[activeDemo].title}
          </h2>
          {demoSections[activeDemo].content}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            This comprehensive manual testing platform includes:
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Rich Text Editor</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Drag & Drop Kanban</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Professional Reports</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Multi-Tenant Architecture</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">Advanced Analytics</span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Export Capabilities</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualTestingDemo;