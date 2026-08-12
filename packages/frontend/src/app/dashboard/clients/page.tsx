'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockClients = [
  {
    id: '1',
    name: 'Clinica Dental Sonrisa',
    industry: 'Clinica Dental',
    plan: 'Growth',
    sedes: 2,
    totalFeedback: 147,
    avgRating: 4.5,
    googleRating: 4.7,
    openTickets: 2,
    referrals: 12,
    couponsActive: true,
    status: 'active',
    createdAt: '2026-06-15',
    contact: { name: 'Dr. Juan Perez', email: 'juan@clinicasonrisa.com', phone: '+57 300 123 4567' },
  },
  {
    id: '2',
    name: 'FitZone Gym',
    industry: 'Gimnasio',
    plan: 'Growth',
    sedes: 3,
    totalFeedback: 89,
    avgRating: 4.3,
    googleRating: 4.4,
    openTickets: 1,
    referrals: 8,
    couponsActive: true,
    status: 'active',
    createdAt: '2026-07-01',
    contact: { name: 'Carlos Mendez', email: 'carlos@fitzone.com', phone: '+57 310 456 7890' },
  },
  {
    id: '3',
    name: 'Studio Belleza Integral',
    industry: 'Estetica',
    plan: 'Starter',
    sedes: 1,
    totalFeedback: 52,
    avgRating: 4.8,
    googleRating: 4.9,
    openTickets: 0,
    referrals: 5,
    couponsActive: false,
    status: 'active',
    createdAt: '2026-07-10',
    contact: { name: 'Andrea Ruiz', email: 'andrea@bellezaintegral.com', phone: '+57 320 789 0123' },
  },
  {
    id: '4',
    name: 'Restaurante La Mesa',
    industry: 'Restaurante',
    plan: 'Growth',
    sedes: 2,
    totalFeedback: 203,
    avgRating: 4.1,
    googleRating: 4.3,
    openTickets: 4,
    referrals: 15,
    couponsActive: true,
    status: 'active',
    createdAt: '2026-05-20',
    contact: { name: 'Chef Diego Torres', email: 'diego@lamesa.com', phone: '+57 300 321 6549' },
  },
  {
    id: '5',
    name: 'Veterinaria PetCare',
    industry: 'Veterinaria',
    plan: 'Starter',
    sedes: 1,
    totalFeedback: 34,
    avgRating: 4.6,
    googleRating: 4.5,
    openTickets: 1,
    referrals: 3,
    couponsActive: false,
    status: 'trial',
    createdAt: '2026-07-28',
    contact: { name: 'Dra. Sofia Ramirez', email: 'sofia@petcare.com', phone: '+57 310 654 3210' },
  },
  {
    id: '6',
    name: 'Centro Fisio Vital',
    industry: 'Fisioterapia',
    plan: 'Growth',
    sedes: 2,
    totalFeedback: 78,
    avgRating: 4.4,
    googleRating: 4.6,
    openTickets: 0,
    referrals: 9,
    couponsActive: true,
    status: 'active',
    createdAt: '2026-06-01',
    contact: { name: 'Luis Perez', email: 'luis@fisiovital.com', phone: '+57 320 987 6543' },
  },
];

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'trial'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockClients
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()));

  const totals = {
    clients: mockClients.length,
    sedes: mockClients.reduce((sum, c) => sum + c.sedes, 0),
    feedback: mockClients.reduce((sum, c) => sum + c.totalFeedback, 0),
    mrr: mockClients.reduce((sum, c) => sum + (c.plan === 'Growth' ? 99 : 49), 0),
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-600">Gestiona todos tus negocios desde un solo lugar</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Agregar cliente
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{totals.clients}</p>
          <p className="text-xs text-gray-600">Clientes activos</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{totals.sedes}</p>
          <p className="text-xs text-gray-600">Sedes totales</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{totals.feedback}</p>
          <p className="text-xs text-gray-600">Feedback total</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-purple-600">${totals.mrr}</p>
          <p className="text-xs text-gray-600">MRR estimado</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="mb-4 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente o industria..."
          className="flex-1 max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'trial'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-2 text-sm ${filter === f ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>
              {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Trial'}
            </button>
          ))}
        </div>
      </div>

      {/* Client cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((client) => (
          <div key={client.id} className="rounded-lg border bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {client.status === 'active' ? 'Activo' : 'Trial'}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{client.industry} | Plan {client.plan} | {client.sedes} sede{client.sedes > 1 ? 's' : ''}</p>
              </div>
              <Link href={`/dashboard/clients/${client.id}`} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50">
                Ver detalle
              </Link>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              <div><p className="text-sm font-bold text-gray-900">{client.totalFeedback}</p><p className="text-xs text-gray-500">Feedback</p></div>
              <div><p className="text-sm font-bold text-gray-900">{client.avgRating}</p><p className="text-xs text-gray-500">Rating</p></div>
              <div><p className="text-sm font-bold text-gray-900">{client.googleRating}⭐</p><p className="text-xs text-gray-500">Google</p></div>
              <div><p className="text-sm font-bold text-orange-600">{client.openTickets}</p><p className="text-xs text-gray-500">Tickets</p></div>
              <div><p className="text-sm font-bold text-purple-600">{client.referrals}</p><p className="text-xs text-gray-500">Referidos</p></div>
            </div>

            {/* Features active */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">Feedback</span>
              <span className="rounded bg-green-50 px-2 py-0.5 text-xs text-green-700">Review Gate</span>
              {client.couponsActive && <span className="rounded bg-purple-50 px-2 py-0.5 text-xs text-purple-700">Cupones</span>}
              {client.referrals > 0 && <span className="rounded bg-orange-50 px-2 py-0.5 text-xs text-orange-700">Referidos</span>}
              <span className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-600">IA</span>
            </div>

            {/* Contact */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span>👤 {client.contact.name}</span>
              <span>📧 {client.contact.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add client modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900">Agregar nuevo cliente</h2>
            <p className="mt-1 text-sm text-gray-600">Registra un negocio nuevo en tu cuenta de agencia</p>
            <div className="mt-5 space-y-3">
              <div><label className="mb-1 block text-xs font-medium text-gray-700">Nombre del negocio *</label><input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Clinica Dental Ejemplo" /></div>
              <div><label className="mb-1 block text-xs font-medium text-gray-700">Industria</label><select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"><option>Clinica Dental</option><option>Fisioterapia</option><option>Estetica</option><option>Gimnasio</option><option>Restaurante</option><option>Veterinaria</option><option>Otro</option></select></div>
              <div><label className="mb-1 block text-xs font-medium text-gray-700">Contacto principal *</label><input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Nombre del responsable" /></div>
              <div><label className="mb-1 block text-xs font-medium text-gray-700">Email *</label><input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="contacto@negocio.com" /></div>
              <div><label className="mb-1 block text-xs font-medium text-gray-700">WhatsApp</label><input type="tel" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="+57 300 000 0000" /></div>
              <div><label className="mb-1 block text-xs font-medium text-gray-700">Plan</label><select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"><option>Starter ($49/mes)</option><option>Growth ($99/mes)</option></select></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-md border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Crear cliente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
