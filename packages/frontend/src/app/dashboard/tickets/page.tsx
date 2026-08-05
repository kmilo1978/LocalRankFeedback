'use client';

import { useState } from 'react';
import { mockTickets } from '@/lib/mock-data';

export default function TicketsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const filteredTickets = filter === 'all'
    ? mockTickets
    : mockTickets.filter((t) => t.status === filter);

  const counts = {
    all: mockTickets.length,
    open: mockTickets.filter((t) => t.status === 'open').length,
    in_progress: mockTickets.filter((t) => t.status === 'in_progress').length,
    resolved: mockTickets.filter((t) => t.status === 'resolved').length,
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tickets Internos</h1>
        <span className="text-sm text-gray-500">
          {counts.open} abiertos
        </span>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        {[
          { key: 'all', label: 'Todos', count: counts.all },
          { key: 'open', label: 'Abiertos', count: counts.open },
          { key: 'in_progress', label: 'En progreso', count: counts.in_progress },
          { key: 'resolved', label: 'Resueltos', count: counts.resolved },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              filter === f.key
                ? 'bg-brand-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Tickets */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`rounded-lg border bg-white p-4 shadow-sm transition ${
              selectedTicket === ticket.id ? 'ring-2 ring-brand-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-xs">
                        {star <= ticket.feedback.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(ticket.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-900">{ticket.feedback.comment}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {ticket.feedback.contact?.name || 'Anonimo'}
                  {ticket.feedback.contact?.email && ` - ${ticket.feedback.contact.email}`}
                  {ticket.feedback.contact?.phone && ` - ${ticket.feedback.contact.phone}`}
                </p>
                {ticket.notes && (
                  <div className="mt-2 rounded-md bg-yellow-50 p-2 text-xs text-yellow-800">
                    <strong>Nota:</strong> {ticket.notes}
                  </div>
                )}
              </div>
              <div className="ml-4 flex gap-2">
                {ticket.status === 'open' && (
                  <button
                    onClick={() => setSelectedTicket(ticket.id)}
                    className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                  >
                    Gestionar
                  </button>
                )}
                {ticket.status === 'in_progress' && (
                  <button className="rounded-md border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50">
                    Resolver
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="rounded-lg border bg-white p-8 text-center text-sm text-gray-500">
            No hay tickets con ese filtro
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-red-100 text-red-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    dismissed: 'bg-gray-100 text-gray-700',
  };

  const labels: Record<string, string> = {
    open: 'Abierto',
    in_progress: 'En progreso',
    resolved: 'Resuelto',
    dismissed: 'Descartado',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || styles.open}`}>
      {labels[status] || status}
    </span>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Hace un momento';
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ayer';
  return `Hace ${days} dias`;
}
