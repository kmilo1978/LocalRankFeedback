'use client';

import { useState } from 'react';

export default function SecurityPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [ipRestriction, setIpRestriction] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const mockSessions = [
    { id: '1', device: 'Chrome - Windows', ip: '181.52.143.87', location: 'Bogota, CO', lastActive: 'Ahora', current: true },
    { id: '2', device: 'Safari - iPhone', ip: '181.52.143.90', location: 'Bogota, CO', lastActive: 'Hace 2 horas', current: false },
    { id: '3', device: 'Chrome - MacOS', ip: '190.25.67.12', location: 'Medellin, CO', lastActive: 'Ayer', current: false },
  ];

  const mockAuditLog = [
    { action: 'Login exitoso', user: 'admin@clinicasonrisa.com', ip: '181.52.143.87', time: 'Hace 5 min', type: 'auth' },
    { action: 'Configuracion actualizada', user: 'admin@clinicasonrisa.com', ip: '181.52.143.87', time: 'Hace 1 hora', type: 'settings' },
    { action: 'Exportacion de contactos', user: 'admin@clinicasonrisa.com', ip: '181.52.143.87', time: 'Hace 3 horas', type: 'data' },
    { action: 'Nuevo usuario invitado', user: 'admin@clinicasonrisa.com', ip: '181.52.143.87', time: 'Ayer', type: 'users' },
    { action: 'Respuesta IA publicada', user: 'staff@clinicasonrisa.com', ip: '190.25.67.12', time: 'Ayer', type: 'ai' },
    { action: 'Login fallido (3 intentos)', user: 'desconocido@email.com', ip: '45.33.21.100', time: 'Hace 2 dias', type: 'alert' },
    { action: 'Password cambiado', user: 'admin@clinicasonrisa.com', ip: '181.52.143.87', time: 'Hace 5 dias', type: 'auth' },
    { action: 'API key generada', user: 'admin@clinicasonrisa.com', ip: '181.52.143.87', time: 'Hace 1 semana', type: 'settings' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seguridad</h1>
          <p className="mt-1 text-sm text-gray-600">Protege tu cuenta y la de tus clientes</p>
        </div>
        {saved && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Guardado!</span>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          {/* Password */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Cambiar contraseña</h3>
            <div className="space-y-3">
              <div><label className="mb-1 block text-xs text-gray-500">Contraseña actual</label><input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="••••••••" /></div>
              <div><label className="mb-1 block text-xs text-gray-500">Nueva contraseña</label><input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Minimo 8 caracteres" /></div>
              <div><label className="mb-1 block text-xs text-gray-500">Confirmar nueva contraseña</label><input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Repetir contraseña" /></div>
              <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Actualizar contraseña</button>
            </div>
          </div>

          {/* 2FA */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">Autenticacion de dos factores (2FA)</h3>
                <p className="text-xs text-gray-500 mt-0.5">Agrega una capa extra de seguridad a tu cuenta</p>
              </div>
              <button onClick={() => setTwoFAEnabled(!twoFAEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFAEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${twoFAEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {twoFAEnabled && (
              <div className="rounded-md bg-green-50 border border-green-200 p-3">
                <p className="text-xs text-green-700">2FA activado. Se pedira codigo de verificacion en cada login.</p>
                <p className="text-xs text-green-600 mt-1">Metodo: SMS al numero registrado</p>
              </div>
            )}
            {!twoFAEnabled && (
              <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3">
                <p className="text-xs text-yellow-700">Recomendado: Activa 2FA para proteger tu cuenta y los datos de tus clientes.</p>
              </div>
            )}
          </div>

          {/* Session config */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Sesiones y acceso</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Tiempo de inactividad para cerrar sesion</label>
                <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="240">4 horas</option>
                  <option value="480">8 horas</option>
                  <option value="0">Nunca (no recomendado)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Restriccion por IP</p>
                  <p className="text-xs text-gray-500">Solo permitir acceso desde IPs especificas</p>
                </div>
                <button onClick={() => setIpRestriction(!ipRestriction)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ipRestriction ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${ipRestriction ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {ipRestriction && (
                <div>
                  <label className="mb-1 block text-xs text-gray-500">IPs permitidas (una por linea)</label>
                  <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono" rows={3} placeholder="181.52.143.87&#10;190.25.67.0/24" />
                </div>
              )}
            </div>
          </div>

          {/* API Keys */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">API Keys</h3>
            <p className="text-xs text-gray-500 mb-3">Claves para integraciones externas (webhooks, CRM, etc.)</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Production key</p>
                  <p className="text-xs font-mono text-gray-500">lr_prod_****...k9f2</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded border px-2 py-1 text-xs hover:bg-gray-50">Copiar</button>
                  <button className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Revocar</button>
                </div>
              </div>
            </div>
            <button className="mt-3 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">+ Generar nueva API key</button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Active sessions */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Sesiones activas</h3>
              <button className="text-xs text-red-600 hover:underline">Cerrar todas las demas</button>
            </div>
            <div className="space-y-2">
              {mockSessions.map((session) => (
                <div key={session.id} className={`flex items-center justify-between rounded-md border p-3 ${session.current ? 'border-green-200 bg-green-50' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{session.device}</p>
                      {session.current && <span className="rounded bg-green-200 px-1.5 py-0.5 text-xs text-green-800">Actual</span>}
                    </div>
                    <p className="text-xs text-gray-500">{session.ip} - {session.location} - {session.lastActive}</p>
                  </div>
                  {!session.current && (
                    <button className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Cerrar</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Audit log */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Log de auditoria</h3>
            <p className="text-xs text-gray-500 mb-3">Registro de acciones sensibles en la cuenta</p>
            <div className="space-y-2">
              {mockAuditLog.map((log, i) => (
                <div key={i} className="flex items-start gap-3 rounded-md border p-2.5">
                  <span className="mt-0.5 text-sm">
                    {log.type === 'auth' && '🔑'}
                    {log.type === 'settings' && '⚙️'}
                    {log.type === 'data' && '📥'}
                    {log.type === 'users' && '👤'}
                    {log.type === 'ai' && '🤖'}
                    {log.type === 'alert' && '🚨'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${log.type === 'alert' ? 'text-red-700' : 'text-gray-900'}`}>{log.action}</p>
                    <p className="text-xs text-gray-500">{log.user} | {log.ip} | {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full rounded-md border border-gray-300 py-2 text-xs text-gray-600 hover:bg-gray-50">Ver log completo</button>
          </div>

          {/* Data protection */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Proteccion de datos</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-700">Encriptacion HTTPS en transito</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-700">Tokens OAuth encriptados (AES-256)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-700">Passwords hasheados (bcrypt 12 rounds)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-700">Consentimientos registrados con timestamp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-700">Log de auditoria inmutable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-700">Backups automaticos diarios</span>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-5">
            <h3 className="font-semibold text-red-800 mb-2">Zona de peligro</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-red-700">Desactivar cuenta</p><p className="text-xs text-red-500">Se pausan todos los servicios</p></div>
                <button className="rounded border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">Desactivar</button>
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-red-700">Eliminar cuenta y datos</p><p className="text-xs text-red-500">Irreversible. Elimina todo en 30 dias.</p></div>
                <button className="rounded border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Guardar cambios</button>
      </div>
    </div>
  );
}
