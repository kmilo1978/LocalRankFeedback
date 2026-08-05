'use client';

import { useState } from 'react';

export default function ReferralsPage() {
  const [programActive, setProgramActive] = useState(true);

  const mockStats = {
    totalLinks: 24,
    totalClicks: 87,
    totalConversions: 12,
    conversionRate: 14,
  };

  const mockLinks = [
    { id: '1', contact: 'Maria Garcia', code: 'ab3k9f2x', clicks: 15, conversions: 3, createdAt: 'Hace 5 dias', active: true },
    { id: '2', contact: 'Carlos Rodriguez', code: 'j7mk2p4s', clicks: 8, conversions: 2, createdAt: 'Hace 8 dias', active: true },
    { id: '3', contact: 'Pedro Lopez', code: 'n4wd8r1t', clicks: 22, conversions: 5, createdAt: 'Hace 12 dias', active: true },
    { id: '4', contact: 'Sofia Ramirez', code: 'q2lp5v7y', clicks: 4, conversions: 0, createdAt: 'Hace 15 dias', active: true },
    { id: '5', contact: 'Diego Torres', code: 'h8fx3m6b', clicks: 12, conversions: 2, createdAt: 'Hace 20 dias', active: false },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Programa de Referidos</h1>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={programActive}
            onChange={(e) => setProgramActive(e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full"></div>
          <span className="ml-2 text-sm text-gray-600">{programActive ? 'Activo' : 'Pausado'}</span>
        </label>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalLinks}</p>
          <p className="text-sm text-gray-600">Links generados</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalClicks}</p>
          <p className="text-sm text-gray-600">Clicks totales</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{mockStats.totalConversions}</p>
          <p className="text-sm text-gray-600">Conversiones</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{mockStats.conversionRate}%</p>
          <p className="text-sm text-gray-600">Tasa conversion</p>
        </div>
      </div>

      {/* Program Config */}
      <div className="mb-6 rounded-lg border bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">Configuracion del programa</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">Premio para quien refiere</p>
            <p className="text-sm font-medium text-gray-900">20% descuento proxima visita</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Premio para el referido</p>
            <p className="text-sm font-medium text-gray-900">15% descuento primera visita</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Invitacion enviada</p>
            <p className="text-sm font-medium text-gray-900">7 dias despues del feedback positivo</p>
          </div>
        </div>
      </div>

      {/* Referral Links Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-4">
          <h3 className="font-semibold text-gray-900">Links de referido activos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Referidor</th>
                <th className="px-4 py-3">Codigo</th>
                <th className="px-4 py-3">Clicks</th>
                <th className="px-4 py-3">Conversiones</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockLinks.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{link.contact}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-gray-100 px-2 py-0.5 text-xs">{link.code}</code>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{link.clicks}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-green-600">{link.conversions}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{link.createdAt}</td>
                  <td className="px-4 py-3">
                    {link.active ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Activo</span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Expirado</span>
                    )}
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
