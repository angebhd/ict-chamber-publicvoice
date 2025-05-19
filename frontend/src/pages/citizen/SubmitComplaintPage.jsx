import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiAlertCircle, FiInfo, FiUpload, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';

const categories = [
  { id: 'roads', name: 'Roads & Infrastructure' },
  { id: 'water', name: 'Water Supply' },
  { id: 'electricity', name: 'Electricity' },
  { id: 'sanitation', name: 'Sanitation & Waste' },
  { id: 'public_transport', name: 'Public Transport' },
  { id: 'parks', name: 'Parks & Recreation' },
  { id: 'noise', name: 'Noise Complaints' },
  { id: 'stray_animals', name: 'Stray Animals' },
  { id: 'public_safety', name: 'Public Safety' },
  { id: 'other', name: 'Other' }
];

const SubmitComplaintPage = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showLocationMap, setShowLocationMap] = useState(false);
  
  const selectedCategory = watch('category', '');

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Simple validation for file types and size
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        notify.error(`Invalid file type: ${file.name}`);
        return false;
      }
      
      if (file.size > maxSize) {
        notify.error(`File too large: ${file.name} (max 5MB)`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setAttachments([...attachments, ...validFiles]);
    }
    
    // Reset the input
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    // In a real implementation,  handle file uploads here
    // For this MVP, we'll just include the file names
    const attachmentNames = attachments.map(file => file.name);
    
    const complaintData = {
      ...data,
      attachments: attachmentNames,
      userId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const response = await api.post('/complaints', complaintData);
      notify.success('Complaint submitted successfully!');
      navigate(`/complaints/${response.data._id}`);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 pb-16">
      <div className="bg-primary-600 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Submit a Complaint</h1>
          <p className="text-primary-100">Report an issue with public services</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold">Complaint Details</h2>
            <p className="text-neutral-600 text-sm mt-1">
              Please provide as much detail as possible to help us address your concern
            </p>
          </div>
          
          {error && (
            <div className="mx-6 mt-6 bg-error-light text-error p-4 rounded-lg flex items-center">
              <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                  Complaint Title <span className="text-error">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className={`input ${errors.title ? 'border-error focus:ring-error' : ''}`}
                  placeholder="Brief title of your complaint"
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 5,
                      message: 'Title must be at least 5 characters'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Title must not exceed 100 characters'
                    }
                  })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                  Category <span className="text-error">*</span>
                </label>
                <select
                  id="category"
                  className={`select ${errors.category ? 'border-error focus:ring-error' : ''}`}
                  {...register('category', {
                    required: 'Please select a category'
                  })}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-error">{errors.category.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                id="description"
                rows="5"
                className={`textarea ${errors.description ? 'border-error focus:ring-error' : ''}`}
                placeholder="Provide a detailed description of the issue"
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message: 'Description must be at least 20 characters'
                  }
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-error">{errors.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
                  Location <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    id="location"
                    type="text"
                    className={`input ${errors.location ? 'border-error focus:ring-error' : ''}`}
                    placeholder="Address or landmark"
                    {...register('location', {
                      required: 'Location is required'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-600"
                    onClick={() => setShowLocationMap(!showLocationMap)}
                  >
                    <FiInfo className="h-5 w-5" />
                  </button>
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-error">{errors.location.message}</p>
                )}
                
                {/* Simple Map UI (would be replaced with actual map in production) */}
                {showLocationMap && (
                  <div className="mt-2 border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="h-36 bg-neutral-100 flex items-center justify-center">
                      <p className="text-neutral-500 text-sm">Map would appear here</p>
                    </div>
                    <div className="px-3 py-2 bg-neutral-50 text-sm">
                      <p className="text-neutral-500">Click on the map to set your location</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-neutral-700 mb-1">
                  Relevant Department
                </label>
                <select
                  id="department"
                  className="select"
                  {...register('department')}
                >
                  <option value="">Select if known (optional)</option>
                  <option value="public_works">Public Works</option>
                  <option value="wasac">Water Utility</option>
                  <option value="reg">Electricity Utility</option>
                  <option value="rib">Rwanda Investigation Bureau</option>
                  <option value="sanitation">Sanitation Department</option>
                  <option value="transportation">Transportation Department</option>
                  <option value="police">Police Department</option>
                  <option value="animal_control">Animal Control</option>
                </select>
                <p className="mt-1 text-xs text-neutral-500">
                  Not required - we'll route your complaint to the appropriate department
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Attachments <span className="text-neutral-500">(optional)</span>
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-neutral-400" />
                  <div className="flex text-sm text-neutral-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-600">
                      <span>Upload files</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleAttachmentChange}
                        multiple
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    PNG, JPG, PDF up to 5MB
                  </p>
                </div>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Attached Files:</h4>
                  <ul className="space-y-2">
                    {attachments.map((file, index) => (
                      <li 
                        key={index}
                        className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-sm"
                      >
                        <span className="truncate max-w-xs">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-neutral-400 hover:text-error transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="publicDisplay"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                    {...register('publicDisplay')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="publicDisplay" className="text-neutral-700">
                    Display this complaint publicly (anonymously)
                  </label>
                  <p className="text-neutral-500">
                    This will allow other citizens to see and support your complaint
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 pt-6 flex flex-col sm:flex-row-reverse gap-4">
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Complaint'
                )}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="btn-outline"
                disabled={isLoading}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaintPage;