'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const weeklyReport = {
    period: '29 Jul - 4 Ago 2026',
    totalFeedback: 73,
    avgRating: 4.3,
    googleReviews: 48,
    ticketsOpen: 3,
    ticketsResolved: 5,
    nps: 72,
    topPositive: 'atencion profesional',
    topNegative: 'tiempo de espera',
    couponsRedeemed: 12,
    referralsConverted: 4,
    ratingChange: +0.2,
    feedbackChange: +15,
  };

  const handleSendNow = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes Semanales</h1>
          <p className="mt-1 text-sm text-gray-600">Resumen automatico enviado cada lunes a las 9am</p>
        </div>
        <div className="flex gap-2">
          {sent && <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">Enviado!</span>}
          <button onClick={handleSendNow} disabled={sending} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {sending ? 'Enviando...' : '📧 Enviar ahora'}
          </button>
        </div>
      </div>

      {/* Report config */}
      <div className="mb-6 rounded-lg border bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Configuracion del reporte</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Enviar a</label>
            <input type="email" defaultValue="admin@clinicasonrisa.com" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Frecuencia</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option>Semanal (lunes 9am)</option>
              <option>Diario (8am)</option>
              <option>Quincenal</option>
              <option>Mensual</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Formato</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option>Email HTML</option>
              <option>PDF adjunto</option>
              <option>Ambos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report preview */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 text-white">
          <h2 className="text-lg font-bold">Reporte Semanal - Clinica Dental Sonrisa</h2>
          <p className="text-sm text-blue-100">{weeklyReport.period}</p>
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklyReport.totalFeedback}</p>
              <p className="text-xs text-gray-600">Feedback recibido</p>
              <p className="text-xs text-green-600">+{weeklyReport.feedbackChange} vs anterior</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklyReport.avgRating}</p>
              <p className="text-xs text-gray-600">Rating promedio</p>
              <p className="text-xs text-green-600">+{weeklyReport.ratingChange} vs anterior</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{weeklyReport.googleReviews}</p>
              <p className="text-xs text-gray-600">Dirigidos a Google</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{weeklyReport.nps}</p>
              <p className="text-xs text-gray-600">NPS Score</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">Lo mas mencionado positivo</p>
              <p className="mt-1 text-lg font-bold text-green-900">"{weeklyReport.topPositive}"</p>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-medium text-orange-800">Area de mejora detectada</p>
              <p className="mt-1 text-lg font-bold text-orange-900">"{weeklyReport.topNegative}"</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center"><p className="text-lg font-bold text-orange-600">{weeklyReport.ticketsOpen}</p><p className="text-xs text-gray-500">Tickets abiertos</p></div>
            <div className="text-center"><p className="text-lg font-bold text-green-600">{weeklyReport.ticketsResolved}</p><p className="text-xs text-gray-500">Tickets resueltos</p></div>
            <div className="text-center"><p className="text-lg font-bold text-purple-600">{weeklyReport.couponsRedeemed}</p><p className="text-xs text-gray-500">Cupones canjeados</p></div>
            <div className="text-center"><p className="text-lg font-bold text-blue-600">{weeklyReport.referralsConverted}</p><p className="text-xs text-gray-500">Referidos convertidos</p></div>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t pt-4 text-center text-xs text-gray-400">
            <p>Generado automaticamente por LocalRank Feedback</p>
            <p className="mt-1">Para cambiar la frecuencia o destinatarios, ve a Configuracion → Reportes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
