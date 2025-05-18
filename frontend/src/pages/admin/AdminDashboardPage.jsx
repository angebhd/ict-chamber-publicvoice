import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText, FiSearch, FiFilter, FiCheckCircle, FiClock,
  FiAlertTriangle, FiXCircle, FiBarChart2, FiUsers, FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import api from '../../services/api';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // Only fetch complaints for the admin's department
        const response = await api.get(`/admin/complaints?department=${user.department}`);
        setComplaints(response.data.complaints);
        console.log(response.data);

        // Update statistics
        const total = response.data.complaints.length;
        const pending = response.data.complaints.filter(c => c.status === 'pending').length;
        const inProgress = response.data.complaints.filter(c => c.status === 'in_progress').length;
        const resolved = response.data.complaints.filter(c => c.status === 'resolved').length;
        const rejected = response.data.complaints.filter(c => c.status === 'rejected').length;

        setStats({ total, pending, inProgress, resolved, rejected });
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [user.department]);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatusFilter = filterStatus === 'all' || complaint.status === filterStatus;

    return matchesSearch && matchesStatusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge-warning">Pending</span>;
      case 'in_progress':
        return <span className="badge-primary">In Progress</span>;
      case 'resolved':
        return <span className="badge-success">Resolved</span>;
      case 'rejected':
        return <span className="badge-error">Rejected</span>;
      default:
        return <span className="badge-secondary">Unknown</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="h-5 w-5 text-warning" />;
      case 'in_progress':
        return <FiAlertTriangle className="h-5 w-5 text-primary" />;
      case 'resolved':
        return <FiCheckCircle className="h-5 w-5 text-success" />;
      case 'rejected':
        return <FiXCircle className="h-5 w-5 text-error" />;
      default:
        return null;
    }
  };

  const getCategoryName = (categoryId) => {
    const categories = {
      roads: 'Roads & Infrastructure',
      water: 'Water Supply',
      electricity: 'Electricity',
      sanitation: 'Sanitation & Waste',
      public_transport: 'Public Transport',
      parks: 'Parks & Recreation',
      noise: 'Noise Complaints',
      stray_animals: 'Stray Animals',
      public_safety: 'Public Safety',
      other: 'Other'
    };

    return categories[categoryId] || categoryId;
  };

  return (
    <div className="pt-16 md:pt-20 pb-16">
      <div className="bg-secondary-600 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Department Admin Dashboard</h1>
          <p className="text-secondary-100">Manage and respond to complaints in your department</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Welcome and Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Welcome, {user?.name}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4 flex items-center">
              <div className="bg-primary-100 rounded-full p-3 mr-4">
                <FiFileText className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Complaints</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
                {console.log(stats)}
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 flex items-center">
              <div className="bg-warning-light rounded-full p-3 mr-4">
                <FiClock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Pending</p>
                <p className="text-2xl font-semibold">{stats.pending}</p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 flex items-center">
              <div className="bg-primary-50 rounded-full p-3 mr-4">
                <FiAlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">In Progress</p>
                <p className="text-2xl font-semibold">{stats.inProgress}</p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 flex items-center">
              <div className="bg-success-light rounded-full p-3 mr-4">
                <FiCheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Resolved</p>
                <p className="text-2xl font-semibold">{stats.resolved}</p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 flex items-center">
              <div className="bg-error-light rounded-full p-3 mr-4">
                <FiXCircle className="h-6 w-6 text-error" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Rejected</p>
                <p className="text-2xl font-semibold">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <a href="#complaints" className="flex items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="bg-primary-100 rounded-full p-2 mr-3">
                    <FiFileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Manage Complaints</h3>
                    <p className="text-sm text-neutral-500">Review and respond to complaints</p>
                  </div>
                </a>

                <a href="#" className="flex items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="bg-secondary-100 rounded-full p-2 mr-3">
                    <FiUsers className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">View Citizens</h3>
                    <p className="text-sm text-neutral-500">Manage citizen interactions</p>
                  </div>
                </a>

                <a href="#" className="flex items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="bg-accent-100 rounded-full p-2 mr-3">
                    <FiBarChart2 className="h-5 w-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="text-sm text-neutral-500">View department statistics</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Analytics Graph - Just a placeholder for the MVP */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Department Overview</h2>
              <select className="select w-auto text-sm" defaultValue="week">
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="p-6">
              <div className="h-64 bg-neutral-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FiBarChart2 className="h-12 w-12 text-neutral-300 mb-2 mx-auto" />
                  <p className="text-neutral-500">Analytics charts would appear here</p>
                  <p className="text-sm text-neutral-400">
                    Detailed analytics would be available in the full version
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <h3 className="text-xs text-neutral-500 uppercase mb-1">Response Time</h3>
                  <p className="text-lg font-semibold">24 hrs</p>
                  <p className="text-xs text-success">↓ 15% from last week</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <h3 className="text-xs text-neutral-500 uppercase mb-1">Resolution Rate</h3>
                  <p className="text-lg font-semibold">78%</p>
                  <p className="text-xs text-success">↑ 5% from last week</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <h3 className="text-xs text-neutral-500 uppercase mb-1">New Complaints</h3>
                  <p className="text-lg font-semibold">43</p>
                  <p className="text-xs text-error">↑ 12% from last week</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <h3 className="text-xs text-neutral-500 uppercase mb-1">Citizen Satisfaction</h3>
                  <p className="text-lg font-semibold">4.2/5</p>
                  <p className="text-xs text-success">↑ 0.3 from last week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint List */}
        <div id="complaints" className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Department Complaints</h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <select
                  className="select pl-10"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <button className="btn-outline flex items-center">
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-neutral-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiFileText className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No complaints found</h3>
              <p className="text-neutral-600 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'There are no complaints assigned to your department yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Citizen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="hover:bg-neutral-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        #{complaint._id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/complaints/${complaint._id}`}
                          className="text-primary hover:text-primary-600 font-medium"
                        >
                          {complaint.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {complaint.user.name || 'Anonymous User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="badge-secondary">{getCategoryName(complaint.category)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(complaint.status)}
                          <span className="ml-2">{getStatusBadge(complaint.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`
                          badge
                          ${complaint.priority === 'high'
                            ? 'bg-error-light text-error'
                            : complaint.priority === 'medium'
                              ? 'bg-warning-light text-warning'
                              : 'bg-neutral-100 text-neutral-600'
                          }
                        `}>
                          {complaint.priority ? complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1) : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;