'use client';

import { useState } from 'react';

const mockReviews = [
  {
    id: '1',
    platform: 'google',
    reviewerName: 'Laura Mendez',
    rating: 5,
    comment: 'Excelente servicio, muy profesionales. El doctor explico todo con detalle y el tratamiento fue rapido e indoloro. Totalmente recomendado.',
    publishedAt: '2026-08-03',
    status: 'responded',
    aiResponse: 'Gracias Laura por tus amables palabras! Nos alegra saber que tu experiencia fue positiva. El Dr. Perez siempre se esfuerza por explicar cada paso del tratamiento. Te esperamos en tu proxima visita!',
  },
  {
    id: '2',
    platform: 'google',
    reviewerName: 'Carlos Jimenez',
    rating: 4,
    comment: 'Buen servicio en general. Solo un poco de espera al llegar pero una vez adentro todo excelente.',
    publishedAt: '2026-08-02',
    status: 'draft',
    aiResponse: 'Hola Carlos! Gracias por tu visita y por compartir tu experiencia. Lamentamos la espera inicial, estamos trabajando en mejorar nuestros tiempos. Nos alegra que el servicio haya sido de tu agrado. Hasta pronto!',
  },
  {
    id: '3',
    platform: 'google',
    reviewerName: 'Andres Morales',
    rating: 2,
    comment: 'Me hicieron esperar 45 minutos y cuando entre la consulta fue muy rapida. No senti que me prestaran atencion.',
    publishedAt: '2026-08-01',
    status: 'pending',
    aiResponse: null,
  },
  {
    id: '4',
    platform: 'doctoralia',
    reviewerName: 'Sofia Ramirez',
    rating: 5,
    comment: 'La mejor clinica dental que he visitado. Instalaciones impecables y personal muy amable.',
    publishedAt: '2026-07-30',
    status: 'responded',
    aiResponse: 'Muchas gracias Sofia! Tu comentario nos motiva a seguir mejorando cada dia. Nuestro equipo trabaja con dedicacion para ofrecer la mejor experiencia. Te esperamos!',
  },
  {
    id: '5',
    platform: 'google',
    reviewerName: 'Pedro Gutierrez',
    rating: 1,
    comment: 'Pesima experiencia. Me cobraron mas de lo que me dijeron y no resolvieron mi problema.',
    publishedAt: '2026-07-28',
    status: 'pending',
    aiResponse: null,
  },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'draft' | 'responded'>('all');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [reviews, setReviews] = useState(mockReviews);

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);

  const generateAiResponse = async (reviewId: string) => {
    setGeneratingId(reviewId);
    // Simulate AI generation delay
    await new Promise((r) => setTimeout(r, 2000));

    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    const response = review.rating >= 4
      ? `Muchas gracias por tu reseña y por confiar en nosotros! Nos alegra que tu experiencia haya sido positiva. Trabajamos cada dia para ofrecer el mejor servicio. Te esperamos en tu proxima visita!`
      : `Hola ${review.reviewerName}, lamentamos mucho que tu experiencia no haya sido la esperada. Tu feedback es muy importante para nosotros. Nos gustaria contactarte para resolver esta situacion. Por favor escribenos a nuestro WhatsApp para poder ayudarte.`;

    setReviews(reviews.map((r) =>
      r.id === reviewId ? { ...r, aiResponse: response, status: 'draft' } : r
    ));
    setGeneratingId(null);
  };

  const approveResponse = (reviewId: string) => {
    setReviews(reviews.map((r) =>
      r.id === reviewId ? { ...r, status: 'responded' } : r
    ));
  };

  const startEdit = (review: typeof mockReviews[0]) => {
    setEditingId(review.id);
    setEditText(review.aiResponse || '');
  };

  const saveEdit = (reviewId: string) => {
    setReviews(reviews.map((r) =>
      r.id === reviewId ? { ...r, aiResponse: editText } : r
    ));
    setEditingId(null);
  };

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    draft: reviews.filter((r) => r.status === 'draft').length,
    responded: reviews.filter((r) => r.status === 'responded').length,
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reseñas y Respuestas IA</h1>
          <p className="mt-1 text-sm text-gray-600">Gestiona las reseñas de Google y genera respuestas automaticas</p>
        </div>
        <button
          onClick={() => reviews.filter(r => r.status === 'pending').forEach(r => generateAiResponse(r.id))}
          className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          🤖 Generar todas las pendientes
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
          <p className="text-xs text-gray-600">Total reseñas</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-orange-600">{counts.pending}</p>
          <p className="text-xs text-gray-600">Sin responder</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{counts.draft}</p>
          <p className="text-xs text-gray-600">Borrador IA</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{counts.responded}</p>
          <p className="text-xs text-gray-600">Respondidas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        {(['all', 'pending', 'draft', 'responded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              filter === f ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : f === 'draft' ? 'Borradores' : 'Respondidas'}
            {' '}({counts[f]})
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="rounded-lg border bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">
                  {review.platform === 'google' ? '🔍' : '👨‍⚕️'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{review.reviewerName}</p>
                  <div className="flex items-center gap-2">
                    <span className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-xs">{s <= review.rating ? '⭐' : '☆'}</span>
                      ))}
                    </span>
                    <span className="text-xs text-gray-400">{review.publishedAt}</span>
                  </div>
                </div>
              </div>
              <StatusBadge status={review.status} />
            </div>

            {/* Review text */}
            <div className="mt-3 rounded-md bg-gray-50 p-3">
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>

            {/* AI Response */}
            {review.status === 'pending' && (
              <div className="mt-3">
                <button
                  onClick={() => generateAiResponse(review.id)}
                  disabled={generatingId === review.id}
                  className="rounded-md bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-200 disabled:opacity-50"
                >
                  {generatingId === review.id ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                      </svg>
                      Generando respuesta...
                    </span>
                  ) : (
                    '🤖 Generar respuesta con IA'
                  )}
                </button>
              </div>
            )}

            {review.aiResponse && review.status !== 'pending' && (
              <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-blue-700">
                    {review.status === 'responded' ? '✅ Respuesta publicada' : '🤖 Borrador IA'}
                  </p>
                  {review.status === 'draft' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(review)}
                        className="rounded px-2 py-1 text-xs text-blue-700 hover:bg-blue-100"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => approveResponse(review.id)}
                        className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                      >
                        ✅ Aprobar y publicar
                      </button>
                    </div>
                  )}
                </div>

                {editingId === review.id ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => saveEdit(review.id)}
                        className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded border px-3 py-1 text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-blue-800">{review.aiResponse}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    draft: 'bg-blue-100 text-blue-700',
    responded: 'bg-green-100 text-green-700',
  };
  const labels: Record<string, string> = {
    pending: 'Sin responder',
    draft: 'Borrador IA',
    responded: 'Respondida',
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
