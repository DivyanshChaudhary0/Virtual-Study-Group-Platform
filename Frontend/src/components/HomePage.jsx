
import React, { useState, useCallback } from 'react';
import GroupList from '../components/GroupList';
import CreateGroupForm from '../components/CreateGroupForm';


function HomePage() {

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGroupCreated = useCallback((newGroup) => {
    console.log('Group created:', newGroup);
    setShowCreateForm(false);
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
   
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Study Groups
        </h1>
        <button
          onClick={toggleCreateForm}
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
        >
          {showCreateForm ? 'Cancel' : '+ Create Group'}
        </button>
      </div>

      <div
         className={`transition-all duration-500 ease-in-out overflow-hidden ${
             showCreateForm ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
         }`}

      >
         {showCreateForm && (
           <CreateGroupForm
             onGroupCreated={handleGroupCreated}
             onClose={() => setShowCreateForm(false)}
           />
         )}
      </div>


      <hr className="my-6 border-gray-200" />

      <GroupList key={refreshKey} />
    </div>
  );
}

export default HomePage;