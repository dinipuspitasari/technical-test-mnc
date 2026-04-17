import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Send, CreditCard, X } from 'lucide-react';
import api from '../services/api';
import AppNavbar from '../components/Navbar';
import TransactionTable from '../components/TransactionTable';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  const [topupModal, setTopupModal] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [targetUser, setTargetUser] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data.result || []);
      if (res.data.result && res.data.result.length > 0) {
        setBalance(res.data.result[0].balance_after);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const initData = async () => {
      await fetchTransactions();
    };
    initData();
  }, [fetchTransactions]);

  const handleTopup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/topup', { amount: parseInt(amount) });
      setTopupModal(false);
      fetchTransactions();
      setAmount('');
    } catch (err) { alert('Topup Failed: ' + (err.response?.data?.message || err.message)); }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pay', { amount: parseInt(amount), remarks });
      setPayModal(false);
      fetchTransactions();
      setAmount(''); setRemarks('');
    } catch (err) { alert('Payment Failed: ' + (err.response?.data?.message || err.message)); }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transfer', { target_user: targetUser, amount: parseInt(amount), remarks });
      setTransferModal(false);
      fetchTransactions();
      setAmount(''); setRemarks(''); setTargetUser('');
    } catch (err) { alert('Transfer Failed: ' + (err.response?.data?.message || err.message)); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <AppNavbar />
      <div className="p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg relative p-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
               <CreditCard className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h5 className="text-sm font-medium text-blue-100 uppercase tracking-wider mb-2">Available Balance</h5>
              <div className="text-4xl font-bold tracking-tight">Rp {balance.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
            <div className="h-full rounded-2xl hover:-translate-y-1 hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center p-4 border-t-4 border-green-500 bg-white shadow-sm" onClick={() => setTopupModal(true)}>
              <PlusCircle className="w-12 h-12 text-green-500 mb-3" />
              <h5 className="font-bold text-gray-800">Top Up</h5>
              <p className="text-xs text-gray-500 mt-1">Add funds easily</p>
            </div>
            <div className="h-full rounded-2xl hover:-translate-y-1 hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center p-4 border-t-4 border-yellow-400 bg-white shadow-sm" onClick={() => setPayModal(true)}>
              <CreditCard className="w-12 h-12 text-yellow-500 mb-3" />
              <h5 className="font-bold text-gray-800">Payment</h5>
              <p className="text-xs text-gray-500 mt-1">Pay for goods</p>
            </div>
            <div className="h-full rounded-2xl hover:-translate-y-1 hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center p-4 border-t-4 border-purple-500 bg-white shadow-sm" onClick={() => setTransferModal(true)}>
              <Send className="w-12 h-12 text-purple-600 mb-3" />
              <h5 className="font-bold text-gray-800">Transfer</h5>
              <p className="text-xs text-gray-500 mt-1">Send to friends</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h5 className="text-xl font-bold tracking-tight text-gray-900">Transaction History</h5>
          </div>
          <div className="p-0">
            <TransactionTable transactions={transactions} />
          </div>
        </div>

        {/* Topup Modal */}
        {topupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative transform transition-all">
              <button onClick={() => setTopupModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X className="w-5 h-5"/></button>
              <div className="p-8">
                <div className="text-center mb-6">
                  <PlusCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                  <h3 className="mb-2 text-xl font-bold text-gray-800">Top Up Balance</h3>
                </div>
                <form onSubmit={handleTopup} className="space-y-5">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Amount (Rp)</label>
                    <input type="number" required placeholder="50000" min="1000" value={amount} onChange={e => setAmount(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"/>
                  </div>
                  <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition">Process Top Up</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {payModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative transform transition-all">
              <button onClick={() => setPayModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X className="w-5 h-5"/></button>
              <div className="p-8">
                <div className="text-center mb-6">
                  <CreditCard className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                  <h3 className="mb-2 text-xl font-bold text-gray-800">Make a Payment</h3>
                </div>
                <form onSubmit={handlePayment} className="space-y-5">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Amount (Rp)</label>
                    <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-3"/>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Remarks</label>
                    <input type="text" required placeholder="Electricity Bill" value={remarks} onChange={e => setRemarks(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-3"/>
                  </div>
                  <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition">Confirm Payment</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {transferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative transform transition-all">
              <button onClick={() => setTransferModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X className="w-5 h-5"/></button>
              <div className="p-8">
                <div className="text-center mb-6">
                  <Send className="mx-auto mb-4 h-12 w-12 text-purple-600" />
                  <h3 className="mb-2 text-xl font-bold text-gray-800">Transfer Funds</h3>
                </div>
                <form onSubmit={handleTransfer} className="space-y-5">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Target User ID</label>
                    <input type="text" required placeholder="User UUID" value={targetUser} onChange={e => setTargetUser(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"/>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Amount (Rp)</label>
                    <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"/>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Remarks</label>
                    <input type="text" required placeholder="Food" value={remarks} onChange={e => setRemarks(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"/>
                  </div>
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition">Send Transfer</button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
