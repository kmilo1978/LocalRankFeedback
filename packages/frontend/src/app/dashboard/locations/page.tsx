'use client';

import { useState } from 'react';
import { mockLocations } from '@/lib/mock-data';

export default function LocationsPage() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/feedback/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sedes</h1>
        <button className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
          + Nueva Sede
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mockLocations.map((location) => (
          <div key={location.id} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{location.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{location.address}</p>
                <p className="mt-0.5 text-sm text-gray-500">{location.phone}</p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Activa
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span>⭐ {location.averageRating}</span>
              <span>📝 {location.feedbackCount} feedback</span>
              <span>🔗 {Math.round(location.feedbackCount * 0.74)} a Google</span>
            </div>

            {/* Feedback link */}
            <div className="mt-4 flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-gray-100 px-2 py-1.5 text-xs text-gray-700">
                /feedback/{location.feedbackSlug}
              </code>
              <button
                onClick={() => copyLink(location.feedbackSlug)}
                className="rounded border border-gray-300 px-2 py-1.5 text-xs hover:bg-gray-50"
                title="Copiar link"
              >
                {copiedSlug === location.feedbackSlug ? '✅' : '📋'}
              </button>
              <a
                href={`/feedback/${location.feedbackSlug}`}
                target="_blank"
                className="rounded border border-gray-300 px-2 py-1.5 text-xs hover:bg-gray-50"
                title="Abrir formulario"
              >
                🔗
              </a>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs transition hover:bg-gray-50">
                ✏️ Editar
              </button>
              <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs transition hover:bg-gray-50">
                📊 Estadisticas
              </button>
              <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs transition hover:bg-gray-50">
                🖨️ QR Code
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
