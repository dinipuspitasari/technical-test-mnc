export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-8 text-gray-500 font-medium">No transactions found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Type</th>
            <th scope="col" className="px-6 py-3">Amount</th>
            <th scope="col" className="px-6 py-3">Remarks</th>
            <th scope="col" className="px-6 py-3">Balance Before</th>
            <th scope="col" className="px-6 py-3">Balance After</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.transaction_id} className="bg-white border-b hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tx.created_date}</td>
              <td className="px-6 py-4 text-xs font-mono tracking-wider">{tx.transaction_id.substring(0,8)}...</td>
              <td className="px-6 py-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded inline-block uppercase tracking-wide ${tx.transaction_type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {tx.transaction_type}
                </span>
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900">Rp {tx.amount.toLocaleString()}</td>
              <td className="px-6 py-4">{tx.remarks || '-'}</td>
              <td className="px-6 py-4 text-gray-600">Rp {tx.balance_before.toLocaleString()}</td>
              <td className="px-6 py-4 font-bold text-gray-900">Rp {tx.balance_after.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
