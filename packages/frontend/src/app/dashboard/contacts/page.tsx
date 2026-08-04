'use client';

export default function ContactsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Contactos</h1>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-4">
          <input
            type="text"
            placeholder="Buscar por nombre, email o telefono..."
            className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefono</th>
                <th className="px-4 py-3">Fuente</th>
                <th className="px-4 py-3">Feedback</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { name: 'Maria Garcia', email: 'maria@email.com', phone: '+57 300 111 2222', source: 'feedback', count: 2, date: 'Hace 2 horas' },
                { name: 'Carlos Rodriguez', email: 'carlos@email.com', phone: '+57 310 333 4444', source: 'feedback', count: 1, date: 'Hace 5 horas' },
                { name: 'Ana Martinez', email: 'ana@email.com', phone: null, source: 'feedback', count: 1, date: 'Ayer' },
                { name: 'Pedro Lopez', email: 'pedro@email.com', phone: '+57 320 555 6666', source: 'referral', count: 3, date: 'Hace 2 dias' },
              ].map((contact, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{contact.name}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.phone || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                      {contact.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contact.count}</td>
                  <td className="px-4 py-3 text-gray-500">{contact.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
