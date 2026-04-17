import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import AppNavbar from '../components/Navbar';
import api from '../services/api';

export default function Profile() {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', address: ''
  });
  const [placeholders, setPlaceholders] = useState({
    user_id: 'Loading...', first_name: 'Loading...', last_name: 'Loading...', address: 'Loading...', phone_number: 'Loading...'
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.status === 'SUCCESS') {
          const user = res.data.result;
          setPlaceholders({
            user_id: user.user_id,
            phone_number: user.phone_number,
            first_name: user.first_name,
            last_name: user.last_name,
            address: user.address,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/profile', formData);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      setPlaceholders({
        user_id: placeholders.user_id,
        phone_number: placeholders.phone_number,
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
      });
      setFormData({first_name: '', last_name: '', address: ''});
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <AppNavbar />
      <div className="p-6 max-w-2xl mx-auto w-full mt-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Update Profile</h1>
        
        {showToast && (
          <div className="mb-4 flex items-center w-full max-w-full p-4 space-x-3 text-green-800 bg-green-50 rounded-lg border border-green-200 shadow-sm transition-opacity">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
              <Check className="w-5 h-5" />
            </div>
            <div className="ml-3 text-sm font-medium">Profile updated successfully.</div>
            <button type="button" onClick={() => setShowToast(false)} className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8">
              <span className="sr-only">Close</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="user_id" className="block mb-2 text-sm font-semibold text-gray-700">Account User ID</label>
                <input readOnly value={placeholders.user_id !== 'Loading...' ? placeholders.user_id : ''} placeholder={placeholders.user_id} id="user_id" name="user_id" className="bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-500 font-mono text-sm rounded-lg block w-full p-3 transition-colors outline-none"/>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="phone_number" className="block mb-2 text-sm font-semibold text-gray-700">Phone Number</label>
                <input readOnly value={placeholders.phone_number !== 'Loading...' ? placeholders.phone_number : ''} placeholder={placeholders.phone_number} id="phone_number" name="phone_number" className="bg-gray-100 cursor-not-allowed border border-gray-300 text-gray-500 font-mono text-sm rounded-lg block w-full p-3 transition-colors outline-none"/>
              </div>
              <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-semibold text-gray-700">First Name</label>
                <input placeholder={placeholders.first_name} id="first_name" name="first_name" required value={formData.first_name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"/>
              </div>
              <div>
                <label htmlFor="last_name" className="block mb-2 text-sm font-semibold text-gray-700">Last Name</label>
                <input placeholder={placeholders.last_name} id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"/>
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block mb-2 text-sm font-semibold text-gray-700">Address</label>
              <textarea placeholder={placeholders.address} id="address" name="address" required rows={3} value={formData.address} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"/>
            </div>
            <button type="submit" disabled={loading} className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-3 text-center shadow-md transition duration-200">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
