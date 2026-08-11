'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from '@/lib/theme-context';

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  return (
    <ThemeProvider>
    <div className="flex min-h-screen dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Brand */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900 dark:text-white">
            LocalRank <span className="text-brand-600">Feedback</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-1">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span>🚪</span>
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="p-6">{children}</div>
      </main>
    </div>
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <span>{theme === 'light' ? '🌙' : '☀️'}</span>
      {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
    </button>
  );
}
