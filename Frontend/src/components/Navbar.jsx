
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
                    StudyGroups
                </Link>

                
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-gray-700 text-sm hidden sm:inline">Welcome, {user.name}!</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Login</Link>
                            <Link to="/register" className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;