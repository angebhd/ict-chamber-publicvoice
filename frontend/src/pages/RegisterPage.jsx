import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiPhone, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError('');
    
    // Default role is citizen for regular registration
    const userData = {
      ...data,
      role: 'citizen'
    };
    
    try {
      await registerUser(userData);
      notify.success('Registration successful! Welcome to CiviConnect.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Your Account</h1>
            <p className="text-neutral-600">
              Join PublicVoice to start submitting and tracking your complaints
            </p>
          </div>

          {registerError && (
            <div className="bg-error-light text-error p-4 rounded-lg mb-6 flex items-center">
              <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{registerError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    className={`input pl-20 ${errors.name ? 'border-error focus:ring-error' : ''}`}
                    placeholder="John Doe"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className={`input pl-20 ${errors.email ? 'border-error focus:ring-error' : ''}`}
                    placeholder="you@gmail.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    className={`input pl-20 ${errors.phone ? 'border-error focus:ring-error' : ''}`}
                    placeholder="(123) 456-7890"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9+\- ]{10,15}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-error">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  className={`input ${errors.address ? 'border-error focus:ring-error' : ''}`}
                  placeholder="123 Main St, City, State"
                  {...register('address', {
                    required: 'Address is required'
                  })}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-error">{errors.address.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex  items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    className={`input pl-20 ${errors.password ? 'border-error focus:ring-error' : ''}`}
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`input pl-20 ${errors.confirmPassword ? 'border-error focus:ring-error' : ''}`}
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                  {...register('terms', {
                    required: 'You must agree to the terms and conditions'
                  })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-neutral-700">
                  I agree to the <a href="#" className="text-primary hover:text-primary-600">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-600">Privacy Policy</a>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-error">{errors.terms.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;