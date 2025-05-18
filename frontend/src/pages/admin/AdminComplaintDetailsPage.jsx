import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiCheckCircle, FiClock, FiAlertTriangle, FiXCircle,
  FiMessageSquare, FiPaperclip, FiMapPin, FiSend, FiUser,
  FiUserCheck, FiPhoneCall, FiMail, FiHome, FiEdit3, FiCheck
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { format } from 'date-fns';
import api from '../../services/api';

const AdminComplaintDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        // In a real implementation, you would fetch from actual endpoints
        const response = await api.get(`/admin/complaints/${id}`);
        response.data.id = response.data._id;
        setComplaint(response.data);
        setSelectedDepartment(response.data.department || '');
        setSelectedStatus(response.data.status || 'pending');
        setSelectedPriority(response.data.priority || 'low');

        // Fetch comments
        const commentsResponse = await api.get(`/admin/complaints/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching complaint details:', error);
        notify.error('Failed to load complaint details');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id, navigate, notify]);

  const updateComplaintStatus = async () => {
    if (!selectedStatus) return;

    setIsUpdating(true);

    try {
      const updatedComplaint = {
        ...complaint,
        status: selectedStatus,
        department: selectedDepartment,
        priority: selectedPriority,
        updatedAt: new Date().toISOString()
      };

      await api.put(`/admin/complaints/${id}`, updatedComplaint);

      setComplaint(updatedComplaint);
      notify.success('Complaint updated successfully');
      setIsEditingAssignment(false);
    } catch (error) {
      console.error('Error updating complaint:', error);
      notify.error('Failed to update complaint');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      const response = await api.post(`/admin/complaints/${id}/comments`, {
        text: newComment,
        userId: user.id,
        userName: user.name,
        userRole: 'admin',
        createdAt: new Date().toISOString()
      });

      setComments([...comments, response.data]);
      setNewComment('');
      notify.success('Response added successfully');
    } catch (error) {
      console.error('Error submitting comment:', error);
      notify.error('Failed to add response');
    } finally {
      setIsSubmittingComment(false);
    }
  };

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
        return <FiClock className="h-5 w-5 text-neutral-500" />;
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

  const getDepartmentName = (deptId) => {
    const departments = {
      public_works: 'Public Works Department',
      water_utility: 'Water Utility',
      electricity_utility: 'Electricity Utility',
      sanitation: 'Sanitation Department',
      transportation: 'Transportation Department',
      parks_recreation: 'Parks & Recreation',
      police: 'Police Department',
      animal_control: 'Animal Control'
    };

    return departments[deptId] || 'Unassigned';
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

  if (!complaint) {
    return (
      <div className="pt-16 md:pt-20 pb-16">
        <div className="container-custom py-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Complaint Not Found</h2>
            <p className="text-neutral-600 mb-6">
              The complaint you are looking for does not exist or you do not have permission to view it.
            </p>
            <Link to="/admin" className="btn-primary">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 pb-16">
      <div className="bg-secondary-600 text-white py-8">
        <div className="container-custom">
          <Link
            to="/admin"
            className="inline-flex items-center text-white hover:text-secondary-100 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{complaint.title}</h1>
              <div className="flex items-center text-secondary-100">
                <span>Complaint #{complaint._id.substring(0, 8)}</span>
                <span className="mx-2">•</span>
                <span>Submitted {format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
            <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
              {getStatusIcon(complaint.status)}
              <span className="ml-2 font-medium text-white">{getStatusBadge(complaint.status)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Complaint Details</h2>
                <p className="text-neutral-700 mb-6">{complaint.description}</p>

                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Attachments</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {complaint.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center border border-neutral-200 rounded-lg p-3 bg-neutral-50"
                        >
                          <FiPaperclip className="h-5 w-5 text-neutral-500 mr-2" />
                          <span className="text-sm truncate">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {console.log(complaint)}

                <div className="bg-neutral-50 rounded-lg p-4 flex items-start">
                  <FiMapPin className="h-5 w-5 text-neutral-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">Location</h3>
                    <p className="text-neutral-600">{complaint.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Citizen Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Citizen Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="bg-secondary-100 rounded-full p-2 mr-3">
                      <FiUser className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Full Name</h3>
                      <p className="text-neutral-700">{complaint.user.name || 'Jane Doe'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-secondary-100 rounded-full p-2 mr-3">
                      <FiUserCheck className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Account Status</h3>
                      <p className="text-neutral-700">Verified Citizen</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-secondary-100 rounded-full p-2 mr-3">
                      <FiPhoneCall className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Phone Number</h3>
                      <p className="text-neutral-700">{complaint.user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-secondary-100 rounded-full p-2 mr-3">
                      <FiMail className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Email Address</h3>
                      <p className="text-neutral-700">{complaint.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start md:col-span-2">
                    <div className="bg-secondary-100 rounded-full p-2 mr-3">
                      <FiHome className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Address</h3>
                      <p className="text-neutral-700">{complaint.user.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Response */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Official Response</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleCommentSubmit}>
                  <label htmlFor="adminResponse" className="block text-sm font-medium text-neutral-700 mb-2">
                    Add an official response that will be visible to the citizen
                  </label>
                  <textarea
                    id="adminResponse"
                    className="textarea mb-4"
                    rows="4"
                    placeholder="Type your response here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn-secondary flex items-center"
                      disabled={isSubmittingComment || !newComment.trim()}
                    >
                      {isSubmittingComment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          Send Response
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Communication History ({comments.length})</h2>
              </div>

              <div className="divide-y divide-neutral-200">
                {comments.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-neutral-500">No communication history yet</p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
                          <div className={`
                            w-full h-full flex items-center justify-center 
                            ${comment.userRole === 'admin'
                              ? 'bg-secondary-100 text-secondary-600'
                              : 'bg-primary-100 text-primary-600'
                            }
                          `}>
                            {comment.user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{comment.user.name}</h4>
                          <p className="text-xs text-neutral-500">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy, h:mm a')}
                          </p>
                        </div>
                        {comment.user.role === 'admin' ? (
                          <span className="ml-2 px-2 py-0.5 rounded text-xs bg-secondary-100 text-secondary-800">
                            Official
                          </span>
                        ) : (
                          <span className="ml-2 px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-800">
                            Citizen
                          </span>
                        )}
                      </div>
                      <div className="pl-12 md:pl-14">
                        <p className="text-neutral-700">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Assignment and Status */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Assignment & Status</h2>
                <button
                  className="text-secondary hover:text-secondary-600 transition-colors"
                  onClick={() => setIsEditingAssignment(!isEditingAssignment)}
                >
                  {isEditingAssignment ? (
                    <FiCheck className="h-5 w-5" />
                  ) : (
                    <FiEdit3 className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="p-6">
                {isEditingAssignment ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Department
                      </label>
                      <select
                        className="select w-full"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        <option value="">-- Assign Department --</option>
                        <option value="public_works">Public Works</option>
                        <option value="water_utility">Water Utility</option>
                        <option value="electricity_utility">Electricity Utility</option>
                        <option value="sanitation">Sanitation Department</option>
                        <option value="transportation">Transportation Department</option>
                        <option value="parks_recreation">Parks & Recreation</option>
                        <option value="police">Police Department</option>
                        <option value="animal_control">Animal Control</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Status
                      </label>
                      <select
                        className="select w-full"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Priority
                      </label>
                      <select
                        className="select w-full"
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <button
                      className="btn-secondary w-full mt-4"
                      onClick={updateComplaintStatus}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        'Update Assignment'
                      )}
                    </button>
                  </div>
                ) : (
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-neutral-500">Status</dt>
                      <dd className="mt-1 flex items-center">
                        {getStatusIcon(complaint.status)}
                        <span className="ml-2">{getStatusBadge(complaint.status)}</span>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-neutral-500">Department</dt>
                      <dd className="mt-1 text-neutral-700">
                        {complaint.department
                          ? getDepartmentName(complaint.department)
                          : 'Not yet assigned'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-neutral-500">Priority</dt>
                      <dd className="mt-1">
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
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-neutral-500">Assigned On</dt>
                      <dd className="mt-1 text-neutral-700">
                        {complaint.department
                          ? format(new Date(complaint.updatedAt), 'MMMM d, yyyy')
                          : 'Not yet assigned'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-neutral-500">Last Updated</dt>
                      <dd className="mt-1 text-neutral-700">
                        {format(new Date(complaint.updatedAt), 'MMMM d, yyyy')}
                      </dd>
                    </div>
                  </dl>
                )}
              </div>
            </div>

            {/* Complaint Summary */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Complaint Summary</h2>
              </div>
              <div className="p-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Category</dt>
                    <dd className="mt-1">
                      <span className="badge-secondary">{getCategoryName(complaint.category)}</span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Submitted On</dt>
                    <dd className="mt-1 text-neutral-700">
                      {format(new Date(complaint.createdAt), 'MMMM d, yyyy')}
                    </dd>
                  </div>

                  {complaint.publicDisplay && (
                    <div>
                      <dt className="text-sm font-medium text-neutral-500">Visibility</dt>
                      <dd className="mt-1 text-neutral-700">
                        Public (Anonymous)
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Response SLA</dt>
                    <dd className="mt-1 text-neutral-700">
                      {complaint.status === 'pending' ? (
                        <span className="text-warning">48 hours (Due in 24 hours)</span>
                      ) : (
                        <span className="text-success">Responded within SLA</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <button className="btn-outline w-full flex items-center justify-center">
                  <FiMessageSquare className="mr-2" />
                  Send Direct Message
                </button>

                <button className="btn-outline w-full flex items-center justify-center">
                  <FiPhoneCall className="mr-2" />
                  Call Citizen
                </button>

                <button className="btn-outline w-full flex items-center justify-center">
                  <FiPaperclip className="mr-2" />
                  Add Internal Note
                </button>

                {complaint.status === 'pending' && (
                  <button
                    className="btn-success w-full flex items-center justify-center"
                    onClick={() => {
                      setSelectedStatus('in_progress');
                      setIsEditingAssignment(true);
                    }}
                  >
                    <FiAlertTriangle className="mr-2" />
                    Mark as In Progress
                  </button>
                )}

                {complaint.status === 'in_progress' && (
                  <button
                    className="btn-success w-full flex items-center justify-center"
                    onClick={() => {
                      setSelectedStatus('resolved');
                      setIsEditingAssignment(true);
                    }}
                  >
                    <FiCheckCircle className="mr-2" />
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetailsPage;