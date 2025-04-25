
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // --- Page Data State ---
  const [groupInfo, setGroupInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Form States ---
  const [memberName, setMemberName] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  const [postAuthor, setPostAuthor] = useState('');
  const [postText, setPostText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState('');

  // --- Fetch Group Details and Posts ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const [groupResponse, postsResponse] = await Promise.all([
        axios.get(BASE_URL + `/api/groups/${groupId}`),
        axios.get(BASE_URL + `/api/groups/${groupId}/posts`)
      ]);

      if (groupResponse.data) {
        setGroupInfo(groupResponse.data.data);
      } else {
        throw new Error(groupResponse.data?.message || 'Failed to fetch group details');
      }

      if (postsResponse.data) {
        setPosts(postsResponse.data.posts);
      } else {
        console.error("Failed to fetch posts:", postsResponse.data?.message);
        setPosts([]); 
      }

    } catch (err) {
      console.error("Error fetching group page data:", err);
      setError(err.message || 'An error occurred while fetching group data.');
      setGroupInfo(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!memberName.trim()) {
      setJoinError('Please enter your name.');
      return;
    }
    setJoinLoading(true);
    setJoinError('');

    try {
      const response = await axios.post(BASE_URL + `/api/groups/${groupId}/join`, { memberName });
      if (response.data?.success) {
        setMemberName('');
        setGroupInfo(response.data.data);
      } else {
        setJoinError(response.data?.message || 'Failed to join group.');
      }
    } catch (err) {
      setJoinError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postAuthor.trim() || !postText.trim()) {
      setPostError('Please enter your name and post text.');
      return;
    }
    setPostLoading(true);
    setPostError('');

    try {
      const response = await axios.post(BASE_URL + `/api/groups/${groupId}/posts`, {
        authorName: postAuthor,
        text: postText,
      });

      if (response.data) {
        setPostAuthor('');
        setPostText('');
        setPosts(prevPosts => [response.data.post, ...prevPosts]);
      } else {
        setPostError(response.data?.message || 'Failed to create post.');
      }
    } catch (err) {
      setPostError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setPostLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !groupInfo) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Group not found.'}</span>
        </div>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Groups List
        </Link>
      </div>
    );
  }

  // Main Content Render
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Link */}
       <Link to="/" className="text-blue-600 hover:text-blue-800 inline-block mb-6">
          ← Back to All Groups
        </Link>

      {/* Group Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-1">{groupInfo.name}</h1>
        <p className="text-xl text-blue-100">{groupInfo.subject}</p>
        {groupInfo.description && <p className="mt-2 text-blue-50">{groupInfo.description}</p>}
        <p className="text-sm text-blue-200 mt-3">Created: {formatDate(groupInfo.createdAt)}</p>
      </div>

      {/* Main Content Grid (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Column (Members & Join Form) */}
        <div className="md:col-span-1 space-y-6">

          {/* Members Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Members ({groupInfo.members?.length || 0})</h2>
            {groupInfo.members && groupInfo.members.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2"> {/* Added scroll */}
                {groupInfo.members.map((member, index) => (
                  <li key={index} className="bg-gray-100 px-3 py-1.5 rounded text-gray-800 text-sm truncate">
                    {member}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No members have joined yet.</p>
            )}
          </div>

          {/* Join Group Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Join this Group</h3>
            <form onSubmit={handleJoinGroup}>
              {joinError && (
                <p className="text-red-500 text-xs italic mb-2">{joinError}</p>
              )}
              <div className="mb-3">
                <label htmlFor="memberName" className="sr-only">Your Name</label>
                <input
                  type="text"
                  id="memberName"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Enter your name to join"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={joinLoading}
                />
              </div>
              <button
                type="submit"
                disabled={joinLoading}
                className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  joinLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {joinLoading ? 'Joining...' : 'Join Group'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (Posts & Create Post Form) */}
        <div className="md:col-span-2 space-y-6">

           <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Post a Message</h2>
             <form onSubmit={handleCreatePost}>
               {postError && (
                 <p className="text-red-500 text-xs italic mb-2">{postError}</p>
               )}
               <div className="mb-3">
                 <label htmlFor="postAuthor" className="sr-only">Your Name</label>
                 <input
                   type="text"
                   id="postAuthor"
                   value={postAuthor}
                   onChange={(e) => setPostAuthor(e.target.value)}
                   placeholder="Your Name"
                   required
                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
                   disabled={postLoading}
                 />
                 <label htmlFor="postText" className="sr-only">Message</label>
                  <textarea
                    id="postText"
                    rows="4"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Type your message here..."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={postLoading}
                  />
               </div>
                <button
                  type="submit"
                  disabled={postLoading}
                  className={`w-full sm:w-auto float-right px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    postLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {postLoading ? 'Posting...' : 'Post Message'}
                </button>
                <div className="clear-both"></div>
             </form>
           </div>

          {/* Posts List Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Group Feed</h2>
            {posts.length > 0 ? (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <p className="text-gray-800 mb-1">{post.text}</p>
                    <div className="text-xs text-gray-500">
                      Posted by <strong className="font-medium text-gray-600">{post.authorName}</strong> on {formatDate(post.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No posts have been made in this group yet.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default GroupDetailPage;