import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiPlus, FiSearch, FiFilter, FiCheckCircle, FiClock, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import api from '../../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
        const response = await api.get('/complaints');

        response.data = response.data.map(item => ({ ...item, id: item._id }))

        setComplaints(response.data);

        // Update statistics
        const total = response.data.length;
        const pending = response.data.filter(c => c.status === 'pending').length;
        const inProgress = response.data.filter(c => c.status === 'in_progress').length;
        const resolved = response.data.filter(c => c.status === 'resolved').length;
        const rejected = response.data.filter(c => c.status === 'rejected').length;

        setStats({ total, pending, inProgress, resolved, rejected });
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || complaint.status === filterStatus;

    return matchesSearch && matchesFilter;
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

  return (
    <div className="pt-16 md:pt-20 pb-16">
      <div className="bg-primary-600 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Citizen Dashboard</h1>
          <p className="text-primary-100">Track and manage your submitted complaints</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Welcome and Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Welcome, {user?.name}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4 flex items-center">
              <div className="bg-primary-100 rounded-full p-3 mr-4">
                <FiFileText className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Complaints</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
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

        {/* Complaint List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">My Complaints</h2>

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

              <Link to="/submit-complaint" className="btn-primary flex items-center">
                <FiPlus className="mr-2" />
                New Complaint
              </Link>
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
                  : 'You have not submitted any complaints yet'}
              </p>
              <Link to="/submit-complaint" className="btn-primary">
                Submit a New Complaint
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Update</th>
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
                          to={`/complaints/${complaint.id}`}
                          className="text-primary hover:text-primary-600 font-medium"
                        >
                          {complaint.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="badge-secondary">{complaint.category}</span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {format(new Date(complaint.updatedAt), 'MMM d, yyyy')}
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

export default DashboardPage;