import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Profile from './pages/Profile';
import FindPeople from './pages/FindPeople';
import SwapRequests from './pages/SwapRequests';
import AdminDashboard from './pages/AdminDashboard';

// Simple Auth Context
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', userData);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

// Navigation Component
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Skill Swap
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
                <Link to="/skills" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Skills
                </Link>
                <Link to="/find-people" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Find People
                </Link>
                <Link to="/swap-requests" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Swap Requests
                </Link>
                {user.is_admin && (
                  <Link to="/admin" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Home Page
function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Swap Skills, Grow Together
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with people who have the skills you need and offer your expertise in return. 
              Build meaningful relationships while learning and teaching.
            </p>
            <div className="space-x-4">
              <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </Link>
              <Link to="/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to find skill exchange opportunities and connect with like-minded individuals.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and showcase your skills, experience, and what you're looking to learn.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">List & Search Skills</h3>
              <p className="text-gray-600">
                Add skills you offer and want, then browse the community for matches.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Request a Swap</h3>
              <p className="text-gray-600">
                Send or receive swap requests, chat, and schedule your learning sessions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Grow</h3>
              <p className="text-gray-600">
                Complete swaps, leave feedback, and build your reputation as you learn and teach.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for a seamless skill exchange experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="Personalized Profiles" desc="Showcase your skills, interests, and availability with a beautiful public profile." />
            <FeatureCard title="Skill Search & Discovery" desc="Find people by skill, location, or availability. Filter and connect instantly." />
            <FeatureCard title="Swap Requests" desc="Send, accept, or reject swap requests. Manage all your exchanges in one place." />
            <FeatureCard title="Feedback & Ratings" desc="Build trust with ratings and reviews after each completed swap." />
            <FeatureCard title="Admin Tools" desc="Admins can monitor swaps, manage users, and keep the community safe." />
            <FeatureCard title="Platform Messaging" desc="Receive important updates and platform-wide announcements." />
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Skill Swap?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We’re more than just a platform – we’re a community of learners and teachers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Safe & Supportive</h3>
              <p className="text-gray-600">All users are verified and swaps are monitored for your safety.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Diverse Skills</h3>
              <p className="text-gray-600">From coding to cooking, find or offer any skill you can imagine.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Free to Use</h3>
              <p className="text-gray-600">No hidden fees. Learn and teach for free, forever.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard name="Aisha K." text="I learned Spanish in exchange for teaching guitar. The process was smooth and fun!" />
            <TestimonialCard name="Ben S." text="The platform helped me find a coding mentor and I got to teach yoga in return." />
            <TestimonialCard name="Priya R." text="I love how easy it is to connect and swap skills. The feedback system is great!" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600">&copy; {new Date().getFullYear()} Skill Swap Platform</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper components for Home page
function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, text }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-700 italic mb-4">"{text}"</p>
      <div className="text-blue-600 font-semibold">{name}</div>
    </div>
  );
}

// Login Page
function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Register Page
function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    bio: '',
    location: ''
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <input
              name="username"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
              name="email"
              type="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              name="password"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="first_name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
              <input
                name="last_name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <input
              name="location"
              type="text"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Location (optional)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <textarea
              name="bio"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Bio (optional)"
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Dashboard Page
function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your skill exchanges.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Your Skills</h3>
          <p className="text-gray-600 mb-4">Manage your offered skills</p>
          <Link to="/skills" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block">
            View Skills
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Swap Requests</h3>
          <p className="text-gray-600 mb-4">Check your pending requests</p>
          <Link to="/swap-requests" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block">
            View Requests
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>
          <p className="text-gray-600 mb-4">Update your profile information</p>
          <Link to="/profile" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

// Skills Page
function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('/api/skills');
        setSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Skills</h1>
        <p className="text-gray-600 mt-2">
          Browse skills available for exchange.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{skill.title}</h3>
            <p className="text-gray-600 mb-4">{skill.description}</p>
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {skill.category}
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {skill.proficiency_level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center text-gray-500">
          No skills available at the moment.
        </div>
      )}
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/find-people" element={<FindPeople />} />
            <Route path="/swap-requests" element={<SwapRequests />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export { useAuth };
export default App; 