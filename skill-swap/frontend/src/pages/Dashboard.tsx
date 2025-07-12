import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ skills: 0, swaps: 0, feedback: 0 });
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentSwaps();
    fetchMessages();
  }, []);

  const fetchStats = async () => {
    try {
      const [skillsRes, swapsRes] = await Promise.all([
        axios.get('/api/skills'),
        axios.get('/api/swap-requests'),
      ]);
      const mySkills = skillsRes.data.filter(s => s.user && s.user.id === user?.id);
      const mySwaps = swapsRes.data.filter(s => s.from_user_id === user?.id || s.to_user_id === user?.id);
      const myFeedback = mySwaps.filter(s => s.feedback).length;
      setStats({ skills: mySkills.length, swaps: mySwaps.length, feedback: myFeedback });
    } catch (err) {
      setStats({ skills: 0, swaps: 0, feedback: 0 });
    }
  };

  const fetchRecentSwaps = async () => {
    try {
      const res = await axios.get('/api/swap-requests');
      const mySwaps = res.data.filter(s => s.from_user_id === user?.id || s.to_user_id === user?.id);
      setRecentSwaps(mySwaps.slice(-5).reverse());
    } catch (err) {
      setRecentSwaps([]);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/messages');
      setMessages(res.data.slice(-3).reverse());
    } catch (err) {
      setMessages([]);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome, {user.first_name}!</h1>
        <p className="text-gray-600 mb-8">Here’s a snapshot of your activity and platform updates.</p>

        {/* Platform-wide messages */}
        {messages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Platform Announcements</h2>
            <div className="space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className="bg-blue-50 border-l-4 border-blue-400 p-2 text-blue-800 text-sm">
                  <span className="font-semibold">[{new Date(msg.created_at).toLocaleString()}]</span> {msg.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-4xl text-blue-600 font-bold mb-2">{stats.skills}</div>
            <div className="text-gray-700 font-semibold">Your Skills</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-4xl text-green-600 font-bold mb-2">{stats.swaps}</div>
            <div className="text-gray-700 font-semibold">Total Swaps</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-4xl text-yellow-500 font-bold mb-2">{stats.feedback}</div>
            <div className="text-gray-700 font-semibold">Feedback Received</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Recent Swaps</h2>
          {recentSwaps.length === 0 ? (
            <div className="text-gray-500">No recent swaps yet.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentSwaps.map(swap => (
                <div key={swap.id} className="py-3 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <span className="font-semibold text-blue-700">{swap.skill?.title || 'Skill'}</span> with <span className="font-semibold">User {swap.from_user_id === user.id ? swap.to_user_id : swap.from_user_id}</span>
                    <span className="ml-2 text-xs text-gray-500">({swap.status})</span>
                  </div>
                  {swap.feedback && (
                    <div className="text-yellow-600 text-sm mt-1 md:mt-0">Feedback: {swap.feedback} (Rating: {swap.rating})</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 