'use client';

import { mockLocations } from '@/lib/mock-data';

export default function ComparePage() {
  const sedesData = [
    { ...mockLocations[0], nps: 75, responseRate: 45, ticketsOpen: 2, couponsRedeemed: 12, referrals: 8, googleRating: 4.6, totalContacts: 187 },
    { ...mockLocations[1], nps: 82, responseRate: 52, ticketsOpen: 1, couponsRedeemed: 8, referrals: 5, googleRating: 4.8, totalContacts: 94 },
  ];

  const metrics = [
    { key: 'feedbackCount', label: 'Total feedback', format: (v: number) => v.toString() },
    { key: 'averageRating', label: 'Rating promedio', format: (v: number) => v.toFixed(1) + ' ⭐' },
    { key: 'googleRating', label: 'Rating Google', format: (v: number) => v.toFixed(1) + ' ⭐' },
    { key: 'nps', label: 'NPS Score', format: (v: number) => v.toString() },
    { key: 'responseRate', label: 'Tasa respuesta', format: (v: number) => v + '%' },
    { key: 'ticketsOpen', label: 'Tickets abiertos', format: (v: number) => v.toString() },
    { key: 'couponsRedeemed', label: 'Cupones canjeados', format: (v: number) => v.toString() },
    { key: 'referrals', label: 'Referidos convertidos', format: (v: number) => v.toString() },
    { key: 'totalContacts', label: 'Total contactos', format: (v: number) => v.toString() },
  ];

  const getWinner = (key: string) => {
    const values = sedesData.map((s: any) => s[key]);
    if (key === 'ticketsOpen') return values[0] < values[1] ? 0 : values[1] < values[0] ? 1 : -1;
    return values[0] > values[1] ? 0 : values[1] > values[0] ? 1 : -1;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Comparar Sedes</h1>
        <p className="mt-1 text-sm text-gray-600">Compara el rendimiento entre tus ubicaciones</p>
      </div>

      {/* Comparison table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metrica</th>
              {sedesData.map((s) => (
                <th key={s.id} className="px-4 py-3 text-center text-sm font-semibold text-gray-900">{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {metrics.map((m) => {
              const winner = getWinner(m.key);
              return (
                <tr key={m.key} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{m.label}</td>
                  {sedesData.map((s: any, i) => (
                    <td key={s.id} className={`px-4 py-3 text-center text-sm font-medium ${winner === i ? 'text-green-700 bg-green-50' : 'text-gray-900'}`}>
                      {m.format(s[m.key])}
                      {winner === i && ' 🏆'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sedesData.map((s) => (
          <div key={s.id} className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{s.name}</h3>
            <p className="text-xs text-gray-500">{s.address}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-lg font-bold text-blue-600">{s.feedbackCount}</p><p className="text-xs text-gray-500">Feedback</p></div>
              <div><p className="text-lg font-bold text-green-600">{s.nps}</p><p className="text-xs text-gray-500">NPS</p></div>
              <div><p className="text-lg font-bold text-purple-600">{s.referrals}</p><p className="text-xs text-gray-500">Referidos</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
