import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { phone_number: phoneNumber, pin });
      if (res.data.status === 'SUCCESS') {
        localStorage.setItem('access_token', res.data.result.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-50">
      <div className="flex items-center mb-6 text-2xl font-bold text-gray-900">
        <ShieldCheck className="w-8 h-8 mr-2 text-blue-600" />
        TechTest Pay
      </div>
      <div className="w-full bg-white rounded-xl shadow-md max-w-md sm:p-8 border border-gray-100">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-6">
          Sign in to your account
        </h1>
        {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">{error}</div>}
        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
            <input
              id="phone"
              type="text"
              placeholder="08123456789"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="pin" className="block mb-2 text-sm font-medium text-gray-900">PIN (6 digits)</label>
            <input
              id="pin"
              type="password"
              placeholder="••••••"
              required
              maxLength={6}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition">
            Sign in
          </button>
          <p className="text-sm font-light text-gray-500 mt-4">
            Don't have an account yet? <Link to="/register" className="font-medium text-blue-600 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
