import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchFeedbacks();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('/api/swap-requests');
      // Show feedback for completed swaps where this user is the recipient
      const completed = res.data.filter(r => r.status === 'completed' && r.to_user_id === profile?.id && r.feedback);
      setFeedbacks(completed);
    } catch (err) {
      setFeedbacks([]);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillChange = (type, idx, value) => {
    setForm(f => {
      const arr = [...(f[type] || [])];
      arr[idx] = value;
      return { ...f, [type]: arr };
    });
  };

  const addSkill = type => {
    setForm(f => ({ ...f, [type]: [...(f[type] || []), ''] }));
  };

  const removeSkill = (type, idx) => {
    setForm(f => {
      const arr = [...(f[type] || [])];
      arr.splice(idx, 1);
      return { ...f, [type]: arr };
    });
  };

  const handlePhotoChange = e => {
    setPhotoFile(e.target.files[0]);
  };

  const handlePhotoUpload = async e => {
    e.preventDefault();
    if (!photoFile) return;
    setUploadMsg('Uploading...');
    const formData = new FormData();
    formData.append('photo', photoFile);
    try {
      const res = await axios.post('/api/auth/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(p => ({ ...p, profile_photo: res.data.profile_photo }));
      setForm(f => ({ ...f, profile_photo: res.data.profile_photo }));
      setUploadMsg('Photo uploaded successfully!');
      setPhotoFile(null);
      setTimeout(() => setUploadMsg(''), 3000);
    } catch (err) {
      setUploadMsg('Error uploading photo');
      setTimeout(() => setUploadMsg(''), 3000);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('Saving...');
    try {
      const res = await axios.put('/api/auth/profile', form);
      setProfile(res.data.user);
      setEdit(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and skills</p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Photo Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
              
              {/* Current Photo */}
              <div className="text-center mb-6">
                {profile.profile_photo ? (
                  <img 
                    src={profile.profile_photo} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto border-4 border-gray-200">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Upload Form */}
              <form onSubmit={handlePhotoUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Photo
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!photoFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Upload Photo
                </button>
              </form>
              
              {uploadMsg && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${uploadMsg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {uploadMsg}
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                {!edit && (
                  <button 
                    onClick={() => setEdit(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {!edit ? (
                /* View Mode */
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-gray-900">{profile.first_name} {profile.last_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <p className="text-gray-900">{profile.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <p className="text-gray-900">{profile.availability || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {profile.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <p className="text-gray-900">{profile.bio || 'No bio added yet'}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills Offered</label>
                      {profile.skills_offered && profile.skills_offered.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills_offered.map((skill, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No skills offered yet</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills Wanted</label>
                      {profile.skills_wanted && profile.skills_wanted.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills_wanted.map((skill, idx) => (
                            <span key={idx} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No skills wanted yet</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input 
                        name="first_name" 
                        value={form.first_name || ''} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input 
                        name="last_name" 
                        value={form.last_name || ''} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input 
                        name="location" 
                        value={form.location || ''} 
                        onChange={handleChange} 
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                      <input 
                        name="availability" 
                        value={form.availability || ''} 
                        onChange={handleChange} 
                        placeholder="e.g., Weekends, Evenings"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea 
                      name="bio" 
                      value={form.bio || ''} 
                      onChange={handleChange} 
                      rows="3"
                      placeholder="Tell others about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_public" 
                      checked={form.is_public || false} 
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Make my profile public
                    </label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Skills Offered</label>
                      <div className="space-y-2">
                        {(form.skills_offered || []).map((skill, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              value={skill} 
                              onChange={e => handleSkillChange('skills_offered', idx, e.target.value)} 
                              placeholder="Enter a skill"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button 
                              type="button" 
                              onClick={() => removeSkill('skills_offered', idx)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={() => addSkill('skills_offered')}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          + Add Skill
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Skills Wanted</label>
                      <div className="space-y-2">
                        {(form.skills_wanted || []).map((skill, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              value={skill} 
                              onChange={e => handleSkillChange('skills_wanted', idx, e.target.value)} 
                              placeholder="Enter a skill"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button 
                              type="button" 
                              onClick={() => removeSkill('skills_wanted', idx)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={() => addSkill('skills_wanted')}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          + Add Skill
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setEdit(false);
                        setForm(profile);
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {feedbacks.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Feedback & Ratings</h2>
          <div className="space-y-4">
            {feedbacks.map(fb => (
              <div key={fb.id} className="bg-gray-50 border rounded p-4">
                <div className="font-semibold text-blue-700 mb-1">{fb.from_user?.first_name} {fb.from_user?.last_name}</div>
                <div className="text-yellow-600 font-bold mb-1">Rating: {fb.rating || 'N/A'}/5</div>
                <div className="text-gray-700">{fb.feedback}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 