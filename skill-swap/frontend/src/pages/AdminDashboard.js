import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('skills');
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user && user.is_admin) {
      fetchSkills();
      fetchUsers();
      fetchSwaps();
      fetchMessages();
    }
  }, [user]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/skills');
      setSkills(res.data);
    } catch (err) {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/swaps');
      setSwaps(res.data);
    } catch (err) {
      setError('Failed to load swaps');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/messages');
      setMessages(res.data);
    } catch (err) {
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await axios.post('/api/admin/messages', { message: newMessage });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const handleRejectSkill = async (id) => {
    if (!window.confirm('Reject this skill?')) return;
    try {
      await axios.post(`/api/admin/skills/${id}/reject`);
      fetchSkills();
    } catch (err) {
      alert('Failed to reject skill');
    }
  };

  const handleBanUser = async (id) => {
    if (!window.confirm('Ban this user?')) return;
    try {
      await axios.post(`/api/admin/users/${id}/ban`);
      fetchUsers();
    } catch (err) {
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (id) => {
    try {
      await axios.post(`/api/admin/users/${id}/unban`);
      fetchUsers();
    } catch (err) {
      alert('Failed to unban user');
    }
  };

  const handleDownload = (type) => {
    window.open(`/api/admin/report/${type}`, '_blank');
  };

  if (!user || !user.is_admin) {
    return <div className="p-8 text-center text-red-600">Access denied. Admins only.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* Platform-wide messages */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Platform-wide Messages</h2>
        <form onSubmit={handleSendMessage} className="flex gap-2 mb-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Enter message to send to all users"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Send</button>
        </form>
        <div className="space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className="bg-blue-50 border-l-4 border-blue-400 p-2 text-blue-800 text-sm">
              <span className="font-semibold">[{new Date(msg.created_at).toLocaleString()}]</span> {msg.message}
            </div>
          ))}
          {messages.length === 0 && <div className="text-gray-500">No messages sent yet.</div>}
        </div>
      </div>
      {/* Download reports */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Download Reports</h2>
        <div className="flex gap-4">
          <button onClick={() => handleDownload('users')} className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded">Download Users CSV</button>
          <button onClick={() => handleDownload('feedback')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">Download Feedback CSV</button>
          <button onClick={() => handleDownload('swaps')} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">Download Swaps CSV</button>
        </div>
      </div>
      <div className="flex space-x-4 mb-8">
        <button onClick={() => setTab('skills')} className={`px-4 py-2 rounded ${tab === 'skills' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Skill Review</button>
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>User Management</button>
        <button onClick={() => setTab('swaps')} className={`px-4 py-2 rounded ${tab === 'swaps' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Swap Monitoring</button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {tab === 'skills' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Skills</h2>
          {loading ? <div>Loading...</div> : (
            <div className="space-y-4">
              {skills.map(skill => (
                <div key={skill.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-blue-700">{skill.title}</div>
                    <div className="text-gray-600">{skill.description}</div>
                    <div className="text-xs text-gray-500">By User ID: {skill.user_id}</div>
                  </div>
                  <button onClick={() => handleRejectSkill(skill.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Reject</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === 'users' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          {loading ? <div>Loading...</div> : (
            <div className="space-y-4">
              {users.map(u => (
                <div key={u.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-blue-700">{u.first_name} {u.last_name} ({u.username})</div>
                    <div className="text-gray-600">Email: {u.email}</div>
                    <div className="text-xs text-gray-500">ID: {u.id} | Banned: {u.banned ? 'Yes' : 'No'} | Admin: {u.is_admin ? 'Yes' : 'No'}</div>
                  </div>
                  {u.banned ? (
                    <button onClick={() => handleUnbanUser(u.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Unban</button>
                  ) : (
                    <button onClick={() => handleBanUser(u.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Ban</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === 'swaps' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Swap Requests</h2>
          {loading ? <div>Loading...</div> : (
            <div className="space-y-4">
              {swaps.map(swap => (
                <div key={swap.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="font-bold text-blue-700">Swap ID: {swap.id}</div>
                    <div className="text-gray-600">Skill ID: {swap.skill_id} | From User: {swap.from_user_id} | To User: {swap.to_user_id}</div>
                    <div className="text-xs text-gray-500">Status: {swap.status} | Created: {swap.created_at}</div>
                    {swap.feedback && <div className="text-green-700 mt-1">Feedback: {swap.feedback} (Rating: {swap.rating})</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 