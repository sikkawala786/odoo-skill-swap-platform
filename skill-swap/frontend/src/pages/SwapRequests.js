import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SwapRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({});
  const [rating, setRating] = useState({});
  const [showFeedbackId, setShowFeedbackId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/swap-requests');
      setRequests(res.data);
    } catch (err) {
      setError('Failed to load swap requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.post(`/api/swap-requests/${id}/${action}`);
      fetchRequests();
    } catch (err) {
      setError('Action failed.');
    }
  };

  const handleFeedback = async (id) => {
    try {
      await axios.post(`/api/swap-requests/${id}/feedback`, {
        feedback: feedback[id] || '',
        rating: rating[id] || 0,
      });
      fetchRequests();
    } catch (err) {
      setError('Failed to submit feedback.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading swap requests...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  // Separate requests by status
  const pending = requests.filter(r => r.status === 'pending');
  const accepted = requests.filter(r => r.status === 'accepted');
  const completed = requests.filter(r => r.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Swap Requests</h1>
      <div>
        <h2 className="text-xl font-semibold mb-4">Current (Accepted) Requests</h2>
        {accepted.length === 0 ? (
          <div className="text-gray-500 text-center">No accepted requests.</div>
        ) : (
          <div className="space-y-6">
            {accepted.map((req) => (
              <div key={req.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-lg mb-1">{req.skill?.title || 'Skill'}</div>
                  <div className="text-gray-600 mb-2">
                    With: <span className="font-medium">{req.from_user?.first_name} {req.from_user?.last_name}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">Status: {req.status}</div>
                </div>
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 mt-4 md:mt-0">
                  <button onClick={() => setShowFeedbackId(req.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Mark as Completed</button>
                  <button onClick={() => handleAction(req.id, 'reject')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Reject</button>
                </div>
                {showFeedbackId === req.id && (
                  <div className="flex flex-col space-y-2 mt-4">
                    <textarea
                      className="border rounded p-2"
                      placeholder="Leave feedback..."
                      value={feedback[req.id] || ''}
                      onChange={e => setFeedback({ ...feedback, [req.id]: e.target.value })}
                    />
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="border rounded p-2 w-24"
                      placeholder="Rating (1-5)"
                      value={rating[req.id] || ''}
                      onChange={e => setRating({ ...rating, [req.id]: e.target.value })}
                    />
                    <button onClick={() => handleFeedback(req.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Submit Feedback & Complete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SwapRequests; 