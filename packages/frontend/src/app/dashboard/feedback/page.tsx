'use client';

export default function FeedbackListPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Feedback Recibido</h1>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-4">
          <div className="flex items-center gap-4">
            <select className="rounded-md border border-gray-300 px-3 py-1.5 text-sm">
              <option value="">Todos los ratings</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </div>
        </div>

        <div className="divide-y">
          {/* Placeholder feedback items */}
          {[
            { rating: 5, comment: 'Excelente atencion, muy profesionales', name: 'Maria G.', date: 'Hace 2 horas', google: true },
            { rating: 4, comment: 'Buena experiencia, puntualidad perfecta', name: 'Carlos R.', date: 'Hace 5 horas', google: true },
            { rating: 2, comment: 'Mucho tiempo de espera', name: 'Ana M.', date: 'Ayer', google: false },
            { rating: 5, comment: 'El mejor dentista que he visitado', name: 'Pedro L.', date: 'Hace 2 dias', google: true },
            { rating: 1, comment: 'Pesima experiencia, me cobraron de mas', name: null, date: 'Hace 3 dias', google: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-sm">
                    {star <= item.rating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{item.comment}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.name || 'Anonimo'} - {item.date}
                </p>
              </div>
              <div>
                {item.google ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Google
                  </span>
                ) : (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                    Ticket
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
