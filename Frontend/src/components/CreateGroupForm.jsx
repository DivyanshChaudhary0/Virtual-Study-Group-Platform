
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

function CreateGroupForm({ onGroupCreated, onClose }) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !subject.trim()) {
      setError('Group Name and Subject are required.');
      return;
    }

    setLoading(true);

    try {
      const groupData = { name, subject, description };
      const response = await axios.post( BASE_URL + '/api/groups', groupData);

      if (response.data && response.data.success) {
        onGroupCreated(response.data.data);
        setName('');
        setSubject('');
        setDescription('');
        onClose();
      } else {
        setError(response.data.message || 'Failed to create group.');
      }
    } catch (err) {
      console.error("Error creating group:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added transition for smooth appearance
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-all duration-300 ease-out">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Create a New Study Group</h3>
      <form onSubmit={handleSubmit}>
        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="groupName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., MERN Hackers"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
        </div>

        {/* Subject Input */}
        <div className="mb-4">
          <label htmlFor="groupSubject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="groupSubject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Web Development"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="groupDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Briefly describe the group's focus..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroupForm;