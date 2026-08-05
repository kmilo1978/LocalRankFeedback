'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    businessName: 'Clinica Dental Sonrisa',
    email: 'admin@clinicasonrisa.com',
    reviewGateThreshold: '4',
    notifyEmail: 'admin@clinicasonrisa.com',
    notifyWhatsapp: '+57 300 123 4567',
    notifyOnNegative: true,
    notifyOnPositive: false,
    googleReviewUrl: 'https://g.page/r/example/review',
    // Branding
    logoUrl: '',
    primaryColor: '#2563eb',
    bannerColor: '#2563eb',
    backgroundColor: '#f0f4ff',
    showBanner: true,
    // Fields
    showNameField: true,
    showEmailField: true,
    showPhoneField: true,
    // Messages
    positiveMessage: 'Nos alegra que hayas tenido una excelente experiencia! Te invitamos a compartirla en Google.',
    negativeMessage: 'Gracias por tu feedback. Tomaremos accion para mejorar tu proxima experiencia.',
    marketingConsentText: 'Acepto recibir promociones, novedades y beneficios exclusivos por email o WhatsApp.',
  });

  const handleChange = (field: string, value: string | boolean) => {
    setSettings({ ...settings, [field]: value });
    setSaved(false);
  };

  const handleSave = () => {
    // TODO: Call API to save settings
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Configuracion</h1>
        {saved && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            ✓ Cambios guardados
          </span>
        )}
      </div>

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
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email de la cuenta
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Branding & Apariencia */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Apariencia del Formulario</h2>
          <p className="mb-4 text-sm text-gray-600">
            Personaliza como se ve el formulario de feedback para tus clientes.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                URL del Logo
              </label>
              <input
                type="url"
                value={settings.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="https://tudominio.com/logo.png"
              />
              <p className="mt-1 text-xs text-gray-400">PNG o SVG transparente recomendado</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Color principal
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="#2563eb"
                />
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-medium text-gray-900">Franja superior (Banner)</label>
                <p className="text-xs text-gray-500">Muestra una franja de color con tu logo en la parte superior del formulario</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={settings.showBanner}
                  onChange={(e) => handleChange('showBanner', e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-brand-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            {settings.showBanner && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Color del banner
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.bannerColor}
                      onChange={(e) => handleChange('bannerColor', e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={settings.bannerColor}
                      onChange={(e) => handleChange('bannerColor', e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="#2563eb"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Color de fondo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={settings.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="#f0f4ff"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="mt-4 rounded-lg border overflow-hidden">
              <p className="px-3 py-1.5 bg-gray-50 text-xs font-medium text-gray-500 border-b">Vista previa</p>
              <div style={{ backgroundColor: settings.backgroundColor }} className="p-4">
                {settings.showBanner && (
                  <div
                    className="rounded-t-lg px-4 py-3 flex items-center justify-center"
                    style={{ backgroundColor: settings.bannerColor }}
                  >
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                    ) : (
                      <span className="text-sm font-bold text-white">{settings.businessName}</span>
                    )}
                  </div>
                )}
                <div className={`bg-white p-4 text-center ${settings.showBanner ? 'rounded-b-lg' : 'rounded-lg'}`}>
                  <p className="text-sm font-medium text-gray-700">Como fue tu experiencia?</p>
                  <p className="mt-1 text-lg">☆ ☆ ☆ ☆ ☆</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="mt-4 border-t pt-4">
            <label className="text-sm font-medium text-gray-900">Campos a solicitar</label>
            <p className="text-xs text-gray-500 mb-3">Elige que datos pedir al cliente en el formulario</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="field-name"
                  checked={settings.showNameField}
                  onChange={(e) => handleChange('showNameField', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600"
                />
                <label htmlFor="field-name" className="text-sm text-gray-700">Nombre</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="field-email"
                  checked={settings.showEmailField}
                  onChange={(e) => handleChange('showEmailField', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600"
                />
                <label htmlFor="field-email" className="text-sm text-gray-700">Email</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="field-phone"
                  checked={settings.showPhoneField}
                  onChange={(e) => handleChange('showPhoneField', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600"
                />
                <label htmlFor="field-phone" className="text-sm text-gray-700">WhatsApp / Telefono</label>
              </div>
            </div>
          </div>
        </div>

        {/* Review Gate Settings */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Review Gate</h2>
          <p className="mb-4 text-sm text-gray-600">
            Define a partir de que calificacion se redirige al cliente a Google Reviews.
            Las calificaciones por debajo de este umbral se capturan de forma privada.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Umbral minimo para Google
              </label>
              <select
                value={settings.reviewGateThreshold}
                onChange={(e) => handleChange('reviewGateThreshold', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="5">5 estrellas (solo excelente → Google)</option>
                <option value="4">4+ estrellas (recomendado → Google)</option>
                <option value="3">3+ estrellas (mas permisivo → Google)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Link de Google Reviews
              </label>
              <input
                type="url"
                value={settings.googleReviewUrl}
                onChange={(e) => handleChange('googleReviewUrl', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="https://g.page/r/XXXXX/review"
              />
            </div>
          </div>

          {/* Visual explanation */}
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Asi funciona:</p>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs">✓</span>
                <span className="text-gray-700">{settings.reviewGateThreshold}-5 ⭐ → Google Maps</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs">🔒</span>
                <span className="text-gray-700">1-{Number(settings.reviewGateThreshold) - 1} ⭐ → Privado + Notificacion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings - THE KEY SECTION */}
        <div className="rounded-lg border-2 border-brand-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔔</span>
            <h2 className="text-lg font-semibold text-gray-900">Alertas de Feedback Negativo</h2>
          </div>
          <p className="mb-5 text-sm text-gray-600">
            Cuando un cliente califica con 1-3 estrellas, el sistema envia una alerta inmediata 
            a los canales que configures aqui. Asi puedes contactar al cliente rapidamente y 
            resolver su inquietud antes de que publique una rese�a negativa.
          </p>

          {/* WhatsApp */}
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <label className="text-sm font-medium text-gray-900">
                  Alertas por WhatsApp
                </label>
              </div>
              <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800">
                Recomendado
              </span>
            </div>
            <input
              type="tel"
              value={settings.notifyWhatsapp}
              onChange={(e) => handleChange('notifyWhatsapp', e.target.value)}
              className="w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="+57 300 123 4567"
            />
            <p className="mt-1.5 text-xs text-green-700">
              Recibiras un mensaje de WhatsApp con la calificacion, comentario y datos del cliente.
              Incluye el codigo de pais (ej: +57 para Colombia).
            </p>
          </div>

          {/* Email */}
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📧</span>
              <label className="text-sm font-medium text-gray-900">
                Alertas por Email
              </label>
            </div>
            <input
              type="email"
              value={settings.notifyEmail}
              onChange={(e) => handleChange('notifyEmail', e.target.value)}
              className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="responsable@tuempresa.com"
            />
            <p className="mt-1.5 text-xs text-blue-700">
              Recibiras un email detallado con toda la informacion del feedback negativo.
              Puedes usar multiples emails separados por coma.
            </p>
          </div>

          {/* Additional options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notify-negative"
                checked={settings.notifyOnNegative}
                onChange={(e) => handleChange('notifyOnNegative', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600"
              />
              <label htmlFor="notify-negative" className="text-sm text-gray-700">
                Notificar feedback negativo (1-3 estrellas) <span className="text-xs text-gray-400">— recomendado</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notify-positive"
                checked={settings.notifyOnPositive}
                onChange={(e) => handleChange('notifyOnPositive', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600"
              />
              <label htmlFor="notify-positive" className="text-sm text-gray-700">
                Notificar tambien feedback positivo (4-5 estrellas) <span className="text-xs text-gray-400">— opcional</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-5 rounded-md bg-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Preview del mensaje WhatsApp:</p>
            <div className="rounded-md bg-white border p-3 text-xs text-gray-700 font-mono leading-relaxed">
              <p>🚨 <strong>Alerta de Feedback Negativo</strong></p>
              <p className="mt-1">📍 Sede: {settings.businessName}</p>
              <p>⭐ Calificacion: ⭐⭐☆☆☆ (2/5)</p>
              <p>📅 Fecha: {new Date().toLocaleDateString('es-CO')}</p>
              <p className="mt-1">💬 Comentario:</p>
              <p className="italic">&quot;Mucho tiempo de espera...&quot;</p>
              <p className="mt-1">👤 Cliente: Juan Perez</p>
              <p>   Tel: +57 300 111 2222</p>
              <p className="mt-1">⚡ Accion: Contactar al cliente lo antes posible.</p>
            </div>
          </div>
        </div>

        {/* Messages Customization */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Mensajes Personalizados</h2>
          <p className="mb-4 text-sm text-gray-600">
            Personaliza los mensajes que ve el cliente despues de enviar su feedback.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Mensaje para feedback positivo (4-5 ⭐)
                </span>
              </label>
              <textarea
                value={settings.positiveMessage}
                onChange={(e) => handleChange('positiveMessage', e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Mensaje de agradecimiento antes de redirigir a Google..."
              />
              <p className="mt-1 text-xs text-gray-400">Este mensaje se muestra antes de redirigir al cliente a Google Reviews.</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                  Mensaje para feedback negativo (1-3 ⭐)
                </span>
              </label>
              <textarea
                value={settings.negativeMessage}
                onChange={(e) => handleChange('negativeMessage', e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Mensaje de agradecimiento cuando se captura feedback privado..."
              />
              <p className="mt-1 text-xs text-gray-400">Este mensaje se muestra cuando el feedback es capturado de forma privada (no va a Google).</p>
            </div>
          </div>
        </div>

        {/* Google Business Profile */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Google Business Profile</h2>
          <p className="mb-4 text-sm text-gray-600">
            Conecta tu cuenta de Google para sincronizar rese�as y activar respuestas automaticas con IA.
          </p>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            disabled
          >
            🔗 Conectar con Google (Fase 2 - Proximamente)
          </button>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Los cambios aplican inmediatamente a nuevos feedback recibidos.
          </p>
          <button
            onClick={handleSave}
            className="rounded-md bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
