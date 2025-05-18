import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiCheckCircle, FiClock, FiAlertTriangle, FiXCircle, 
  FiMessageSquare, FiPaperclip, FiMapPin, FiSend, FiLoader
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { format } from 'date-fns';
import api from '../../services/api';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        // In a real implementation, you would fetch from actual endpoints
        const response = await api.get(`/complaints/${id}`);
        setComplaint(response.data);
        
        // Fetch comments
        const commentsResponse = await api.get(`/complaints/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching complaint details:', error);
        notify.error('Failed to load complaint details');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id, navigate, notify]);

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
        return <FiLoader className="h-5 w-5 text-neutral-500" />;
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
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
    
    return departments[deptId] || 'Unknown Department';
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmittingComment(true);
    
    try {
      const response = await api.post(`/complaints/${id}/comments`, {
        text: newComment,
        userId: user.id,
        userName: user.name,
        userRole: 'citizen',
        createdAt: new Date().toISOString()
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
      notify.success('Comment added successfully');
    } catch (error) {
      console.error('Error submitting comment:', error);
      notify.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 md:pt-20 pb-16">
        <div className="container-custom py-8">
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
            <Link to="/dashboard" className="btn-primary">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 pb-16">
      <div className="bg-primary-600 text-white py-8">
        <div className="container-custom">
          <Link 
            to="/dashboard"
            className="inline-flex items-center text-white hover:text-primary-100 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{complaint.title}</h1>
              <div className="flex items-center text-primary-100">
                <span>Complaint #{complaint.id.substring(0, 8)}</span>
                <span className="mx-2">•</span>
                <span>Submitted {format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
            <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
              {getStatusIcon(complaint.status)}
              <span className="ml-2 font-medium text-white">{getStatusName(complaint.status)}</span>
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
                
                <div className="bg-neutral-50 rounded-lg p-4 flex items-start">
                  <FiMapPin className="h-5 w-5 text-neutral-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">Location</h3>
                    <p className="text-neutral-600">{complaint.location}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Status Timeline</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
                  
                  {/* Submitted */}
                  <div className="relative flex items-start mb-8">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 mt-1 mr-4 z-10">
                      <FiCheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Complaint Submitted</h3>
                      <p className="text-sm text-neutral-500">
                        {format(new Date(complaint.createdAt), 'MMM d, yyyy, h:mm a')}
                      </p>
                      <p className="mt-1 text-neutral-600">
                        Your complaint has been received and is pending review.
                      </p>
                    </div>
                  </div>
                  
                  {/* In Progress (conditional) */}
                  {['in_progress', 'resolved', 'rejected'].includes(complaint.status) && (
                    <div className="relative flex items-start mb-8">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 mt-1 mr-4 z-10">
                        <FiAlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">In Progress</h3>
                        <p className="text-sm text-neutral-500">
                          {format(new Date(complaint.updatedAt), 'MMM d, yyyy, h:mm a')}
                        </p>
                        <p className="mt-1 text-neutral-600">
                          Your complaint has been assigned to {getDepartmentName(complaint.department || 'public_works')} and is being addressed.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Resolved (conditional) */}
                  {complaint.status === 'resolved' && (
                    <div className="relative flex items-start mb-8">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success-light text-success mt-1 mr-4 z-10">
                        <FiCheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Complaint Resolved</h3>
                        <p className="text-sm text-neutral-500">
                          {format(new Date(complaint.updatedAt), 'MMM d, yyyy, h:mm a')}
                        </p>
                        <p className="mt-1 text-neutral-600">
                          Your complaint has been successfully resolved by {getDepartmentName(complaint.department || 'public_works')}.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Rejected (conditional) */}
                  {complaint.status === 'rejected' && (
                    <div className="relative flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-error-light text-error mt-1 mr-4 z-10">
                        <FiXCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Complaint Rejected</h3>
                        <p className="text-sm text-neutral-500">
                          {format(new Date(complaint.updatedAt), 'MMM d, yyyy, h:mm a')}
                        </p>
                        <p className="mt-1 text-neutral-600">
                          Your complaint has been reviewed and could not be addressed. Please check the comments for more information.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Current Status (if pending) */}
                  {complaint.status === 'pending' && (
                    <div className="relative flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning-light text-warning mt-1 mr-4 z-10">
                        <FiClock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Awaiting Review</h3>
                        <p className="text-sm text-neutral-500">Current Status</p>
                        <p className="mt-1 text-neutral-600">
                          Your complaint is currently awaiting review by government officials.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Comments */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
              </div>
              
              <div className="divide-y divide-neutral-200">
                {comments.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-neutral-500">No comments yet</p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full mr-3 overflow-hidden">
                          {/* Would use actual user avatar in production */}
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{comment.userName}</h4>
                          <p className="text-xs text-neutral-500">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy, h:mm a')}
                          </p>
                        </div>
                        {comment.userRole === 'admin' && (
                          <span className="ml-2 px-2 py-0.5 rounded text-xs bg-secondary-100 text-secondary-800">
                            Official
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
              
              {/* Comment Form */}
              <div className="p-6 bg-neutral-50">
                <h3 className="text-lg font-medium mb-3">Add a Comment</h3>
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    className="textarea mb-3"
                    rows="3"
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
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
                        Submit Comment
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Complaint Summary</h2>
              </div>
              <div className="p-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Status</dt>
                    <dd className="mt-1 flex items-center">
                      {getStatusIcon(complaint.status)}
                      <span className="ml-2">{getStatusBadge(complaint.status)}</span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Category</dt>
                    <dd className="mt-1">
                      <span className="badge-secondary">{getCategoryName(complaint.category)}</span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Department Assigned</dt>
                    <dd className="mt-1 text-neutral-700">
                      {complaint.department 
                        ? getDepartmentName(complaint.department) 
                        : 'Pending Assignment'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Submitted On</dt>
                    <dd className="mt-1 text-neutral-700">
                      {format(new Date(complaint.createdAt), 'MMMM d, yyyy')}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Last Updated</dt>
                    <dd className="mt-1 text-neutral-700">
                      {format(new Date(complaint.updatedAt), 'MMMM d, yyyy')}
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
                </dl>
              </div>
            </div>
            
            {/* Related Complaints (Would be implemented in production) */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Similar Complaints</h2>
              </div>
              <div className="p-6">
                <p className="text-neutral-500 text-center">
                  No similar complaints found in your area
                </p>
              </div>
            </div>
            
            {/* Helpful Resources */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold">Helpful Resources</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-primary hover:text-primary-600 flex items-center">
                      <FiExternalLink className="mr-2 h-4 w-4" />
                      Department Contact Information
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:text-primary-600 flex items-center">
                      <FiExternalLink className="mr-2 h-4 w-4" />
                      FAQs About {getCategoryName(complaint.category)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:text-primary-600 flex items-center">
                      <FiExternalLink className="mr-2 h-4 w-4" />
                      Emergency Services
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// This is just for rendering in this component; would be imported in a real app
const FiExternalLink = ({ className }) => (
  <svg 
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

export default ComplaintDetailsPage;