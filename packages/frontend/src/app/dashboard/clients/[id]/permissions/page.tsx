'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Permission {
  id: string;
  module: string;
  label: string;
  description: string;
  actions: { id: string; label: string; enabled: boolean }[];
}

const defaultPermissions: Permission[] = [
  {
    id: 'dashboard',
    module: 'Panel',
    label: 'Dashboard',
    description: 'Ver metricas y resumen general',
    actions: [
      { id: 'view_dashboard', label: 'Ver dashboard', enabled: true },
      { id: 'view_analytics', label: 'Ver analytics avanzado', enabled: true },
    ],
  },
  {
    id: 'feedback',
    module: 'Feedback',
    label: 'Feedback y Formularios',
    description: 'Gestionar feedback recibido y formularios',
    actions: [
      { id: 'view_feedback', label: 'Ver feedback recibido', enabled: true },
      { id: 'edit_form', label: 'Editar formulario (branding, campos)', enabled: true },
      { id: 'delete_feedback', label: 'Eliminar feedback', enabled: false },
    ],
  },
  {
    id: 'tickets',
    module: 'Tickets',
    label: 'Tickets Internos',
    description: 'Gestionar tickets de feedback negativo',
    actions: [
      { id: 'view_tickets', label: 'Ver tickets', enabled: true },
      { id: 'manage_tickets', label: 'Cambiar estado y asignar', enabled: true },
      { id: 'delete_tickets', label: 'Eliminar tickets', enabled: false },
    ],
  },
  {
    id: 'reviews',
    module: 'Reseñas',
    label: 'Reseñas y Respuestas IA',
    description: 'Ver reseñas de Google y gestionar respuestas',
    actions: [
      { id: 'view_reviews', label: 'Ver reseñas', enabled: true },
      { id: 'generate_ai', label: 'Generar respuestas con IA', enabled: true },
      { id: 'publish_response', label: 'Publicar respuestas en Google', enabled: false },
    ],
  },
  {
    id: 'coupons',
    module: 'Cupones',
    label: 'Cupones de Recompensa',
    description: 'Configurar y gestionar cupones',
    actions: [
      { id: 'view_coupons', label: 'Ver cupones y estadisticas', enabled: true },
      { id: 'config_coupons', label: 'Configurar recompensas', enabled: true },
      { id: 'redeem_coupons', label: 'Marcar cupones como canjeados', enabled: true },
    ],
  },
  {
    id: 'referrals',
    module: 'Referidos',
    label: 'Programa de Referidos',
    description: 'Configurar y ver referidos',
    actions: [
      { id: 'view_referrals', label: 'Ver referidos y estadisticas', enabled: true },
      { id: 'config_referrals', label: 'Configurar programa', enabled: true },
      { id: 'confirm_conversion', label: 'Confirmar conversiones manualmente', enabled: true },
    ],
  },
  {
    id: 'contacts',
    module: 'Contactos',
    label: 'Contactos y Datos',
    description: 'Acceso a la base de datos de clientes',
    actions: [
      { id: 'view_contacts', label: 'Ver contactos', enabled: true },
      { id: 'export_contacts', label: 'Exportar datos (CSV/JSON)', enabled: false },
      { id: 'delete_contacts', label: 'Eliminar contactos', enabled: false },
    ],
  },
  {
    id: 'notifications',
    module: 'Notificaciones',
    label: 'Alertas y Notificaciones',
    description: 'Configurar quien recibe alertas',
    actions: [
      { id: 'receive_whatsapp', label: 'Recibir alertas por WhatsApp', enabled: true },
      { id: 'receive_email', label: 'Recibir alertas por Email', enabled: true },
      { id: 'config_notifications', label: 'Cambiar destinatarios', enabled: false },
    ],
  },
  {
    id: 'qr',
    module: 'QR',
    label: 'QR Code',
    description: 'Generar y descargar QR codes',
    actions: [
      { id: 'view_qr', label: 'Ver y descargar QR', enabled: true },
      { id: 'customize_qr', label: 'Personalizar diseño del QR', enabled: true },
    ],
  },
  {
    id: 'settings',
    module: 'Configuracion',
    label: 'Configuracion General',
    description: 'Cambiar ajustes del negocio',
    actions: [
      { id: 'view_settings', label: 'Ver configuracion', enabled: true },
      { id: 'edit_branding', label: 'Editar branding (logo, colores)', enabled: true },
      { id: 'edit_platforms', label: 'Agregar/quitar plataformas', enabled: false },
      { id: 'edit_billing', label: 'Ver y cambiar plan', enabled: false },
      { id: 'config_ai', label: 'Configurar proveedor IA', enabled: false },
    ],
  },
  {
    id: 'locations',
    module: 'Sedes',
    label: 'Gestion de Sedes',
    description: 'Agregar y editar sedes',
    actions: [
      { id: 'view_locations', label: 'Ver sedes', enabled: true },
      { id: 'add_location', label: 'Agregar nueva sede', enabled: false },
      { id: 'edit_location', label: 'Editar sede existente', enabled: true },
      { id: 'delete_location', label: 'Eliminar sede', enabled: false },
    ],
  },
];

export default function ClientPermissionsPage() {
  const params = useParams();
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [saved, setSaved] = useState(false);
  const [preset, setPreset] = useState<'full' | 'limited' | 'viewonly' | 'custom'>('custom');

  const toggleAction = (permId: string, actionId: string) => {
    setPermissions(permissions.map((p) =>
      p.id === permId
        ? { ...p, actions: p.actions.map((a) => a.id === actionId ? { ...a, enabled: !a.enabled } : a) }
        : p
    ));
    setPreset('custom');
  };

  const toggleModule = (permId: string, enabled: boolean) => {
    setPermissions(permissions.map((p) =>
      p.id === permId ? { ...p, actions: p.actions.map((a) => ({ ...a, enabled })) } : p
    ));
    setPreset('custom');
  };

  const applyPreset = (type: 'full' | 'limited' | 'viewonly') => {
    setPreset(type);
    if (type === 'full') {
      setPermissions(permissions.map((p) => ({ ...p, actions: p.actions.map((a) => ({ ...a, enabled: true })) })));
    } else if (type === 'viewonly') {
      setPermissions(permissions.map((p) => ({
        ...p,
        actions: p.actions.map((a) => ({ ...a, enabled: a.id.startsWith('view_') || a.id.startsWith('receive_') })),
      })));
    } else {
      setPermissions(defaultPermissions);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const enabledCount = permissions.reduce((sum, p) => sum + p.actions.filter((a) => a.enabled).length, 0);
  const totalCount = permissions.reduce((sum, p) => sum + p.actions.length, 0);

  return (
    <div>
      <div className="mb-6">
        <Link href={`/dashboard/clients/${params.id}`} className="text-xs text-blue-600 hover:underline">← Volver al cliente</Link>
        <div className="mt-1 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Permisos del Cliente</h1>
            <p className="mt-1 text-sm text-gray-600">Controla que puede ver y hacer este cliente en su panel</p>
          </div>
          {saved && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Guardado!</span>}
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6 rounded-lg border bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-gray-900">Presets rapidos</h3>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => applyPreset('full')} className={`rounded-lg border-2 p-3 text-center transition ${preset === 'full' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <p className="text-lg">🔓</p>
            <p className="text-sm font-medium text-gray-900">Acceso completo</p>
            <p className="text-xs text-gray-500">Puede ver y hacer todo</p>
          </button>
          <button onClick={() => applyPreset('limited')} className={`rounded-lg border-2 p-3 text-center transition ${preset === 'limited' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <p className="text-lg">🔒</p>
            <p className="text-sm font-medium text-gray-900">Acceso limitado</p>
            <p className="text-xs text-gray-500">Sin eliminar ni exportar</p>
          </button>
          <button onClick={() => applyPreset('viewonly')} className={`rounded-lg border-2 p-3 text-center transition ${preset === 'viewonly' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <p className="text-lg">👁️</p>
            <p className="text-sm font-medium text-gray-900">Solo lectura</p>
            <p className="text-xs text-gray-500">Solo puede ver, no modificar</p>
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500 text-center">{enabledCount}/{totalCount} permisos activos</p>
      </div>

      {/* Permissions grid */}
      <div className="space-y-3">
        {permissions.map((perm) => {
          const allEnabled = perm.actions.every((a) => a.enabled);
          const someEnabled = perm.actions.some((a) => a.enabled);
          return (
            <div key={perm.id} className="rounded-lg border bg-white shadow-sm overflow-hidden">
              {/* Module header */}
              <div className="flex items-center justify-between border-b bg-gray-50 px-5 py-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allEnabled}
                    ref={(el) => { if (el) el.indeterminate = someEnabled && !allEnabled; }}
                    onChange={() => toggleModule(perm.id, !allEnabled)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{perm.label}</p>
                    <p className="text-xs text-gray-500">{perm.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{perm.actions.filter(a => a.enabled).length}/{perm.actions.length}</span>
              </div>
              {/* Actions */}
              <div className="px-5 py-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {perm.actions.map((action) => (
                  <label key={action.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={action.enabled}
                      onChange={() => toggleAction(perm.id, action.id)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600"
                    />
                    <span className={`text-xs ${action.enabled ? 'text-gray-700' : 'text-gray-400'}`}>{action.label}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          Guardar permisos
        </button>
      </div>
    </div>
  );
}
