'use client';

import { useState } from 'react';
import { mockContacts } from '@/lib/mock-data';

export default function ContactsPage() {
  const [search, setSearch] = useState('');

  const filteredContacts = search
    ? mockContacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          (c.phone && c.phone.includes(search)),
      )
    : mockContacts;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contactos</h1>
        <span className="text-sm text-gray-500">{mockContacts.length} total</span>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o telefono..."
            className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                <th className="px-4 py-3">Registrado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{contact.name}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.phone || '-'}</td>
                  <td className="px-4 py-3">
                    <SourceBadge source={contact.source} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contact.feedbackCount}</td>
                  <td className="px-4 py-3 text-gray-500">{formatTimeAgo(contact.createdAt)}</td>
                </tr>
              ))}

              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No se encontraron contactos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const styles: Record<string, string> = {
    feedback: 'bg-blue-100 text-blue-700',
    referral: 'bg-purple-100 text-purple-700',
    manual: 'bg-gray-100 text-gray-700',
    import: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[source] || styles.feedback}`}>
      {source}
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
