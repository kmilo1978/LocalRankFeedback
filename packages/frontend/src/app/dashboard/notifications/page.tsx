'use client';

import { useState } from 'react';

const mockNotifications = [
  { id: '1', type: 'feedback_negative', title: 'Feedback negativo recibido', body: 'Ana Martinez califico con 2 estrellas en Sede Centro', time: 'Hace 5 min', read: false, icon: '🚨' },
  { id: '2', type: 'referral_converted', title: 'Referido convertido!', body: 'El referido de Maria Garcia se convirtio en cliente', time: 'Hace 1 hora', read: false, icon: '🎉' },
  { id: '3', type: 'coupon_redeemed', title: 'Cupon canjeado', body: 'Carlos Rodriguez canjeo su cupon de cafe gratis', time: 'Hace 2 horas', read: false, icon: '🎁' },
  { id: '4', type: 'review_new', title: 'Nueva reseña en Google', body: 'Sofia Ramirez dejo una reseña de 5 estrellas', time: 'Hace 3 horas', read: true, icon: '⭐' },
  { id: '5', type: 'ticket_resolved', title: 'Ticket resuelto', body: 'El ticket #47 fue marcado como resuelto', time: 'Hace 5 horas', read: true, icon: '✅' },
  { id: '6', type: 'feedback_negative', title: 'Feedback negativo recibido', body: 'Pedro Lopez califico con 1 estrella en Sede Norte', time: 'Hace 8 horas', read: true, icon: '🚨' },
  { id: '7', type: 'milestone', title: 'Meta alcanzada!', body: 'Llegaste a 50 reseñas en Google este mes', time: 'Ayer', read: true, icon: '🏆' },
  { id: '8', type: 'report', title: 'Reporte semanal listo', body: 'Tu reporte de la semana 29 Jul - 4 Ago esta disponible', time: 'Hace 2 dias', read: true, icon: '📊' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">{unreadCount}</span>
          )}
        </div>
        <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">Marcar todas como leidas</button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setFilter('all')} className={`rounded-md px-3 py-1.5 text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>Todas ({notifications.length})</button>
        <button onClick={() => setFilter('unread')} className={`rounded-md px-3 py-1.5 text-sm ${filter === 'unread' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>Sin leer ({unreadCount})</button>
      </div>

      {/* List */}
      <div className="rounded-lg border bg-white shadow-sm divide-y">
        {filtered.map((n) => (
          <div key={n.id} onClick={() => markRead(n.id)} className={`flex items-start gap-3 p-4 cursor-pointer transition hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}>
            <span className="text-xl mt-0.5">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
            {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-blue-500 shrink-0"></span>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">No hay notificaciones</div>
        )}
      </div>
    </div>
  );
}
