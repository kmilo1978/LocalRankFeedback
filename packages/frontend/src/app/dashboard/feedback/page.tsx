'use client';

import { useState } from 'react';
import { mockFeedbackList } from '@/lib/mock-data';

export default function FeedbackListPage() {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredFeedback = filterRating
    ? mockFeedbackList.filter((f) => f.rating === filterRating)
    : mockFeedbackList;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Feedback Recibido</h1>
        <span className="text-sm text-gray-500">{mockFeedbackList.length} total</span>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        {/* Filters */}
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                !filterRating ? 'bg-brand-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Todos
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(r)}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  filterRating === r ? 'bg-brand-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {r}⭐
              </button>
            ))}
          </div>
        </div>

        {/* Feedback list */}
        <div className="divide-y">
          {filteredFeedback.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-gray-50">
              <div className="flex gap-0.5 pt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-sm">
                    {star <= item.rating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {item.comment || <span className="italic text-gray-400">(Sin comentario)</span>}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.contact?.name || 'Anonimo'}
                  {item.contact?.email && ` (${item.contact.email})`}
                  {' - '}
                  {formatTimeAgo(item.createdAt)}
                </p>
              </div>
              <div className="shrink-0">
                {item.directedToGoogle ? (
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    → Google
                  </span>
                ) : (
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
                    Ticket
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredFeedback.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500">
              No hay feedback con ese rating
            </div>
          )}
        </div>
      </div>
    </div>
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
