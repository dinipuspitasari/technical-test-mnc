import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone_number: '', address: '', pin: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/register', formData);
      if (res.data.status === 'SUCCESS') {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-50">
      <div className="flex items-center mb-6 text-2xl font-bold text-gray-900">
        <ShieldCheck className="w-8 h-8 mr-2 text-blue-600" />
        TechTest Pay
      </div>
      <div className="w-full bg-white rounded-xl shadow-md max-w-md sm:p-8 border border-gray-100">
        <h1 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl mb-6">
          Create an account
        </h1>
        {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">{error}</div>}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
              <input id="first_name" name="first_name" required onChange={handleChange} placeholder='First' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"/>
            </div>
            <div className="flex-1">
              <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
              <input id="last_name" name="last_name" required onChange={handleChange} placeholder='Last' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"/>
            </div>
          </div>
          <div>
            <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
            <input id="phone_number" name="phone_number" type="text" required onChange={handleChange} placeholder='0895xxxx' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"/>
          </div>
          <div>
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
            <textarea id="address" name="address" required rows={2} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"/>
          </div>
          <div>
            <label htmlFor="pin" className="block mb-2 text-sm font-medium text-gray-900">PIN (6 digits)</label>
            <input id="pin" name="pin" type="password" required maxLength={6} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"/>
          </div>
          <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 transition">Register</button>
          <p className="text-sm font-light text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
