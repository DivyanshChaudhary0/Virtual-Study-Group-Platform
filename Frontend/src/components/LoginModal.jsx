
import React from 'react';
import { Link } from 'react-router-dom';

function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Login Required</h2>
                <p className="text-gray-600 mb-6">
                    Please log in or register to view group details and interact.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                    >
                        Close
                    </button>
                    <Link
                        to="/login"
                        onClick={onClose} // Close modal when navigating
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;