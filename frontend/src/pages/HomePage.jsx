import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiSearch, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <FiFileText className="h-8 w-8 text-primary" />,
      title: 'Easy Submission',
      description: 'Submit your complaints or feedback with a simple, user-friendly form designed for all citizens.'
    },
    {
      icon: <FiSearch className="h-8 w-8 text-primary" />,
      title: 'Track Progress',
      description: 'Follow the status of your submissions in real-time from submission to resolution.'
    },
    {
      icon: <FiCheckCircle className="h-8 w-8 text-primary" />,
      title: 'Direct Response',
      description: 'Receive direct responses from the appropriate government departments handling your case.'
    },
    {
      icon: <FiBarChart2 className="h-8 w-8 text-primary" />,
      title: 'Transparency',
      description: 'View statistics and reports on complaint resolution times and satisfaction ratings.'
    }
  ];

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-neutral-900 opacity-10 pattern-dots"></div>
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white animate-fade-in">
              Your Voice, Our Priority
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
              A direct line to government services. Submit, track, and resolve public service issues efficiently.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/register" className="btn bg-white text-primary-600 hover:bg-white/90 focus:ring-white">
                Register Now
              </Link>
              <Link to="/login" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 focus:ring-white">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path 
              fill="#F9FAFB" 
              fillOpacity="1" 
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How PublicVoice Works</h2>
            <p className="text-lg text-neutral-600">
              Our platform simplifies communication between citizens and government agencies,
              ensuring your concerns are heard and addressed promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
              >
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-neutral-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple Three-Step Process</h2>
            <p className="text-lg text-neutral-600">
              Getting your concerns addressed is as easy as following these steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Submit Your Complaint</h3>
              <p className="text-neutral-600 mb-6">
                Register an account and fill out our streamlined complaint form with details of your issue.
              </p>
              
              {/* Mobile-only divider */}
              <div className="md:hidden w-16 h-1 bg-primary-300 my-8 mx-auto"></div>
              
              {/* Desktop arrow */}
              <div className="hidden md:block absolute top-6 right-0 w-1/2 h-2">
                <div className="h-0.5 bg-primary-300 w-full relative">
                  <div className="absolute right-0 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-primary-300 transform rotate-45"></div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">Track Your Case</h3>
              <p className="text-neutral-600 mb-6">
                Monitor the progress of your complaint in real-time as it moves through the system.
              </p>
              
              {/* Mobile-only divider */}
              <div className="md:hidden w-16 h-1 bg-primary-300 my-8 mx-auto"></div>
              
              {/* Desktop arrow */}
              <div className="hidden md:block absolute top-6 right-0 w-1/2 h-2">
                <div className="h-0.5 bg-primary-300 w-full relative">
                  <div className="absolute right-0 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-primary-300 transform rotate-45"></div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Receive Resolution</h3>
              <p className="text-neutral-600 mb-6">
                Get direct responses from government officials and rate your satisfaction with the resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Citizens Say</h2>
            <p className="text-lg text-neutral-600">
              Read how PublicVoice has helped citizens get their issues resolved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 relative">
              <div className="text-primary-400 text-4xl absolute top-4 left-4 opacity-20">"</div>
              <p className="text-neutral-700 mb-6 relative z-10">
                I reported a broken streetlight that had been out for months. Within a week, it was fixed! The ability to track the progress kept me informed throughout the process.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-200 rounded-full mr-4 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">James Manzi</h4>
                  <p className="text-sm text-neutral-500">Downtown Resident</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 relative">
              <div className="text-primary-400 text-4xl absolute top-4 left-4 opacity-20">"</div>
              <p className="text-neutral-700 mb-6 relative z-10">
                After struggling to get my garbage collection issues resolved for weeks, I used PublicVoice and received a response within 48 hours. The problem was resolved the following day!
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-200 rounded-full mr-4 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Mutoni</h4>
                  <p className="text-sm text-neutral-500">Remera Resident</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 relative">
              <div className="text-primary-400 text-4xl absolute top-4 left-4 opacity-20">"</div>
              <p className="text-neutral-700 mb-6 relative z-10">
                The water quality in our neighborhood had been declining. I submitted a complaint with water test results, and the water department contacted me for additional samples. Issue resolved in two weeks!
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-200 rounded-full mr-4 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Ishimwe</h4>
                  <p className="text-sm text-neutral-500">Kicukiro Resident</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of citizens who have successfully resolved their issues through PublicVoice.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="btn bg-white text-primary-600 hover:bg-white/90 focus:ring-white">
                Register Now
              </Link>
              <Link to="/login" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 focus:ring-white">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;