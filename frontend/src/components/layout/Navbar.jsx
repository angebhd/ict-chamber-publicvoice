import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFileText, FiInbox, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'superadmin') return '/superadmin';
    if (user?.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">PublicVoice</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="text-neutral-700 hover:text-primary transition-colors duration-200">
                  Home
                </Link>
                <Link to="/login" className="text-neutral-700 hover:text-primary transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to={getDashboardLink()}
                  className="text-neutral-700 hover:text-primary transition-colors duration-200"
                >
                  Dashboard
                </Link>
                
                {user?.role === 'citizen' && (
                  <Link to="/submit-complaint" className="text-neutral-700 hover:text-primary transition-colors duration-200">
                    Submit Complaint
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-neutral-700 hover:text-primary transition-colors duration-200">
                    <FiUser className="h-5 w-5" />
                    <span>{user?.name?.split(' ')[0] || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                    {user?.role === 'superadmin' && (
                      <Link
                        to="/superadmin"
                        className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        <FiSettings className="mr-2 h-4 w-4" />
                        Admin Settings
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-700 focus:outline-none"
          >
            {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'max-h-screen opacity-100 visible' 
          : 'max-h-0 opacity-0 invisible'
      }`}>
        <div className="container-custom py-4 bg-white shadow-md border-t border-neutral-100 space-y-3">
          <Link
            to="/"
            className="flex items-center w-full px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
          >
            <FiHome className="mr-3 h-5 w-5" />
            Home
          </Link>
          
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="flex items-center w-full px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
              >
                <FiUser className="mr-3 h-5 w-5" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center w-full px-3 py-2 text-white bg-primary hover:bg-primary-600 rounded-lg"
              >
                <FiUser className="mr-3 h-5 w-5" />
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={getDashboardLink()}
                className="flex items-center w-full px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
              >
                <FiInbox className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              
              {user?.role === 'citizen' && (
                <Link
                  to="/submit-complaint"
                  className="flex items-center w-full px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                >
                  <FiFileText className="mr-3 h-5 w-5" />
                  Submit Complaint
                </Link>
              )}

              {user?.role === 'superadmin' && (
                <Link
                  to="/superadmin"
                  className="flex items-center w-full px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                >
                  <FiSettings className="mr-3 h-5 w-5" />
                  Admin Settings
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
