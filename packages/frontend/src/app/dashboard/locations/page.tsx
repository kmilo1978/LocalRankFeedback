'use client';

export default function LocationsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sedes</h1>
        <button className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
          + Nueva Sede
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          {
            name: 'Sede Centro',
            address: 'Calle 50 #10-20, Bogota',
            slug: 'clinica-sonrisa-centro',
            feedback: 32,
            rating: 4.3,
          },
          {
            name: 'Sede Norte',
            address: 'Carrera 15 #100-45, Bogota',
            slug: 'clinica-sonrisa-norte',
            feedback: 15,
            rating: 4.5,
          },
        ].map((location, i) => (
          <div key={i} className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{location.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{location.address}</p>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span>⭐ {location.rating}</span>
              <span>📝 {location.feedback} feedback</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                /feedback/{location.slug}
              </code>
              <button
                className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                title="Copiar link"
              >
                📋
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs transition hover:bg-gray-50">
                Editar
              </button>
              <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs transition hover:bg-gray-50">
                Ver QR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
