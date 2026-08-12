'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: '📊' },
  { href: '/dashboard/feedback', label: 'Feedback', icon: '⭐' },
  { href: '/dashboard/reviews', label: 'Reseñas IA', icon: '🤖' },
  { href: '/dashboard/tickets', label: 'Tickets', icon: '🎫' },
  { href: '/dashboard/rewards', label: 'Cupones', icon: '🎁' },
  { href: '/dashboard/referrals', label: 'Referidos', icon: '🔗' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { href: '/dashboard/reports', label: 'Reportes', icon: '📋' },
  { href: '/dashboard/notifications', label: 'Notificaciones', icon: '🔔' },
  { href: '/dashboard/compare', label: 'Comparar sedes', icon: '⚖️' },
  { href: '/dashboard/qr', label: 'QR Code', icon: '📷' },
  { href: '/dashboard/contacts', label: 'Contactos', icon: '👥' },
  { href: '/dashboard/export', label: 'Exportar', icon: '📥' },
  { href: '/dashboard/activity', label: 'Actividad', icon: '🕐' },
  { href: '/dashboard/locations', label: 'Sedes', icon: '📍' },
  { href: '/dashboard/settings', label: 'Configuracion', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  return (
    <div className={`flex min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`flex w-64 flex-col border-r ${dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        {/* Brand */}
        <div className={`border-b p-4 ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
          <Link href="/dashboard" className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            LocalRank <span className="text-blue-500">Feedback</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? dark ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-700'
                    : dark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Theme + Logout */}
        <div className={`border-t p-3 space-y-2 ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Dark mode switch */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              {dark ? '🌙 Noche' : '☀️ Dia'}
            </span>
            <button
              onClick={toggleDark}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                dark ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                  dark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
              dark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>🚪</span>
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
