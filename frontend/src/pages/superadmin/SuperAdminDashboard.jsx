import { useState, useEffect } from 'react';
import { FiUsers, FiGrid, FiBarChart2, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalDepartments: 0,
    activeAdmins: 0
  });
  const [departments, setDepartments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewDepartmentForm, setShowNewDepartmentForm] = useState(false);
  const [showNewAdminForm, setShowNewAdminForm] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    phone: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, departmentsRes, adminsRes] = await Promise.all([
          api.get('/superadmin/stats'),
          api.get('/superadmin/departments'),
          api.get('/superadmin/admins')
        ]);

        setStats(statsRes.data);
        setDepartments(departmentsRes.data);
        setAdmins(adminsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        notify.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [notify]);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/departments', newDepartment);
      setDepartments([...departments, response.data]);
      setShowNewDepartmentForm(false);
      setNewDepartment({ name: '', code: '', description: '' });
      notify.success('Department created successfully');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to create department');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/admins', newAdmin);
      setAdmins([...admins, response.data.admin]);
      setShowNewAdminForm(false);
      setNewAdmin({ name: '', email: '', password: '', department: '', phone: '' });
      notify.success('Admin created successfully');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleUpdateAdminStatus = async (adminId, isActive) => {
    try {
      const response = await api.patch(`/admin/admins/${adminId}/status`, { isActive });
      setAdmins(admins.map(admin => 
        admin.id === adminId ? response.data : admin
      ));
      notify.success(`Admin ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      notify.error('Failed to update admin status');
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 md:pt-20 pb-16">
        <div className="container-custom py-8">
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 pb-16">
      <div className="bg-secondary-600 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-secondary-100">Manage departments and administrators</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-full p-3 mr-4">
                <FiUsers className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Admins</p>
                <p className="text-2xl font-semibold">{stats.totalAdmins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-secondary-100 rounded-full p-3 mr-4">
                <FiGrid className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Departments</p>
                <p className="text-2xl font-semibold">{stats.totalDepartments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-success-light rounded-full p-3 mr-4">
                <FiBarChart2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Active Admins</p>
                <p className="text-2xl font-semibold">{stats.activeAdmins}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Departments Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Departments</h2>
            <button
              className="btn-secondary flex items-center"
              onClick={() => setShowNewDepartmentForm(!showNewDepartmentForm)}
            >
              <FiPlus className="mr-2" />
              Add Department
            </button>
          </div>

          {showNewDepartmentForm && (
            <div className="p-6 border-b border-neutral-200 bg-neutral-50">
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Department Name
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Department Code
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={newDepartment.code}
                      onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="textarea"
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setShowNewDepartmentForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-secondary">
                    Create Department
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {departments.map((department) => (
                  <tr key={department._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{department.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{department.code}</td>
                    <td className="px-6 py-4">{department.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${department.isActive ? 'badge-success' : 'badge-error'}`}>
                        {department.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-secondary hover:text-secondary-600 mr-2">
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button className="text-error hover:text-error/80">
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admins Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Department Admins</h2>
            <button
              className="btn-secondary flex items-center"
              onClick={() => setShowNewAdminForm(!showNewAdminForm)}
            >
              <FiPlus className="mr-2" />
              Add Admin
            </button>
          </div>

          {showNewAdminForm && (
            <div className="p-6 border-b border-neutral-200 bg-neutral-50">
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="input"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="input"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Department
                    </label>
                    <select
                      className="select"
                      value={newAdmin.department}
                      onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept.code}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="input"
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setShowNewAdminForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-secondary">
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {departments.find(d => d.code === admin.department)?.name || admin.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${admin.isActive ? 'badge-success' : 'badge-error'}`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`mr-2 ${admin.isActive ? 'text-error' : 'text-success'} hover:opacity-80`}
                        onClick={() => handleUpdateAdminStatus(admin._id, !admin.isActive)}
                      >
                        {admin.isActive ? (
                          <FiX className="h-5 w-5" />
                        ) : (
                          <FiCheck className="h-5 w-5" />
                        )}
                      </button>
                      <button className="text-secondary hover:text-secondary-600">
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;