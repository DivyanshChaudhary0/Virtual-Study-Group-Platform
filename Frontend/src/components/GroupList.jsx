

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

function GroupList({key}) {
  
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(BASE_URL + '/api/groups');

        if (response.data && response.data.success) {
          setGroups(response.data.data);
        } else {
          setError('Failed to fetch groups: Invalid response structure.');
          console.error("Invalid response structure:", response.data);
        }

      } catch (err) {
        console.error("Error fetching groups:", err);
        setError(err.message || 'An error occurred while fetching groups.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();

  }, [key]);

  if (loading) {
    return <div>Loading groups...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="group-list container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Study Groups</h2>
      {groups.length === 0 ? (
        <p className="text-gray-600 italic">No study groups found. Why not create one?</p>
      ) : (
        
        <ul className="space-y-3">
          {groups?.map((group) => (
            
            <li
              key={group?._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200"
            >
             
              <Link
                to={`/groups/${group?._id}`}
                className="block text-blue-600 hover:text-blue-800"
              >
                <strong className="text-lg font-semibold">{group?.name}</strong>

                <span className="text-gray-600 ml-2">({group?.subject})</span>
              </Link>
              
              {group?.description && <p className="text-sm text-gray-500 mt-1">{group?.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GroupList;