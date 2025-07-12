import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

const FindPeople = () => {
  const { user } = useAuth();
  const [userSearch, setUserSearch] = useState('');
  const [userAvailability, setUserAvailability] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [swapStatus, setSwapStatus] = useState({});

  // Fetch all public users on mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      setUserLoading(true);
      setUserError('');
      try {
        const res = await axios.get('/api/users/search');
        setUserResults(res.data);
      } catch (err) {
        setUserError('Error loading users');
      } finally {
        setUserLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

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

  const handleRequestSwap = async (targetUser) => {
    if (!user) {
      alert('You must be logged in to request a swap.');
      return;
    }
    if (targetUser.id === user.id) {
      alert('You cannot request a swap with yourself.');
      return;
    }
    if (!targetUser.skills_offered || targetUser.skills_offered.length === 0) {
      alert('This user has no skills offered for swap.');
      return;
    }
    const skill = window.prompt('Enter the skill you want to request from this user (choose from: ' + targetUser.skills_offered.join(', ') + '):', targetUser.skills_offered[0]);
    if (!skill || !targetUser.skills_offered.includes(skill)) {
      alert('Invalid skill selected.');
      return;
    }
    const message = window.prompt('Enter a message for your swap request (optional):', '');
    setSwapStatus((prev) => ({ ...prev, [targetUser.id]: 'loading' }));
    try {
      // Find the skill_id by searching the backend (optional: you could fetch all skills and match)
      const res = await axios.get('/api/skills', { params: { search: skill } });
      const skillObj = res.data.find(s => s.title === skill && s.user && s.user.id === targetUser.id);
      if (!skillObj) {
        setSwapStatus((prev) => ({ ...prev, [targetUser.id]: 'error' }));
        alert('Skill not found for this user.');
        return;
      }
      await axios.post('/api/swap-requests', {
        to_user_id: targetUser.id,
        skill_id: skillObj.id,
        message: message || '',
      });
      setSwapStatus((prev) => ({ ...prev, [targetUser.id]: 'success' }));
    } catch (err) {
      setSwapStatus((prev) => ({ ...prev, [targetUser.id]: 'error' }));
      alert('Failed to send swap request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find People by Skill</h1>
          <p className="text-gray-600 mt-2">Search for public users by skill, availability, or location.</p>
        </div>
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
            {userResults.map(userResult => (
              <div key={userResult.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                  {userResult.profile_photo ? (
                    <img src={userResult.profile_photo} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{userResult.first_name} {userResult.last_name}</div>
                    <div className="text-xs text-gray-500">{userResult.location}</div>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">{userResult.availability || 'N/A'}</span>
                  <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${userResult.is_public ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{userResult.is_public ? 'Public' : 'Private'}</span>
                </div>
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">Skills Offered:</div>
                  <div className="flex flex-wrap gap-2">
                    {userResult.skills_offered && userResult.skills_offered.length > 0 ? userResult.skills_offered.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    )) : <span className="text-gray-400 text-xs">None</span>}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">Skills Wanted:</div>
                  <div className="flex flex-wrap gap-2">
                    {userResult.skills_wanted && userResult.skills_wanted.length > 0 ? userResult.skills_wanted.map((skill, idx) => (
                      <span key={idx} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    )) : <span className="text-gray-400 text-xs">None</span>}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600 min-h-[32px]">{userResult.bio}</div>
                {user && userResult.id !== user.id && userResult.skills_offered && userResult.skills_offered.length > 0 && (
                  <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full"
                    onClick={() => handleRequestSwap(userResult)}
                    disabled={swapStatus[userResult.id] === 'loading'}
                  >
                    {swapStatus[userResult.id] === 'success' ? 'Requested!' : swapStatus[userResult.id] === 'loading' ? 'Requesting...' : 'Request Swap'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default FindPeople; 