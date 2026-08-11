'use client';

const mockActivity = [
  { id: '1', type: 'feedback', action: 'Feedback 5⭐ recibido', detail: 'Maria Garcia en Sede Centro', time: 'Hace 5 min', icon: '⭐' },
  { id: '2', type: 'notification', action: 'Alerta WhatsApp enviada', detail: 'Feedback negativo → +57 300 123 4567', time: 'Hace 12 min', icon: '📱' },
  { id: '3', type: 'coupon', action: 'Cupon generado', detail: 'LR-A3K9F2XB para Maria Garcia (cafe gratis)', time: 'Hace 20 min', icon: '🎁' },
  { id: '4', type: 'review', action: 'Respuesta IA generada', detail: 'Reseña de Sofia Ramirez (5⭐) - borrador listo', time: 'Hace 1 hora', icon: '🤖' },
  { id: '5', type: 'referral', action: 'Link de referido creado', detail: 'Pedro Lopez → codigo: n4wd8r1t', time: 'Hace 2 horas', icon: '🔗' },
  { id: '6', type: 'ticket', action: 'Ticket resuelto', detail: 'Ticket #47 - "tiempo de espera" marcado resuelto', time: 'Hace 3 horas', icon: '✅' },
  { id: '7', type: 'feedback', action: 'Feedback 2⭐ recibido', detail: 'Anonimo en Sede Norte → ticket creado', time: 'Hace 4 horas', icon: '🚨' },
  { id: '8', type: 'referral', action: 'Referido convertido!', detail: 'Amigo de Carlos Rodriguez se registro', time: 'Hace 5 horas', icon: '🎉' },
  { id: '9', type: 'coupon', action: 'Cupon canjeado', detail: 'LR-J7MK2P4S por Diego Torres', time: 'Hace 6 horas', icon: '✨' },
  { id: '10', type: 'review', action: 'Respuesta publicada en Google', detail: 'Reseña de Laura Mendez respondida', time: 'Hace 8 horas', icon: '📝' },
  { id: '11', type: 'settings', action: 'Configuracion actualizada', detail: 'Se cambio el color del banner a verde', time: 'Ayer', icon: '⚙️' },
  { id: '12', type: 'feedback', action: 'Feedback 5⭐ recibido', detail: 'Valentina Gomez en Sede Centro', time: 'Ayer', icon: '⭐' },
  { id: '13', type: 'report', action: 'Reporte semanal enviado', detail: 'Enviado a admin@clinicasonrisa.com', time: 'Hace 2 dias', icon: '📊' },
  { id: '14', type: 'milestone', action: 'Meta alcanzada!', detail: '50 reseñas en Google Maps este mes', time: 'Hace 3 dias', icon: '🏆' },
];

export default function ActivityPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Actividad</h1>
        <p className="mt-1 text-sm text-gray-600">Todo lo que ha pasado en tu cuenta</p>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="divide-y">
          {mockActivity.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-gray-50">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <span className="text-xl">{item.icon}</span>
                {index < mockActivity.length - 1 && <div className="mt-2 h-full w-px bg-gray-200 flex-1" />}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
              </div>
              {/* Time */}
              <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
