'use client';

import { useState } from 'react';

export default function RewardsPage() {
  const [active, setActive] = useState(true);

  const mockConfig = {
    rewardTitle: 'Cafe gratis',
    rewardDescription: 'Disfruta un cafe gratis en tu proxima visita como agradecimiento por tu resena',
    delayMinutes: 15,
    channel: 'whatsapp',
    expirationDays: 14,
    maxPerMonth: null,
  };

  const mockStats = {
    total: 38,
    sent: 30,
    redeemed: 18,
    pending: 8,
    redemptionRate: 60,
  };

  const mockCoupons = [
    { code: 'LR-A3K9F2XB', status: 'redeemed', contact: 'Maria Garcia', sentAt: 'Hace 2 dias', redeemedAt: 'Ayer' },
    { code: 'LR-J7MK2P4S', status: 'sent', contact: 'Carlos Rodriguez', sentAt: 'Hace 1 dia', redeemedAt: null },
    { code: 'LR-N4WD8R1T', status: 'redeemed', contact: 'Pedro Lopez', sentAt: 'Hace 3 dias', redeemedAt: 'Hace 2 dias' },
    { code: 'LR-Q2LP5V7Y', status: 'pending', contact: 'Sofia Ramirez', sentAt: 'En 10 min', redeemedAt: null },
    { code: 'LR-H8FX3M6B', status: 'expired', contact: 'Diego Torres', sentAt: 'Hace 20 dias', redeemedAt: null },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cupones de Recompensa</h1>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full"></div>
          <span className="ml-2 text-sm text-gray-600">{active ? 'Activo' : 'Pausado'}</span>
        </label>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{mockStats.total}</p>
          <p className="text-xs text-gray-600">Total generados</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{mockStats.sent}</p>
          <p className="text-xs text-gray-600">Enviados</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{mockStats.redeemed}</p>
          <p className="text-xs text-gray-600">Canjeados</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-orange-600">{mockStats.pending}</p>
          <p className="text-xs text-gray-600">Pendientes</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-purple-600">{mockStats.redemptionRate}%</p>
          <p className="text-xs text-gray-600">Tasa de canje</p>
        </div>
      </div>

      {/* Config Card */}
      <div className="mb-6 rounded-lg border bg-blue-50 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">Recompensa configurada</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Recompensa</p>
            <p className="text-sm font-medium text-gray-900">🎁 {mockConfig.rewardTitle}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Se envia</p>
            <p className="text-sm font-medium text-gray-900">{mockConfig.delayMinutes} min despues de la resena</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Canal</p>
            <p className="text-sm font-medium text-gray-900">📱 WhatsApp</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Vigencia</p>
            <p className="text-sm font-medium text-gray-900">{mockConfig.expirationDays} dias</p>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-4">
          <h3 className="font-semibold text-gray-900">Cupones recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Codigo</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Enviado</th>
                <th className="px-4 py-3">Canjeado</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockCoupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <code className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono">{coupon.code}</code>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{coupon.contact}</td>
                  <td className="px-4 py-3 text-gray-600">{coupon.sentAt}</td>
                  <td className="px-4 py-3 text-gray-600">{coupon.redeemedAt || '-'}</td>
                  <td className="px-4 py-3">
                    <CouponStatus status={coupon.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CouponStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    sent: 'bg-blue-100 text-blue-700',
    redeemed: 'bg-green-100 text-green-700',
    expired: 'bg-gray-100 text-gray-600',
  };

  const labels: Record<string, string> = {
    pending: 'Pendiente',
    sent: 'Enviado',
    redeemed: 'Canjeado',
    expired: 'Expirado',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
