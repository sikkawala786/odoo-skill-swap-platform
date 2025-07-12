import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userAvailability, setUserAvailability] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const { user } = useAuth ? useAuth() : { user: null };
  const [swapStatus, setSwapStatus] = useState({});

  useEffect(() => {
    fetchFilters();
    fetchSkills();
  }, []);

  const fetchFilters = async () => {
    try {
      const [catRes, lvlRes] = await Promise.all([
        axios.get('/api/skills/categories'),
        axios.get('/api/skills/levels'),
      ]);
      setCategories(catRes.data);
      setLevels(lvlRes.data);
    } catch (err) {
      // ignore
    }
  };

  const fetchSkills = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/skills', { params });
      setSkills(res.data);
    } catch (err) {
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchSkills({ search, category, level, location });
  };

  const handleUserSearch = async (e) => {
    e.preventDefault();
    setUserLoading(true);
    setUserError('');
    setUserResults([]);
    try {
      const res = await axios.get('/api/users/search', {
        params: {
          skill: userSearch,
          availability: userAvailability,
          location: userLocation,
        },
      });
      setUserResults(res.data);
    } catch (err) {
      setUserError('Error searching users');
    } finally {
      setUserLoading(false);
    }
  };

  const handleRequestSwap = async (skill) => {
    if (!user) {
      alert('You must be logged in to request a swap.');
      return;
    }
    if (skill.user && skill.user.id === user.id) {
      alert('You cannot request a swap with your own skill.');
      return;
    }
    const message = window.prompt('Enter a message for your swap request (optional):', '');
    setSwapStatus((prev) => ({ ...prev, [skill.id]: 'loading' }));
    try {
      await axios.post('/api/swap-requests', {
        to_user_id: skill.user.id,
        skill_id: skill.id,
        message: message || '',
      });
      setSwapStatus((prev) => ({ ...prev, [skill.id]: 'success' }));
    } catch (err) {
      setSwapStatus((prev) => ({ ...prev, [skill.id]: 'error' }));
      alert('Failed to send swap request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Skill Marketplace</h1>
          <p className="text-gray-600 mt-2">Browse, search, and connect with people offering skills for swap.</p>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Skill, tag, or description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City or country"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        {/* --- Find People by Skill Section --- */}
        <div className="mb-12 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find People by Skill</h2>
          <p className="text-gray-600 mb-6">Search for public users by skill, availability, or location.</p>
          <form onSubmit={handleUserSearch} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill (offered or wanted)</label>
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="e.g. Photoshop, Excel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="min-w-[160px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <input
                type="text"
                value={userAvailability}
                onChange={e => setUserAvailability(e.target.value)}
                placeholder="e.g. weekends, evenings"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="min-w-[160px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={userLocation}
                onChange={e => setUserLocation(e.target.value)}
                placeholder="City or country"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
          {userLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Searching users...</p>
            </div>
          ) : userError ? (
            <div className="text-center text-red-600 py-8">{userError}</div>
          ) : userResults.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userResults.map(user => (
                <div key={user.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    {user.profile_photo ? (
                      <img src={user.profile_photo} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
                      <div className="text-xs text-gray-500">{user.location}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">{user.availability || 'N/A'}</span>
                    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${user.is_public ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{user.is_public ? 'Public' : 'Private'}</span>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 mb-1">Skills Offered:</div>
                    <div className="flex flex-wrap gap-2">
                      {user.skills_offered && user.skills_offered.length > 0 ? user.skills_offered.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                      )) : <span className="text-gray-400 text-xs">None</span>}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 mb-1">Skills Wanted:</div>
                    <div className="flex flex-wrap gap-2">
                      {user.skills_wanted && user.skills_wanted.length > 0 ? user.skills_wanted.map((skill, idx) => (
                        <span key={idx} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                      )) : <span className="text-gray-400 text-xs">None</span>}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 min-h-[32px]">{user.bio}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No skills found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map(skill => (
              <div key={skill.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {skill.user && skill.user.profile_photo ? (
                      <img src={skill.user.profile_photo} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-blue-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{skill.user ? `${skill.user.first_name} ${skill.user.last_name}` : 'User'}</div>
                      <div className="text-xs text-gray-500">{skill.location}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-700 mb-1">{skill.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skill.tags && skill.tags.map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3 min-h-[48px]">{skill.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{skill.category}</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{skill.proficiency_level}</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">{skill.availability}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Hourly Rate: <span className="font-semibold text-gray-700">${skill.hourly_rate}</span></div>
                </div>
                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full"
                  onClick={() => handleRequestSwap(skill)}
                  disabled={swapStatus[skill.id] === 'loading' || (user && skill.user && skill.user.id === user.id)}
                >
                  {swapStatus[skill.id] === 'success' ? 'Requested!' : swapStatus[skill.id] === 'loading' ? 'Requesting...' : 'Request Swap'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills; 