'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

const mockClientDetail = {
  id: '1',
  name: 'Clinica Dental Sonrisa',
  industry: 'Clinica Dental',
  plan: 'Growth',
  status: 'active',
  createdAt: '2026-06-15',
  contact: { name: 'Dr. Juan Perez', email: 'juan@clinicasonrisa.com', phone: '+57 300 123 4567' },
  sedes: [
    { id: '1', name: 'Sede Centro', address: 'Calle 50 #10-20', feedback: 95, rating: 4.5, google: 4.7 },
    { id: '2', name: 'Sede Norte', address: 'Carrera 15 #100-45', feedback: 52, rating: 4.6, google: 4.8 },
  ],
  stats: {
    totalFeedback: 147,
    avgRating: 4.5,
    googleRating: 4.7,
    directedToGoogle: 112,
    openTickets: 2,
    resolvedTickets: 18,
    couponsGenerated: 45,
    couponsRedeemed: 28,
    referralLinks: 24,
    referralConversions: 12,
    nps: 75,
    contactsTotal: 234,
  },
  recentActivity: [
    { action: 'Feedback 5⭐ recibido', detail: 'Maria Garcia - Sede Centro', time: 'Hace 1 hora', icon: '⭐' },
    { action: 'Cupon canjeado', detail: 'LR-N4WD8R1T - Pedro Lopez', time: 'Hace 3 horas', icon: '🎁' },
    { action: 'Referido convertido', detail: 'Amigo de Carlos se registro', time: 'Hace 5 horas', icon: '🎉' },
    { action: 'Ticket resuelto', detail: '#47 - tiempo de espera', time: 'Ayer', icon: '✅' },
    { action: 'Respuesta IA publicada', detail: 'Reseña de Laura Mendez', time: 'Ayer', icon: '🤖' },
    { action: 'Feedback 2⭐ recibido', detail: 'Anonimo - Sede Norte → ticket creado', time: 'Hace 2 dias', icon: '🚨' },
  ],
  services: {
    feedback: true,
    reviewGate: true,
    notifications: true,
    coupons: true,
    referrals: true,
    aiResponses: true,
    multiPlatform: true,
    qrCode: true,
    reports: true,
  },
};

export default function ClientDetailPage() {
  const params = useParams();

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link href="/dashboard/clients" className="text-xs text-blue-600 hover:underline">← Volver a clientes</Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{mockClientDetail.name}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
            <span>{mockClientDetail.industry}</span>
            <span>|</span>
            <span>Plan {mockClientDetail.plan}</span>
            <span>|</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Activo</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">✏️ Editar</button>
          <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Ir a su panel</button>
        </div>
      </div>

      {/* Contact info */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm flex items-center gap-6">
        <div className="flex items-center gap-2"><span className="text-gray-400">👤</span><span className="text-sm">{mockClientDetail.contact.name}</span></div>
        <div className="flex items-center gap-2"><span className="text-gray-400">📧</span><span className="text-sm">{mockClientDetail.contact.email}</span></div>
        <div className="flex items-center gap-2"><span className="text-gray-400">📱</span><span className="text-sm">{mockClientDetail.contact.phone}</span></div>
        <div className="flex items-center gap-2"><span className="text-gray-400">📅</span><span className="text-sm">Desde {mockClientDetail.createdAt}</span></div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Stat label="Feedback total" value={mockClientDetail.stats.totalFeedback.toString()} />
        <Stat label="Rating promedio" value={mockClientDetail.stats.avgRating.toString()} />
        <Stat label="Google Rating" value={mockClientDetail.stats.googleRating + '⭐'} />
        <Stat label="NPS" value={mockClientDetail.stats.nps.toString()} />
        <Stat label="Cupones canjeados" value={`${mockClientDetail.stats.couponsRedeemed}/${mockClientDetail.stats.couponsGenerated}`} />
        <Stat label="Referidos conv." value={`${mockClientDetail.stats.referralConversions}/${mockClientDetail.stats.referralLinks}`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sedes */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-gray-900">Sedes ({mockClientDetail.sedes.length})</h3>
          {mockClientDetail.sedes.map((sede) => (
            <div key={sede.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{sede.name}</p>
                  <p className="text-xs text-gray-500">{sede.address}</p>
                </div>
                <div className="flex gap-4 text-center text-sm">
                  <div><p className="font-bold">{sede.feedback}</p><p className="text-xs text-gray-500">Feedback</p></div>
                  <div><p className="font-bold">{sede.rating}</p><p className="text-xs text-gray-500">Rating</p></div>
                  <div><p className="font-bold">{sede.google}⭐</p><p className="text-xs text-gray-500">Google</p></div>
                </div>
              </div>
            </div>
          ))}

          {/* Services active */}
          <h3 className="font-semibold text-gray-900 pt-2">Servicios activos</h3>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(mockClientDetail.services).map(([key, active]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Actividad reciente</h3>
          <div className="rounded-lg border bg-white shadow-sm divide-y">
            {mockClientDetail.recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm text-center">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
