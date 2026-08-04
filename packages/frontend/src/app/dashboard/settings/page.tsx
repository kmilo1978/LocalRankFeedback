'use client';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Configuracion</h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Cuenta</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombre del negocio
              </label>
              <input
                type="text"
                defaultValue="Clinica Dental Sonrisa"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@clinicasonrisa.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Review Gate Settings */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Review Gate</h2>
          <p className="mb-4 text-sm text-gray-600">
            Configura a partir de que calificacion se redirige al cliente a Google Reviews.
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Umbral minimo para Google (estrellas)
            </label>
            <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="5">5 estrellas (solo excelente)</option>
              <option value="4" selected>4+ estrellas (recomendado)</option>
              <option value="3">3+ estrellas (mas permisivo)</option>
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Notificaciones</h2>
          <p className="mb-4 text-sm text-gray-600">
            Recibe alertas cuando haya feedback negativo o nuevos tickets.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="notify-email" defaultChecked className="rounded" />
              <label htmlFor="notify-email" className="text-sm text-gray-700">
                Notificar por email
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="notify-whatsapp" className="rounded" />
              <label htmlFor="notify-whatsapp" className="text-sm text-gray-700">
                Notificar por WhatsApp (proximamente)
              </label>
            </div>
          </div>
        </div>

        {/* Google Connection */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Google Business Profile</h2>
          <p className="mb-4 text-sm text-gray-600">
            Conecta tu cuenta de Google para sincronizar resenas y responder automaticamente.
          </p>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            disabled
          >
            🔗 Conectar con Google (Fase 2)
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button className="rounded-md bg-brand-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
