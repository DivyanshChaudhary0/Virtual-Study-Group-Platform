
import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GroupList from '../components/GroupList';
import CreateGroupForm from '../components/CreateGroupForm';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGroupCreated = useCallback(() => {
    setShowCreateForm(false);
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };


  const handleGroupClick = useCallback((groupId) => {
    if (user) {
      navigate(`/groups/${groupId}`);
    } else {
      setShowLoginModal(true);
    }
  }, [user, navigate]);

  if (authLoading) {
      return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4"> {/* Added flex-wrap and gap */}
        <h1 className="text-3xl font-bold text-gray-800">
          Study Groups
        </h1>
        {/* Conditional Buttons */}
        {user ? (
           <button
             onClick={toggleCreateForm}
             className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out order-first sm:order-last" // Responsive order
           >
             {showCreateForm ? 'Cancel Creation' : '+ Create Group'}
           </button>
        ) : (
          <div className="flex space-x-3 order-first sm:order-last"> {/* Responsive order */}
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Login
            </Link>
             <Link
              to="/register"
              className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Conditionally render Create Group Form (only if logged in) */}
      {user && (
         <div
           className={`transition-all duration-500 ease-in-out overflow-hidden ${
               showCreateForm ? 'max-h-screen opacity-100 mt-4 mb-6' : 'max-h-0 opacity-0'
           }`}
         >
           {showCreateForm && (
             <CreateGroupForm
               onGroupCreated={handleGroupCreated}
               onClose={() => setShowCreateForm(false)}
             />
           )}
         </div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* Pass the click handler to GroupList */}
      <GroupList key={refreshKey} onGroupClick={handleGroupClick} />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default HomePage;