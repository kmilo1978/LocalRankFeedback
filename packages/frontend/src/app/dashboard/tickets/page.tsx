'use client';

export default function TicketsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Tickets Internos</h1>

      <div className="mb-4 flex gap-2">
        {['Todos', 'Abiertos', 'En progreso', 'Resueltos'].map((filter) => (
          <button
            key={filter}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm transition hover:bg-gray-50"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {/* Placeholder tickets */}
        {[
          { rating: 2, comment: 'Mucho tiempo de espera', name: 'Ana M.', status: 'open', date: 'Ayer' },
          { rating: 1, comment: 'Pesima experiencia, me cobraron de mas', name: 'Anonimo', status: 'open', date: 'Hace 3 dias' },
          { rating: 3, comment: 'Regular, podria mejorar la comunicacion', name: 'Luis P.', status: 'in_progress', date: 'Hace 5 dias' },
        ].map((ticket, i) => (
          <div key={i} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-xs">
                        {star <= ticket.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-900">{ticket.comment}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {ticket.name} - {ticket.date}
                </p>
              </div>
              <button className="rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50">
                Gestionar
              </button>
            </div>
          </div>
        ))}
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
