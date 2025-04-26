
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (result) {
            navigate('/');
        } else {
            setError(result.message || 'Failed to log in');
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-md">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Login</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-6">
                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button type="submit" disabled={loading}
                    className={`w-full px-4 py-2 rounded-md text-white font-bold ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                 <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;