// src/pages/GroupDetailPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';


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
  const { user, token, loading: authLoading } = useAuth();

  console.log(token);
  

  // --- Page Data State ---
  const [groupInfo, setGroupInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Page loading state
  const [error, setError] = useState(null);

  // --- Form States ---
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState(''); 

  // Removed postAuthor state
  const [postText, setPostText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState('');

  // --- Derived State ---
  // Check if the logged-in user is a member (using useMemo for efficiency)
  const isMember = useMemo(() => {
    if (!user || !groupInfo?.members) return false;
    // IMPORTANT: Assumes you store member NAMES in the array as per previous logic.
    // If you store user IDs instead, change this to: groupInfo.members.includes(user._id)
    return groupInfo?.members?.includes(user?.name);
  }, [user, groupInfo]);

  // --- Fetch Group Details ---
  const fetchGroupDetails = useCallback(async () => {
    setError(null);
    try {
      // No token needed usually to fetch basic group info
      const response = await axios.get(`${BASE_URL}/api/groups/${groupId}`);

      if (response.data?.success) {
        setGroupInfo(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch group details');
      }
    } catch (err) {
      console.error("Error fetching group details:", err);
      setError(err.response?.data?.message || err.message || 'Error fetching group data.');
      setGroupInfo(null);
    }
  }, [groupId]);

  // --- Fetch Posts (Only if user is a member and token exists) ---
  const fetchPosts = useCallback(async () => {
    if (!isMember || !token) {
        setPosts([]);
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/groups/${groupId}/posts`,{
          headers: {Authorization: `bearer ${localStorage.getItem("authToken")}`}
        });

        console.log(response);

        if (response.data) {
            setPosts(response.data.posts);
        } else {
            console.error("Failed to fetch posts:", response.data?.message);
            setPosts([]);
        }
    } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
        setPostError(err.response?.data?.message || 'Error fetching posts');
    }
  }, [groupId, isMember, token]);

  // --- Initial Data Load Effect ---
  useEffect(() => {
      const loadInitialData = async () => {
          setLoading(true);
          await fetchGroupDetails();
          setLoading(false);
      };
      if (!authLoading) {
         loadInitialData();
      }
  }, [fetchGroupDetails, authLoading]);


   useEffect(() => {
       if (groupInfo && !authLoading) {
           fetchPosts();
       }
       if (!user) {
           setPosts([]);
       }
   }, [groupInfo, fetchPosts, authLoading, user]);


  // --- Handler Functions ---

  // Handle Joining Group (Uses logged-in user info)
  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!user || !token) {
        setJoinError("You must be logged in to join.");
        return;
    }
    setJoinLoading(true); setJoinError('');
    try {
        const response = await axios.post(`${BASE_URL}/api/groups/${groupId}/join`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data) {
            setGroupInfo(response.data.data);
           
        } else {
            setJoinError(response.data?.message || 'Failed to join group.');
        }
    } catch (err) {
        console.error("Join group error:", err);
        setJoinError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
        setJoinLoading(false);
    }
  };

  // Handle Creating Post (Uses logged-in user info)
  const handleCreatePost = async (e) => {
    e.preventDefault();
     if (!isMember) { // Double check authorization
       setPostError("Only members can post messages.");
       return;
    }
    if (!postText.trim()) {
      setPostError('Please enter your message.');
      return;
    }
    if (!token) {
        setPostError('Authentication error. Please log in again.');
        return;
    }
    setPostLoading(true); setPostError('');
    try {
      const response = await axios.post(`${BASE_URL}/api/groups/${groupId}/posts`,
        { text: postText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      

      if (response.data) {
        setPostText('');
        setPosts(prevPosts => [response.data.post, ...prevPosts]);
      } else {
        setPostError(response.data?.message || 'Failed to create post.');
      }
    } catch (err) {
        console.error("Create post error:", err);
        setPostError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setPostLoading(false);
    }
  };


  // --- Render Logic ---

  // Handle Auth/Page Loading State First
  if (authLoading || loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        </div>
      );
  }

  // Handle Page Load Error or Group Not Found
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

  // --- Main Content Render ---
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Link */}
       <Link to="/" className="text-blue-600 hover:text-blue-800 inline-block mb-6">
          ← Back to All Groups
        </Link>

      {/* Group Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-1">{groupInfo?.name}</h1>
        <p className="text-xl text-blue-100">{groupInfo?.subject}</p>
        {groupInfo.description && <p className="mt-2 text-blue-50">{groupInfo?.description}</p>}
        <p className="text-sm text-blue-200 mt-3">Created: {formatDate(groupInfo?.createdAt)}</p>
        {/* Optionally display creator if available: */}
        {groupInfo?.createdBy && <p className="text-xs text-blue-300 mt-1">Creator ID: {groupInfo.createdBy}</p>}
      </div>

      {/* Main Content Grid (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Column (Members & Join Button/Status) */}
        <div className="md:col-span-1 space-y-6">
            {/* --- Members Section --- */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Members ({groupInfo.members?.length || 0})</h2>
                {groupInfo.members && groupInfo.members.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {groupInfo?.members.map((member, index) => (
                    <li key={index} className="bg-gray-100 px-3 py-1.5 rounded text-gray-800 text-sm truncate">
                        {member} {/* Assumes names are stored */}
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-sm text-gray-500 italic">No members have joined yet.</p>
                )}
            </div>

            {/* --- Join Group Button / Status --- */}
            {/* Show Login prompt if not logged in */}
            {!user && (
                 <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm px-4 py-3 rounded-lg shadow-md" role="alert">
                    <p><Link to="/login" className="font-bold hover:underline">Login</Link> or <Link to="/register" className="font-bold hover:underline">Register</Link> to join this group.</p>
                </div>
            )}

            {/* Show Join Button if logged in AND not a member */}
            {user && !isMember && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Become a Member</h3>
                    {joinError && <p className="text-red-500 text-xs italic mb-2">{joinError}</p>}
                    <button
                        onClick={handleJoinGroup}
                        disabled={joinLoading}
                        className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        joinLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {joinLoading ? 'Joining...' : 'Join this Group'}
                    </button>
                </div>
            )}

            {/* Show "You are a member" message if logged in AND a member */}
            {user && isMember && (
                <div className="bg-green-100 border border-green-300 text-green-800 text-sm px-4 py-3 rounded-lg shadow-md" role="alert">
                    <p><span className="font-bold">✓ You are a member</span> of this group.</p>
                </div>
            )}
        </div>


        {/* Right Column (Posts & Create Post Form - Conditional) */}
        <div className="md:col-span-2 space-y-6">
            {/* Conditionally Render based on Membership AND Login Status */}
            {user && isMember ? (
                <> {/* Use Fragment to group multiple elements */}
                    {/* --- Create Post Form Section --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Post a Message</h2>
                        <form onSubmit={handleCreatePost}>
                            {postError && <p className="text-red-500 text-xs italic mb-2">{postError}</p>}
                            <div className="mb-3">
                                {/* Removed Author Input */}
                                <label htmlFor="postText" className="sr-only">Message</label>
                                <textarea
                                    id="postText"
                                    rows="4"
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                    placeholder={`Posting as ${user.name}... Type your message here.`}
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

                    {/* --- Posts List Section --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Group Feed</h2>
                        {posts?.length > 0 ? (
                        <ul className="space-y-4">
                            {posts.map((post) => (
                            <li key={post?._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <p className="text-gray-800 mb-1">{post?.text}</p>
                                <div className="text-xs text-gray-500">
                                Posted by <strong className="font-medium text-gray-600">{post?.authorName}</strong> on {formatDate(post?.createdAt)}
                                </div>
                            </li>
                            ))}
                        </ul>
                        ) : (
                        <p className="text-sm text-gray-500 italic">No posts found for this group.</p>
                        )}
                    </div>
                </>
            ) : (
                 // --- Message shown to non-members or logged-out users ---
                 // Only show this specific message if the user is logged in but NOT a member
                 user && !isMember && (
                    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm px-4 py-3 rounded-lg shadow-md" role="alert">
                        <p><span className="font-bold">Join the group</span> to view and create posts.</p>
                    </div>
                 )
                 // If user is not logged in, the join prompt on the left covers it.
                 // No specific message needed here unless you want redundancy.
            )}
        </div>
      </div>
    </div>
  );
}

export default GroupDetailPage;